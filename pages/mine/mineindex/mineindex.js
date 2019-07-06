// pages/mine/mineindex/mineindex.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType:'0', // 用户类型：0普通，1网红，2商家
    userPic:'../../image/wx-testhead.jpg', // 用户头像--微信
    isLogin:false,   // 是否登录
    userName:'星星', // 微信昵称
    userPhone:'188****7493'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const scene = decodeURIComponent(options.scene);
    console.log(scene + '88888');
    // 获取openid,key
    console.log(app.globalData.openid);
    // 判断用户类型
    this.getUserType();
  },
// 获取用户信息（getUserInfo获取用户的几个参数）
  getUserType:function(){

  },
  // 联系我们
  callUs: function (e) {
    wx.makePhoneCall({
      phoneNumber: '400-6033-235',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 关于我们
  skipAboutUs:function(){
    wx.navigateTo({
      url: '../abortus/abortus',
    })
  }
})