module.exports = {
  apps: [
    {
      script: './bin/svn-observer.js',
      watch: '.',
      name: 'svn-observer',
      args: ['start', '-o'],
    },
  ],
};
