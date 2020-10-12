// 修改环境变量
const path = require('path');
const fs = require('fs')
const buildTypeScript = require('./createdYbftsbuild')
const { syncReadFile } = require('./utils')

async function changeEnvMode(mode) {
  const filename = path.resolve(__dirname, './env.js')
  const file = await syncReadFile(filename, `export default { NODE_ENV : 'test' }`)
  const newFormat = file
    .replace(/(\r\n\t|\n|\r\t)/gm, '')
    .replace('export default', '')
    .replace(/,/g, '')
    .replace(/{/g, '')
    .replace(/}/g, '')
  const left = newFormat.split(':')[0].trim()
  fs.writeFile(filename, `module.exports = { ${left || 'env'} : '${mode || 'dev'}' }`, (e) => {

    // buildTypeScript({})
  })
}

module.exports = changeEnvMode