# svn-observer

svn-observer 可以监听 svn 项目更新并执行自定义回调。

## 使用方式

1. 全局安装 npm 包

   ```bash
   npm install -g svn-observer
   ```

2. 生成配置文件目录，目录地址可以为相对或绝对路径：

    ```bash
    svn-observer config -s yourConfigFolder
    ```

    配置文件解析如下：

    ```bash
    yourConfigFolder
    |
    |  ecosystem.config.js   // pm2 配置文件, 无需更改
    |  global.default.js     // 全局配置文件
    |  index.js              // 配置文件加载脚本, 无需更改
    |  repos.default.js      // svn 项目配置脚本
    |
    ```

    生成完成后更改相关配置文件为实际配置
3. 在配置文件目录中打开命令行执行

    ```bash
    pm2 start
    ```

    确认是否启动成功可以使用如下命令查看项目日志

    ```bash
    pm2 log svn-observer
    ```

    ![pm2 日志](https://s1.ax1x.com/2020/10/30/BYLLvt.png)

## TODO

  1. 添加 web 面板

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)