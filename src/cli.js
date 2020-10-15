const fs = require('fs-extra')
const path = require('path')
const { getFileMap } = require('./getFileMap')
const { createdFile } = require('./createdFile')
const { copyPackageJson } = require('./copyPackageJson')
exports.run = function (type, name) {
  try {
    fs.readFileSync(path.join(process.cwd(), '/', 'app.json'), 'utf8')
    console.log('正在拷贝目录...')
    var pathName = path.resolve(__dirname, '../', 'copyFile');
    let dirs = getFileMap(pathName)
    createdFile(dirs)
    copyPackageJson()
    console.log('文件已启动， crtl + y 结束进程')
  } catch (e) {
    console.log(`根目录下不存在app.json文件，请在小程序根目录操作`)
    process.exit(1)
  }
}
