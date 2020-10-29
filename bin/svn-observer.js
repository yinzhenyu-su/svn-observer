require('module-alias/register');
const { program } = require('commander');
const Observer = require('@lib/observer');
const ConfigPath = require('@lib/configPath');

program.version(`${require('@root/package.json').version}`);

program
  .command('config [value]')
  .option(
    '-s --set <path>',
    `specify config file path, relative root is ${ConfigPath.userPath}, you can set another absolute path`
  )
  .option('-g --get', 'get current config file path')
  .option('-r --reset', 'reset config file path')
  .action((value, cmd) => {
    if (cmd.set !== undefined) {
      if (cmd.set.trim().length) {
        console.log(ConfigPath.setConfigPath(cmd.set.trim()));
        ConfigPath.copyConfigFile();
      } else {
        console.log("config file path can't be empty");
      }
    } else if (cmd.get === true) {
      console.log(ConfigPath.getCurrentConfigPath());
    } else if (cmd.reset === true) {
      ConfigPath.resetConfigPath();
      console.log(ConfigPath.getCurrentConfigPath());
    }
  });

program
  .command('start [value]')
  .option('-o --observe', 'start svn observe')
  .action(function (value, cmd) {
    if (cmd.observe) {
      new Observer();
    }
  });

program.parse(process.argv);

if (process.argv.length === 2) {
  console.log(program.help());
}
