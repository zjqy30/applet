// pages/mine/banklist/banklist.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  banklist: [{
   bankName: '中国工商银行',
   bankImg: ''
  }, {
   bankName: '招商银行',
   bankImg: ''
  }, {
   bankName: '中国光大银行',
   bankImg: ''
  }, {
   bankName: '中信银行',
   bankImg: ''
  }, {
   bankName: '浦发银行',
   bankImg: ''
  }, {
   bankName: '广发银行',
   bankImg: ''
  }, {
   bankName: '华夏银行',
   bankImg: ''
  }, {
   bankName: '中国建设银行',
   bankImg: ''
  }, {
   bankName: '交通银行',
   bankImg: ''
  }, {
   bankName: '中国银行',
   bankImg: ''
  }, {
   bankName: '中国民生银行',
   bankImg: ''
  }, {
   bankName: '兴业银行',
   bankImg: ''
  }, {
   bankName: '平安银行',
   bankImg: ''
  }]
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  var _this = this;
  for (var i = 0, len = _this.data.banklist.length; i < len; i++) {
   _this.data.banklist[i].bankImg = '../../image/bank/' + _this.data.banklist[i].bankName + '.png';
  }
  this.setData({
   banklist: _this.data.banklist
  })
  console.log(JSON.stringify(_this.data.banklist));
 },
 // 返回
 selectedBank:function(e){
  app.globalData.withdrawData.bankName = e.currentTarget.dataset.bankname;
  wx.navigateBack({
   delta: 1
  })
 },
 /**
  * 生命周期函数--监听页面初次渲染完成
  */
 onReady: function() {

 },
 /**
  * 生命周期函数--监听页面显示
  */
 onShow: function() {

 },
 /**
  * 生命周期函数--监听页面隐藏
  */
 onHide: function() {

 },

 /**
  * 生命周期函数--监听页面卸载
  */
 onUnload: function() {

 },

 /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
 onPullDownRefresh: function() {

 },

 /**
  * 页面上拉触底事件的处理函数
  */
 onReachBottom: function() {

 },

 /**
  * 用户点击右上角分享
  */
 onShareAppMessage: function() {

 }
})