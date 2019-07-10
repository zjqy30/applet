// pages/mine/identification4/identification4.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  // 条框跳转
  skipAgreement: function(e) {
    var type = e.currentTarget.dataset.type;
    console.log(type);
    wx.navigateTo({
      url: '',
    })
  },
  // 选择服务类型
  selectService:function(){
    wx.navigateTo({
      url: '../servicetype/servicetype',
    })
  }
})