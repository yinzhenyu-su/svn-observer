const { exec } = require('child_process');

function getLocalRev(svnPath) {
  return new Promise((resolve, reject) => {
    // const regex = /Revision: ([\d]+)/gm;
    const regex = /\nr([\d]+)/gm;
    exec(
      `"${svnPath}" log -r HEAD`,
      { encoding: 'utf-8', cwd },
      (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          reject('Get svn rev failed.');
          return;
        }
        const match = regex.exec(stdout);
        resolve(match[1]);
      },
    );
  });
}

function getRemoteRev({ svnPath, repo, username, password }) {
  const cmd = `"${svnPath}" info ${repo} --username=${username} --password=${password}`;
  return new Promise((resolve, reject) => {
    exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
      let re = /Rev: ([\d]+)$/gm;
      let re2 = /版本: ([\d]+)$/gm;
      if (err) {
        console.log(err);
        reject('Get svn rev failed.');
      } else {
        console.log(cmd);
        if (stdout.match(re)) {
          resolve(re.exec(stdout)[1]);
        } else {
          resolve(re2.exec(stdout)[1]);
        }
      }
    });
  });
}
module.exports = {
  getLocalRev,
  getRemoteRev,
};
