//index.js
//获取应用实例
const app = getApp();


Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    cardCur: 0,
    // 测试banner
    bannerImg: [],
    // 测试公告
    announcement: [],
    // 测试的网红类型
    tabType: [{
      name: '全部'
    }, {
      name: '抖音'
    }, {
      name: '快手'
    }, {
      name: '微视'
    }, {
      name: '全部'
    }],
    whList: [],
    pageNumber: '1',
    hasmore: 'none',
    test: '<button>123</button>',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const scene = decodeURIComponent(options.scene);
    // console.log(scene + '88888');
    var _this = this;
    // 获取用户的基本信息
    wx.getUserInfo({
      success:function(res){
        console.log(JSON.stringify(res));
      }
    })
    // 获取缓存中的openid，如果有就不用走授权流程了
    wx.getStorage({
      key: 'openid',
      success(res) {
        console.log(res)
        var openid = res.data;
        app.globalData.openid = openid; //存全局变量，用于其他页面使用
      },
      fail(res) {
        console.log(res)
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
    // 获取最新资源
    _this.getNewResource();

    // 测试图标显示
    _this.chartTest();

  },
  // 获取当前显示的图片序号
  cardSwiper(e) {
    // console.log(JSON.stringify(e));
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

  // 获取用户的openid
  getOpenid: function(code) {
    var _this = this;
    var params = {
      code: code
    }
    app.fetch('/hone/applet/wx/openId', params).then((response) => {
      // 数据返回成功
      if (response.errorCode == '0') {
        app.globalData.openid = response.data.openid;
        app.globalData.session_key = response.data.session_key;
        wx.setStorage({
          key: 'openid',
          data: response.data.openid
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
      wx - wx.navigateTo({
        url: '',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (bannerType == '3') {
      wx - wx.navigateTo({
        url: '',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      // switchTab跳转到tabbar页面
      wx.switchTab({

        url: '../hall/celebrityhall/celebrityhall'

      });

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
  // 获取用户最新资源
  getNewResource: function() {
    var _this = this;
    var params = {
      "pageNumber": _this.data.pageNumber,
      "pageSize": "10",
      "tag": '', // 标签,多个用逗号隔开
      "sex": '', // 性别
      "orderBy": '', // asc升序
      "platIds": ''
    }
    app.fetch('/hone/applet/userBasic/listByStar', params).then((response) => {
      // 数据返回成功
      if (response.errorCode == '0') {
        var unDeal = response.data.pageData.list;
        // 处理标签，最多只显示4个，
        for (var i = 0, len = unDeal.length; i < len; i++) {
          var tagArr = unDeal[i].tags.split(',');
          if (tagArr[0] == undefined) {
            unDeal[i].tags = '';
          } else if (tagArr[1] == undefined) {
            unDeal[i].tags = tagArr[0];
          } else if (tagArr[2] == undefined) {
            unDeal[i].tags = tagArr[0] + ',' + tagArr[1];
          } else if (tagArr[3] == undefined) {
            unDeal[i].tags = tagArr[0] + ',' + tagArr[1] + ',' + tagArr[2];
          } else {
            unDeal[i].tags = tagArr[0] + ',' + tagArr[1] + ',' + tagArr[2] + ',' + tagArr[3];
          }

          // 处理下无平台的
          if (unDeal[i].platName == null) {
            unDeal[i].platName = '暂无'
          }
        }
        _this.setData({
          whList: _this.data.whList.concat(response.data.pageData.list)
        })
        wx.hideLoading();
      } else {
        // 数据返回失败
        wx.showToast({
          title: '数据获取失败' || '',
          icon: 'none'
        })
        wx.hideLoading();
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户上拉
   */
  onReachBottom: function() {
    console.log('触到底部');
    if (this.data.hasmore != 'block') {
      console.log('触到底部');
      this.loadMore();
    }
  },
  // 上拉加载更多
  loadMore: function() {
    var _this = this;
    wx.showLoading({
      title: '拼命加载中...'
    });
    var nowpage = parseInt(_this.data.pageNumber) + 1;
    _this.setData({
      pageNumber: nowpage
    });
    _this.getNewResource();
  },
  // 图标测试
  chartTest: function() {

  }

})