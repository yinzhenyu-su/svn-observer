require('module-alias/register');
const ConfigPath = require('@lib/configPath');
const path = require('path');

module.exports = () => {
  return `module.exports = {
    apps: [
      {
        script: '${path.join(
          ConfigPath.projectRoot,
          'bin',
          'svn-observer.js'
        ).replace(/\\/g,'/')}',
        watch: '.',
        name: 'svn-observer',
        args: ['start', '-o'],
      },
    ],
  };
  `;
};
