
const fs = require('fs')
const path = require('path');
const config = require('./config')
const { syncReadFile } = require('./utils')
/** 用于同步app.json 和routesConfig数据 */
async function syncPage() {

  const appJsonName = path.join(process.cwd(), config.appJsonFilePath)
  const routesConfigName = path.resolve(__dirname, '../plugins/routesConfig.js')
  let appJsonFile = null
  try {
    appJsonFile = fs.readFileSync(appJsonName, 'utf8');
  } catch (e) {
    appJsonFile = await syncReadFile(appJsonName, `{ "pages": [] }`)
  }

  const appJsonnewFormat = appJsonFile
    .replace(/(\r\n\t|\n|\r\t)/gm, '')
    .replace(/}{/g, '},{');
  let appjson = JSON.parse(appJsonnewFormat)

  let routesConfigFile = await syncReadFile(routesConfigName, 'export default []')

  const routesNewFormat = routesConfigFile
    .replace(/(\r\n\t|\n|\r\t)/gm, '')
    .replace('export default', '')
    .replace(/}{/g, '},{');
  let routesConfig = JSON.parse(routesNewFormat)

  appjson.pages.forEach(app => {
    const page = routesConfig.filter(route => {
      return route.path === app
    })

    if (page.length === 0) {
      routesConfig.push({
        path: app
      })
    }
  })

  // 删除掉重复的路由
  let filterRoute = []
  routesConfig.forEach(item => {
    const hasRoute = filterRoute.filter(filter => {
      return item.path == filter.path
    })
    hasRoute.length > 0 ? '' : filterRoute.push(item)
  });

  routesConfig = JSON.stringify(filterRoute, null, "\t")
  routesConfig = 'export default ' + routesConfig
  fs.writeFile(routesConfigName, routesConfig, (e) => {
    console.log('routeConfig同步成功')
  })
}


// syncPage()
module.exports = syncPage
