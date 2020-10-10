/*
 * @Description: 这是文件代码注释
 * @Version: 1.0
 * @Autor: popup
 * @Date: 2020-08-31 10:01:24
 * @LastEditors: popup
 * @LastEditTime: 2020-09-28 14:37:34
 */
// import {
//   reactive
// } from './extendAppGlobalProxy'

const pageExtend = Page => {
  return object => {
    // 导出原生Page传入的object参数中的生命周期函数
    const {
      onLoad,
      onShow
    } = object

    // 公共的onLoad生命周期函数
    object.onLoad = function (options) {
      // 记录当前页面参数
      this.__params = wx.$toPageOptions.params || options
      this.__query = wx.$toPageOptions.query || {}

      this.eventChannel = this.getOpenerEventChannel()

      let prevRoute = wx.$getPrevPage()

      if (prevRoute) {
        // 页面打开后触发
        wx.$afterRouter(prevRoute, wx.$getNowPage())
      }

      // 执行一次globalData数据代理
      // if (!getApp().globalData.isInit) {
      // getApp().globalData.isInit = true
      // getApp().globalData = reactive(getApp().globalData)
      // }

      // 执行onLoaded生命周期函数
      if (typeof onLoad === 'function') {
        onLoad.call(this, options)
      }
    }

    object.onShow = function (options) {
      this.globalData = getApp().globalData

      if (typeof onShow === 'function') {
        onShow.call(this, options)
      }
    }

    // 扩展this.$emit方法，对this.eventChannel.emit进行封装
    object.$emit = function (...args) {
      // wx.$getNowPage().eventChannel.emit(...args);
      this.eventChannel.emit(...args);
    }

    // 扩展页面跳转方法，主要是为了路由监听
    object.$goPage = (e) => {
      const {
        url,
        totype
      } = e.currentTarget.dataset
      if (totype == 'redirect' || totype == 'replace') {
        wx.$router.replace(url)
      } else if (totype == 'switchTab') {
        wx.$router.switchTab(url)
      } else if (totype == 'reLaunch') {
        wx.reLaunch({
          url
        })
      } else {
        wx.$router.push(url)
      }
    }

    return Page(object)
  }
}



// 获取原生Page
const originalPage = Page
// 定义一个新的Page，将原生Page传入Page扩展函数
Page = pageExtend(originalPage)