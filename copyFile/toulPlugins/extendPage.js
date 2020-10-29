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


      if (this.computed) {
        computed(this, this.computed)
      }

      if (this.watch) {
        watch(this, this.watch)
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


function computed(ctx, obj) {
  let keys = Object.keys(obj)
  let dataKeys = Object.keys(ctx.data)
  dataKeys.forEach(dataKey => {
    defineReactive(ctx.data, dataKey, ctx.data[dataKey])
  })
  let firstComputedObj = keys.reduce((prev, next) => {
    ctx.data.$target = function () {
      ctx.setData({ [next]: obj[next].call(ctx) })
    }
    // 手动读取一次变量，触发对象的get方法
    prev[next] = obj[next].call(ctx)
    ctx.data.$target = null
    return prev
  }, {})

  ctx.setData(firstComputedObj)

  Object.assign(ctx.data, firstComputedObj)
}

function watch(ctx, obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(ctx.data, key, ctx.data[key], function (old, newvalue) {
      obj[key].call(ctx, old, newvalue)
    })
  })
}

function defineReactive(data, key, val, fn) {
  let subs = data['$' + key] || [] // 新增
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get: function () {
      if (data.$target) {
        subs.push(data.$target)
        data['$' + key] = subs
      }
      return val
    },
    set: function (newVal) {
      if (newVal === val) return
      fn && fn(val, newVal)

      // 每一次设置值都执行sub？
      if (subs.length) {
        // 用 setTimeout 因为此时 this.data 还没更新
        setTimeout(() => {
          subs.forEach(sub => sub())
        }, 0)
      }
      val = newVal
    },
  })
}



// 获取原生Page
const originalPage = Page
// 定义一个新的Page，将原生Page传入Page扩展函数
Page = pageExtend(originalPage)