#!/usr/bin/env bash
# Installs certbot and obtains/renews a Let's Encrypt certificate for the
# file-cloud nginx site, then rewrites the nginx config for HTTPS.
#
# Run this AFTER deploy/setup-nginx.sh, once DNS for the domain below
# already points at this server.
#
# Usage: sudo ./deploy/setup-ssl.sh

set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "This script must be run as root (sudo ./deploy/setup-ssl.sh)" >&2
  exit 1
fi

DOMAIN="linenn-line.com"
EMAIL="${CERTBOT_EMAIL:-aaaaaa30101975@gmail.com}"

echo "==> Installing certbot"
apt-get update
apt-get install -y certbot python3-certbot-nginx

echo "==> Requesting certificate for $DOMAIN"
certbot --nginx \
  -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  -m "$EMAIL" \
  --redirect

echo "==> Verifying auto-renewal timer"
systemctl enable --now certbot.timer
certbot renew --dry-run

echo "==> Done. https://$DOMAIN is live and will auto-renew."
