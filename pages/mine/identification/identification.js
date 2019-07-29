// pages/mine/identification/identification.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plat: [],
    storeItem: 0,
    isCheck: '0', // 是否进行了数据验证
    checkData: {
      age: 0
    },
    follower_quantity: '', // 总粉丝数
    inviteCode: '', // 邀请码
    age: [], // 年龄
    receivepraise_num_user: '', // 点赞数
    feed_num_all: '', // 视频总数（作品总数）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    _this.setData({
     inviteCode: app.globalData.inviteCode
    })
    // 获取年龄数组
    for (var i = 0, len = 100; i < len; i++) {
      _this.setData({
        age: _this.data.age.concat(i),
        store:[{
          value:'0',
          text:'无'
        }, {
            value: '1',
            text: '有'
          }]
      })
    }
    _this.getPlat();

  },
  // 选择的平台
  bindPlat: function(e) {
    var _this = this;
    // console.log('选择的平台', e.detail.value);
    _this.setData({
      platItem: e.detail.value,
    })
  },
  // 选择的年龄
  bindAge: function(e) {
    var _this = this;
    // console.log('选择的年龄', e.detail.value);
    _this.setData({
      ageItem: e.detail.value
    })
  },
  // 选择的店铺
  bindStore: function(e) {
    var _this = this;
    // console.log('选择的年龄', e.detail.value);
    _this.setData({
      storeItem: e.detail.value
    })
  },
  // 获取平台的名称
  getPlat: function() {
    var _this = this;

    var params = {
      type: 'platType'
    }
    app.fetch('/hone/applet/dict/listByType', params).then((response) => {
      // 数据返回成功
      if (response.errorCode == 0) {
        var unDeal = response.data.dictList;
        _this.setData({
          plat: unDeal
        })


      } else {
        // 数据返回失败
        wx.showToast({
          title: response.data.custom.text || '',
          icon: 'none'
        })
      }
    })
  },
  // 验证平台的账号数据
  checkPlatUserId: function(platFormId) {
    // console.log(platFormId + '平台的id')
    var _this = this;
    var params = {
      userId: app.globalData.userId, // app.globalData.userId
      platId: _this.data.plat[_this.data.platItem].id, // 20 b站
      platUserId: platFormId
    }
    app.fetch('/hone/applet/suantao/fanPortraits', params).then((response) => {
      // 数据返回成功
      if (response.errorCode == '0') {
        // 1获取数据并填写，2isCheck=1已验证
        var unDeal = response.data;
        if (unDeal.baseInfo) {
          // 验证拿到的数据
          _this.setData({
            checkData: unDeal.baseInfo,
            ageItem: unDeal.baseInfo.age + 1
          })
        }
        wx.showToast({
          title: '验证成功，请完善您的认证资料' || '',
          icon: 'none'
        })
        _this.setData({
          isCheck: '1'
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
  // 下一步
  // skipNext:function(){
  //   wx.navigateTo({
  //     url: '../identification2/identification2',
  //   })
  // },
  // 表单提交
  formSubmit: function(e) {
    var _this = this;
    // console.log(JSON.stringify(e));
    // 非空校验
    // 平台ID暂不加校验
    //   else if(e.detail.value.platFormUserId.indexOf('.') != -1) {
    //   _this.popToast('请输入正确的平台ID！');
    //   return false;
    // }

    if (!e.detail.value.plat || e.detail.value.plat == '') {
      _this.popToast('所在平台不能为空！');
      return false;
    } else if (!e.detail.value.platFormUserId || e.detail.value.platFormUserId == '') {
      _this.popToast('平台ID不能为空！');
      return false;
    } else if ((!e.detail.value.fansNum || e.detail.value.fansNum == '') && _this.data.isCheck == '1') {
      _this.popToast('粉丝数不能为空！');
      return false;
    } else if ((!e.detail.value.age || e.detail.value.age == '') && _this.data.isCheck == '1') {
      _this.popToast('请选择年龄！');
      return false;
    } else if ((!e.detail.value.thumpUpNums || e.detail.value.thumpUpNums == '') && _this.data.isCheck == '1') {
      _this.popToast('点赞数不能为空！');
      return false;
    } else if ((!e.detail.value.workNums || e.detail.value.workNums == '') && _this.data.isCheck == '1') {
      _this.popToast('作品数不能为空！');
      return false;
    } else if ((!e.detail.value.hasShop || e.detail.value.hasShop == '') && _this.data.isCheck == '1') {
      _this.popToast('请选择有无店铺！');
      return false;
    }


    if (_this.data.isCheck == '0') {
      // 数据未校验，开始校验
      _this.checkPlatUserId(e.detail.value.platFormUserId);
    } else {
      // 获取已填数据，进行下一步(每提交进行一次就保存一次)

      app.globalData.stepOneData = {
        openid:app.globalData.openid,
        userId: app.globalData.userId,
        platFormId: _this.data.plat[_this.data.platItem].id,
        platFormUserId: e.detail.value.platFormUserId,
        fanNums: e.detail.value.fansNum,
        inviteCode: e.detail.value.inviteCode,
        age: e.detail.value.age,
        thumpUpNums: e.detail.value.thumpUpNums,
        workNums: e.detail.value.workNums,
        hasShop: _this.data.store[_this.data.storeItem].value,
      };
      // 保存后进行下一步
      wx.navigateTo({
        url: '../identification2/identification2',
      })

    }

  },
  // 提示语
  popToast: function(info) {
    wx.showToast({
      title: info || '',
      icon: 'none'
    })
  },
  // 粉丝数，点赞数，作品数
  noPointLimit: function(e) {
    // console.log(JSON.stringify(e) + '失去焦点');
    if (e.detail.value.indexOf('.') != -1) {
        wx.showToast({
          title: '请输入整数',
          icon: 'none'
        })
    }
  }
})