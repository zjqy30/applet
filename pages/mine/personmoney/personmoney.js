// pages/mine/personmoney/personmoney.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  pageNumber: '1'
 },
 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  this.offerRecord();
 },
 // 商家的
 offerRecord: function() {
  var _this = this;
  var params = {
   userId: app.globalData.userId,
   pageNumber: _this.data.pageNumber,
   pageSize: '10'
  }
  app.fetch('/hone/applet/accountCharge/list', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    // 测试一下
    // response = {
    //  "errorCode": "0",
    //  "msg": "操作成功",
    //  "data": {
    //   "pageData": {
    //    "pageNumer": 1,
    //    "pageSize": 10,
    //    "totalCount": null,
    //    "list": [{
    //     "id": "7cc52b9b71c74363a7ed959bb9e0725e",
    //     "createDate": "2019-07-15 08:41:21",
    //     "updateDate": "2019-07-15 08:41:21",
    //     "enableFlag": "1",
    //     "offerId": "517fb41caf164ee0870c871664e630d4",
    //     "outTradeNo": "1907151164110459962571",
    //     "totalFee": 1,
    //     "serviceFee": null,
    //     "chargeType": "PY",
    //     "chargeStatus": "1",
    //     "userId": "21ffb3b86867461c9384f0bd8bdf454a",
    //     "title": "短视频推广／次"
    //    }]
    //   }
    //  }
    // }

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
 }
})