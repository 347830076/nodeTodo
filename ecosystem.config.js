module.exports = {
  apps : [{
    name: 'pm2',
    script: './src/app.js',
    watch: '.'
  }],
};
