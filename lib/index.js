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

const { default: Axios } = require('axios');
const config = require('../config/global');
const repos = require('../config/repos');
const { getRemoteRev } = require('../lib/svn/getSVNRev');
const Queue = require('./queue');

let axios = Axios.create({
  timeout: 8000,
  auth: {
    username: config.jenkinsUsername,
    password: config.jenkinsPassword,
  },
});

setInterval(() => {
  repos.forEach((repo) => {
    getRemoteRev({
      repo: repo.repo,
      username: repo.username || config.svnUsername,
      password: repo.password || config.svnPassword,
    }).then((svn) => {
      repo.lastCheckTime = new Date().valueOf();
      if (!repo.firstCheck) {
        if (repo.svn !== svn) {
          // 需要更新
          repo.svn = svn;
          console.log(
            `--${new Date().toLocaleString()}: 项目${repo.repo}需要更新`,
          );
          axios
            .get(repo.notifyUrl)
            .then(() => {
              repo.notified = true;
              console.log(
                `--${new Date().toLocaleString()}: 项目${
                  repo.repo
                }更新回调成功`,
              );
            })
            .catch((e) => {
              repo.notified = false;
              console.log(e);
              console.log(
                `--${new Date().toLocaleString()}: 项目${
                  repo.repo
                }更新回调失败`,
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
          `--${new Date().toLocaleString()}: 项目${
            repo.repo
          }首次运行，不作通知`,
        );
      }
    });
  });
}, config.checkInterval);
