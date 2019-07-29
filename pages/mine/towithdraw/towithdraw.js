// pages/mine/towithdraw/towithdraw.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  fee: 0, // 手续费
  userId: app.globalData.userId || '21ffb3b86867461c9384f0bd8bdf454a'
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  this.setData({
   avaiableBalance: options.avaiableBalance
  })
 },
 // 跳转最近收款人
 skipRencet: function() {
  wx.navigateTo({
   url: '../recentpayment/recentpayment',
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
  console.log(app.globalData.withdrawData);
  this.setData({
   receiver: app.globalData.withdrawData.receiver,
   cardNo: app.globalData.withdrawData.cardNo,
   bankName: app.globalData.withdrawData.bankName,
  })
 },
 // 选择收款的银行
 selectBank: function() {
  wx.navigateTo({
   url: '../banklist/banklist',
  })
 },
 // 计算手续费
 countFee: function(e) {
  var fillBalance = e.detail.value;
  this.setData({
   fee: parseFloat(parseInt(fillBalance) * 0.01)
  })
  if (parseInt(fillBalance) > parseInt(this.data.avaiableBalance)) {
   wx.showToast({
    title: '您的余额不足，请重新输入！' || '',
    icon: 'none'
   })
  }

 },
 // 全部提现
 allWithDraw: function() {
  this.setData({
   allMoney: this.data.avaiableBalance
  })
 },
 // 提取
 submitWithdraw: function(e) {
  var _this = this;
  console.log(JSON.stringify(e) + '');
  app.globalData.withdrawData.drawAmount = e.detail.value.drawAmount;
  app.globalData.withdrawData.receiver = e.detail.value.receiver;
  app.globalData.withdrawData.cardNo = e.detail.value.cardNo;
  app.globalData.withdrawData.bankName = e.detail.value.bankName;
  app.globalData.withdrawData.userId = app.globalData.userId;

  if (!e.detail.value.receiver || e.detail.value.receiver == '') {
   _this.popToast('请输入收款人姓名！');
   return false;
  } else if (!e.detail.value.cardNo || e.detail.value.cardNo == '') {
   _this.popToast('请输入收款卡号！');
   return false;
  } else if (!e.detail.value.bankName || e.detail.value.bankName == '') {
   _this.popToast('请选择收款银行！');
   return false;
  } else if (!e.detail.value.drawAmount || e.detail.value.drawAmount == '') {
   _this.popToast('请输入提取金额！');
   return false;
  }


  _this.submitData();
 },
 // 提示语
 popToast: function(info) {
  wx.showToast({
   title: info || '',
   icon: 'none'
  })
 },
 // 提交数据
 submitData: function() {
  var _this = this;
  var params = app.globalData.withdrawData;
  app.fetch('/hone/applet/applyWithDraw/apply', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    wx.navigateBack({
      delta:1
    })
   } else {
    // 数据返回失败
    wx.showToast({
     title: response.msg,
     icon: 'none'
    })
   }
  })
 }

})