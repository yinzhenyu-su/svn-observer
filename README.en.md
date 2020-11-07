# svn-observer

svn-observer 可以监听 svn 项目更新并执行自定义回调。

## How to use

1. Install npm package globally

   ```bash
   npm install -g svn-observer
   ```

2. Generate the configuration file directory, the directory address can be a relative or absolute path

    ```bash
    svn-observer config -s yourConfigFolder
    ```

    The configuration file is parsed as follows:

    ```bash
    yourConfigFolder
    |
    |  ecosystem.config.js   // pm2 Configuration file, no need to change
    |  global.default.js     // Global Configuration file
    |  index.js              // Configuration file loading script, no need to change
    |  repos.default.js      // svn Project configuration script
    |
    ```

    After the generation is complete, change the relevant configuration file to the actual configuration
3. Open the command line in the configuration file directory and execute

    ```bash
    pm2 start
    ```

    To confirm whether the startup is successful, you can use the following command to view the project log

    ```bash
    pm2 log svn-observer
    ```

    ![pm2 log](https://s1.ax1x.com/2020/10/30/BYLLvt.png)

## TODO

  1. add web panel.

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)