// pages/mine/recentpayment/recentpayment.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  rencentList: [] // 最近收款人列表
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  this.getRecentPerson();
 },
 // 获取最近收款
 getRecentPerson: function() {
  var _this = this;
  var params = {
   userId: app.globalData.userId || '21ffb3b86867461c9384f0bd8bdf454a'
  }
  app.fetch('/hone/applet/applyWithDraw/receiverList', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    // 测试数据
    // response = {
    //  "errorCode": "0",
    //  "msg": "操作成功",
    //  "data": {
    //   "receiverListRepos": [{
    //    "userName": "安徽郭富城",
    //    "cardNo": "123456",
    //    "bankName": "中国银行",
    //    "createDate": "2019-06-06 02:43:45"
    //   }, {
    //    "userName": "xx",
    //    "cardNo": "1234567890",
    //    "bankName": "交通银行",
    //    "createDate": "2019-06-06 02:43:45"
    //   }]
    //  }
    // };
    var unDeal = response.data.receiverListRepos;
    for (var i = 0, len = unDeal.length; i < len; i++) {
     unDeal[i].bankimg = '../../image/bank/' + unDeal[i].bankName + '.png';
    }

    _this.setData({
     rencentList: unDeal
    })
    console.log(JSON.stringify(unDeal))
   } else {
    // 数据返回失败
    wx.showToast({
     title: '数据获取失败' || '',
     icon: 'none'
    })
   }
  })
 },
 // 点击跳转
 selectedPerson: function(e) {
  app.globalData.withdrawData.receiver = e.currentTarget.dataset.receiver;
  app.globalData.withdrawData.bankName = e.currentTarget.dataset.bankname;
  app.globalData.withdrawData.cardNo = e.currentTarget.dataset.cardno;
  wx.navigateBack({
   delta: 1
  })

 }
})