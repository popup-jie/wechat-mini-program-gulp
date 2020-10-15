
const path = require('path')
const fs = require('fs-extra')

const getFileMap = (pathName) => {
  // 文件对象map
  const dirs = new Map()
  readDdir(pathName)

  function readDdir(pathName) {
    let files = fs.readdirSync(pathName)
    for (var i = 0;i < files.length;i++) {
      let newPath = path.join(pathName, files[i])
     
      let statDdir = fs.statSync(newPath)
      if (statDdir.isDirectory()) {
        readDdir(newPath)
      } else {
        let pathArr = newPath.split('\\')
        let file = pathArr.pop()
        // 拿到文件名字
        const ddirName = pathArr.pop()
        if (dirs.has(ddirName)) {
          const ddirValue = dirs.get(ddirName)
          ddirValue.push(newPath)
        } else {
          dirs.set(ddirName, [newPath])
        }
      }
    }
  }

  return dirs
}
module.exports = {
  getFileMap
}