// pages/hall/snatchlist/snatchlist.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  snatchUserList:[]
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  this.setData({
   offerId: options.offerId || "a5cc6e121d25453e8cace46e41b03da6"
  })
  this.getSnatchList();
 },
 // 获取抢单人员列表
 getSnatchList: function() {
  var _this = this;
  var params = {
   offerId: _this.data.offerId
  }
  app.fetch('/hone/applet/offer/snatchUserList', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    var unDeal  =response.data.snatchUserList;
    // for(var i=0,len=unDeal.length;i<len;i++){
    //  unDeal[i].fansNums = (unDeal[i].fansNums / 10000).toFixed(1);
    // }
    _this.setData({
     snatchUserList: unDeal
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
 // 进入网红详情
 selectSnatch:function(e){
  var _this = this;

  wx.navigateTo({
   url: '../whdetail/whdetail?offerId=' + _this.data.offerId+'&pageType=select&whId='+e.currentTarget.dataset.id+'&webnum=3',
  })
 }
})