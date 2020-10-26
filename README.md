# svn-observer

svn-observer 可以监听 svn 项目更新并执行自定义回调。

## 使用方式

1.  将项目克隆到你本地,然后打开根目录。
2.  复制 `config` 文件夹下的文件并将其重命名为 `global.local.js`, `repos.local.js`,并修改其中的配置为你本地的配置。
3.  执行 npm install 安装项目依赖
4.  在控制台中执行如下命令
    ```cmd
    node lib
    ```
    此时程序会监听在 repos 中配置好的项目,如果有更新会向`notifyUrl` 发送 get 请求
    ![Bn6V58.png](https://s1.ax1x.com/2020/10/26/Bn6V58.png)]
    你可以使用 [pm2](https://pm2.io/) 自动运行该项目
    ```cmd
    pm2 start ./lib/index.js --name svn-observer
    ```

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
