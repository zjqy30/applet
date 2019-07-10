// pages/mine/identification/identification.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plat: [{
      id: '1',
      name: '抖音'
    }, {
      id: '2',
      name: 'b站'
    }, {
      id: '3',
      name: '火山'
    }],
    platItem: 0,
    age: [],
    ageItem: 0,
    store: [{
      id: '0',
      name: '无'
    }, {
      id: '1',
      name: '有'
    }],
    storeItem: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    // 获取年龄数组
    for (var i = 0, len = 100; i < len; i++) {
      _this.setData({
        age: _this.data.age.concat(i + 1)
      })
    }

  },
  // 选择的平台
  bindPlat: function(e) {
    var _this = this;
    console.log('选择的平台', e.detail.value);
    _this.setData({
      platItem: e.detail.value
    })
  },
  // 选择的年龄
  bindAge: function(e) {
    var _this = this;
    console.log('选择的年龄', e.detail.value);
    _this.setData({
      ageItem: e.detail.value
    })
  },
  // 选择的店铺
  bindStore: function(e) {
    var _this = this;
    console.log('选择的年龄', e.detail.value);
    _this.setData({
      storeItem: e.detail.value
    })
  },
  // 下一步
  skipNext:function(){
    wx.navigateTo({
      url: '../identification2/identification2',
    })
  }
})