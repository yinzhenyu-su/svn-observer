const { exec } = require('child_process');

function getLocalRev(cwd) {
  return new Promise((resolve, reject) => {
    // const regex = /Revision: ([\d]+)/gm;
    const regex = /\nr([\d]+)/gm
    exec('"svn" log -r HEAD', { encoding: 'utf-8', cwd }, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        reject('Get svn rev failed.');
        return;
      }
      const match = regex.exec(stdout);
      resolve(match[1]);
    });
  });
}

function getRemoteRev({repo,username,password}) {
  return new Promise((resolve,rejece)=>{
    const regex = /Rev: ([\d]+)$/gm;
    exec(`"svn" info ${repo} --username=${username} --password=${password}`, {encoding: 'utf-8'},(err,stdout,stderr)=>{
      if(err) {
        console.log(err);
        reject('Get svn rev failed.');
      }
      resolve(regex.exec(stdout)[1])
    })
  })
}
module.exports = {
  getLocalRev,
  getRemoteRev,
};