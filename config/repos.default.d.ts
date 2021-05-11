interface RepoConfig {
  repo: string; // svn 仓库地址
  firstCheck: true, // 是否为首次检查
  notifyUrl: string; // 更新时要请求的url
  lastCheckTime: number; // 最后一次检查更新时间
  username: string; // 项目用户名，可以为空，配置后会覆盖全局 svn 用户名
  password: string; // 项目密码，可以为空，配置后会覆盖全局 svn 密码
  svn: number; // svn 版本号
  errorCount: number; // 监听报错计数
}

type RepoConfigs = Array<RepoConfig>

export default RepoConfigs;

