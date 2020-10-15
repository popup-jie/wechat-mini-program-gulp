const fs = require('fs-extra')
const path = require('path')
const createdFile = (map) => {
  let dst = process.cwd()
  for (let [key, value] of map.entries()) {
    let fileName = value[0].split('\\')
    let fileIndex = fileName.indexOf('copyFile')
    fileName = fileName.slice(fileIndex + 1, fileName.length - 1)
    let _dst = path.join(dst, '/', fileName.join('//'))

    fs.mkdir(_dst, { recursive: true }, (err) => {
      for (let i = 0;i < value.length;i++) {
        let nowName = value[i].split('\\')
        let _name = nowName.pop() // 文件名
        let file = fs.readFileSync(value[i], 'utf8');
        let newPath = path.join(_dst, '/', _name)
        fs.writeFile(newPath, file, (err) => {
          if (err) {
            console.log(err)
          }
        })
      }
    })
  }
}

module.exports = { createdFile }