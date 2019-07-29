// pages/mine/mycollect/mycollect.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  whList: [], // 收藏的网红列表
  pageNumber: '1',
  delBtnWidth: 90,
  list: [],
  startX: "",
  hasData: true
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  this.getCollectList('1');
 },
 // 获取收藏的网红列表
 getCollectList: function(isFresh) {
  var _this = this;
  var params = {
   "pageNumber": _this.data.pageNumber,
   "pageSize": "10",
   "userId": app.globalData.userId || '21ffb3b86867461c9384f0bd8bdf454a'
  }
  app.fetch('/hone/applet/collect/list', params).then((response) => {
   // 数据返回成功0
   // console.log(response);
   if (response.errorCode == '0') {
    var unDeal = response.data.pageData.list;
    if (unDeal.length != 0) {
     for (var i = 0, len = unDeal.length; i < len; i++) {
      if (unDeal[i].tag){
       var tagArr = unDeal[i].tag.split(',');
       unDeal[i].tagArr = tagArr;
      }else{
       unDeal[i].tagArr = ['暂无'];

      }
     
     }

     if (isFresh == '1') {
      // 刷新
      this.setData({
       whList: unDeal
      })
     } else {
      // 继续加载
      this.setData({
       whList: _this.data.whList.concat(unDeal)
      })
     }

    } else {
     // 继续加载
     this.setData({
      whList: _this.data.whList.concat(unDeal)
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
 // 网红详情页面
 skipDetail: function(e) {
  console.log(JSON.stringify(e));
  wx.navigateTo({
   url: '../../hall/whdetail/whdetail?whId=' + e.currentTarget.dataset.userid
  })
 },

 touchS: function(e) {
  if (e.touches.length == 1) {
   this.setData({
    //设置触摸起始点水平方向位置
    startX: e.touches[0].clientX
   });
  }
 },
 touchM: function(e) {
  if (e.touches.length == 1) {
   //手指移动时水平方向位置
   var moveX = e.touches[0].clientX;
   //手指起始点位置与移动期间的差值
   var disX = this.data.startX - moveX;
   var delBtnWidth = this.data.delBtnWidth;
   var txtStyle = "";
   if (disX == 0 || disX < 0) { //如果移动距离小于等于0，说明向右滑动，文本层位置不变
    txtStyle = "left:0px";
   } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
    txtStyle = "left:-" + disX + "px";
    if (disX >= delBtnWidth) {
     //控制手指移动距离最大值为删除按钮的宽度
     txtStyle = "left:-" + delBtnWidth + "px";
    }
   }
   //获取手指触摸的是哪一项
   var index = e.currentTarget.dataset.index;
   var list = this.data.whList;
   list[index].txtStyle = txtStyle;
   //更新列表的状态
   this.setData({
    whList: list
   });
  }
 },
 touchE: function(e) {
  if (e.changedTouches.length == 1) {
   //手指移动结束后水平位置
   var endX = e.changedTouches[0].clientX;
   //触摸开始与结束，手指移动的距离
   var disX = this.data.startX - endX;
   var delBtnWidth = this.data.delBtnWidth;
   //如果距离小于删除按钮的1/2，不显示删除按钮
   var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
   //获取手指触摸的是哪一项
   var index = e.currentTarget.dataset.index;
   var list = this.data.whList;
   list[index].txtStyle = txtStyle;
   //更新列表的状态
   this.setData({
    whList: list
   });
  }
 },
 //获取元素自适应后的实际宽度
 getEleWidth: function(w) {
  var real = 0;
  try {
   var res = wx.getSystemInfoSync().windowWidth;
   var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
   real = Math.floor(res / scale);
   return real;
  } catch (e) {
   return false;
   // Do something when catch error
  }
 },
 initEleWidth: function() {
  var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
  this.setData({
   delBtnWidth: delBtnWidth
  });
 },
 //点击删除按钮事件
 delItem: function(e) {
  //获取列表中要删除项的下标
  var userId = e.currentTarget.dataset.userid;
  var objectId = e.currentTarget.dataset.objectid;
  // 取消收藏
  this.cancelCollect(userId, objectId);
 },
 // 取消收藏
 cancelCollect: function(userId, objectId) {
  var _this = this;
  var params = {
   "objectId": objectId,
   "userId": userId
  }
  app.fetch('/hone/applet/collect/cancel', params).then((response) => {
   // 数据返回成功0
   // console.log(response);
   if (response.errorCode == '0') {
    wx.showToast({
     title: '取消成功' || '',
     icon: 'none'
    })
    this.setData({
     whList: [],
     pageNumber: '1',
    })
    _this.getCollectList('1');

   } else {
    // 数据返回失败
    wx.showToast({
     title: '数据返回失败' || '',
     icon: 'none'
    })
   }
  })
 },
 // 去网红大厅
 toWhHall: function() {
  wx.switchTab({
   url: '../../hall/celebrityhall/celebrityhall',
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
  // 连续加载
  _this.getCollectList('0');
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

   pageNumber: '1',
  })
  // 刷新
  this.getCollectList('1');
 },
})