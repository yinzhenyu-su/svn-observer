const fs = require('fs');
const path = require('path');

class ConfigPath {
  constructor() {
    this.projectRoot = path.join(__dirname, '..'); // 项目根目录
    this.userPath = process.env.APPDATA || process.env.HOME; // 用户文件夹
    this.pathFile = path.join(this.projectRoot, '.config-path'); // 路径缓存文件
    this.configPathContent = path.join(this.projectRoot, 'config'); // 默认项目配置文件路径
  }

  getCurrentConfigPath() {
    if (fs.existsSync(this.pathFile)) {
      return fs.readFileSync(this.pathFile, { encoding: 'utf8' });
    }
    return this.configPathContent;
  }

  resetConfigPath() {
    if (fs.existsSync(this.pathFile)) {
      fs.unlinkSync(this.pathFile);
    }
    return 0;
  }

  setConfigPath(relativeConfigPath = '') {
    // 格式化为绝对路径
    if (path.isAbsolute(relativeConfigPath)) {
      this.configPathContent = relativeConfigPath;
    } else {
      this.configPathContent = path.join(this.userPath, relativeConfigPath);
    }
    fs.writeFileSync(this.pathFile, this.configPathContent, {
      encoding: 'utf8',
    });
    return this.getCurrentConfigPath();
  }

  copyConfigFile() {
    this.configPathContent = this.getCurrentConfigPath();
    console.log(this.configPathContent);
    if (!fs.existsSync(this.configPathContent)) {
      fs.mkdirSync(this.configPathContent, { recursive: false });
    }
    fs.readdirSync(path.join(this.projectRoot, 'config')).forEach((file) => {
      let content = fs.readFileSync(
        path.join(this.projectRoot, 'config', file),
        {
          encoding: 'utf8',
        }
      );
      if (!fs.existsSync(path.join(this.configPathContent, file))) {
        fs.writeFileSync(path.join(this.configPathContent, file), content, {
          flag: 'w',
        });
      }
    });
    if (
      !fs.existsSync(path.join(this.configPathContent, 'ecosystem.config.js'))
    ) {
    }
    return 0;
  }
}

module.exports = new ConfigPath();
