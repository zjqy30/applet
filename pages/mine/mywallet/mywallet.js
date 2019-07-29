// pages/mine/mywallet/mywallet.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  changeList: [],
  avaiableBalance: ''
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  var _this = this;
  // 获取账户余额
  _this.getBalance();
  // 获取提现的列表
  _this.getWithdrawList();
 },
 onShow:function(){
  // 获取账户余额
  _this.getBalance();
  // 获取提现的列表
  this.getWithdrawList();
 },
 // 获取账户余额
 getBalance: function() {
  var _this = this;
  var params = {
   userId: app.globalData.userId || ''
  }
  app.fetch('/hone/applet/accountBalance/findByUser', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    _this.setData({
     avaiableBalance: response.data.accountBalance.avaiableBalance
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
 // 获取提现
 getWithdrawList: function() {
  var _this = this;
  var params = {
   userId: app.globalData.userId || '',
   pageNumber: '1',
   pageSize: '10'
  }
  app.fetch('/hone/applet/accountCharge/list', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    var unDeal = response.data.pageData.list;
    for (var i = 0, len = unDeal.length; i < len; i++) {
     // 处理状态值
     if (unDeal[i].chargeStatus == '1') {
      unDeal[i].chargeStatusText = '成功';
     } else if (unDeal[i].chargeStatus == '2') {
      unDeal[i].chargeStatusText = '审核中';
     } else {
      unDeal[i].chargeStatusText = '拒绝';
     }

     // 处理加减号
     switch (unDeal[i].chargeType) {
      case 'DR':
       unDeal[i].icon = '-';
       break;
      case 'SR':
       unDeal[i].icon = '+';
       break;
      case 'PY':
       unDeal[i].icon = '-';
       break;
      case 'RN':
       unDeal[i].icon = '+';
       break;
     }
    }
    _this.setData({
     changeList: response.data.pageData.list
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

 // 提现
 toWithdraw: function(e) {
  if (this.data.avaiableBalance == 0) {
   wx.showToast({
    title: '您没有余额可以进行提现' || '',
    icon: 'none'
   })
  } else {
   wx.navigateTo({
    url: '../towithdraw/towithdraw?avaiableBalance=' + this.data.avaiableBalance,
   })
  }

 }
})