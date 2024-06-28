module.exports = {
  apps: [
    {
      name: 'one-for-all',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'local',
      },
      env_prod: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
