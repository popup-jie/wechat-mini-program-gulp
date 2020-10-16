# wechat-mini-program-gulp
利用`gulp+vscode`来开发小程序的一个小工具，内置扩展了一系列的`wx`全局api方法，支持自定义配置相对应的信息和别名等问题

## 安装方法：

```shell
# 全局安装
npm install -g wechat-mini-gulp
# 当前小程序根目录下运行
wechat-gulp run init
# 安装依赖
npm install
```

## 运行

```shell
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

## 使用全局方法

在app.js下面引入

```javascript
// 导入扩展方法
import './toulPlugins/index'
```

## 内置提供全局wx方法

### api路由方法

将微信方法做了二次封装，扩展了相对应的`query`和`params`写法

```js
wx.$router.push // 类似vue的vue.router.push
wx.$router.replace // 类似vue的vue.router.replace
wx.$router.switchTab  // 对应微信tab组件的switchTab方法
```

`wx.$router.push`和`wx.$router.replace`方法都支持传入的参数对象或者字符串，如下

````js
// 参数是字符串
wx.$router.push('/pages/index/index')

// 参数是对象
wx.$router.push({
    url: '/pages/index/index',
    params: {},
    query: {}
    events: {} // 对应微信的派发事件
})

````

上面的方法传参，在每个页面内部可以通过**`this.__query`**获取到传过来的`query`，**`this._params`**获取传过来的`params`

```js
// 这种写法也支持 this.__params
wx.$router.push('/pages/index/index?id=1')
```

<font color="red">特别注意：!!!!!!</font>

如果项目中需要进行分享处理，需要单独在`onLoad`拿到传入的参数，具体详情看

微信小程序页面路由(<https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html>)

因为分享进来的代码，并没有经过`wx.$router.xxx`方法的处理

### wxml页面路由方法

扩展了在`wxml`页面上面直接调用`$toPage`方法，可以直接调用`wx.$router.xxx`，

需要在标签上传入相对应的`data-xxx`

`data-url` 需要跳转的路由地址

`data-totype` 跳转的方法，支持： 

* redirect 或 replace
* switchTab
* reLaunch
* push 默认

具体使用如下

```html
<view catch:tap="$goPage" data-url="/pages/mine/order/index?userType=isC&orderStatus=4" data-totype="push"></view>
```

### 上传图片

```javascript
// pages.js
// 调用chooseImage后，返回来历史路径
wx.$wxUploadFile(tempFilePaths[0]).then(obj => {})
// 上传图片
wx.$wxUploadFile = (imageUrl) => {
}
```

### 节流函数

```javascript
wx.$YBFThrottle = (cb, delay = 300) => {
  const nowPage = wx.$getNowPage()
  if (!nowPage.isCanClick) return
  nowPage.isCanClick = false
  cb && cb()

  setTimeout(() => {
    nowPage.isCanClick = true
  }, delay)
}
```

### 全局路由拦截处理

```javascript
// /toulPlugins/extendWxApi.js
// 路由进入之前
wx.$beforeRouter = (from, to, next) => {
    // ...someCode
}

// 路由进入之后
wx.$afterRouter = (oldRoute, toRoute) => {
    // ...code
}
```

### 获取当前页面信息

```javascript
// 拿到当前页面数据
wx.$getNowPage = () => {
    // ...code
}
```

### 获取上一页信息

```javascript
// 拿到上一前页面数据
wx.$getPrevPage = () => {
  // ...code
}
```

### 确认弹窗confirm

带取消和确定按钮，可执行配置，根据`<van-dialog>`

```javascript
// confirm 
// return promise
wx.$confirm = (options) =>{}
```

### 弹出框alert

带确定按钮，可执行配置，根据`<van-dialog>`

```javascript
// alert 
// return promise
wx.$alert = (options) => {}
```

### 模态框toast

```javascript
// return promise
wx.$toast = (msg, cb) => {}
```

### 复制copy

```javascript
// return void
wx.$copy = (msg) => {}
```

### once函数

```
wx.$once(fn)
```



## 默认配置

文件位于：`gulp/config.js`距离

也可以自己扩展配置，需要在项目根目录下，新增`gulpconfig.js`文件，在进行更改

```js
// gulpconfig.js

// 以下信息为内置默认配置
module.exports = {
  // 路径别名
  alisa: {
    '@plugins': "./plugins",
    '@scss': './scss',
    '@utils': './utils',
    '@api': './api',
    '@config': './config',
    '@images': './images'
  },
  // 需要编译的别名js文件，本工具默认监听ybf.js
  buildJsUrl: ['./pages/**/ybf.js'],
  // 这里建议写好文件的路径，方便gulp减少文件的监听
    
  // 需要编译的scss文件，如果是abc.scss 则编译成abc.scss
  buildScssUrl: ['./pages/**/*.scss', './components/**/*.scss'],
  
  // ts编译
  buildTsUrl: ['./**/*.ts'],
  // app.json路径 默认根目录
  appJsonFilePath: './app.json',
  // 是否开启ts编译
  isTs: false
}
```

## routesConfig配置

该文件主要为了配置`wx.$beforeRouter`和`wx.$afterRouter `而配置的文件

 文件位于`./toulPlugins/routesConfig.js`

例如：

```javascript
export default [
    {
        path: 'pages/index/index' // app.json 相对应的 pages下的路径
        meta: {
        	noPage: true  // 提示 页面暂未开发
    	}
    }
]
```

## Gulp文件讲解

位于`/gulp`下

### 环境变量

实现小程序向webpack开发一样，自动编译api环境

```javascript
// changeEnvMode.js
// 手动改变 /config/env.ts文件，默认mode=dev 并执行ts编译
function changeEnvMode(mode) {
    // ...somecode
    buildTypeScript({})
}
```

此文件的作用大大提高了api的调整，避免开发人员进行 <font color="red">注释关闭</font> 相关代码

### 监听ybf.js生成index.js

```javascript
// createYbfPageTask.js
// 监听ybf文件，解决文件@引入,只支持监听/pages目录下，并生成相对应的index.js，
function createYbfPageTask(event) {
	// ...somecode 
}
```

### 监听scss文件生成index.wxss

```javascript
// createdYbfcss.js
// 该函数支持px转rpx 支持文件@引入，支持监听component和pages下的文件index.scss，生成相对应的index.scss
function createdYbfcss(event) {
    // ...somecode 
}
```

### 监听ts文件生成相对应的js

```javascript
// buildTypeScript.js
// 监听当前目录下所有ts文件，改动一个ts文件后，所有ts文件都会自动编译
function buildTypeScript(event) {
	// ...somecode 
}
```

### 删除文件存在的console.log

```javascript
// gulpCleanConsole.js
function gulpCleanConsole() {
	// ...somecode
}
```

### 监听新建ybf.js文件<font color="green">(此文件是重点)</font>

```javascript
// createdWechatFile.js
// 监听pages下所有文件的ybf.js生成，如果生成创建wxss,wxml,scss,ybf.js,json文件
function generateFile(event) {
    
    generateJson()
    generateRoute()
}
// 向app.json文件内部pages下新增页面路由
function generateJson(pageUrl) {    
}
// 向/toulPlugins/routesConfig.js做路由同步
function generateRoute(pageUrl) {}
```

在需要新建`小程序page`的时候，在相对应文件夹下，新增**`ybf.js`**文件就会新增创建相对应的小程序文件及路由

### 同步app.json的pages

```javascript
// synsPages.js
// 该文件只为了同步app.json下pages对象，为了后期扩展进行路由拦截配置等问题
function syncPage() {}
```

## 