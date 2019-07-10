// pages/mine/identification2/identification2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    handCard: '../../image/wx-default.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  skipModel: function(e) {
    var type = e.currentTarget.dataset.type;
    // console.log(type);
    // 非tabbar页面
    wx.navigateTo({
      url: '',
    })
  },
  // 下一步
  skipNext: function () {
    wx.navigateTo({
      url: '../identification3/identification3',
    })
  }



})