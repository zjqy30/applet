// pages/mine/identification4/identification4.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  isAgree: [], // 是否同意条款
  serviceArr: [], // 已选择的服务类型
  isShow:false
 },
 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  console.log(app.globalData.stepOneData);
 },
 // 获取个人介绍
 getIntroduce: function(e) {
  app.globalData.stepOneData.personalIntroduce = e.detail.value;
 },
 // 条框跳转
 skipAgreement: function(e) {
  var type = e.currentTarget.dataset.type;
  // console.log(type);
  if (type == '1') {
   // 服务条款
   wx.navigateTo({
    url: '../serviceprotocol/serviceprotocol',
   })
  } else {
   // 隐私政策
   wx.navigateTo({
    url: '../secretpolice/secretpolice',
   })
  }

 },
 // 页面显示
 onShow: function() {
  console.error(this.data.isShow)
  // console.error('******');
  // 从服务类型页面返回
  // console.error(app.globalData.stepOneData);
  this.setData({
   serviceArr: app.globalData.stepOneData.serviceArr
  })

  // 修改下数组格式
  var unArr = app.globalData.stepOneData.serviceArr;
  app.globalData.stepOneData.serviceTemplateIds = '';
  if (unArr){
   for (var i = 0, len = unArr.length; i < len; i++) {
    app.globalData.stepOneData.serviceTemplateIds = unArr[i].id + '-' + unArr[i].price + ',' + app.globalData.stepOneData.serviceTemplateIds;
   }
  }



 },
 // 选择服务类型
 selectService: function() {
  wx.navigateTo({
   url: '../servicetype/servicetype',
  })
 },
 // 我同意
 checkChange: function(e) {
  // console.log(JSON.stringify(e));
  this.setData({
   isAgree: e.detail.value
  })
 },
 // 提交审核
 submitCheck: function(e) {

  var _this = this;
  console.log(JSON.stringify(e) + '获取formID');
  _this.data.formId = e.detail.formId;
  // 非空校验
  if (!app.globalData.stepOneData.personalIntroduce || app.globalData.stepOneData.personalIntroduce == '') {
   _this.popToast('请输入个人介绍！');
   return false;
  } else if (!app.globalData.stepOneData.serviceArr || app.globalData.stepOneData.serviceArr == '') {
   _this.popToast('请选择服务类型！');
   return false;
  } else if (_this.data.isAgree[0] != '1') {
   _this.popToast('请勾选同意！');
   return false;
  }
  console.error(app.globalData.stepOneData);
 // 弹出提示信息
  _this.setData({
   isShow: !_this.data.isShow
  })

 },
 // 提示语
 popToast: function(info) {
  wx.showToast({
   title: info || '',
   icon: 'none'
  })
 },
 // 提交认证的资料
 submitYourInfo: function() {
  app.globalData.stepOneData.serviceArr = '';
  var _this = this;
  app.globalData.stepOneData.serviceTemplateIds = app.globalData.stepOneData.serviceTemplateIds.substr(0, app.globalData.stepOneData.serviceTemplateIds.lastIndexOf(','));
  app.globalData.stepOneData.personalImgs = app.globalData.stepOneData.personalImgs.substr(0, app.globalData.stepOneData.personalImgs.lastIndexOf(','));
  var params = app.globalData.stepOneData;
  console.error(JSON.stringify(params));
  app.fetch('/hone/applet/userBasic/star/applyApproved', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    wx.showToast({
     title: '提交成功',
     duration: 2000
    })
    // 保存一下
    app.globalData.ifApproved = '0';

    // 发送支付的模板消息
    _this.sendModelMsg();


   } else {
    // 数据返回失败
    wx.showToast({
     title: '数据获取失败' || '',
     icon: 'none'
    })
   }
  })
 },
 // 发送模板消息
 sendModelMsg: function() {
  var _this = this;
  var params = {
   formId: _this.data.formId,
   openId: app.globalData.openid,
   userId: app.globalData.userId,
   outTradeNo: ''
  };
  console.error(JSON.stringify(params) + '');
  app.fetch('/hone/applet/wx/formId', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    // 跳转到我的首页（tabbar）
    wx.switchTab({
     url: '../mineindex/mineindex',
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
 // 关闭
 closePop: function () {
  this.setData({
   isShow: !this.data.isShow
  })
 },
})