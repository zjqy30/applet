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
  onLoad: function (options) {
    this.data.inviteCode = options.inviteCode || '';
    console.log(app.globalData.openid);

  },
  // 获取用户信息
  bindGetUserInfo: function (e) {
    var _this = this
    wx.showLoading({
      title: '登录中...',
    })
    // 根据button进行用户授权
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh',
      success: function (res) {
        wx.setStorage({
          key: 'userInfo',
          data: JSON.stringify(res.userInfo),
        })
        console.log(JSON.stringify(res.userInfo) + 'Login获取的用户信息');
        _this.data.userInfo = res.userInfo;
        // 登录一下
        _this.userLogin();

      }
    })
  },
  // 用户登录
  userLogin: function () {
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
        app.globalData.phoneNo = response.data.phoneNo;
        app.globalData.userId = response.data.userId;
        app.globalData.isLogin = true;
        _this.data.isLogin = true;
        if (!response.data.phoneNo) {
          // 未绑定手机号
        } else {
          _this.data.isBindPhone = true;
        }
        // 登录完成后的userid储存
        wx.setStorage({
          key: 'loginInfo',
          data: JSON.stringify(response.data),
        })


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
  
  // 点击完成
  backhome: function () {
    // 跳转到tabbar首页面
    if (app.globalData.isLogin == true){
      wx.switchTab({
        url: '../index/index',
      })
    }else{
      wx.showToast({
        title: '请您先进行登录！',
        icon: 'none'
      })
    }
    
    // 后期如果首页没有tabbar，用navigatorTo

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})