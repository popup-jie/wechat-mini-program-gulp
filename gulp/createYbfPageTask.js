const aliases = require('gulp-wechat-weapp-src-alisa'); // 目录别名重置
const rename = require('gulp-rename') // 重命名
const plumber = require('gulp-plumber'); // 报错日志
const gulp = require('gulp');
const config = require('./config')
const changed = require('gulp-changed') // 文件改动

// 监听ybf文件，解决文件@引入, 并生成相对应的index.js
function createYbfPageTask(event) {
  return gulp.src(config.buildYbfUrl)
    .pipe(plumber(function (path) {
      console.log(path)
      console.error('编译有误！！！，请注意文件')
      console.error('\n重启完毕')
    }))
    .pipe(aliases(config.alisa))

    .pipe(rename((path) => {
      path.basename = 'index'
      path.extname = '.js'
    }))
    .pipe(changed('./pages')) //只编译改动的文件
    .pipe(gulp.dest(function (file) { return file.base; }))
    .pipe(rename((path) => {
      var d = event.base || 'pages'
      console.log('编译完成文件：' + d + '\\' + path.dirname + '\\' + path.basename + '.js')
    }))
}

module.exports = createYbfPageTask