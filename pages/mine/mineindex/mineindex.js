// pages/mine/mineindex/mineindex.js
//获取应用实例
const app = getApp();

Page({

 /**
  * 页面的初始数据
  */
 data: {
  userType: '0', // 用户类型：0普通，1网红，2商家
  ifApproved: '',
  userInfo: {}, // 用户信息
  userPic: '../../image/wx-testhead.jpg', // 用户头像--微信
  isLogin: false, // 是否登录
  isShow: false,
  isShowApproved: false, // 是否审核
  selectType: '0'
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  var _this = this;
  wx.getStorage({
   key: 'userInfo',
   success: function(res) {
    console.log(app.globalData.isLogin);
    _this.setData({
     userInfo: JSON.parse(res.data)
    })
   },
   fail: function(error) {
    wx.showToast({
     title: '请授权获取用户信息',
    })
   }
  })

  _this.setData({
   userType: app.globalData.userType,
   isLogin: app.globalData.isLogin,
   ifApproved: app.globalData.ifApproved //0审核，-1普通，1已审核
  })

  wx.getStorage({
   key: 'loginInfo',
   success: function(res) {
    var loginInfo = JSON.parse(res.data);
    // 手机号加密
    var enPhone = loginInfo.phoneNumber.substring(0, 3) + "****" + loginInfo.phoneNumber.substring(8, 11);
    _this.setData({
     // userType: loginInfo.userType,
     // isLogin: app.globalData.isLogin,
     phoneNo: enPhone,
     // ifApproved: loginInfo.ifApproved //0审核，-1普通，1已审核
    })
    console.error(_this.data.userType + '用户类型');
   },
   fail: function(error) {
    wx.showToast({
     title: '请登录获取用户信息',
    })
   }
  })
 },
 // 联系我们
 callUs: function(e) {
  wx.makePhoneCall({
   phoneNumber: '400-6033-235',
   success: function(res) {},
   fail: function(res) {},
   complete: function(res) {},
  })
 },
 // 关于我们
 skipAboutUs: function() {
  wx.navigateTo({
   url: '../abortus/abortus',
  })
 },
 // 扫码测试点击
 scanTest: function() {
  var _this = this;
  wx.scanCode({
   success(res) {
    console.log(JSON.stringify(res));
    // 发送二维码信息
    _this.sendInfo(res);
   }
  })
 },
 sendInfo: function(res) {
  var _this = this;
  var params = {
   socketId: res.result,
   openId: app.globalData.openid || ''
  }
  app.fetch('/hone/web/userBasic/scan', params).then((response) => {
   // 数据返回成功（报错不显示）
   console.error(JSON.stringify(response));
   if (response.errorCode == '1002') {
    console.error(JSON.stringify(response))
   } else {
    // 数据返回失败
    // wx.showToast({
    //  title: '数据获取失败' || '',
    //  icon: 'none'
    // })
   }
  })
 },
 // 选择身份
 selectedIdentify: function() {
  var _this = this;
  _this.setData({
   isShow: !_this.data.isShow
  })
 },
 // 关闭身份选择
 closePop: function() {
  var _this = this;
  _this.setData({
   isShow: !_this.data.isShow
  })
 },
 // 跳转到用户的页面
 skipiDentify: function(e) {
  var userType = e.currentTarget.dataset.usertype;
  console.log(userType);
  this.setData({
   selectType: userType
  })

  var url = '';
  if (userType == '1') {
   // 网红
   url = '../identification/identification';
  } else {
   // 商家
   url = '../identificationoffer/identificationoffer';
  }
  wx.navigateTo({
   url: url,
  })

  this.setData({
   isShow: !this.data.isShow
  })
 },
 // 扫一扫
 scanOneScan: function() {
  var _this = this;
  wx.scanCode({
   success(res) {
    console.log(JSON.stringify(res));
    // 发送二维码信息
    _this.sendInfo(res);
   }
  })
 },
 testFormId: function(e) {
  console.error(JSON.stringify(e));
 },
 // 网红的主功能点击事件
 skipFunctionModel: function(e) {
  var _this = this;
  // console.log(JSON.stringify(e));
  var type = e.detail.target.dataset.whtype;

  _this.data.formId = e.detail.formId;
  // 发送支付的模板消息
  _this.sendModelMsg(type);
 },
 // 发送模板消息
 sendModelMsg: function(type) {
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
    // 其他跳转放到sendModelMsg()
    var url = '';

    switch (type) {
     case '1':
      url = '../personfile/personfile'; // 个人资料（网红）
      break;
     case '2':
      if (_this.data.userType == '1') {
       // 网红
       url = '../ordermanage/ordermanage'; // 订单管理（网红）
      } else if (_this.data.userType == '2') {
       // 商家
       url = '../ordermanagedoffer/ordermanageoffer'; // 订单管理（商家）
      }

      break;
     case '3':
      url = '../mywallet/mywallet'; // 我的钱包（网红）
      break;
     case '4':
      url = '../mycollect/mycollect'; // 我的收藏（网红，商家）
      break;
     case '7':
      url = '../personmoney/personmoney'; // 我的账单（商家）
      break;
     case '5': // 扫一扫（网红，商家）
      url = '';
      break;
    }
    if (url && url != '') {
     wx.navigateTo({
      url: url,
     })
    } else {
     // 扫一扫
     wx.scanCode({
      success(res) {
       console.log(JSON.stringify(res) + '扫一扫参数');
       // 发送二维码信息
       _this.sendInfo(res);
      }
     })
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
 // 修改手机号
 correctPhone: function() {
  wx.navigateTo({
   url: '../correctphone/correctphone',
  })
 },
 // 显示
 onShow: function() {
  var _this = this;
  _this.setData({
   ifApproved: app.globalData.ifApproved
  })

  if (_this.data.ifApproved == '0') {
   _this.setData({
    isShowApproved: true

   })
  } else {
   _this.setData({
    isShowApproved: false

   })
  }
 },
 // 使用教程
 introduce: function() {
  if(app.globalData.userType == '1'){
   // 网红
   wx.navigateTo({
    url: '../useways/useways',
   })
  } else if (app.globalData.userType == '2'){
   // 商家
   wx.navigateTo({
    url: '../useways1/useways1',
   })
  }
  
 },

})