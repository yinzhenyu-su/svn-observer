const config  = require('../config')
const { getRemoteRev } = require('../lib/svn/getSVNRev')

setInterval(()=>{
  getRemoteRev({repo: config.repos[0], username: config.username, password: config.password}).then(v=>{
    console.log(v);
  })
}, config.checkInterval)