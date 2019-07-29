// pages/mine/ordermanagedoffer/ordermanageoffer.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  delBtnWidth: 90,
  list: [],
  startX: "",
  tabtype: 'PY',
  pageNumber: '1',
  orderStatus: '', // 订单状态
  hasData: true,
  isShow: false
 },
 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  this.getOrderOffer('1');
 },
 // 头部tab点击
 clickTab: function(e) {
  var tabtype = e.currentTarget.dataset.tabtype;
  this.setData({
   tabtype: tabtype,
   pageNumber: '1',
  })

  this.getOrderOffer('1');
 },
 // 页面每显示就刷新一次
 onShow:function(){
  this.setData({
   pageNumber: '1'
  })
  this.getOrderOffer('1');
 },
 // 商家订单列表
 getOrderOffer: function (isFresh) {

  var _this = this;
  var params = {
   userId: app.globalData.userId || 'fb8abfba4f62468598b162ac8417c28f',
   pageNumber: _this.data.pageNumber,
   pageSize: '10',
   type: _this.data.tabtype
  }
  app.fetch('/hone/applet/offer/sellerOfferList', params).then((response) => {
   // 数据返回成功
   wx.hideLoading();
   if (response.errorCode == '0') {
    // 测试数据
    // response = {
    //  "errorCode": "0",
    //  "msg": "操作成功",
    //  "data": {
    //   "pageData": {
    //    "pageNumer": 1,
    //    "pageSize": 10,
    //    "totalCount": null,
    //    "list": [
    //     {
    //      "id": "4b3e26cb55804d9d90096b52abafc738",
    //      "headPic": null,
    //      "wxName": null,
    //      "title": "包包",
    //      "pic": "https://hongone-1258770736.cos.ap-shanghai.myqcloud.com/images/201907/20190719/1563530098272.jpg",
    //      "tags": "语音/电台",
    //      "fansNum": "222",
    //      "status": "LK",
    //      "snatchNums": null,
    //      "phoneNo": null,
    //      "remarks": "测试商品5",
    //      "sellApprove": '0',
    //      "starApprove": '1',
    //      "price": "1.0",
    //      "starIds": [

    //      ]
    //     },
    //     {
    //      "id": "cae074df631743bca3f1b33cadedcc6f",
    //      "headPic": null,
    //      "wxName": null,
    //      "title": "包包",
    //      "pic": "https://hongone-1258770736.cos.ap-shanghai.myqcloud.com/images/201907/20190719/1563529927807.jpg",
    //      "tags": "游戏,舞蹈,电影,运动,教育",
    //      "fansNum": "11",
    //      "status": "LK",
    //      "snatchNums": null,
    //      "phoneNo": null,
    //      "remarks": "测试商品4",
    //      "sellApprove": '1',
    //      "starApprove": '0',
    //      "price": "1.0",
    //      "starIds": [

    //      ]
    //     }
    //    ]
    //   }
    //  }
    // };

    var unDeal = response.data.pageData.list;
    for (var i = 0, len = unDeal.length; i < len; i++) {
     // 处理商品照片
     if (unDeal[i].pic.indexOf(',') !=  -1) {
      unDeal[i].pic = unDeal[i].pic.substr(0, unDeal[i].pic.indexOf(','));
     }

     // 处理标签
     if (unDeal[i].tags) {
      var tagArr = unDeal[i].tags.split(',');
      unDeal[i].tagArr = tagArr;
     } else {
      unDeal[i].tagArr = ['暂无'];
     }
     // 处理状态值
     if (unDeal[i].status) {
      if (unDeal[i].status == 'PY') {
       // 待审核tab
       unDeal[i].statusText = '待审核';
      } else if (unDeal[i].status == 'NAP') {
       // 审核未通过（可继续修改订单）
       unDeal[i].statusText = '审核未通过';
      } else if (unDeal[i].status == 'AP') {
       // 已发布tab（等待网红抢单）
       unDeal[i].statusText = '已发布';
      } else if (unDeal[i].status == 'LK') {
       // 进行中tab（已经和一名网红锁单，完成任务中）
       // 1都未点击确认完成按钮；2、网红已点完成按钮，等待商家点击；3、商家点击，等待网红确认
       if (unDeal[i].sellApprove == '0' && unDeal[i].starApprove == '0') {
        // 商家和网红都没确认
        unDeal[i].statusText = '进行中';
       } else if (unDeal[i].sellApprove == '0' && unDeal[i].starApprove == '1') {
        // 商家未点确认，网红点确认
        unDeal[i].statusText = '待确认';
       } else if (unDeal[i].sellApprove == '1' && unDeal[i].starApprove == '0') {
        // 商家点确认，网红未点确认
        unDeal[i].statusText = '等待网红确认完成';
       }
       
      } else if (unDeal[i].status == 'FN') {
       // 已完成tab（商家网红都点击了完成确认；已退款完成）
       unDeal[i].statusText = '已完成';
      } else if (unDeal[i].status == 'RN') {
       unDeal[i].statusText = '退款成功';
      } else if (unDeal[i].status == 'RA') {
       // 待退款tab（待退款；退款驳回）
       unDeal[i].statusText = '退款中';
      } else if (unDeal[i].status == 'RF') {
       unDeal[i].statusText = '退款驳回';
      }
     } else {
      unDeal[i].statusText = '异常订单，请联系我们';
     }
    }


    if (isFresh == '1') {
     // 刷新
     _this.setData({
      list: unDeal
     })
    } else if (isFresh == '0') {
     // 下拉加载
     _this.setData({
      list: _this.data.list.concat(unDeal)
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
 // 去大厅
 toOrderHall: function (e) {
  wx.switchTab({
   url: '../../hall/businesshall/businesshall',
  })
 },
 // 侧滑事件
 touchS: function(e) {
  if (e.currentTarget.dataset.status != 'RA') {
   if (e.touches.length == 1) {
    this.setData({
     //设置触摸起始点水平方向位置
     startX: e.touches[0].clientX
    });
   }
  }

 },
 touchM: function(e) {
  if (e.currentTarget.dataset.status != 'RA') {
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
    var list = this.data.list;
    list[index].txtStyle = txtStyle;
    //更新列表的状态
    this.setData({
     list: list
    });
   }
  }

 },
 touchE: function(e) {
  if (e.currentTarget.dataset.status != 'RA') {
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
    var list = this.data.list;
    list[index].txtStyle = txtStyle;
    //更新列表的状态
    this.setData({
     list: list
    });
   }
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
 //点击退款
 delItem: function(e) {
  var _this = this;
  var offerId = e.currentTarget.dataset.id;
  wx.navigateTo({
   url: '../wantToDrawback/wantToDrawback?offerId=' + offerId,
  })

 },
 // 点击订单列表
 skipOrderDetail: function(e) {
  var pageType = e.currentTarget.dataset.pagetype;
  var offerId = e.currentTarget.dataset.id;
  var phoneNo = e.currentTarget.dataset.phoneno;
  var wxName = e.currentTarget.dataset.wxname;
  wx.navigateTo({
   url: '../../hall/orderdetail/orderdetail?offerId=' + offerId + '&pageType=' + pageType + '&phoneNo=' + phoneNo + '&wxName=' + wxName,
  })
 },
 // 联系商家
 concatOffer: function(e) {
  var phone = e.currentTarget.dataset.shopphone;
  wx.makePhoneCall({
   phoneNumber: phone,
   success: function(res) {},
   fail: function(res) {},
   complete: function(res) {},
  })
 },
 // 联系我们
 concatUs: function(e) {
  wx.makePhoneCall({
   phoneNumber: '400-6033-235',
   success: function(res) {},
   fail: function(res) {},
   complete: function(res) {},
  })
 },
 // 商家确认完成
 sureFinish: function(e) {
  console.log(e)
  var _this = this;
  var starApprove = e.currentTarget.dataset.starapprove;
  var sellApprove = e.currentTarget.dataset.sellapprove;
  var id = e.currentTarget.dataset.id;
  _this.setData({
   sureId: e.currentTarget.dataset.id
  })
  // sellApprove,starApprove:0  sellApprove:0starApprove:1 sellApprove:1starApprove:0
  if (sellApprove == '1') {
   wx.showToast({
    title: '等待网红确认完成，如有问题请联系商家或我们',
    icon: 'none'
   })
  } else if (sellApprove == '0') {
   // 网红走确认，如果此时商家未确认，点击后置灰：进行中-等待商家确认；商家已确认，刷新列表重新渲染，因为此时订单已完成
   _this.setData({
    isShow: !_this.data.isShow
   })
  }
 },
 // 关闭
 closePop: function() {
  this.setData({
   isShow: !this.data.isShow
  })
 },
 // 商家确认完成{弹出确定}}
 sureFinishMine: function(e) {
  var _this = this;
  var params = {
   offerId: _this.data.sureId,
   userId: app.globalData.userId,
   openid: app.globalData.openid
  }
  app.fetch('/hone/applet/offer/confirmFN', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    _this.setData({
     isShow: !_this.data.isShow,
     pageNumber:'1'
    })
    _this.getOrderOffer('1');

   } else {
    // 数据返回失败
    wx.showToast({
     title: '数据获取失败' || '',
     icon: 'none'
    })
   }
  })
 },
 /**
  * 页面相关事件处理函数--监听用户上拉
  */
 onReachBottom: function () {
  console.log('触到底部');
  if (this.data.hasmore != 'block') {
   console.log('触到底部');
   this.loadMore();
  }
 },
 // 上拉加载更多
 loadMore: function () {
  var _this = this;
  wx.showLoading({
   title: '拼命加载中...'
  });
  var nowpage = parseInt(_this.data.pageNumber) + 1;
  _this.setData({
   pageNumber: nowpage
  });
  // 连续加载
  _this.getOrderOffer('0');
 },
 /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
 onPullDownRefresh: function () {
  this.refresh();
 },
 /*
  *刷新
  */
 refresh: function () {
  wx.showLoading({
   title: '拼命刷新中...'
  });
  this.setData({
   list: [],
   pageNumber: '1',
  })
  // 刷新
  this.getOrderOffer('1');
 },
})