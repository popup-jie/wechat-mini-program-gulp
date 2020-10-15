const fs = require('fs')
const path = require('path');
const gulp = require('gulp');
const plumber = require('gulp-plumber'); // 报错日志
const config = require('./config')

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
  // windows没问题，可能需要排除一下mac的
  var str = event.path.match(/pages(\S*)ybf.js/)[1];

  // 获取写入app.json 的文件，去掉\xxx\xx 的写反，反写为/xxx/xx
  let appjsonStr = str.substring(1, str.length - 1)

  appjsonStr = appjsonStr.replace(/\\/g, '/')

  let filePath = event.path.split('\\')
  filePath.pop()

  // d = d.split('\\')[d.length - 1]
  filePath = filePath.join('\\') + '\\index.js'

  // 解决 git pull 执行后导致的代码被覆盖问题
  isFileExisted(filePath).then(res => {
    console.log('当前页面存在index.js')
  }).catch(() => {
    generateJson(appjsonStr)
    generateRoute(appjsonStr)
    return gulp.src('./pageTemplate/*')
      .pipe(plumber(function (path) {
        console.log(path)
        console.error('编译有误！！！，请注意文件')
        console.log('\n重启完毕')
      }))
      .pipe(gulp.dest(`./pages/${str}`))
  })
}

// 编译app.json
function generateJson(pageUrl) {
  const filename = path.join(process.cwd(), config.appJsonFilePath)

  // 针对app.json写入相对应的pages文件
  function convert(input_file_path) {
    const file = fs.readFileSync(input_file_path, 'utf8');
    const newFormat = file
      .replace(/(\r\n\t|\n|\r\t)/gm, '')
      .replace(/}{/g, '},{');
    let appjson = JSON.parse(newFormat)
    let pages = appjson.pages

    if (pageUrl == '/') {
      pages.indexOf(`pages/index`) > -1 ? '' : pages.push(`pages/index`)
    } else {
      pages.indexOf(`pages/${pageUrl}/index`) > -1 ? '' : pages.push(`pages/${pageUrl}/index`)
    }
    fs.writeFile(input_file_path, JSON.stringify(appjson, null, "\t"), (e) => {
      console.log('app.json写入成功')
    })
  }
  convert(filename);
}

// 编译routesConfig.js
function generateRoute(pageUrl) {
  const filename = path.resolve(__dirname, '../plugins/routesConfig.js')
  const file = fs.readFileSync(filename, 'utf8');
  const newFormat = file
    .replace(/(\r\n\t|\n|\r\t)/gm, '')
    .replace('export default', '')
    .replace(/}{/g, '},{');
  let appjson = JSON.parse(newFormat)

  let equalPath = `pages/${pageUrl}/index`
  if (pageUrl == '/') {
    equalPath = `pages/index`
  }

  appjson.forEach(page => {
    if (page.path == equalPath) {
      console.log('页面存在！, 无需重复写入')
      return
    }
  })
  appjson.push({ "path": equalPath })
  appjson = JSON.stringify(appjson, null, "\t")
  appjson = 'export default ' + appjson
  fs.writeFile(filename, appjson, (e) => {
    console.log('routeConfig写入成功')
  })
}

// generateRoute()

module.exports = generateFile