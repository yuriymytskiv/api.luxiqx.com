module.exports = {
  apps: [
    {
      name: 'luxiqx-api',
      script: 'dist/main.js',
      instances: 'max',
      ignore_watch: ['node_modules', 'temp', 'dist', '.git', '.idea', 'test'],
      autorestart: true,
      watch_delay: 1000,
      watch: false,
      watch_options: {
        usePolling: true,
      },
      max_memory_restart: '500M',
      time: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
