/**
 * global config 对象字段介绍
 * svnUsername: svn 项目用户名
 * svnPassword: svn 项目密码
 * jenkinsUsername: jenkins 账号
 * jenkinsPassword: jenkins 密码
 * checkInterval: 检查更新间隔，单位ms
 */

/**
 * repos config 对象字段介绍
 * repo: svn 项目地址
 * firstCheck: 是否为首次运行
 * lastCheckTime: 最后一次检查更新时间
 * svn: 最新 svn 号
 */

const configPromise = require('../config');
const { default: Axios } = require('axios');
const { getRemoteRev } = require('../lib/svn/getSVNRev');
let config = {};
const Queue = require('./queue');

let main = async () => {
  config = await configPromise;
  let axios = Axios.create({
    timeout: 8000,
    auth: {
      username: config.global.jenkinsUsername,
      password: config.global.jenkinsPassword,
    },
  });
  setInterval(() => {
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
            axios
              .get(repo.notifyUrl)
              .then(() => {
                repo.notified = true;
                console.log(
                  `--${new Date().toLocaleString()}: 项目 ${
                    repo.repo
                  } 更新回调成功`
                );
              })
              .catch((e) => {
                repo.notified = false;
                console.log(e);
                console.log(
                  `--${new Date().toLocaleString()}: 项目 ${
                    repo.repo
                  } 更新回调失败`
                );
              });
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

main();
