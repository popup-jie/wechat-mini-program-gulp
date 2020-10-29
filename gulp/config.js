/*
 * @Description: 这是文件代码注释
 * @Version: 1.0
 * @Autor: popup
 * @Date: 2020-08-25 16:23:12
 * @LastEditors: popup
 * @LastEditTime: 2020-10-29 11:23:39
 */
const GULP_CONFIG = {
  alias: {
    '@plugins': "./plugins",
    '@scss': './static/scss',
    '@utils': './utils',
    '@api': './api',
    '@config': './config',
    '@images': './images'
  },
  buildYbfUrl: ['./pages/**/ybf.js'],
  buildScssUrl: ['./**/*.scss'],
  buildTsUrl: ['./**/*.ts'],
  appJsonFilePath: './app.json',
  routesConfigName: './toulPlugins/routesConfig.js', //routesConfig.js
  isTs: false
}
let alias, buildYbfUrl, buildScssUrl, buildTsUrl, appJsonFilePath, isTs, routesConfigName
try {
  const path = require('path')
  let filePath = path.join(process.cwd(), './gulpconfig.js')
  let gulpconfig = require(filePath)
  gulpconfig = Object.assign({}, GULP_CONFIG, gulpconfig)
  gulpconfig.buildScssUrl.push('!node_modules/**/*.scss')
  gulpconfig.buildTsUrl.push('!node_modules/**/*.ts')

  alias = gulpconfig.alias
  buildYbfUrl = gulpconfig.buildJsUrl
  buildScssUrl = gulpconfig.buildScssUrl
  buildTsUrl = gulpconfig.buildTsUrl
  appJsonFilePath = gulpconfig.appJsonFilePath
  isTs = gulpconfig.isTs

  routesConfigName = gulpconfig.routesConfigName

} catch (e) {
  // 文件别名
  alias = GULP_CONFIG.alias
  // 编译文件
  buildYbfUrl = GULP_CONFIG.buildYbfUrl
  buildScssUrl = GULP_CONFIG.buildScssUrl
  buildTsUrl = GULP_CONFIG.buildTsUrl
  appJsonFilePath = GULP_CONFIG.appJsonFilePath
  isTs = GULP_CONFIG.isTs

  routesConfigName = GULP_CONFIG.routesConfigName

  buildScssUrl.push('!node_modules/**/*.scss')
  buildTsUrl.push('!node_modules/**/*.ts')
}

module.exports = {
  alias: alias,
  buildScssUrl: buildScssUrl,
  buildTsUrl: buildTsUrl,
  buildYbfUrl: buildYbfUrl,
  appJsonFilePath,
  isTs,
  routesConfigName
}