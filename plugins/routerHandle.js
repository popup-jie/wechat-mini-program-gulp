import routes from './routesConfig'

const isObject = (obj) => {
  return obj.constructor === Object
}
function routerHandle() {
  return {
    go(num) {
      if (num >= 0) {
        wx.$toast('参数值必须小于等于0')
        return
      }
      wx.navigateBack({
        delta: Math.abs(num)
      });
    },
    /**
     * 
     * @param {*} op 
     * {
     *    url: '/pages/mine/index?a=1',
     *    success: '',
     *    error: ''
     * }
     */
    replace(option) {
      wx.$YBFThrottle(() => {
        this.urlPathToObject(option, 'redirectTo').then(() => {
          wx.$beforeRouter(option, wx.$next)
        })
      }, 0)
    },
    push(option) {
      wx.$YBFThrottle(() => {
        this.urlPathToObject(option, 'navigateTo').then(() => {
          wx.$beforeRouter(option, wx.$next)
        })
      }, 0)
    },
    switchTab(option) {
      wx.$YBFThrottle(() => {
        this.urlPathToObject(option, 'switchTab').then(() => {
          wx.$beforeRouter(option, wx.$next)
        })
      }, 0)
    },

    // 路由格式为对象，为防止传入是字符串，转变成路由对象
    urlPathToObject(op, type) {
      return new Promise((resolve, reject) => {
        if (isObject(op)) {
          if (!op.url) {
            wx.$toast('url参数为必填')
            reject()
          }
          this.nowPathIsHasRoute(op.url).then(() => {
            wx.$toPageOptions = Object.assign({}, op, { type })
            resolve()
          }).catch(() => { })
        } else {
          this.nowPathIsHasRoute(op).then(() => {
            wx.$toPageOptions = {
              url: op,
              type,
            }
            resolve()
          }).catch(() => { })
        }
      })
    },
    // 判断当前路由存不存在
    nowPathIsHasRoute(url) {
      return new Promise((resolve, reject) => {
        let path = url.split('?')[0].replace(/^\//, '')
        const d = routes.filter(ro => {
          return ro.path === path
        })
        if (d.length == 0) {
          wx.$toast('路由不存在，请检查app.json文件是否存在')
          reject()
        } else {
          resolve()
        }
      })
    }
  }
}

export default routerHandle