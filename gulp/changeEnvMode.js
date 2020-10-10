// 修改环境变量
const path = require('path');
const fs = require('fs')
const buildTypeScript = require('./createdYbftsbuild')
function changeEnvMode(mode) {
  const filename = path.resolve(__dirname, '../config/env.ts')
  const file = fs.readFileSync(filename, 'utf8');
  const newFormat = file
    .replace(/(\r\n\t|\n|\r\t)/gm, '')
    .replace('export default', '')
    .replace(/,/g, '')
    .replace(/{/g, '')
    .replace(/}/g, '')
  const left = newFormat.split(':')[0].trim()
  fs.writeFile(filename, `export default { ${left} : '${mode || 'dev'}' }`, (e) => {
    console.log('调整环境变量成功')

    // 这里调用一次ts编译，就是不明白为什么动态改变.ts文件后不会自动执行
    buildTypeScript({})
  })
}

module.exports = changeEnvMode