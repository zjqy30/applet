// pages/mine/wantToDrawback/wantToDrawback.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  isShow:false
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  this.setData({
   offerId: options.offerId || "308687cd3a7f47c7b5c4c16d9e9f70b7"
  })
  this.getOrderDetail();
 },
 // 获取该订单的详情
 getOrderDetail: function() {
  var _this = this;
  var params = {
   id: _this.data.offerId,
   userId: app.globalData.userId || 'fb8abfba4f62468598b162ac8417c28f',
   status: '' // 需求状态值(订单大厅,派单中AP，LK进行中，已完成FN，审核中PY)
  }
  app.fetch('/hone/applet/offer/offerInfo', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    var unDeal = response.data.offerInfo;

    // 处理商品照片
    if (unDeal.offerPic.indexOf(',') != '-1') {
     unDeal.offerPic = unDeal.offerPic.substr(0, unDeal.offerPic.indexOf(','));
    }

    // 处理标签
    if (unDeal.tag) {
     var tagArr = unDeal.tag.split(',');
     unDeal.tagArr = tagArr;
    } else {
     unDeal.tagArr = ['暂无'];
    }

    _this.setData({
     offerInfo: unDeal
    })
   } else {
    // 数据返回失败
    wx.showToast({
     title: '数据获取失败' || '',
     icon: 'none'
    })
   }
  })
 },

 // 申请退款
 submitDrawback: function(e) {
  var _this = this;
  // _this.setData({
  //  isShow: !_this.data.isShow
  // })
  console.log(e);
  if (!e.detail.value.reason || e.detail.value.reason == ''){
   wx.showToast({
    title: '请填写退款原因！',
    icon: 'none'
   })
   return false;
  }
  var _this = this;
  var params = {
   offerId: _this.data.offerId,
   userId: app.globalData.userId || 'fb8abfba4f62468598b162ac8417c28f',
   openid: app.globalData.openid || 'o562H5Cz3QpYBiD4uhnDSQQqUzWA',
   reason: e.detail.value.reason
  }
  app.fetch('/hone/applet/offer/applyRefund', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    _this.setData({
     isShow: !_this.data.isShow
    })
    setTimeout(function(){
     wx.navigateBack({
      delta: 1
     })
    },2000)
   } else {
    // 数据返回失败
    wx.showToast({
     title: '数据获取失败' || '',
     icon: 'none'
    })
   }
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