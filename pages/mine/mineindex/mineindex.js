// pages/mine/mineindex/mineindex.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType:'0', // 用户类型：0普通，1网红，2商家
    userInfo:{}, // 用户信息
    userPic:'../../image/wx-testhead.jpg', // 用户头像--微信
    isLogin:false,   // 是否登录
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log(app.globalData.isLogin);
        _this.setData({
          userInfo: JSON.parse(res.data)
        })
      },
      fail:function(error){
        wx.showToast({
          title: '请授权获取用户信息',
        })
      }
    })

    wx.getStorage({
      key: 'loginInfo',
      success: function(res) {
        var loginInfo = JSON.parse(res.data);
        _this.setData({
          // loginInfo.userType
          userType:'2' ,
          isLogin: app.globalData.isLogin,
          phoneNo: loginInfo.phoneNo,
        })
        console.error(_this.data.userType + '用户类型');
      }, fail: function (error) {
        wx.showToast({
          title: '请登录获取用户信息',
        })
      }
    })
  },
  // 联系我们
  callUs: function (e) {
    wx.makePhoneCall({
      phoneNumber: '400-6033-235',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 关于我们
  skipAboutUs:function(){
    wx.navigateTo({
      url: '../abortus/abortus',
    })
  },
  // 扫码测试点击
  scanTest:function(){
    var _this = this;
    wx.scanCode({
      success(res) {
        console.log(JSON.stringify(res));
        // 发送二维码信息
        _this.sendInfo(res);
      }
    })
  },
  sendInfo: function (res){
    var _this = this;
    var params = {
      socketId: res.result,
      openId: app.globalData.openid || 'o562H5ID7DnGiGjpiQOTSIDeyXNw'
    }
    app.fetch('/hone/web/userBasic/scan', params).then((response) => {
      // 数据返回成功
      if (response.errorCode == '0') {
        console.error(JSON.stringify(response))
      } else {
        // 数据返回失败
        wx.showToast({
          title: '数据获取失败' || '',
          icon: 'none'
        })
      }
    })
  },
  // 选择身份
  selectedIdentify:function(){
    var _this = this;
    _this.setData({
      isShow:!_this.data.isShow
    })
  },
  // 关闭身份选择
  closePop:function(){
    var _this = this;
    _this.setData({
      isShow: !_this.data.isShow
    })
  },
  // 跳转到用户的页面
  skipiDentify:function(e){
    var userType = e.currentTarget.dataset.usertype;
    console.log(userType);
    var url ='';
    if (userType == '1'){
      // 网红
      url = '../identification/identification';
    }else{
      // 商家
      // url = '../identification/identification';
    }
    wx.navigateTo({
      url: url,
    })
  },

})