#!/usr/bin/env bash
# Full server bootstrap: nginx -> SSL -> deploy, in order.
# Run this once on a fresh server (as the deploy user via sudo), after DNS
# for cloud.nasam-ag.com already points at this box.
#
# Usage: sudo ./deploy/setup.sh

set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "This script must be run as root (sudo ./deploy/setup.sh)" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DEPLOY_USER="${SUDO_USER:-$(id -un)}"

echo "==> [1/3] Setting up nginx"
bash "$SCRIPT_DIR/setup-nginx.sh"

echo "==> [2/3] Setting up SSL"
bash "$SCRIPT_DIR/setup-ssl.sh"

echo "==> [3/3] Deploying app (as $DEPLOY_USER)"
if [ "$DEPLOY_USER" = "root" ]; then
  bash "$SCRIPT_DIR/deploy.sh"
else
  sudo -u "$DEPLOY_USER" -H bash "$SCRIPT_DIR/deploy.sh"
fi

echo "==> Setup complete. https://cloud.nasam-ag.com is live and running under PM2 on port 3005."
