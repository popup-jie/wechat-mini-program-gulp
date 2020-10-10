/*
 * @Description: 这是文件代码注释
 * @Version: 1.0
 * @Autor: popup
 * @Date: 2020-08-25 16:23:12
 * @LastEditors: popup
 * @LastEditTime: 2020-10-10 16:30:43
 */
const GULP_CONFIG = {
  alisa: {
    '@plugins': "./plugins",
    '@scss': './static/scss',
    '@utils': './utils',
    '@api': './api',
    '@config': './config',
    '@images': './images'
  },
  buildYbfUrl: ['./pages/**/ybf.js'],
  buildScssUrl: ['./**/*.scss'],
  buildTsUrl: ['./**/*.ts']
}
let alisa, buildYbfUrl, buildScssUrl, buildTsUrl
try {
  const path = require('path')
  let filePath = path.join(process.cwd(), './gulpconfig.js')
  let gulpconfig = require(filePath)
  gulpconfig = Object.assign({}, GULP_CONFIG, gulpconfig)
  gulpconfig.buildScssUrl.push('!node_modules/**/*.scss')
  gulpconfig.buildTsUrl.push('!node_modules/**/*.ts')

  alisa = gulpconfig.alisa
  buildYbfUrl = gulpconfig.buildJsUrl
  buildScssUrl = gulpconfig.buildScssUrl
  buildTsUrl = gulpconfig.buildTsUrl

} catch (e) {
  // 文件别名
  alisa = GULP_CONFIG.alisa
  // 编译文件
  buildYbfUrl = GULP_CONFIG.buildYbfUrl
  buildScssUrl = GULP_CONFIG.buildScssUrl
  buildTsUrl = GULP_CONFIG.buildTsUrl
}

module.exports = {
  alisa: alisa,
  buildScssUrl: buildScssUrl,
  buildTsUrl: buildTsUrl,
  buildYbfUrl: buildYbfUrl
}