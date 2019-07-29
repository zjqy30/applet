// pages/hall/creatOrder/creatOrder.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  plat: [], // 平台数组
  // platItem: 0, // 去除默认项，不设为0
  genderArr: [{
   text: '全部',
   value: ''
  }, {
   text: '男',
   value: '1'
  }, {
   text: '女',
   value: '2'
  }],
  // genderItem: ,
  labelArr: [],
  labelNum: 0, // 已选的标签的个数
  pageType: '', // 从审核未通过页面过来修改订单
  orderData: {}
 },
 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  if (options.pageType == 'NAP') {
   this.data.pageType = options.pageType;
   this.setData({
    orderData: app.globalData.saveOrderDetail
   })
   // 因为性别可以为空，单独处理一下
   if (app.globalData.saveOrderDetail.gender == '') {
    this.data.genderItem = 0;
   }
   console.error(this.data.orderData);
  } else {
   this.setData({
    platItem: 0,
    genderItem: 0
   })
  }
  this.getNeedPlat();
  // 获取网红标签
  this.getWhLabel();
 },
 // 获取需求平台
 getNeedPlat: function() {
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

 // 获取网红标签
 getWhLabel: function() {
  var _this = this;

  var params = {
   type: 'label'
  }
  app.fetch('/hone/applet/dict/listByType', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == 0) {

    var unDeal = response.data.dictList;
    var hadTags = [];
    if (_this.data.orderData.tag && _this.data.orderData.tag != '') {
     hadTags = _this.data.orderData.tag.split(',');
     _this.data.labelNum = hadTags.length;
    }

    for (var i = 0, len = unDeal.length; i < len; i++) {
     unDeal[i].status = '0';
    }

    for (var i = 0, len = unDeal.length; i < len; i++) {
     if (_this.data.orderData.tag) {
      for (var j = 0, len1 = hadTags.length; j < len1; j++) {
       if (unDeal[i].dictValue == hadTags[j]) {
        // console.error(unDeal[i].dictValue+'2222222222222222222222');
        unDeal[i].status = '1';
       }
      }
     } else {
      console.error(111111111);
      unDeal[i].status = '0';
     }
    }


    _this.setData({
     labelArr: unDeal
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
 // 点击标签
 selectLabel: function(e) {
  var _this = this;
  // console.log(JSON.stringify(e) + '点到我啦');

  var id = e.currentTarget.dataset.id;
  var status = e.currentTarget.dataset.status;
  var index = e.currentTarget.dataset.index;

  if (status == '0') {
   // 未选变已选
   if (_this.data.labelNum > 5) {
    wx.showToast({
     title: '至多选择6个标签',
     icon: 'none'
    })
    return false;
   }
   _this.data.labelNum++;
   _this.data.labelArr[index].status = '1';
  } else if (status == '1') {
   _this.data.labelNum--;
   // 已选变未选
   _this.data.labelArr[index].status = '0';
  }

  _this.setData({
   labelArr: _this.data.labelArr
  })
 },
 // 选择的平台
 bindPlat: function(e) {
  var _this = this;
  // console.log('选择的平台', e.detail.value);
  _this.setData({
   platItem: e.detail.value,
  })
  if (app.globalData.saveOrderDetail) {
   app.globalData.saveOrderDetail.platId = _this.data.plat[_this.data.platItem].id;
  }
 },
 // 选择性别
 bindGender: function(e) {
  var _this = this;
  // console.log('选择的性别', e.detail.value);
  _this.setData({
   genderItem: e.detail.value,
  })
  if (app.globalData.saveOrderDetail) {
   app.globalData.saveOrderDetail.gender = _this.data.genderArr[_this.data.genderItem].value;
  }
 },
 // 数据提交
 formSubmit: function(e) {
  var _this = this;
  // 已填页面做全局变量存储
  // console.log(JSON.stringify(e));

  var _this = this;
  var tags = '';
  for (var i = 0, len = _this.data.labelArr.length; i < len; i++) {
   if (_this.data.labelArr[i].status == '1') {
    // 已选
    tags += _this.data.labelArr[i].id + ','
   }
  }

  // 非空校验
  if (!e.detail.value.fansNum || e.detail.value.fansNum == '') {
   _this.popToast('粉丝数不能为空！');
   return false;
  } else if (!e.detail.value.remarks || e.detail.value.remarks == '') {
   _this.popToast('商品介绍不能为空！');
   return false;
  } else if (!tags || tags == '') {
   _this.popToast('请选择网红标签！');
   return false;
  }

  // 存储已选的标签
  app.globalData.creatOrderData = {
   userId: app.globalData.userId,
   plateFormId: app.globalData.saveOrderDetail.platId || _this.data.plat[_this.data.platItem].id,
   fansNum: e.detail.value.fansNum,
   shopPlateForm: e.detail.value.shopPlateForm,
   remarks: e.detail.value.remarks,
   tags: tags,
   sex: app.globalData.saveOrderDetail.gender || _this.data.genderArr[_this.data.genderItem].value
  }

  // 跳转到下一步
  wx.navigateTo({
   url: '../creatOrder2/creatOrder2?pageType=' + _this.data.pageType,
  })
 },
 // 提示语
 popToast: function(info) {
  wx.showToast({
   title: info || '',
   icon: 'none'
  })
 },
 // 数组去重
 uniqueArray(array, key) {
  let result = [array[0]];
  for (let i = 1; i < array.length; i++) {
   let item = array[i];
   let repeat = false;
   for (let j = 0; j < result.length; j++) {
    if (item[key] == result[j][key]) {
     repeat = true;
     break;
    }
   }
   if (!repeat) {
    result.push(item);
   }
  }
  return result;
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