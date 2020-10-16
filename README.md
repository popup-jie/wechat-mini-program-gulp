# wechat-mini-program-gulp
利用`gulp+vscode`来开发小程序的一个小工具，内置扩展了一系列的`wx`全局api方法

## 使用方法：

```shell
# 全局安装
npm install -g wechat-mini-gulp
# 当前小程序根目录下运行
wechat-gulp run init
# 安装依赖
npm install
# 根目录运行

#开发环境
npm run gulpdev
#正式环境
npm run gulpbuild
# 测试环境
npm run gulptest
# 清空console
npm run gulpclean
# 同步routerConfig
npm run gulpsync
```

## 项目目录

```markdown
shop-wechat
├── gulp					// gulp任务包
|   |—— pageTemplate		// 页面模板文件
|   |—— cleanplugIn 		// 清空console-gulp插件
│   ├── changeEnvMode.js	// 修改环境变量
│   ├── config.js			// 配置
│   ├── createdWechatFile.js	// 新增ybf.js自动同步
│   ├── createdYbfcss.js		// 编译scss
│   ├── createdYbftsbuild.js	// 编译ts
│   ├── createYbfPageTask.js	// 编译ybf.js
│   ├── env.js				   // 环境变量
│   ├── gulpCleanConsole.js		// 清空console-任务队列
│   └── synsPages.js			// 同步app.json下的pages，后期可以处理路由权限
│   └── utils.js				// 工具方法
├── gulpfile.js				// gulp任务项
├── package.json			// npm依赖
└── toulPlugins					// 扩展小程序路由方法，实体方法等
    |—— extendPage			// 扩展页面方法
    |—— extendWxApi			// 扩展wx内置方法
    |—— index			    // 导出plugins下文件
    |—— routerHandle		// 伪造vue-router，代理wx内置跳转方法
    └── routesConfig		// 伪造vue-routes，里面为当前小程序页面路由

```

