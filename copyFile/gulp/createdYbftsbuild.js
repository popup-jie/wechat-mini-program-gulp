const gulp = require('gulp');
const plumber = require('gulp-plumber'); // 报错日志
const rename = require('gulp-rename') // 重命名
const ts = require('gulp-typescript'); // ts编译

const config = require('./config')
const aliases = require('gulp-wechat-weapp-src-alisa'); // 目录别名重置
let tsProject = null
if (config.isTs) {
  tsProject = ts.createProject('./tsconfig.json');
}
// 编译ts文件
function buildTypeScript(event) {
  return gulp.src(['./**/*.ts', '!node_modules/**/*.ts'])
    .pipe(plumber(function (path) {
      console.log(path)
      console.error('编译有误！！！，请注意文件')
      console.log('\n重启完毕')
    }))
    .pipe(aliases(config.alisa))
    .pipe(tsProject())
    .pipe(gulp.dest(function (file) { return file.base; }))
    .pipe(rename((path) => {
      var d = event.base || 'pages'
      console.log('编译完成js文件：' + d + '\\' + path.dirname + '\\' + path.basename + '.scss')
    }))
}

module.exports = buildTypeScript