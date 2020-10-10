/*
 * @Description: 此文件是用来配置gulp的，主要作用
 *  路径别名，类似webpack-alias的操作
 *  支持内部scss文件编译
 * 
 * @Version: 1.0
 * @Autor: popup
 * @Date: 2020-09-29 17:00:49
 * @LastEditors: popup
 * @LastEditTime: 2020-10-10 17:01:06
 */


module.exports = {
  // 路径别名
  alisa: {
    '@plugins': "./plugins",
    '@scss': './static/scss',
    '@utils': './utils',
    '@api': './api',
    '@config': './config',
    '@images': './images'
  },
  // 需要编译的别名js文件，本工具默认监听ybf.js
  buildJsUrl: ['./pages/**/ybf.js'],
  // 需要编译的scss文件，如果是abc.scss 则编译成abc.scss // 如果不写则默认监听所有除node_modules依赖的全部scss
  buildScssUrl: ['./pages/**/*.scss', './components/**/*.scss']

}