const { exec } = require('child_process');
const iconv = require('iconv-lite');


function matchSVNLogRev(svnLogBuffer) {
  let re = /\nr([\d]+)/gm;
  let s = iconv.decode(svnLogBuffer, 'utf8');
  let match = '';
  if(s.match(re)) {
    match = re.exec(s)[1];
  } else if((s = iconv.decode(svnLogBuffer, 'cp936')).match(re)) {
    match = re.exec(s)[1];
  }
  return match;
}

function getLocalRev(svnPath) {
  return new Promise((resolve, reject) => {
    exec(
      `"${svnPath || 'svn'}" log -l 1`,
      { encoding: 'buffer' },
      (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          reject('Get svn rev failed.');
          return;
        }
        let m = matchSVNLogRev(stdout);
        console.log(`get svn rev: ${m}`);
        resolve(m);
      }
    );
  });
}

function matchSVNInfoRev(svnInfoBuffer) {
  let match = '';
  let re = /Rev: ([\d]+)$/gm;
  let re2 = /版本: ([\d]+)$/gm;

  let s = iconv.decode(svnInfoBuffer, 'utf8');

  if (s.match(re)) {
    match = re.exec(s)[1];
  } else if (s.match(re2)) {
    match = re2.exec(s)[1];
  } else if ((s = iconv.decode(svnInfoBuffer, 'cp936')).match(re2)) {
    match = re2.exec(s)[1];
  } else if ((s = iconv.decode(svnInfoBuffer, 'cp936')).match(re)) {
    match = re.exec(s)[1];
  }
  return match;
}

function getRemoteRev({ svnPath, repo, username, password }) {
  const cmd = `"${
    svnPath || 'svn'
  }" info ${repo} --username=${username} --password=${password}`;
  return new Promise((resolve, reject) => {
    exec(
      cmd,
      { windowsHide: true, encoding: 'buffer' },
      (err, stdout, stderr) => {
        if (err) {
          console.log(err);
          reject('Get svn rev failed.');
        } else {
          let rev = matchSVNRev(stdout);
          rev ? resolve(rev) : reject("can't parse:" + stdout.toString());
        }
      }
    );
  });
}

function getSVNPath() {
  const cmd = 'where svn';
  return new Promise((resolve,reject)=>{
    exec(cmd,{windowsHide: true, encoding: 'buffer'},(err, stdout, stderr) => {
      if(err) {
        console.log(err);
        reject('Get svn path failed.')
      } else {
        resolve(stdout);
      }
    })
  })
}


module.exports = {
  getLocalRev,
  getRemoteRev,
  getSVNPath,
  matchSVNLogRev,
  matchSVNInfoRev,
};