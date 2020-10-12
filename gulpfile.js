const gulp = require('gulp');
const generateFile = require('./gulp/createdWechatFile')
const createYbfPageTask = require('./gulp/createYbfPageTask')
const buildTypeScript = require('./gulp/createdYbftsbuild')
const createdYbfcss = require('./gulp/createdYbfcss')
const syncPage = require('./gulp/synsPages')
const watcher = require('gulp-watch') // watch
const config = require('./gulp/config')
const changeEnvMode = require('./gulp/changeEnvMode')

const gulpCleanConsole = require('./gulp/gulpCleanConsole')
// 编译sass
gulp.task('waterCss', async () => {
  await watcher(config.buildScssUrl, ['change'], async (event) => {
    await createdYbfcss(event);
  });
})

// 同步app.json->pages 和 routesConfig
gulp.task('syncPage', async () => {
  await syncPage()
})


// 监听ybf.js文件并编译，编译运用别名
gulp.task('waterPagejs', async () => {
  await watcher(config.buildYbfUrl, function (e) {
    if (e.event == 'add') {
      generateFile(e)
    } else if (e.event == 'change') {
      createYbfPageTask(e)
    } else {
      console.log('delete')
    }
  })
})

// 直接修改环境变量
gulp.task('buildEnv', async () => {
  await changeEnvMode(process.argv.pop().split('=')[1])
})

gulp.task('clean', async () => {
  gulpCleanConsole()
})
// 监听ts文件并编译
gulp.task('waterTs', async () => {
  if (config.isTs) {
    await watcher(config.buildTsUrl, async (event) => {
      // console.log(event)
      buildTypeScript(event)
    })
  }
})


// 默认任务
gulp.task('default', gulp.parallel(['syncPage', 'waterCss', 'waterTs', 'waterPagejs', 'buildEnv']), () => {
  console.log('start')
});

