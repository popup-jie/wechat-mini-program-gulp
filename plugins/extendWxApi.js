import routerHandle from './routerHandle'
import routes from './routesConfig'

import config from '../config/index'

wx.$isCanClick = true // 重复点击
wx.$toPageOptions = {} // 保存需要跳转的页面对象


const noop = () => { }

const isObject = (obj) => {
  return obj.constructor === Object
}

wx.$toast = (msg, cb, delay = 0) => {
  wx.showToast({
    title: '' + msg,
    icon: 'none',
    success: () => {
      setTimeout(() => {
        cb && cb()
      }, delay)
    },
    duration: 1800,
    mask: true,
  })
}

// confirm
wx.$confirm = (options) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: options.title,
      content: options.message,
      success(res) {
        if (res.confirm) {
          resolve(res)
        } else if (res.cancel) {
          reject()
        }
      }
    })
  })
}

// 为防止用户重复点击，弹出多个页面，坐以下处理
wx.$YBFThrottle = (cb, delay = 0) => {
  // const nowPage = wx.$getNowPage()
  if (!wx.$isCanClick) return
  wx.$isCanClick = false
  if (delay != 0) {
    cb && cb()
    wx.$YBFThrottleTime = setTimeout(() => {
      wx.$isCanClick = true
      clearTimeout(wx.$YBFThrottleTime)
      wx.$YBFThrottleTime = null

    }, delay)
  } else {
    wx.nextTick(() => {
      wx.$isCanClick = true
      cb && cb()
    })
  }

}

// 路由处理
wx.$router = routerHandle()

// 实现vue路由 next方法
wx.$next = (bool) => {
  // 不执行页面跳转
  if (bool === false) {
    wx.$isCanClick = true
    clearTimeout(wx.$YBFThrottleTime)
    wx.$YBFThrottleTime = null
    // wx.$toast('不允许跳转')
    return
  }

  wx.$urlpipeExec()
}

// 实际执行函数跳转的地方
wx.$urlpipeExec = () => {
  const option = wx.$toPageOptions
  let successHanlde = option.success || noop

  wx[option.type]({
    url: option.url,
    success: successHanlde,
    fail: option.error || option.fail || noop,
    events: option.events || noop,
  })
}

// 拿到当前页面数据
wx.$getNowPage = () => {
  const pages = getCurrentPages()
  const nowPage = pages[pages.length - 1]
  return nowPage
}

// 拿到上一前页面数据
wx.$getPrevPage = () => {
  const pages = getCurrentPages()
  const nowPage = pages[pages.length - 2]
  return nowPage
}

// 拿到路由信息
wx.$getRoute = (to, form) => {
  // 新路由
  const toUrl = isObject(to) ? to.url : to
  const newPath = toUrl.replace(/^\//, '').split('?')[0]

  // 旧路由
  const oldPath = form.replace(/^\//, '').split('?')[0]

  // 旧路由
  const oldRoute = routes
    .filter((route) => {
      if (route.path === oldPath) {
        return route
      }
    })
    .shift()

  // 新路由
  const toRoute = routes
    .filter((route) => {
      if (route.path === newPath) {
        return route
      }
    })
    .shift()

  return {
    oldRoute,
    toRoute,
  }
}

// 复制
wx.$copy = (str) => {
  str += ''
  wx.setClipboardData({
    data: str,
    success: () => {
      wx.getClipboardData({
        success: () => {
          wx.$toast('复制成功')
        },
      })
    },
  })
}

// 上传图片
wx.$wxUploadFile = (imageUrl) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${config.uploadApi}/file/upload/`,
      filePath: imageUrl,
      name: 'file',
      formData: {
        file: imageUrl,
        createdBy: getApp().globalData.ybfMerchantInfo.weixinNo,
      },
      success(res) {
        resolve(JSON.parse(res.data))
      },
      fail() {
        reject()
      },
    })
  })
}

// 路由进入之前
wx.$beforeRouter = (to, next) => {
  const {
    oldRoute,
    toRoute
  } = wx.$getRoute(to, wx.$getNowPage().route)

  if (oldRoute.beforeRouter) {
    oldRoute.beforeRouter && oldRoute.beforeRouter(oldRoute, toRoute)
  } else {
    if (toRoute.meta && toRoute.meta.noPage) {
      wx.$toast('页面暂未开发')
      next(false)
      return
    }

    next()
  }
}

// 路由进入之后
wx.$afterRouter = (oldRoute, toRoute) => {
  console.log('路由进入之后')
  // let now = wx.$getNowPage()
  // let proxyData = now.globalData
  oldRoute.afterRouter && oldRoute.afterRouter(oldRoute, toRoute)
}