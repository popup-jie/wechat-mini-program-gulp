const gulp = require('gulp');
const sass = require('gulp-sass'); // sass编译
const rename = require('gulp-rename') // 重命名
const changed = require('gulp-changed') // 文件改动

const px2rpx = require('gulp-px2rpx'); // glup 将px单位转换成rpx
const plumber = require('gulp-plumber'); // 报错日志
const aliases = require('gulp-wechat-weapp-src-alisa'); // 目录别名重置
const config = require('./config')

// 编译scss文件
function createdYbfcss(event) {
  return gulp.src(config.buildScssUrl, '!./pageTemplate/*.scss') // 需要编译的文件
    .pipe(plumber(function (path) {
      console.log(path)
      console.error('编译有误！！！，请注意文件')
      console.error('\n重启完毕')
    }))
    .pipe(aliases(config.alisa))
    .pipe(px2rpx({
      screenWidth: 750, // 设计稿屏幕, 默认750
      wxappScreenWidth: 750, // 微信小程序屏幕, 默认750
      remPrecision: 6 // 小数精度, 默认6
    }))
    .pipe(sass({
      outputStyle: 'compressed'//展开输出方式 expanded 
    }))
    .pipe(rename((path) => {
      path.extname = '.wxss'
    }))
    .pipe(changed('./pages')) //只编译改动的文件
    .pipe(changed('./components')) //只编译改动的文件
    // 改动谁就编译谁
    .pipe(gulp.dest(function (file) { return file.base; }))
    .pipe(rename((path) => {
      var d = event.base || 'pages'
      console.log('编译完成文件：' + d + '\\' + path.dirname + '\\' + path.basename + '.scss')
    }))
}

module.exports = createdYbfcss