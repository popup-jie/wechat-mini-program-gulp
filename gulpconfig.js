/*
 * @Description: 此文件是用来配置gulp的，主要作用
 *  路径别名，类似webpack-alias的操作
 *  支持内部scss文件编译
 * 
 * @Version: 1.0
 * @Autor: popup
 * @Date: 2020-09-29 17:00:49
 * @LastEditors: popup
 * @LastEditTime: 2020-10-12 17:30:33
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
  // 这里建议写好文件的路径，方便gulp减少文件的监听

  // 需要编译的scss文件，如果是abc.scss 则编译成abc.scss
  buildScssUrl: ['./pages/**/*.scss', './components/**/*.scss'],
  
  // app.json路径 默认根目录
  appJsonFilePath: './app.json',

}