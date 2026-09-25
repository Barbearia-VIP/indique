#!/usr/bin/env bash
# Preparação do servidor: pastas do site, nginx e certificado HTTPS (Let's Encrypt).
#
# Direto no servidor, com o repositório clonado (como root):
#   bash deploy/server-setup.sh
#   CERTBOT_EMAIL=voce@exemplo.com bash deploy/server-setup.sh   # sem pergunta interativa
#
# Ou da sua máquina, via SSH: scripts/deploy.sh setup
#
# Parâmetros, todos opcionais (posição ou variável de ambiente):
#   1  domínio             DEPLOY_DOMAIN   padrão: indique.barbearia.vip
#   2  pasta do site       DEPLOY_PATH     padrão: /var/www/<domínio>
#   3  dono dos arquivos   DEPLOY_USER     padrão: quem chamou o sudo, ou root
#   4  conf do nginx       —               padrão: nginx/<domínio>.conf ao lado deste script
#   5  e-mail do certbot   CERTBOT_EMAIL   perguntado se faltar e o certificado não existir
#
# O que faz:
# - cria a pasta do site (releases/) e a pasta de validação do Let's Encrypt
# - instala a configuração do nginx (sites-available/sites-enabled ou conf.d)
# - emite o certificado HTTPS com certbot (webroot) se ainda não existir
# - configura o reload do nginx após cada renovação do certificado

set -euo pipefail

if [[ ${1:-} == -h || ${1:-} == --help ]]; then
  sed -n '2,21p' "$0" | sed 's/^# \{0,1\}//'
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOMAIN=${1:-${DEPLOY_DOMAIN:-indique.barbearia.vip}}
WEB_PATH=${2:-${DEPLOY_PATH:-/var/www/$DOMAIN}}
OWNER=${3:-${DEPLOY_USER:-${SUDO_USER:-root}}}
CONF_SRC=${4:-$SCRIPT_DIR/nginx/$DOMAIN.conf}
EMAIL=${5:-${CERTBOT_EMAIL:-}}

ACME_ROOT=/var/www/letsencrypt
CERT=/etc/letsencrypt/live/$DOMAIN/fullchain.pem

log() { printf '\033[1;33m[setup]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[setup] erro:\033[0m %s\n' "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "execute como root (sudo bash $0)"
command -v nginx >/dev/null || die "nginx não está instalado (ex.: apt install -y nginx certbot)"
[[ -f $CONF_SRC ]] || die "arquivo de configuração não encontrado: $CONF_SRC"
[[ $WEB_PATH == /* && $WEB_PATH != / && ${#WEB_PATH} -gt 5 ]] || die "pasta do site inválida: '$WEB_PATH'"
id -u "$OWNER" >/dev/null 2>&1 || die "usuário '$OWNER' não existe (ajuste DEPLOY_USER)"

if [[ -d /etc/nginx/sites-available ]]; then
  CONF=/etc/nginx/sites-available/$DOMAIN.conf
  LINK=/etc/nginx/sites-enabled/$DOMAIN.conf
else
  CONF=/etc/nginx/conf.d/$DOMAIN.conf
  LINK=
fi

enable_site() {
  # Servidor sem IPv6: `listen [::]` impediria o nginx de subir
  if [[ ! -e /proc/net/if_inet6 ]]; then
    sed -i '/listen \[::\]/d' "$CONF"
    log "servidor sem IPv6: linhas 'listen [::]' removidas de $CONF"
  fi
  if [[ -n $LINK ]]; then ln -sfn "$CONF" "$LINK"; fi
}

reload_nginx() {
  if command -v systemctl >/dev/null && systemctl is-active --quiet nginx 2>/dev/null; then
    systemctl reload nginx
  else
    nginx -s reload
  fi
}

# Pré-requisitos do certificado, conferidos antes de alterar qualquer coisa
if [[ ! -f $CERT ]]; then
  command -v certbot >/dev/null || die "certbot não está instalado (ex.: apt install -y certbot)"
  if [[ -z $EMAIL && -t 0 ]]; then
    read -rp "E-mail para avisos do Let's Encrypt: " EMAIL
  fi
  [[ -n $EMAIL ]] || die "certificado inexistente: defina CERTBOT_EMAIL para emitir com o Let's Encrypt"
  if ! getent hosts "$DOMAIN" >/dev/null; then
    die "o DNS de $DOMAIN ainda não resolve; aponte o registro A para este servidor e rode de novo"
  fi
fi

log "pastas: $WEB_PATH/releases e $ACME_ROOT"
mkdir -p "$WEB_PATH/releases" "$ACME_ROOT"
chown "$OWNER": "$WEB_PATH" "$WEB_PATH/releases"
chmod 755 "$WEB_PATH" "$WEB_PATH/releases"

BACKUP=
if [[ -f $CONF ]]; then
  BACKUP=$(mktemp)
  cp "$CONF" "$BACKUP"
fi

# Volta a configuração do nginx ao estado de antes deste script
restore_conf() {
  if [[ -n $BACKUP ]]; then
    cp "$BACKUP" "$CONF"
    log "configuração anterior restaurada"
  else
    rm -f "$CONF"
    if [[ -n $LINK ]]; then rm -f "$LINK"; fi
  fi
}

if [[ ! -f $CERT ]]; then

  log "configuração provisória (só HTTP) para validar o domínio"
  cat > "$CONF" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    location ^~ /.well-known/acme-challenge/ { root $ACME_ROOT; default_type text/plain; }
    location / { return 404; }
}
EOF
  enable_site
  nginx -t
  reload_nginx

  log "emitindo certificado para $DOMAIN"
  if ! certbot certonly --webroot -w "$ACME_ROOT" -d "$DOMAIN" \
    --email "$EMAIL" --agree-tos --no-eff-email --non-interactive; then
    restore_conf
    reload_nginx
    die "o Let's Encrypt não emitiu o certificado (confira se o DNS aponta para este servidor e se a porta 80 está liberada)"
  fi
fi

log "instalando $CONF"
install -m 644 "$CONF_SRC" "$CONF"
enable_site

if ! nginx -t; then
  restore_conf
  die "nginx -t falhou; nada foi recarregado"
fi
reload_nginx

if [[ -d /etc/letsencrypt ]]; then
  HOOK=/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
  mkdir -p "$(dirname "$HOOK")"
  printf '#!/bin/sh\nnginx -t && (systemctl reload nginx 2>/dev/null || nginx -s reload)\n' > "$HOOK"
  chmod 755 "$HOOK"
fi

if [[ -n $BACKUP ]]; then rm -f "$BACKUP"; fi
log "ok: nginx configurado para https://$DOMAIN"
log "próximo passo: publicar o site com scripts/deploy.sh (neste servidor: DEPLOY_HOST=local scripts/deploy.sh)"
