const fs = require('fs');
const path = require('path');

/**
 * 设置项目配置文件目录，如果不是默认目录会将默认配置文件复制到指定目录并保存调用路径
 * @param {*} relativeConfigPath 配置文件目录，可以为绝对路径或相对路径
 */
module.exports = (relativeConfigPath) => {
  const projectRoot = path.join(__dirname, '..');
  const pathFile = path.join(projectRoot, '.config-path'); // 保存配置文件调用路径到项目根目录
  let configPathContent = path.join(projectRoot, 'config');

  if (
    relativeConfigPath === undefined ||
    relativeConfigPath === '' ||
    relativeConfigPath === '.'
  ) {
    if (fs.existsSync(pathFile)) {
      return fs.readFileSync(pathFile, { encoding: 'utf8' });
    }
    return configPathContent;
  }

  // 格式化为绝对路径
  if (path.isAbsolute(relativeConfigPath)) {
    configPathContent = relativeConfigPath;
  } else {
    configPathContent = path.join(projectRoot, relativeConfigPath);
  }

  // 保存传参到路径文件
  fs.writeFileSync(pathFile, configPathContent);

  // 复制默认配置文件到新路径
  if (!fs.existsSync(configPathContent)) {
    fs.mkdirSync(configPathContent, { recursive: false });
    fs.readdirSync(path.join(projectRoot, 'config')).forEach((file) => {
      let content = fs.readFileSync(path.join(projectRoot, 'config', file), {
        encoding: 'utf8',
      });
      fs.writeFileSync(path.join(configPathContent, file), content, {
        flag: 'w',
      });
    });
  }
  return configPathContent;
};
