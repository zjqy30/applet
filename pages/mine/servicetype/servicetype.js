// pages/mine/servicetype/servicetype.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  typeArr: [],
  selectPrice: [],
  priceArr: [{
   text: '元',
   value: '0.00'
  }, {
   text: '元',
   value: '100.00'
  }, {
   text: '元',
   value: '200.00'
  }, {
   text: '元',
   value: '300.00'
  }, {
   text: '元',
   value: '400.00'
  }, {
   text: '元',
   value: '500.00'
  }, {
   text: '元',
   value: '600.00'
  }, {
   text: '元',
   value: '700.00'
  }, {
   text: '元',
   value: '800.00'
  }, {
   text: '元',
   value: '900.00'
  }, {
   text: '元',
   value: '1000.00'
  }, {
   text: '元',
   value: '1500.00'
  }, {
   text: '元',
   value: '2000.00'
  }, {
   text: '元',
   value: '2500.00'
  }, {
   text: '元',
   value: '3000.00'
  }, {
   text: '元',
   value: '3500.00'
  }, {
   text: '元',
   value: '4000.00'
  }, {
   text: '元',
   value: '4500.00'
  }, {
   text: '元',
   value: '5000.00'
  }, {
   text: '元',
   value: '5500.00'
  }, {
   text: '元',
   value: '6000.00'
  }, {
   text: '元',
   value: '6500.00'
  }, {
   text: '元',
   value: '7000.00'
  }, {
   text: '元',
   value: '7500.00'
  }, {
   text: '元',
   value: '8000.00'
  }, {
   text: '元',
   value: '8500.00'
  }, {
   text: '元',
   value: '9000.00'
  }, {
   text: '元',
   value: '9500.00'
  }, {
   text: '元',
   value: '10000.00'
  }, {
   text: '元',
   value: '20000.00'
  }, {
   text: '元',
   value: '30000.00'
  }, {
   text: '元',
   value: '40000.00'
  }, {
   text: '元',
   value: '50000.00'
  }, {
   text: '元',
   value: '60000.00'
  }, {
   text: '元',
   value: '70000.00'
  }, {
   text: '元',
   value: '80000.00'
  }, {
   text: '元',
   value: '90000.00'
  }, {
   text: '元',
   value: '100000.00'
  }],
  isShow: true, // 控制底部弹出
  priceItem: 0
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  app.globalData.saveWhDetail.serviceTemplateList = [];
  this.getServiceTemplate();
 },
 // 获取服务类型
 getServiceTemplate: function() {
  var _this = this;
  var params = {};
  app.fetch('/hone/applet/common/serviceTemplate/list', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    var unDeal = response.data.serviceTemplateList;
    for (var i = 0, len = unDeal.length; i < len; i++) {
     unDeal[i].status = '0';
     // 初始化每一项价格
     _this.data.selectPrice.push('0.00');

    }
    _this.setData({
     typeArr: unDeal,
     selectPrice: _this.data.selectPrice
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
 // 点击多选框
 checkboxChange: function(e) {
  var _this = this;
  console.log(JSON.stringify(e));

  // console.log(_this.data.isShow + '是否弹出');
  if (e.detail.value.length != 0) {
   console.log('选中了');
   for (var i = 0, len = _this.data.typeArr.length; i < len; i++) {
    if (_this.data.typeArr[i].id == e.currentTarget.id) {
     _this.data.typeArr[i].status = '1';
    }
   }
  } else if (e.detail.value.length == 0) {
   console.log('取消了');
   for (var i = 0, len = _this.data.typeArr.length; i < len; i++) {
    if (_this.data.typeArr[i].id == e.currentTarget.id) {
     _this.data.typeArr[i].status = '0';
    }
   }
  }

  console.log(_this.data.typeArr)

 },
 // 选择服务类型，弹出价格选择
 selectPrice: function(e) {
  console.error(JSON.stringify(e));
  var _this = this;
  var which = e.currentTarget.dataset.which;
  _this.data.selectPrice[which] = _this.data.priceArr[e.detail.value].value;
  _this.data.typeArr[which].price = _this.data.priceArr[e.detail.value].value;
  // console.log('选择的价格', e.detail.value);
  _this.setData({
   priceItem: e.detail.value,
   isShow: true,
   selectPrice: _this.data.selectPrice
  })
  console.error(_this.data.selectPrice);
 },
 // 点击确定返回
 overBack: function() {
  var _this = this;
  // 存一下全局 
  app.globalData.stepOneData.serviceArr = [];
  for (var i = 0, len = _this.data.typeArr.length; i < len; i++) {
   if (_this.data.typeArr[i].status == '1') {
    // 筛选出已选的，存全局变量
    if (_this.data.typeArr[i].price == '0.00' || !_this.data.typeArr[i].price) {
     wx.showToast({
      title: '请选择价格！',
      icon: 'none'
     })
     return false;
    }

    // 网信息修改
    console.error(app.globalData.saveWhDetail);

    if (app.globalData.saveWhDetail.userId) {
     // 修改个人资料
     app.globalData.saveWhDetail.serviceTemplateList.push({
      id: _this.data.typeArr[i].id,
      title: _this.data.typeArr[i].title,
      price: _this.data.typeArr[i].price,
     });
     if (app.globalData.saveWhDetail.serviceTemplateList.length > 4){
      wx.showToast({
       title: '最多选择4个！',
       icon: 'none'
      })
      return false;
     }
    } else {
     // 认证
     app.globalData.stepOneData.serviceArr.push({
      id: _this.data.typeArr[i].id,
      title: _this.data.typeArr[i].title,
      price: _this.data.typeArr[i].price,
     });

     if (app.globalData.stepOneData.serviceArr.length > 4) {
      wx.showToast({
       title: '最多选择4个！',
       icon: 'none'
      })
      return false;
     }

    }

 


   }
  }
  console.error(app.globalData.stepOneData.serviceArr)

  wx.navigateBack({
   delta: '1'
  })
 }
})