const configPromise = require('../config');
const actionPromise = require('./actions');
const { default: Axios } = require('axios');
const { getRemoteRev } = require('../lib/svn/getSVNRev');
const { catch } = require('../config');
let config = {};

class Observer {
  _intervalHandle = 0; // 监听定时器
  _isWorking = false; // 定时器运行状态

  main = async () => {
    config = await configPromise;
    actions = await actionPromise;
    let axios = Axios.create({
      timeout: 8000,
      auth: {
        username: config.global.jenkinsUsername,
        password: config.global.jenkinsPassword,
      },
    });

    this._isWorking = true;

    this._intervalHandle = setInterval(() => {
      config.repos.forEach((repo) => {
        getRemoteRev({
          svnPath: config.global.svnPath,
          repo: repo.repo,
          username: repo.username || config.global.svnUsername,
          password: repo.password || config.global.svnPassword,
        }).then((svn) => {
          repo.lastCheckTime = new Date().valueOf();
          if (!repo.firstCheck) {
            if (repo.svn !== svn) {
              // 需要更新
              repo.svn = svn;
              console.log(
                `--${new Date().toLocaleString()}: 项目 ${
                  repo.repo
                } 需要更新,svn=${svn}`
              );
              // 执行更新回调自定义脚本
              Object.keys(actions).forEach((action) => {
                try {
                  actions[action]();
                } catch (e) {
                  console.log(e);
                  console.log(
                    `--${new Date().toLocaleString()}: 自定义脚本 ${action} 执行失败.`
                  );
                }
                action();
              });
              if (repo.notifyUrl) {
                this.doNotify();
              }
            } else {
              // console.log(
              //   `--${new Date().toLocaleString()}: 项目${repo.repo}已是最新版本.`,
              // );
            }
          } else {
            repo.firstCheck = false;
            repo.svn = svn;
            console.log(
              `--${new Date().toLocaleString()}: 项目 ${
                repo.repo
              } 首次运行，svn=${svn}`
            );
          }
        });
      });
    }, config.global.checkInterval);
  };

  doNotify(url) {
    axios
      .get(url)
      .then(() => {
        repo.notified = true;
        console.log(
          `--${new Date().toLocaleString()}: 项目 ${repo.repo} 更新回调成功`
        );
      })
      .catch((e) => {
        repo.notified = false;
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

  setData() {
    config.repos;
  }

  constructor() {
    this.start();
  }
}

module.exports = Observer;
