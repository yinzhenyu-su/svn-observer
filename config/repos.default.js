module.exports = [
  {
    repo: '', // svn 仓库地址
    firstCheck: true, // 是否为首次检查
    notifyUrl: '', // 更新时要请求的url
    lastCheckTime: new Date().valueOf(), // 最后一次检查更新时间
    username: '', // 项目用户名，可以为空，配置后会覆盖全局 svn 用户名
    password: '', // 项目密码，可以为空，配置后会覆盖全局 svn 密码
    svn: 0, // svn 版本号
    errorCount: 0, // 监听报错计数
  },
];
