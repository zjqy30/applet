//app.js
const fetch = require('./utils/fetch.js')
const string = require('./utils/string.js')
const ajax = require('./utils/ajax.js')
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
  isTest:'0', // 是否是测试的1正式，0测试
  userInfo: {},
  code: '',
  openid: '',
  session_key: '',
  userType: '',
  inviteCode:'3HW3XF',
  isLogin: false, // 登录状态
  phoneNo: '', // 需要绑定手机号
  stepOneData: {
   personalImgs: '', // 个人形象照，多个拼接
   serviceTemplateIds: '', // 服务类型，多个拼接
  }, // 网红验证信息存储
  stepOneData1: {
   industryId: '', // 默认值

  }, // 商家验证信息存储
  creatOrderData: {}, // 商家发布需求的数据存储
  saveOrderDetail: {}, // 保存的订单详情可以继续修改
  saveWhDetail: {
   personalImgs:'',
   serviceTemplateIds:'',
   serviceTemplateList:['1111']
  }, // 网红个人信息，可修改提交
  saveWhDetail0:{}, // 网红个人信息原始的
  withdrawData: {}, // 提现的数据
  uploadPath: 'https://hongonew.com', // 图片上传的路径http://l1838324x8.imwork.net|||||http://192.168.0.166:8080
 },
 fetch: fetch,
 string: string,
 ajax: ajax,
 md5: md5
})