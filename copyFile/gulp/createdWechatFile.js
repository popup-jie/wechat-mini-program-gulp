const fs = require('fs')
const path = require('path');
const gulp = require('gulp');
const plumber = require('gulp-plumber'); // 报错日志
const config = require('./config');

function isFileExisted(filePath) {
  return new Promise(function (resolve, reject) {
    fs.access(filePath, (err) => {
      if (err) {
        reject(err.message);
      } else {
        resolve('existed');
      }
    })
  })
}

/** 
 * 暂时未考虑分包的情况
 * */

// 生成页面文件的方法
function generateFile(event) {

  let parentPath = path.resolve(event.path, '../')
  let indexFile = path.resolve(parentPath, './index.js')

  isFileExisted(indexFile).then(res => {
    console.log('当前页面存在index.js')
  }).catch(() => {
    generateJson(parentPath)
    generateRoute(parentPath)
    const pagePath = path.join(__dirname, '../pages/01-template/*')
    return gulp.src(pagePath)
      .pipe(plumber((path) => {
        console.log(path)
        console.error('编译有误！！！，请注意文件')
        console.log('\n重启完毕')
      }))
      .pipe(gulp.dest(`${parentPath}`))
  })
}

// 编译app.json
const generateJson = (parentPath) => {
  const filename = path.resolve(__dirname, '../app.json')

  // 针对app.json写入相对应的pages文件
  function convert(input_file_path) {
    const file = fs.readFileSync(input_file_path, 'utf8');
    const newFormat = file
      .replace(/(\r\n\t|\n|\r\t)/gm, '')
      .replace(/}{/g, '},{');
    let appjson = JSON.parse(newFormat)

    let pages = appjson.pages

    let pathUrl = parentPath.toLocaleLowerCase().slice(process.cwd().length + 1)
    pathUrl = pathUrl.replace(/\\/g, '/') + '/index'

    pages.indexOf(pathUrl) > -1 ? '' : pages.push(pathUrl)

    fs.writeFile(input_file_path, JSON.stringify(appjson, null, "\t"), (e) => {
      console.log('app.json写入成功')
    })
  }
  convert(filename);
}

// 编译routesConfig.js
function generateRoute(parentPath) {
  const filename = path.resolve(__dirname, '../plugins/routesConfig.js')
  const file = fs.readFileSync(filename, 'utf8');
  const newFormat = file
    .replace(/(\r\n\t|\n|\r\t)/gm, '')
    .replace('export default', '')
    .replace(/}{/g, '},{');
  let appjson = JSON.parse(newFormat)

  let equalPath = parentPath.toLocaleLowerCase().slice(process.cwd().length + 1)
  equalPath = equalPath.replace(/\\/g, '/') + '/index'

  let isHas = false
  appjson.forEach(page => {
    if (page.path == equalPath) {
      console.log('页面存在！, 无需重复写入')
      isHas = true
    }
  })

  if (isHas) return

  appjson.push({ "path": equalPath })
  appjson = JSON.stringify(appjson, null, "\t")
  appjson = 'export default ' + appjson
  fs.writeFile(filename, appjson, (e) => {
    console.log('routeConfig写入成功')
  })
}

// generateRoute()

module.exports = generateFile