//index.js
//获取应用实例
const app = getApp();

Page({
 data: {
  userId: '',
  userInfo: {},
  hasUserInfo: false,
  cardCur: 0,
  // 测试banner
  bannerImg: [],
  // 测试公告
  announcement: [],
  // 测试的网红类型
  tabType: [],
  whList: [],
  pageNumber: '1',
  hasmore: 'none',
  test: '<button>123</button>',
  inviteCode: '',
  isShow: false,
  arrPerson: [],
  initPerson: 10000,
  isShow: false
 },
 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  var _this = this;
  // 如果有邀请码
  if (options.id) {
   app.globalData.inviteCode = decodeURIComponent(options.id);
  }
  _this.getWhNum();
  // 设置导航栏高度
  wx.getSystemInfo({
   success: function(res) {
    console.log(JSON.stringify(res));
    var titleBarHeight = 0
    if (res.model.indexOf('iPhone') !== -1) {
     titleBarHeight = 44;
    } else {
     titleBarHeight = 48;
    }
    _this.setData({
     statusBarHeight: res.statusBarHeight,
     titleBarHeight: titleBarHeight,
     mainTop: parseInt(res.statusBarHeight) + parseInt(titleBarHeight)
    })
   },
  })
  // const scene = decodeURIComponent(options.scene);
  // console.log(scene + '88888');

  console.log(JSON.stringify(_this.data.userInfo) + '这是用户信息');
  // 新老用户进入先获取code并获取opneid
  // 获取缓存中的openid，如果有就不用走授权流程了
  wx.getStorage({
   key: 'openid',
   success(res) {
    var openid = res.data;
    app.globalData.openid = openid; //存全局变量，用于其他页面使用
    // 获取session_key
    wx.getStorage({
     key: 'session_Key',
     success: function(res) {
      var session_key = res.data;
      app.globalData.session_key = session_key; //存全局变量，用于其他页面使用
     },
    })

    // 从缓存中获取用户的userid,如果没有重新登录
    wx.getStorage({
     key: 'loginInfo',
     success: function(res) {
      // 已登录过了
      var loginInfo = JSON.parse(res.data);
      // 本页要用
      _this.data.userId = loginInfo.userId;

      // 存全局，其他页面使用
      app.globalData.userId = loginInfo.userId;
      app.globalData.userType = loginInfo.userType;
      app.globalData.ifApproved = loginInfo.ifApproved;
      app.globalData.serviceList = loginInfo.serviceList;
      app.globalData.isLogin = true;

      // 重新获取获取下用户信息-因为ifApproved是变动的
      _this.getUserInfoJuge();
     },
     fail: function(error) {
      // 未登录
      // _this.setData({
      //  isShow:true
      // })
      wx.redirectTo({
       url: '/pages/login/login',
      })
     }
    })
   },
   fail(res) {
    // 获取登录凭证
    wx.login({
     success: function(res) {
      var code = res.code;
      _this.getOpenid(code);
     }
    })
   }
  });

  // 获取顶部的banner
  _this.getBanner();
  // 获取公告
  _this.getAnnouncement();
  // 获取实时信息
  _this.getRencentNews();

 },
 onShow: function() {
  // 获取实时信息
  this.getRencentNews();
  this.getUserInfoJuge();
  console.log('显示了');
 },
 getUserInfoJuge: function() {
  var _this = this;
  wx.getStorage({
   key: 'userInfo',
   success: function(res) {

    console.log('刷新啦');
    res = JSON.parse(res.data);
    _this.data.tempInfo = {
     openid: app.globalData.openid,
     wxname: res.nickName,
     gender: res.gender,
     avatarUrl: res.avatarUrl,
     country: res.country,
     inviteCode: '',
    }
    _this.updataUserInfo();
   },
  })
 },
 // 更新当前用户的信息
 updataUserInfo: function() {
  var _this = this;
  var params = _this.data.tempInfo
  app.fetch('/hone/applet/userBasic/login', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    app.globalData.ifApproved = response.data.ifApproved;
    app.globalData.userType = response.data.userType;
    app.globalData.serviceList = response.data.serviceList;
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
    }

   } else {

   }
  })
 },
 // 获取当前显示的图片序号
 cardSwiper(e) {
  this.setData({
   cardCur: e.detail.current
  })
 },
 // 切换的方法
 tabSelect(e) {
  var that = this
  let idx = e.currentTarget.dataset.id
  let tabName = this.data.tabs[idx].title
  let schTerrace = idx == 0 ? '' : this.data.tabs[idx].title
  that.setData({
   TabCur: idx,
   scrollLeft: (idx - 1) * 60,
   tabName,
   schTerrace,
   whUsers: [],
   fids: []
  })
  this.getWhUsers()
 },
 checkWhtag: function(e) {
  this.setData({
   whtag: e.detail.items || []
  })
 },
 resetWhtag: function(e) {
  var that = this
  this.setData({
   whtag: [],
   showSxMenu: !that.data.showSxMenu
  })
  this.getWhUsers()
 },
 // 检测页面滚动
 onPageScroll: function(e) {
  if (e.scrollTop > 300) {
   this.setData({
    showtabs: true,
   })
  } else {
   this.setData({
    showtabs: false,
   })
  }
 },
 // 禁止滑动
 stopTouchMove: function() {
  return false;
 },
 // 获取用户的openid
 getOpenid: function(code) {
  var _this = this;
  var params = {
   code: code
  }
  app.fetch('/hone/applet/wx/openId', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    // 通过接口获取的存全局，其他页面使用
    app.globalData.openid = response.data.openid;
    app.globalData.session_key = response.data.session_key;

    wx.setStorage({
     key: 'openid',
     data: response.data.openid
    })
    wx.setStorage({
     key: 'session_Key',
     data: response.data.session_key
    })

    // 从缓存中获取用户的userid,如果没有重新登录
    wx.getStorage({
     key: 'loginInfo',
     success: function(res) {
      // 已登录过了
      var loginInfo = JSON.parse(res.data);
      _this.data.userId = loginInfo.userId;
      app.globalData.isLogin = true;

     },
     fail: function(error) {
      // 未登录
      wx.redirectTo({
       url: '/pages/login/login',
      })
     }
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
 // 获取banner
 getBanner: function() {
  var _this = this;
  var params = {
   pages: '1'
  }
  app.fetch('/hone/applet/banner/list', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    _this.setData({
     bannerImg: response.data.bannersList
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
 // banner点击处理
 clickBanner: function(e) {
  var bannerType = e.currentTarget.dataset.bannerType;
  // 1图片只做轮播图展示，2富文本需要新页面展示，3h5页面的链接跳转
  if (bannerType == '2') {

  } else if (bannerType == '3') {

  } else {
   // switchTab跳转到tabbar页面
   // wx.switchTab({
   //  url: '../hall/celebrityhall/celebrityhall'
   // });

  }
 },
 // 获取公告
 getAnnouncement: function() {
  var _this = this;
  var params = {
   ifPublic: '1'
  }
  app.fetch('/hone/applet/systemNotice/list', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    _this.setData({
     announcement: response.data.systemNoticeList
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
 // 获取实时消息
 getRencentNews: function() {
  var _this = this;
  var params = {}
  app.fetch('/hone/applet/frontMsg/list', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    if (response.data.messageList.length != 0) {
     _this.setData({
      newslist: response.data.messageList
     })
    }

    if (_this.data.newslist.length == 1) {
     _this.setData({
      swiperHeight: '20',
      items:1
     })
    } else if (_this.data.newslist.length == 2) {
     _this.setData({
      swiperHeight: '40',
      items: 2

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
 // 底部四个模块的跳转
 skipDetailPage: function(e) {
  var _this = this;
  var type = e.currentTarget.dataset.type;
  console.log(type + '类型');
  var url = '';
  switch (type) {
   case '2':
    wx.switchTab({
     url: '../hall/celebrityhall/celebrityhall',
    })
    break;
   case '1':
    wx.switchTab({
     url: '../hall/businesshall/businesshall',
    })
    break;
   case '4':
    // _this.setData({
    //  isShow: !_this.data.isShow,
    // })
    wx.navigateTo({
     url: '../mine/noticeus/noticeus',
    })
    break;
   case '3':
    wx.navigateTo({
     url: '../mine/companypic/companypic',
    })
    break;
  }
 },
 // 关掉二维码
 closeCode: function() {
  var _this = this;
  _this.setData({
   isShow: !_this.data.isShow,
  })
 },
 // 长按识别或者保存
 saveCodePic: function() {
  console.log('111111112345')
 },
 // 入驻人数
 getWhNum: function() {
  var _this = this;
  var params = {};
  app.fetch('/hone/applet/common/fansNums', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    // 处理数字,存进数组
    var allPerson = response.data.fansNums;
    var arrPerson = [];
    for (var i = 0, len = allPerson.length; i < len; i++) {
     arrPerson.push(allPerson.substr(i, 1));
    }
    this.setData({
     arrPerson: arrPerson
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
 // 获取随机数
 random: function(lower, upper) {
  return Math.floor(Math.random() * (upper - lower)) + lower;
 }
})