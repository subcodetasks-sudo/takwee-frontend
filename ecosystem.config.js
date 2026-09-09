/**
 * PM2 process file for linen-line-store.
 * Used by deploy/deploy/deploy.sh — keep `name` in sync with APP_NAME there.
 *
 * Start:   pm2 start ecosystem.config.js
 * Reload:  pm2 reload ecosystem.config.js --update-env
 */
module.exports = {
  apps: [
    {
      name: "linenn-line.com",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
