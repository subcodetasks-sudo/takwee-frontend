#!/usr/bin/env bash
# Deploys linen-line-store on the server: pulls latest code, installs deps,
# builds the Next.js app, and (re)starts it under PM2 on port 3000.
#
# Usage: ./deploy/deploy/deploy.sh
# Run this from the project root on the server, as the user that owns
# the checkout and runs PM2 (do not run as root).

set -euo pipefail

APP_NAME="linenn-line.com"
BRANCH="${DEPLOY_BRANCH:-main}"

# Scripts live in deploy/deploy/ — project root is two levels up.
cd "$(dirname "$0")/../.."

echo "==> Fetching latest changes (branch: $BRANCH)"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> Installing dependencies"
npm ci

echo "==> Building"
npm run build

echo "==> Starting/reloading PM2 process"
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start ecosystem.config.js
fi

pm2 save

echo "==> Done. $APP_NAME is running on port 3000."
