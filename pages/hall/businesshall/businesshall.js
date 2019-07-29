// 订单大厅
// 获取应用实例
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  userType: '',
  isOpen: 1,
  stationType: '1',
  isShow: false,
  // isShow2:false
  isCheck: false,
  orderList: [],
  hasData: false,
  pageNumber: '1',
  stationArray: [],
  labelArray: [],
  selectedNum: 0, // 已选平台的计数
  selectedNum1: 0, // 更多的基数，暂时不用
  selectedStation: '', // 已选的平台
  selectedLabel: '', // 已选的标签
  selectFans: '', // 已选的粉丝要求
  selectOrder: '', // 无须desc/asc,已选的价格排序
  hasmore: 'none',
 },
 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  console.log(+'这是用户的type');
  this.setData({
   userType: app.globalData.userType,
   ifApproved: app.globalData.ifApproved

  })
  // 获取网红列表
  this.getOrder();
  // 获取平台
  this.getWHdic('platType');
  // 获取标签--更多
  this.getWHdic('label');
 },
 // 点击tab
 clickSelect: function(e) {
  var type = e.currentTarget.dataset.type;
  this.setData({
   stationType: type,
   isShow: !this.data.isShow
  })
  if (type == '3') {
   // 价格排序点击
   if (this.data.selectOrder == 'desc') {
    this.setData({
     selectOrder: 'asc'
    })
   } else {
    this.setData({
     selectOrder: 'desc'
    })
   }
   this.setData({
    orderList: [],
    // selectedLabel: '',
    // selectedStation: '',
    // selectFans: '',
    pageNumber: '1',
   })
   this.getOrder();
  } else if (type == '2') {
   // 粉丝要求
   // 价格排序点击
   if (this.data.selectFans == 'desc') {
    this.setData({
     selectFans: 'asc'
    })
   } else {
    this.setData({
     selectFans: 'desc'
    })
   }
   this.setData({
    orderList: [],
    // selectedLabel: '',
    // selectedStation: '',
    // selectOrder: '',
    pageNumber: '1',
   })
   this.getOrder();
  }
 },
 // 点击平台
 clickStation: function(e) {
  var _this = this;
  var id = e.currentTarget.dataset.id;
  var status = e.currentTarget.dataset.status;
  var index = e.currentTarget.dataset.index;
  // 0未选，1已选
  console.log('选中第' + index + '项,原状态为：' + status);
  // 去除全部
  if (index != '0') {
   if (_this.data.selectedNum == _this.data.stationArray.length - 1) {
    _this.data.stationArray[index].status = '0';
   } else {
    if (_this.data.stationArray[index].status == '0') {
     _this.data.stationArray[index].status = '1';
     _this.data.selectedNum++;
    } else if (_this.data.stationArray[index].status == '1') {
     _this.data.stationArray[index].status = '0';
     _this.data.selectedNum--;
    }
   }

  } else {
   // 全部的情况
   if (_this.data.stationArray[index].status == '0') {
    // 全部被选中
    _this.data.stationArray[index].status = '1';
    _this.data.selectedNum = _this.data.stationArray.length - 1;
    for (var i in _this.data.stationArray) {
     if (i != '0') {
      _this.data.stationArray[i].status = '0';
     }
    }

   } else if (_this.data.stationArray[index].status == '1') {
    _this.data.stationArray[index].status = '0';
    _this.data.selectedNum = 0;
    for (var i in _this.data.stationArray) {
     if (i != '0') {
      _this.data.stationArray[i].status = '0';
     }
    }
   }
  }
  console.log(JSON.stringify(_this.data.stationArray));
  _this.setData({
   stationArray: _this.data.stationArray,
   selectedNum: _this.data.selectedNum
  })

 },
 // 点击标签
 clickLabel: function(e) {
  var _this = this;
  var id = e.currentTarget.dataset.id;
  var status = e.currentTarget.dataset.status;
  var index = e.currentTarget.dataset.index;
  // 0未选，1已选
  console.log('选中第' + index + '项,原状态为：' + status);
  // 去除全部
  if (index != '0') {
   if (_this.data.selectedNum1 == _this.data.labelArray.length - 1) {
    _this.data.labelArray[index].status = '0';
   } else {
    if (_this.data.labelArray[index].status == '0') {
     _this.data.labelArray[index].status = '1';
     _this.data.selectedNum1++;
    } else if (_this.data.labelArray[index].status == '1') {
     _this.data.labelArray[index].status = '0';
     _this.data.selectedNum1--;
    }
   }
  } else {
   // 全部的情况
   if (_this.data.labelArray[index].status == '0') {
    // 全部被选中
    _this.data.labelArray[index].status = '1';
    _this.data.selectedNum1 = _this.data.labelArray.length - 1;
    for (var i in _this.data.labelArray) {
     if (i != '0') {
      _this.data.labelArray[i].status = '0';
     }
    }
   } else if (_this.data.labelArray[index].status == '1') {
    _this.data.labelArray[index].status = '0';
    _this.data.selectedNum1 = 0;
    for (var i in _this.data.labelArray) {
     if (i != '0') {
      _this.data.labelArray[i].status = '0';
     }
    }
   }
  }
  _this.setData({
   labelArray: _this.data.labelArray,
  })
 },
 // 重置标签
 clearAll: function(e) {
  var cleartype = e.currentTarget.dataset.cleartype;
  console.log(cleartype + '重置的类型');
  if (cleartype == '0') {
   for (var i = 0, len = this.data.stationArray.length; i < len; i++) {
    this.data.stationArray[i].status = '0';
   }
   this.setData({
    stationArray: this.data.stationArray,
    selectedNum: 0
   })
  } else {
   for (var i = 0, len = this.data.labelArray.length; i < len; i++) {
    this.data.labelArray[i].status = '0';
   }
   this.setData({
    labelArray: this.data.labelArray,
    selectedNum1: 0
   })
  }
 },
 // 确定平台筛选
 sureStation: function(e) {
  this.setData({
   isShow: false
  })
  var selectedStation = '';
  // 全部的情况
  if (this.data.stationArray[0].status == '1') {
   this.data.selectedStation = '';
  } else {
   for (var i = 0, len = this.data.stationArray.length; i < len; i++) {
    if (this.data.stationArray[i].status == '1') {
     selectedStation += this.data.stationArray[i].id + ',';
    }
   }
   this.data.selectedStation = selectedStation;
  }
  this.setData({
   orderList: [],
   // selectedLabel: '',
   // selectSex: '',
   // selectOrder: '',
   pageNumber: '1',
  })
  this.getOrder();
 },
 // 确定标签筛选
 sureLabel: function(e) {
  this.setData({
   isShow: false
  })
  var selectedLabel = '';
  for (var i = 0, len = this.data.labelArray.length; i < len; i++) {
   if (this.data.labelArray[i].status == '1') {
    selectedLabel += this.data.labelArray[i].id + ',';
   }
  }
  this.data.selectedLabel = selectedLabel;
  this.setData({
   orderList: [],
   // selectedStation: '',
   // selectSex: '',
   // selectOrder: '',
   pageNumber: '1',
  })
  this.getOrder();
 },
 // 性别选择
 radioChange: function(e) {
  this.setData({
   isShow: false
  })
  // console.log(JSON.stringify(e) + '****这是单选按钮');
  // 取选中的标签
  this.data.selectSex = e.detail.value;
  this.setData({
   orderList: [],
   // selectedLabel: '',
   // selectedStation: '',
   // selectOrder: '',
   pageNumber: '1',
  })
  this.getOrder();
 },
 // 粉丝排序
 fansOrder: function() {

 },
 // 获取订单列表
 getOrder: function() {
  var _this = this;
  var params = {
   "pageNumber": _this.data.pageNumber,
   "pageSize": "10",
   "tag": _this.data.selectedLabel, // 标签,多个用逗号隔开
   "fansNumsOrderBy": _this.data.selectFans, // 粉丝的排序
   "priceOrderBy": _this.data.selectOrder, // asc升序
   "platIds": _this.data.selectedStation
  }
  app.fetch('/hone/applet/offer/list', params).then((response) => {
   // 数据返回成功0
   // console.log(response);
   if (response.errorCode == '0') {
    var unDeal = response.data.pageData.list;
    if (unDeal.length != 0) {
     for (var i = 0, len = unDeal.length; i < len; i++) {
      if (unDeal[i].tag) {
       var tagArr = unDeal[i].tag.split(',');
       unDeal[i].tagArr = tagArr;
      } else {
       unDeal[i].tagArr = ['全部'];
      }

      if (unDeal[i].offerPic.indexOf(',') != '-1') {
       unDeal[i].offerPic = unDeal[i].offerPic.substr(0, unDeal[i].offerPic.indexOf(','));
      }

     }

     this.setData({
      orderList: _this.data.orderList.concat(response.data.pageData.list)
     })
    } else {
     this.setData({
      hasData: true
     })
    }
    wx.hideLoading();
   } else {
    // 数据返回失败
    wx.showToast({
     title: '数据返回失败' || '',
     icon: 'none'
    })
    wx.hideLoading();
   }
  })
 },
 // 获取网红平台/标签
 getWHdic: function(type) {
  var _this = this;

  var params = {
   type: type
  }
  app.fetch('/hone/applet/dict/listByType', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == 0) {
    var unDeal = response.data.dictList;
    unDeal.unshift({
     "id": "",
     "createDate": "",
     "updateDate": "",
     "enableFlag": "",
     "dictType": type,
     "dictValue": "全部",
     "dictDesc": "00",
     "dictSort": "",
     "pid": "",
     "dictPic": null
    })
    for (var i = 0, len = unDeal.length; i < len; i++) {
     unDeal[i].status = '0';
    }
    if (type == 'platType') {
     _this.setData({
      stationArray: unDeal
     })
    } else if (type == 'label') {
     _this.setData({
      labelArray: unDeal
     })
    }
   } else {
    // 数据返回失败
    wx.showToast({
     title: response.data.custom.text || '',
     icon: 'none'
    })
   }
  })
 },
 // 获取网红标签
 getWHLabel: function() {
  var _this = this;

  var params = {
   pages: '1'
  }
  app.fetch('/hone/applet/dict/listByType', params).then((response) => {
   // 数据返回成功
   if (response.data.custom && response.data.status.code == '200') {
    if (response.data.custom.code != '0') {

    } else {
     wx.showToast({
      title: response.data.custom.text || '',
      icon: 'none'
     })
    }

   } else {
    // 数据返回失败
    wx.showToast({
     title: response.data.custom.text || '',
     icon: 'none'
    })
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
  _this.getOrder();
 },
 /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
 onPullDownRefresh: function() {
  this.refresh();
 },
 /*
  *刷新
  */
 refresh: function() {
  wx.showLoading({
   title: '拼命刷新中...'
  });
  this.setData({
   orderList: [],
   // selectedLabel: '',
   // selectedStation: '',
   // selectOrder: '',
   // selectFans: '',
   pageNumber: '1',
  })
  this.getOrder();
 },
 // 发布需求订单
 clickPublic: function() {
  wx.navigateTo({
   url: '../creatOrder/creatOrder',
  })
 },
 // 查看订单详情
 skipOrderDetail: function(e) {
  var offerId = e.currentTarget.dataset.offerid;
  wx.navigateTo({
   url: '../orderdetail/orderdetail?offerId=' + offerId + '&pageType=0',
  })
 },
 toSkipPC: function() {
  wx.showToast({
   title: '请前往PC端红腕进行查看！',
   icon: 'none'
  })
 }
})