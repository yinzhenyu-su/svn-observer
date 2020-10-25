const { exec } = require("child_process");

function getLocalRev(svnPath) {
  return new Promise((resolve, reject) => {
    // const regex = /Revision: ([\d]+)/gm;
    const regex = /\nr([\d]+)/gm;
    exec(
      `"${svnPath}" log -r HEAD`,
      { encoding: "utf-8", cwd },
      (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          reject("Get svn rev failed.");
          return;
        }
        const match = regex.exec(stdout);
        resolve(match[1]);
      }
    );
  });
}

function getRemoteRev({ svnPath, repo, username, password }) {
  return new Promise((resolve, reject) => {
    exec(
      `"${svnPath}" info ${repo} --username=${username} --password=${password}`,
      { windowsHide: true, encoding: "utf-8" },
      (err, stdout, stderr) => {
        let regex = /Rev: ([\\d]+)$/g;
        let regex2 = /版本: ([\\d]+)$/g
        let s = stdout.toString();
        if (err) {
          reject("Get svn rev failed.");
        } else {
          let m;
          if((m=regex.exec(s))!==null) {
            console.log(m);
          }
        }
      }
    );
  });
}
module.exports = {
  getLocalRev,
  getRemoteRev,
};
