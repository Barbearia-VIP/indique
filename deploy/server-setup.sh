#!/usr/bin/env bash
# Preparação do servidor (executado como root, via `scripts/deploy.sh setup`).
#
# Uso: server-setup.sh <domínio> <pasta-do-site> <dono> <arquivo-conf-nginx> [email-certbot]
#
# - cria a pasta do site (releases/) e a pasta de validação do Let's Encrypt
# - instala a configuração do nginx (sites-available/sites-enabled ou conf.d)
# - emite o certificado HTTPS com certbot (webroot) se ainda não existir
# - configura o reload do nginx após cada renovação do certificado

set -euo pipefail

DOMAIN=$1
WEB_PATH=$2
OWNER=$3
CONF_SRC=$4
EMAIL=${5:-}

ACME_ROOT=/var/www/letsencrypt
CERT=/etc/letsencrypt/live/$DOMAIN/fullchain.pem

log() { printf '\033[1;33m[setup]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[setup] erro:\033[0m %s\n' "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "execute como root (sudo)"
command -v nginx >/dev/null || die "nginx não está instalado (ex.: apt install nginx)"
[[ -f $CONF_SRC ]] || die "arquivo de configuração não encontrado: $CONF_SRC"

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

log "pastas: $WEB_PATH/releases e $ACME_ROOT"
mkdir -p "$WEB_PATH/releases" "$ACME_ROOT"
chown "$OWNER": "$WEB_PATH" "$WEB_PATH/releases"
chmod 755 "$WEB_PATH" "$WEB_PATH/releases"

BACKUP=
if [[ -f $CONF ]]; then
  BACKUP=$(mktemp)
  cp "$CONF" "$BACKUP"
fi

if [[ ! -f $CERT ]]; then
  [[ -n $EMAIL ]] || die "certificado inexistente: defina CERTBOT_EMAIL para emitir com o Let's Encrypt"
  command -v certbot >/dev/null || die "certbot não está instalado (ex.: apt install certbot)"

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
  certbot certonly --webroot -w "$ACME_ROOT" -d "$DOMAIN" \
    --email "$EMAIL" --agree-tos --no-eff-email --non-interactive
fi

log "instalando $CONF"
install -m 644 "$CONF_SRC" "$CONF"
enable_site

if ! nginx -t; then
  if [[ -n $BACKUP ]]; then
    cp "$BACKUP" "$CONF"
    log "configuração anterior restaurada"
  else
    rm -f "$CONF"
    if [[ -n $LINK ]]; then rm -f "$LINK"; fi
  fi
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
