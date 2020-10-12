const fs = require('fs')
// 判断读取文件是否存在，不存在则强制新建
async function syncReadFile(filepath, initValue) {
  try {
    let file = fs.readFileSync(filepath, 'utf8')
    return file
  } catch (e) {
    let file = null
    let filesplit = filepath.split('\\')
    let end = filesplit.pop()

    fs.mkdirSync(filesplit.join('//'), { recursive: true })

    fs.writeFileSync(filepath, initValue, 'utf-8')
    file = fs.readFileSync(filepath, 'utf8')
    return file
  }
}

module.exports = { syncReadFile }
