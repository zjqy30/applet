// pages/mine/correctphone/correctphone.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  isCanClick:''
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  this.getDate();
 },
 // 获取手机号
 correctPhone: function(e) {
  if (!app.string.isPhoneNum(e.detail.value.phoneNo) || e.detail.value.phoneNo == '') {
   wx.showToast({
    title: '请确认输入的手机号码' || '',
    icon: 'none'
   })
   return false;
  } else if (e.detail.value.code == '') {
   wx.showToast({
    title: '短信验证码不能为空' || '',
    icon: 'none'
   })
   return false;
  }

  var _this = this;
  var params = {
   phoneNo: e.detail.value.phoneNo,
   code: e.detail.value.code,
   userId: app.globalData.userId
  }
  app.fetch('/hone/applet/userBasic/bindPhone', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    wx.showToast({
     title: '修改成功！' || '',
     icon: 'none'
    })
    setTimeout(function(){
     wx.navigateBack({
      delta: 1
     })
    },2000)
   
   } else {
    // 数据返回失败
    wx.showToast({
     title: response.msg || '',
     icon: 'none'
    })
   }
  })

 },
 // 获取输入的手机号
 getInputPhone: function(e) {
  this.setData({
   phoneNo: e.detail.value
  })
 },
 // 获取手机验证码
 getPhoneCode: function() {
  var _this = this;
  // 手机号校验
  if (!app.string.isPhoneNum(_this.data.phoneNo) || _this.data.phoneNo == '') {
   wx.showToast({
    title: '请确认输入的手机号码' || '',
    icon: 'none'
   })
   return false;
  }

  _this.setData({
   isCanClick:'disabled'
  })

  var currentDate = _this.getDate();
  console.log(currentDate + ':' + _this.data.phoneNo + ':hongone888');
  var params = {
   phoneNo: _this.data.phoneNo,
   smsSign: app.md5.hexMD5(currentDate + ':' + _this.data.phoneNo + ':hongone888'),
   type: '2'
  }
  app.fetch('/hone/pc/website/message/sendSms', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    wx.showToast({
     title: '短信验证码获取成功，请注意查收' || '',
     icon: 'none'
    })
   } else {
    // 数据返回失败
    wx.showToast({
     title: response.msg || '',
     icon: 'none'
    })
   }
  })
 },
 // 获取时间
 getDate: function() {
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  //获取年份  
  var Y = date.getFullYear();
  //获取月份  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //获取当日日期 
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  console.log("当前时间：" + Y + '-' + M + '-' + D);
  var currentDate = Y + '-' + M + '-' + D;
  return currentDate;

 }
})