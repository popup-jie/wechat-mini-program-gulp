/*
 * @Description: 这是文件代码注释
 * @Version: 1.0
 * @Autor: popup
 * @Date: 2020-08-25 16:23:12
 * @LastEditors: popup
 * @LastEditTime: 2020-09-29 18:11:31
 */

const fs = require('fs')
const path = require('path');

/** 用于同步app.json 和routesConfig数据 */
async function syncPage() {

  const appJsonName = path.resolve(__dirname, '../app.json')
  const routesConfigName = path.resolve(__dirname, '../plugins/routesConfig.js')

  const appJsonFile = fs.readFileSync(appJsonName, 'utf8');

  const appJsonnewFormat = appJsonFile
    .replace(/(\r\n\t|\n|\r\t)/gm, '')
    .replace(/}{/g, '},{');
  let appjson = JSON.parse(appJsonnewFormat)

  let routesConfigFile = fs.readFileSync(routesConfigName, 'utf-8')
  // let routesConfigFile = await syncReadFile(routesConfigName, 'export default []')

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

// 判断读取文件是否存在，不存在则强制新建
async function syncReadFile(filepath, initValue) {
  try {
    let file = fs.readFileSync(filepath, 'utf8')
    return file
  } catch (e) {
    fs.writeFileSync(filepath, initValue, 'utf-8')
    let file = fs.readFileSync(filepath, 'utf8')
    return file
  }
}

// syncPage()
module.exports = syncPage
