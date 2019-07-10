//app.js
const fetch = require('./utils/fetch.js')
const md5 = require('./utils/md5.js')
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     console.log(JSON.stringify(res.userInfo))
          //     // 可以将 res 发送给后台解码出 unionId
          //     this.globalData.userInfo = res.userInfo;
          //     console.log(this.globalData.userInfo + '这是在app.js里获取的用户信息');
          //     wx.setStorage({
          //       key: 'userinfo',
          //       data: JSON.stringify(res.userInfo),
          //     })

          //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //     // 所以此处加入 callback 以防止这种情况
          //     if (this.userInfoReadyCallback) {
          //       this.userInfoReadyCallback(res)
          //     }
          //   }
          // })
        } else {

        }
      }
    })
  },
  globalData: {
    userInfo: {},
    code: '',
    openid: '',
    session_key: '',
    userType: '',
    isLogin: false, // 登录状态
    phoneNo: '', // 需要绑定手机号

  },
  fetch: fetch,
  md5: md5
})