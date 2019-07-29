// 网红详情页
// 获取应用实例
const app = getApp();

Page({
 data: {
  offerId: '', // 需求id
  userExtraInfo: '',
  userBasicInfo: '',
  offerPic: [],
  perImgLength: 0,
  currentIndex: 1,
  isShow: false, // 遮罩
  ifSnatch: '', // 是否已抢单
  pageType: '0', // 详情页入口类型（订单大厅0，网红订单审核中wh1，网红订单进行中wh2，网红订单已完成wh3）页面显示不同
  phoneNo: '', // 电话：商家<=>网红
 },
 onLoad: function(options) {

  this.setData({
   offerId: options.offerId || '290898db56fc4f74ae7cc04c3b347d5e',
   pageType: options.pageType || 'NAP',
   phoneNo: options.phoneNo,
   wxName: options.wxName
  })
  console.log(JSON.stringify(this.data.phoneNo));
  // 获取基本信息
  this.getOrderDetail();
  // 确定该单是否已抢
  this.isSnatch();
  if (this.data.pageType == 'AP') {
   //商家已发布
   // 抢单列表
   this.getSnatchList();
  }

 },
 // 获取抢单列表

 // 获基本信息
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
    var unDeal = response.data;
    // 商品照片
    var imgsArr = [];
    if (unDeal.offerInfo.offerPic) {
     if (unDeal.offerInfo.offerPic.indexOf(',') == '-1') {
      // 未找到,说明只有一张照片
      imgsArr.push(unDeal.offerInfo.offerPic);
     } else {
      // 
      imgsArr = unDeal.offerInfo.offerPic.split(',');
     }
     _this.setData({
      offerPic: imgsArr,
      perImgLength: imgsArr.length,
     })
    }

    if (unDeal.offerInfo.gender == '') {
     unDeal.offerInfo.genderText = '全部';
    } else if (unDeal.offerInfo.gender == '1') {
     unDeal.offerInfo.genderText = '男';
    } else if (unDeal.offerInfo.gender == '2') {
     unDeal.offerInfo.genderText = '女';
    }

   // 审核未通过，需要存已有信息
    if (_this.data.pageType == 'NAP') {
     app.globalData.saveOrderDetail = unDeal.offerInfo;
     app.globalData.saveOrderDetail.offerId = _this.data.offerId;
    }

    _this.setData({
     offerInfo: unDeal.offerInfo
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
 // 预览图片
 perviewPic: function(e) {

  var thisPic = e.currentTarget.dataset.pic;
  // console.log(thisPic);
  var urls = [];
  urls.push(thisPic)
  wx.previewImage({
   urls: urls,
  })
 },
 // 判断是否已抢
 isSnatch: function() {
  var _this = this;
  var params = {
   offerId: _this.data.offerId, // 需求ID
   userId: app.globalData.userId || 'fb8abfba4f62468598b162ac8417c28f',
  }
  app.fetch('/hone/applet/offer/ifSnatch', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    _this.setData({
     ifSnatch: response.data.ifSnatch
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
 // 轮播图切换图片时计数改变
 changePic: function(e) {
  // console.log(JSON.stringify(e));
  this.setData({
   currentIndex: e.detail.current + 1,
  })
 },
 // 我要抢单
 toSnatchOrder: function(e) {
  if (this.data.ifSnatch == '0') {
   this.setData({
    isShow: !this.data.isShow
   })
  } else {
   wx.showToast({
    title: '请勿重复抢单！',
    icon: 'none'
   })
  }

 },
 // 关闭
 closePop: function() {
  this.setData({
   isShow: !this.data.isShow
  })
 },
 // 确认抢单
 sureSnatchOrder: function() {
  var _this = this;
  var params = {
   id: _this.data.offerId, // 需求ID
   userId: app.globalData.userId || 'fb8abfba4f62468598b162ac8417c28f',
  }
  app.fetch('/hone/applet/offer/snatchOffer', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    _this.setData({
     isShow: !_this.data.isShow
    })
    wx.showToast({
     title: '抢单成功',
     icon: 'none'
    })
    _this.isSnatch();
   } else {
    // 数据返回失败
    wx.showToast({
     title: response.msg || '',
     icon: 'none'
    })
   }
  })
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
    var unDeal = response.data.snatchUserList;
    // for (var i = 0, len = unDeal.length; i < len; i++) {
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
 // 去抢单人员列表
 toSnatchList: function() {
  // 暂无抢单，不可跳转
  var _this = this;
  if (_this.data.snatchUserList.length != 0) {
   wx.navigateTo({
    url: '../snatchlist/snatchlist?offerId=' + _this.data.offerId,
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
   })
  }
 },
 // 点击抢单人员列表，进入抢单网红详情
 selectSnatch: function(e) {
  var _this = this;
  wx.navigateTo({
   url: '../whdetail/whdetail?offerId=' + _this.data.offerId + '&pageType=select&whId=' + e.currentTarget.dataset.id+'&webnum=2',
  })
 },
 // 修改订单
 correctOrder: function() {
  wx.navigateTo({
   url: '../creatOrder/creatOrder?pageType='+this.data.pageType,
  })
 }
})