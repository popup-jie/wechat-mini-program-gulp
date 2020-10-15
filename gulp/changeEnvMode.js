// 修改环境变量
const path = require('path');
const fs = require('fs')
const buildTypeScript = require('./createdYbftsbuild')
const { syncReadFile } = require('./utils')
const config = require('./config')

async function changeEnvMode(mode) {
  const filename = path.resolve(__dirname, './env.js')
  const file = await syncReadFile(filename, `export default { NODE_ENV : 'test' }`)
  const newFormat = file
    .replace(/(\r\n\t|\n|\r\t)/gm, '')
    .replace('module.exports', '')
    .replace(/,/g, '')
    .replace(/{/g, '')
    .replace(/}/g, '')
  let left = newFormat.split(':')[0].trim().split('=')[1]
  left = left || 'env'
  mode = mode || 'dev'
  fs.writeFile(filename, `module.exports = {${left} : '${mode}' }`, (e) => {
    if (config.isTs) {
      buildTypeScript()
    }
  })
}

module.exports = changeEnvMode