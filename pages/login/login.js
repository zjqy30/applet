// pages/login/login.js
//获取应用实例
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  userInfo: '',
  inviteCode: '',
  isLogin: false,
  isBindPhone: false
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  this.data.inviteCode = app.globalData.inviteCode || '';
  console.log(app.globalData.openid);
  console.log(app.globalData.session_key);

 },
 // 获取用户信息
 bindGetUserInfo: function(e) {
  var _this = this
  // 根据button进行用户授权
  wx.getUserInfo({
   withCredentials: true,
   lang: 'zh_CN',
   success: function(res) {

    _this.getLocation(res);
    

   }
  })
 },
 // 获取用户定位数据
 getLocation: function (res){
  var _this = this
  wx.request({
   url: 'https://apis.map.qq.com/ws/location/v1/ip?key=BGLBZ-JWIWV-LM5PQ-U427R-DLLZQ-HUFWH',
   method: 'GET',
   dataType: 'json',
   responseType: 'text',
   success: function (e) {
    console.log(JSON.stringify(e));
    var userloc = e.data.result.ad_info.province + e.data.result.ad_info.city + e.data.result.ad_info.district
    var userip = e.data.result.ip
    console.log('地址：' + userloc + '当前ip:' + userip);
    res.userInfo.country = userloc;
    wx.setStorage({
     key: 'userInfo',
     data: JSON.stringify(res.userInfo),
    })
    console.log(JSON.stringify(res.userInfo) + 'Login获取的用户信息');
    _this.data.userInfo = res.userInfo;
    // 登录一下
    _this.userLogin();
   },
   fail: function (res) {

   },
   complete: function (res) { },
  })
 },
 // 用户登录
 userLogin: function() {
  wx.showLoading({
   title: '登录中...',
  })
  var _this = this;
  var params = {
   openid: app.globalData.openid,
   wxname: _this.data.userInfo.nickName,
   gender: _this.data.userInfo.gender,
   avatarUrl: _this.data.userInfo.avatarUrl,
   country: _this.data.userInfo.country,
   inviteCode: _this.data.inviteCode
  }
  app.fetch('/hone/applet/userBasic/login', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {

    app.globalData.userType = response.data.userType;
    app.globalData.ifApproved = response.data.ifApproved;
    app.globalData.phoneNo = response.data.phoneNo;
    app.globalData.userId = response.data.userId;
    app.globalData.serviceList = response.data.serviceList;

    app.globalData.isLogin = true;
    // _this.data.isLogin = true;
    _this.setData({
     isLogin: true
    })

    if (!response.data.phoneNo) {
     // 未绑定手机号
    } else {
     _this.data.isBindPhone = true;
    }

    _this.data.loginInfo = response.data;


    wx.hideLoading();
    // 登录后获取用户的类型
    if (response.data.userType == '0') {
     // 普通用户，可去个人中心认证网红或商家

    } else if (response.data.userType == '1') {

    } else if (response.data.userType == '2') {

    }
   } else {
    // 数据返回失败
    wx.showToast({
     title: '数据获取失败' || '',
     icon: 'none'
    })
   }
  })
 },
 // 点击绑定手机号
 // 检测用户是否同意授权手机号
 bindGetPhoneNumber: function(e) {
  var _this = this
  if (e.detail.encryptedData) {
   console.log(JSON.stringify(e))
   _this.getphonenmunber(e.detail.encryptedData, e.detail.iv)
  }
 },
 // 解密手机号并绑定
 getphonenmunber: function(encryptedData, iv) {
  var _this = this;
  var params = {
   encrypData: encryptedData,
   ivData: iv,
   sessionKey: app.globalData.session_key,
   openid: app.globalData.openid
  }
  app.fetch('/hone/applet/wx/decryptData', params).then((response) => {
   // 数据返回成功
   if (response.data.phoneNumber) {
    app.globalData.phoneNumber = response.data.phoneNumber;
    _this.data.loginInfo.phoneNumber = response.data.phoneNumber;
    // 登录完成后的userid储存
    wx.setStorage({
     key: 'loginInfo',
     data: JSON.stringify(_this.data.loginInfo),
    })
    // 绑定手机号
    app.globalData.isBindPhone = true;
    _this.setData({
     isBindPhone: true
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
 // 点击完成
 backhome: function() {
  // 跳转到tabbar首页面
  if (app.globalData.isLogin && app.globalData.isBindPhone) {

   // 无服务类型的，已通过审核的网红
   if (app.globalData.serviceList == '0' && app.globalData.userType == '1' && app.globalData.ifApproved == '1') {
    wx.showModal({
     title: '温馨提示',
     content: '经系统检测，您尚未定制自己的服务类型。为了更好的用户体验，请去完善您的资料吧',
     showCancel: false,
     confirmText: '完善资料',
     success(res) {
      if (res.confirm) {
       console.log('用户点击确定')
       wx.redirectTo({
        url: '../mine/personfile/personfile',
       })
      }
     }
    })
   } else {
    wx.switchTab({
     url: '../index/index',
    })
   }






  } else {
   wx.showToast({
    title: '请您先进行登录或绑定手机号！',
    icon: 'none'
   })
  }

  // 后期如果首页没有tabbar，用navigatorTo

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