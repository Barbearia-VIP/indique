#!/usr/bin/env bash
# Deploy da landing page "Indique um amigo" em https://indique.barbearia.vip
#
# Uso:
#   scripts/deploy.sh setup      prepara o servidor (pastas, nginx e HTTPS) — 1ª vez
#   scripts/deploy.sh [deploy]   build + publica uma nova versão
#   scripts/deploy.sh rollback   volta para a versão anterior
#   scripts/deploy.sh releases   lista as versões publicadas
#
# Configuração: arquivo .env.deploy na raiz do projeto (veja .env.deploy.example)
# ou variáveis de ambiente com os mesmos nomes.
# Rodando no próprio servidor (repositório clonado nele), sem SSH:
#   DEPLOY_HOST=local scripts/deploy.sh
#
# Estrutura no servidor:
#   $DEPLOY_PATH/releases/<data-hora>-<commit>/   uma pasta por versão
#   $DEPLOY_PATH/current -> releases/...          versão no ar (troca atômica)

# Os scripts remotos ficam entre aspas simples de propósito: expandem no servidor.
# shellcheck disable=SC2016,SC2029

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${DEPLOY_ENV_FILE:-$ROOT_DIR/.env.deploy}"
if [[ -f $ENV_FILE ]]; then
  set -a
  # shellcheck source=/dev/null
  source "$ENV_FILE"
  set +a
fi

DOMAIN="${DEPLOY_DOMAIN:-indique.barbearia.vip}"
REMOTE_USER=
PORT="${DEPLOY_PORT:-22}"
REMOTE_PATH="${DEPLOY_PATH:-/var/www/$DOMAIN}"
KEEP="${DEPLOY_KEEP_RELEASES:-5}"
SITE_URL="https://$DOMAIN/"

log() { printf '\033[1;33m[deploy]\033[0m %s\n' "$*"; }
ok()  { printf '\033[1;32m[deploy]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[deploy] erro:\033[0m %s\n' "$*" >&2; exit 1; }

usage() { sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'; }

require() {
  local cmd
  for cmd in "$@"; do
    command -v "$cmd" >/dev/null || die "comando '$cmd' não encontrado"
  done
}

# ---------------------------------------------------------------------------
# Destino: servidor remoto por SSH (uma conexão reaproveitada por todos os
# comandos) ou esta própria máquina (DEPLOY_HOST=local)
# ---------------------------------------------------------------------------
LOCAL=0
CONTROL_DIR=
SSH_OPTS=()
TARGET=
DEST=

target_init() {
  [[ -n ${DEPLOY_HOST:-} ]] ||
    die "defina DEPLOY_HOST no .env.deploy: IP/hostname do servidor, ou 'local' para publicar nesta máquina"
  [[ $REMOTE_PATH == /* && $REMOTE_PATH != / && ${#REMOTE_PATH} -gt 5 ]] ||
    die "DEPLOY_PATH inválido: '$REMOTE_PATH'"
  [[ $KEEP =~ ^[0-9]+$ && $KEEP -ge 2 ]] || die "DEPLOY_KEEP_RELEASES deve ser um número >= 2"

  if [[ $DEPLOY_HOST == local ]]; then
    LOCAL=1
    REMOTE_USER="${DEPLOY_USER:-${SUDO_USER:-$(id -un)}}"
    TARGET=local
    DEST="$REMOTE_PATH"
    return
  fi

  require ssh
  REMOTE_USER="${DEPLOY_USER:-deploy}"
  TARGET="$REMOTE_USER@$DEPLOY_HOST"
  DEST="$TARGET:$REMOTE_PATH"
  CONTROL_DIR="$(mktemp -d)"
  SSH_OPTS=(-p "$PORT" -o ControlMaster=auto -o "ControlPath=$CONTROL_DIR/%C" -o ControlPersist=120)
  if [[ -n ${DEPLOY_SSH_KEY:-} ]]; then SSH_OPTS+=(-i "$DEPLOY_SSH_KEY"); fi
  trap ssh_close EXIT
}

ssh_close() {
  if [[ -n $CONTROL_DIR ]]; then
    ssh "${SSH_OPTS[@]}" -O exit "$TARGET" 2>/dev/null || true
    rm -rf "$CONTROL_DIR"
  fi
}

# remote_bash <script> [args...] — executa o script com bash no servidor
remote_bash() {
  local script=$1
  shift
  if ((LOCAL)); then
    bash -s -- "$@" <<<"$script"
    return
  fi
  local args=""
  if (($#)); then args=$(printf '%q ' "$@"); fi
  ssh "${SSH_OPTS[@]}" "$TARGET" "bash -s -- $args" <<<"$script"
}

# ---------------------------------------------------------------------------
# Comandos
# ---------------------------------------------------------------------------
cmd_setup() {
  target_init
  local conf="deploy/nginx/$DOMAIN.conf"
  [[ -f $conf ]] || die "configuração do nginx não encontrada: $conf"

  if ((LOCAL)); then
    local runner=(bash)
    if ((EUID != 0)); then
      require sudo
      runner=(sudo bash)
    fi
    "${runner[@]}" deploy/server-setup.sh "$DOMAIN" "$REMOTE_PATH" "$REMOTE_USER" "$conf" "${CERTBOT_EMAIL:-}" ||
      die "a preparação do servidor falhou"
    ok "servidor pronto. Agora rode: DEPLOY_HOST=local scripts/deploy.sh"
    return
  fi

  log "enviando configuração do nginx para $TARGET"
  local tmp
  tmp=$(remote_bash 'mktemp -d')
  ssh "${SSH_OPTS[@]}" "$TARGET" "cat > $tmp/site.conf" <"$conf"
  ssh "${SSH_OPTS[@]}" "$TARGET" "cat > $tmp/server-setup.sh" <deploy/server-setup.sh

  log "executando a preparação com sudo (pode pedir a senha)"
  local status=0
  ssh -t "${SSH_OPTS[@]}" "$TARGET" \
    "sudo bash $tmp/server-setup.sh $(printf '%q ' "$DOMAIN" "$REMOTE_PATH" "$REMOTE_USER" "$tmp/site.conf" "${CERTBOT_EMAIL:-}")" ||
    status=$?
  remote_bash 'rm -rf -- "$1"' "$tmp"
  ((status == 0)) || die "a preparação do servidor falhou"
  ok "servidor pronto. Agora rode: scripts/deploy.sh"
}

cmd_deploy() {
  require rsync
  target_init

  if [[ ${SKIP_BUILD:-0} != 1 ]]; then
    command -v npm >/dev/null ||
      die "Node.js/npm não encontrado: instale o Node 22 ou gere o build em outra máquina e use SKIP_BUILD=1"
    log "instalando dependências e gerando o build"
    npm ci --no-audit --no-fund
    npm run lint
    npm run build
  fi
  [[ -f dist/index.html ]] || die "dist/index.html não existe; rode o build"

  local rev release
  rev=$(git rev-parse --short HEAD 2>/dev/null || echo manual)
  if [[ -n $(git status --porcelain 2>/dev/null) ]]; then rev="$rev-dirty"; fi
  release="$(date -u +%Y%m%d-%H%M%S)-$rev"

  log "preparando a versão $release em $DEST"
  local has_current
  has_current=$(remote_bash '
    set -euo pipefail
    [[ -d "$1/releases" ]] || { echo "pasta $1/releases não existe; rode: scripts/deploy.sh setup" >&2; exit 1; }
    mkdir -p "$1/releases/$2"
    if [[ -d "$1/current" ]]; then echo yes; else echo no; fi
  ' "$REMOTE_PATH" "$release")

  local rsync_opts=(-a --delete "--chmod=D755,F644")
  # Arquivos iguais aos da versão no ar viram hard links (upload e disco menores)
  if [[ $has_current == yes ]]; then rsync_opts+=("--link-dest=$REMOTE_PATH/current/"); fi

  log "enviando arquivos"
  if ((LOCAL)); then
    rsync "${rsync_opts[@]}" dist/ "$REMOTE_PATH/releases/$release/"
  else
    rsync "${rsync_opts[@]}" -z -e "ssh ${SSH_OPTS[*]}" dist/ "$DEST/releases/$release/"
  fi

  log "ativando a versão"
  remote_bash '
    set -euo pipefail
    cd "$1"
    [[ -f "releases/$2/index.html" ]] || { echo "upload incompleto: releases/$2/index.html" >&2; exit 1; }
    ln -sfn "releases/$2" current.tmp
    mv -Tf current.tmp current
  ' "$REMOTE_PATH" "$release"

  log "removendo versões antigas (mantendo $KEEP)"
  remote_bash '
    set -euo pipefail
    cd "$1/releases"
    active=$(basename "$(readlink ../current)")
    ls -1 | grep -E "^[0-9]{8}-[0-9]{6}-" | sort -r | tail -n +$(($2 + 1)) |
      while read -r old; do
        if [[ $old != "$active" ]]; then rm -rf -- "$old"; fi
      done
  ' "$REMOTE_PATH" "$KEEP"

  healthcheck
  ok "no ar: $SITE_URL (versão $release)"
}

healthcheck() {
  if [[ ${SKIP_HEALTHCHECK:-0} == 1 ]]; then return; fi
  require curl
  local asset
  asset=$(grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' dist/index.html | head -n1)
  # DEPLOY_CURL_OPTS permite testar antes do DNS apontar, ex.:
  #   DEPLOY_CURL_OPTS="--resolve indique.barbearia.vip:443:203.0.113.10"
  local curl_opts=() extra=()
  # No modo local, confere o nginx desta máquina mesmo antes do DNS apontar
  if ((LOCAL)); then curl_opts=(--resolve "$DOMAIN:443:127.0.0.1"); fi
  read -ra extra <<<"${DEPLOY_CURL_OPTS:-}"
  curl_opts+=("${extra[@]}")
  log "verificando $SITE_URL"
  local html
  if ! html=$(curl -fsS --max-time 20 "${curl_opts[@]}" "$SITE_URL"); then
    die "o site não respondeu. Para voltar à versão anterior: scripts/deploy.sh rollback"
  fi
  if [[ -n $asset && $html != *"$asset"* ]]; then
    die "o site respondeu, mas não com a versão nova (esperado $asset). Verifique o nginx ou rode: scripts/deploy.sh rollback"
  fi
}

cmd_rollback() {
  target_init
  local result
  result=$(remote_bash '
    set -euo pipefail
    cd "$1"
    active=$(basename "$(readlink current)")
    previous=$(ls -1 releases | grep -E "^[0-9]{8}-[0-9]{6}-" | sort -r | awk -v a="$active" "found { print; exit } \$0 == a { found = 1 }")
    [[ -n $previous ]] || { echo "não há versão anterior a $active" >&2; exit 1; }
    ln -sfn "releases/$previous" current.tmp
    mv -Tf current.tmp current
    echo "$active -> $previous"
  ' "$REMOTE_PATH")
  ok "rollback: $result"
}

cmd_releases() {
  target_init
  remote_bash '
    set -euo pipefail
    cd "$1"
    active=$(basename "$(readlink current 2>/dev/null || true)")
    ls -1 releases | grep -E "^[0-9]{8}-[0-9]{6}-" | sort -r | while read -r r; do
      if [[ $r == "$active" ]]; then echo "* $r (no ar)"; else echo "  $r"; fi
    done
  ' "$REMOTE_PATH"
}

case "${1:-deploy}" in
  deploy) cmd_deploy ;;
  setup) cmd_setup ;;
  rollback) cmd_rollback ;;
  releases) cmd_releases ;;
  -h | --help | help) usage ;;
  *)
    usage
    exit 1
    ;;
esac
