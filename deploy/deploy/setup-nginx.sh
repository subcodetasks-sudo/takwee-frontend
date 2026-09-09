#!/usr/bin/env bash
# One-time server setup: installs nginx, installs the file-cloud site config,
# and reloads nginx. Run deploy/setup-ssl.sh afterwards to add HTTPS.
#
# Usage: sudo ./deploy/setup-nginx.sh
# Target: Debian/Ubuntu server with apt.

set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "This script must be run as root (sudo ./deploy/setup-nginx.sh)" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_NAME="file-cloud"

echo "==> Installing nginx"
apt-get update
apt-get install -y nginx

echo "==> Installing site config"
cp "$SCRIPT_DIR/nginx.conf" "/etc/nginx/sites-available/$SITE_NAME"
ln -sf "/etc/nginx/sites-available/$SITE_NAME" "/etc/nginx/sites-enabled/$SITE_NAME"

# Remove the default site if it's still enabled, so it doesn't shadow ours.
if [ -e /etc/nginx/sites-enabled/default ]; then
  rm /etc/nginx/sites-enabled/default
fi

echo "==> Testing nginx config"
nginx -t

echo "==> Reloading nginx"
systemctl reload nginx
systemctl enable nginx

echo "==> Done. Site is live over HTTP. Run deploy/setup-ssl.sh next to enable HTTPS."
