const cleanplugIn = require('./cleanplugIn.js')
const gulp = require('gulp');
const rename = require('gulp-rename') // 重命名

const aliases = require('gulp-wechat-weapp-src-alisa'); // 目录别名重置
const config = require('./config')

function gulpCleanConsole() {
  return gulp.src(['./app.js','./pages/**/*.js', '!node_modules/**/*.js'])
    .pipe(cleanplugIn())
    .pipe(aliases(config.alisa))
    .pipe(rename((path) => {
      if (path.basename == 'ybf') {
        path.basename = 'index'
      }
      path.extname = '.js'
    }))
    .pipe(gulp.dest(function (file) { return file.base; }))
}

module.exports = gulpCleanConsole

