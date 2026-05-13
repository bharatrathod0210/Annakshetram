/**
 * PM2: run from repo root as `pm2 start server/ecosystem.config.cjs`
 * Or from server/: `pm2 start ecosystem.config.cjs`
 */
const path = require('path');

const serverDir = __dirname;

module.exports = {
  apps: [
    {
      name: 'annakshetram-api',
      script: 'index.js',
      cwd: serverDir,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: path.join(serverDir, 'logs', 'pm2-error.log'),
      out_file: path.join(serverDir, 'logs', 'pm2-out.log'),
      merge_logs: true,
      time: true,
    },
  ],
};
