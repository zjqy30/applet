// 获取应用实例
const app = getApp();
Page({
  data: {
    whId: '', // 网红id
    personalImgs: [{
      index: '1',
      imgurl: '../../image/1.jpg'
    }, {
      index: '2',
      imgurl: '../../image/2.jpg'
    }, {
      index: '3',
      imgurl: '../../image/3.jpg'
      }, {
        index: '4',
        imgurl: '../../image/4.jpg'
      }],
    perImgLength: 0,
    currentIndex: 1,
    test:''

  },
  onLoad: function(options) {
    this.setData({
      perImgLength: this.data.personalImgs.length
    })
    if (options.whId) {
      this.data.whId = options.whId;
      // 获取网红的基本信息
      this.getWhDetail();
    } else {
      this.data.whId = '9c4488c75cd37dcc0e8add4304529e2b';
      // 获取网红的基本信息
      this.getWhDetail();
    }
  },
  // 获基本信息
  getWhDetail: function() {
    var _this = this;
    var params = {
      userId: _this.data.whId
    }
    app.fetch('/hone/applet/userBasic/userStarInfo', params).then((response) => {
      // 数据返回成功
      if (response.errorCode == '0') {
        _this.setData({
          userExtraInfo: response.data.userExtraInfo,
          userBasicInfo: response.data.userBasicInfo
        })
        // console.log(userBasicInfo);
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
    console.log(JSON.stringify(e));
    this.setData({
      currentIndex: e.detail.current + 1,
      
    })
  }
})