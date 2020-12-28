const { exec } = require('child_process');
const iconv = require('iconv-lite');

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
  const cmd = `"${svnPath || 'svn'}" info ${repo} --username=${username} --password=${password}`;
  return new Promise((resolve, reject) => {
    exec(
      cmd,
      { windowsHide: true, encoding: 'buffer' },
      (err, stdout, stderr) => {
        let re = /Rev: ([\d]+)$/gm;
        let re2 = /版本: ([\d]+)$/gm;
        if (err) {
          console.log(err);
          reject('Get svn rev failed.');
        } else {
          let s = iconv.decode(stdout, 'utf8');
          if (s.match(re)) {
            resolve(re.exec(s)[1]);
          } else if(s.match(re2)) {
            resolve(re2.exec(s)[1])
          } else if((s = iconv.decode(stdout, 'cp936')).match(re2)) {
            resolve(re2.exec(s)[1])
          } else {
            reject('can\'t parse:'+ s.toString())
          }
        }
      },
    );
  });
}
module.exports = {
  getLocalRev,
  getRemoteRev,
};
