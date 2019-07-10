// pages/mine/servicetype/servicetype.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeArr: [{
      text: '可接受纯佣合作',
      value: '1'
    }, {
      text: '图文推广/次',
      value: '2'
    }, {
      text: '微信朋友圈广告/次',
      value: '3'
    }, {
      text: '短视频推广/次',
      value: '4'
    }, {
      text: '抖音橱窗类似方式',
      value: '5'
    }, {
      text: '直播/次',
      value: '6'
    }, {
      text: '纯佣：专场',
      value: '7'
    }],
    priceArr:[{
      text:'元',
      value:'100'
    }, {
        text: '元',
        value: '1000'
      }, {
        text: '元',
        value: '10000'
      }],
    isShow:true, // 控制底部弹出
    priceItem:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 点击多选框
  checkboxChange: function (e) {
    var _this = this;

    console.log(e.detail.value.length);
    console.log(_this.data.isShow+'是否弹出');
    if (e.detail.value.length == 1){
      console.log('选中了！！');
      _this.setData({
        isShow:false
      })
    } else if (e.detail.value.length == 0){
      console.log('取消了！！');
      _this.setData({
        isShow:true
      })
    }
  },
  // 选择服务类型，弹出价格选择
  selectPrice: function (e) {
    var _this = this;
    console.log('选择的价格', e.detail.value);
    _this.setData({
      priceItem: e.detail.value
    })
  },
  // 点击确定返回
  overBack:function(){
    wx.navigateBack({
      delta:'1'
    })
  }
})