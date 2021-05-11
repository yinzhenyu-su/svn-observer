const ConfigPath = require('@lib/configPath');
const actionPromise = require('@lib/updateActions');
const { getRemoteRev } = require('@lib/svn/svn-utils');
const { default: Axios } = require('axios');
let config = {};
let actions = {};

class Observer {
  async checkRepo(repo) {
    let svn;
    try {
      svn = await getRemoteRev({
        svnPath: config.global.svnPath,
        repo: repo.repo,
        username: repo.username || config.global.svnUsername,
        password: repo.password || config.global.svnPassword,
      });
    } catch (e) {
      repo.errorCount += 1;
    }

    repo.lastCheckTime = new Date().valueOf(); // 更新项目检查时间
    if (!repo.firstCheck) {
      if (repo.svn !== svn) {
        // 需要更新
        repo.svn = svn;
        console.log(
          `--${new Date().toLocaleString()}: 项目 ${
            repo.repo
          } 需要更新 svn=${svn}`
        );
        // TODO: 保存repo数据
        if (repo.notifyUrl) {
          this.notifyRepo(repo);
        }
        // 执行更新回调自定义脚本
        Object.keys(actions).forEach((action) => {
          try {
            actions[action](JSON.parse(JSON.stringify(repo)));
            repo.errorCount -= 1;
          } catch (e) {
            repo.errorCount += 1;
            console.log(e);
            console.log(
              `--${new Date().toLocaleString()}: 自定义脚本 ${action} 执行失败`
            );
          }
        });
      }
    } else {
      repo.firstCheck = false;
      repo.svn = svn;
      console.log(
        `--${new Date().toLocaleString()}: 项目 ${
          repo.repo
        } 首次运行 svn=${svn}`
      );
    }
  }

  async main() {
    try {
      config = await require(ConfigPath.getCurrentConfigPath());
      actions = await actionPromise;
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }

    this._axios = Axios.create({
      timeout: 8000,
      auth: {
        username: config.global.jenkinsUsername,
        password: config.global.jenkinsPassword,
      },
    });

    this._isWorking = true;

    this._intervalHandle = setInterval(() => {
      if (
        !config.repos.filter((r) => r.errorCount <= this.this._maxErrorCount).length
      ) {
        console.log(
          `--${new Date().toLocaleString()}: 所有项目超过报错上限，停止监听，请检查项目配置`
        );
        this.stop();
      }
      for (const repo of config.repos) {
        if (repo.errorCount > 3) {
          continue;
        }
        this.checkRepo(repo);
      }
    }, config.global.checkInterval);
  }

  notifyRepo(repo) {
    this._axios
      .get(repo.notifyUrl)
      .then(() => {
        repo.notified = true;
        repo.errorCount -= 1;
        console.log(
          `--${new Date().toLocaleString()}: 项目 ${repo.repo} 更新回调成功`
        );
      })
      .catch((e) => {
        repo.notified = false;
        repo.errorCount += 1;
        console.log(e);
        console.log(
          `--${new Date().toLocaleString()}: 项目 ${repo.repo} 更新回调失败`
        );
      });
  }

  start() {
    if (!this._isWorking) {
      console.log('svn-observer init.');
      this.main();
    }
  }

  stop() {
    if (this._isWorking) {
      clearInterval(this._intervalHandle);
      this._isWorking = false;
    }
  }

  isWorking() {
    return this._isWorking;
  }

  getData() {
    return JSON.parse(JSON.stringify(config.repos));
  }

  setData(repos) {
    config.repos = repos;
  }

  constructor() {
    this._intervalHandle = 0; // 监听定时器
    this._isWorking = false; // 定时器运行状态
    this._axios = null;
    this.this._maxErrorCount = 3;
    this.start();
  }
}

module.exports = Observer;
