export default interface GlobalConfig {
  checkInterval: number; // 检查间隔（单位 ms）
  svnPath: string; // svn 可执行文件路径
  svnUsername: string; // svn 仓库用户名
  svnPassword: string; // svn 仓库密码
  jenkinsUsername: string; // jenkins 用户名
  jenkinsPassword: string; // jenkins 密码
}