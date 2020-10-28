require('module-alias/register');
const { program } = require('commander');
const Observer = require('@lib/observer');
const configPath = require('@lib/configPath');

program.version(`${require('@root/package.json').version}`);

program.option('-c --config <config path>', 'specify config file path', '.');

program
  .command('start')
  .description('start observe svn projects')
  .action(function (cmd, options) {
    new Observer();
  });

program.parse(process.argv);

if (program.config) {
  configPath(program.config);
}
if (process.argv.length === 2) {
  console.log(program.help());
}
