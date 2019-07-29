// pages/mine/ordermanage/ordermanage.js
const app = getApp();
Page({
 /**
  * 页面的初始数据
  */
 data: {
  tabtype: '1',
  pageNumber: '1',
  list: [], // 网红订单列表
  hasData: true,
  isShow: false,
  sureId: '', // 当前点击确认的订单id
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  // 获取订单列表
  this.getOrderList('1');
 },
 onShow:function(){
  this.setData({
   pageNumber: '1'
  })
  // 获取订单列表
  this.getOrderList('1');
 },
 // 点击顶部tab切换
 clickTab: function(e) {
  wx.showLoading({
   title: '拼命加载中...'
  });
  var tabtype = e.currentTarget.dataset.tabtype;
  this.setData({
   tabtype: tabtype,
   pageNumber: '1'
  })
  // 刷新
  this.getOrderList('1');
 },
 // 获取订单列表
 getOrderList: function(isFresh) {
  var _this = this;
  var params = {
   pageNumber: _this.data.pageNumber,
   pageSize: '10',
   type: _this.data.tabtype,
   userId: app.globalData.userId

  }
  app.fetch('/hone/applet/offer/starSnatchList', params).then((response) => {
   // 数据返回成功
   wx.hideLoading();
   if (response.errorCode == '0') {

    var unDeal = response.data.pageData.list;
    this.setData({
     hasData: true
    })

    for (var i = 0, len = unDeal.length; i < len; i++) {
     // 处理标签
     if (unDeal[i].tags) {
      var tagArr = unDeal[i].tags.split(',');
      unDeal[i].tagArr = tagArr;
     } else {
      unDeal[i].tagArr = ['暂无'];
     }

     // 处理照片
     if (unDeal[i].pic) {
      var imgsArr = [];
      if (unDeal[i].pic.indexOf(',') != '-1') {
       imgsArr = unDeal[i].pic.split(',');
       unDeal[i].pic = imgsArr[0];
      }
     } else {
      // 无商品照
     }

     // 处理订单状态值
     if (unDeal[i].status) {
      if (_this.data.tabtype == '1') {
       // 审核中
       if (unDeal[i].status == 'AP') {
        unDeal[i].status = '抢单中';
       } else{
        //  if (unDeal[i].status == 'FN') RN
        unDeal[i].status = '抢单失败';
       }
      } else if (_this.data.tabtype == '2') {
       // 进行中
       if (unDeal[i].status == 'LK') {
        if (unDeal[i].sellApprove == '0' && unDeal[i].starApprove == '0') {
         // 商家和网红都没确认
         unDeal[i].status = '进行中';
        } else if (unDeal[i].sellApprove == '0' && unDeal[i].starApprove == '1') {
         // 商家未点确认，网红点确认
         unDeal[i].status = '等待商家确认完成';
        } else if (unDeal[i].sellApprove == '1' && unDeal[i].starApprove == '0') {
         // 商家点确认，网红未点确认
         unDeal[i].status = '待确认';
        }
       }
      } else if (_this.data.tabtype == '3') {
       if (unDeal[i].status == 'FN') {
        unDeal[i].status = '已完成';
       }
      }
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
 // 查看订单详情
 skipOrderDetail: function(e) {
  var offerId = e.currentTarget.dataset.id;
  var pageType = e.currentTarget.dataset.pagetype;
  var phoneNo = e.currentTarget.dataset.phoneno;
  console.log(phoneNo);
  // 审核中wh1（已抢单的详情）,进行中wh2(商家选中),已完成wh3(双方确定，结束时间)
  wx.navigateTo({
   url: '../../hall/orderdetail/orderdetail?offerId=' + offerId + '&pageType=' + pageType + '&phoneNo=' + phoneNo,
  })
 },
 // 去大厅
 toOrderHall: function(e) {
  wx.switchTab({
   url: '../../hall/businesshall/businesshall',
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
  _this.getOrderList('0');
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
   list: [],
   pageNumber: '1',
  })
  // 刷新
  this.getOrderList('1');
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
 // 网红确认完成
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
  if (starApprove == '1') {
   wx.showToast({
    title: '等待商家确认完成，如有问题请联系商家或我们',
    icon: 'none'
   })
  } else if (starApprove == '0') {
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
 // 网红确认完成
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
    _this.getOrderList('1');

   } else {
    // 数据返回失败
    wx.showToast({
     title: response.msg || '',
     icon: 'none'
    })
   }
  })
 }
})