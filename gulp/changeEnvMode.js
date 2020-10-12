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
    
    buildTypeScript({})
  })
}

module.exports = changeEnvMode