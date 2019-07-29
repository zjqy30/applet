// pages/hall/creatOrder2/creatOrder2.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  defaultImg: '../../image/wx-add.png',
  templateName: '',
  price: '',
  personImgs: [], // 网红的形象照
  personImgAll: [], // 上传的字符串照片
  imgNum: 0, // 上传的图片的个数
  isShow: false,
  orderData: {},
  offerPicArr:[]
 },
 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function (options) {
  var _this = this;
  if (options.pageType == 'NAP') {
   _this.setData({
    orderData: app.globalData.saveOrderDetail
   })
   // var offerPicArr = [];

   if ( _this.data.orderData.offerPic.indexOf(',') == -1) {
    console.log('无');
    _this.data.offerPicArr.push({
     path: _this.data.orderData.offerPic
    });
   } else {
    var offerPicArrs = _this.data.orderData.offerPic.split(',');
    for (var i in offerPicArrs) {
     _this.data.offerPicArr.push({
      path: offerPicArrs[i]
     })
    }
   }
   app.globalData.creatOrderData.pics = app.globalData.saveOrderDetail.offerPic;
   app.globalData.creatOrderData.templateId = app.globalData.saveOrderDetail.templateId;
   app.globalData.creatOrderData.templateName = app.globalData.saveOrderDetail.offerTitle;
   app.globalData.creatOrderData.price = app.globalData.saveOrderDetail.price;
   _this.setData({
    personImgs: _this.data.personImgs.concat(_this.data.offerPicArr),
   })

   console.error(JSON.stringify(app.globalData.creatOrderData) + '创建订单提交数据');
  }
 },
 // 选择服务类型
 selectService: function () {
  if (!app.globalData.saveOrderDetail.templateId){
   wx.navigateTo({
    url: '../commandTemplate/commandTemplate',
   })
  }
  
 },
 /**
  * 生命周期函数--监听页面显示
  */
 onShow: function () {
  console.log(app.globalData.creatOrderData + '上一步的数据');
  if (app.globalData.creatOrderData.templateName) {
   // 已选择
   this.setData({
    templateName: app.globalData.creatOrderData.templateName,
    price: app.globalData.creatOrderData.price
   })
  }else{

  }
 },
 // 上传形象照
 uploadImg: function () {
  var _this = this;
  wx.chooseImage({
   sourceType: ['album', 'camera'], // 可选择性开放访问相册、相机
   count: 6, // 仅能上传6张
   success(res) {
    // 返回的数数组，可多选
    var tempFilePath = res.tempFilePaths;
    //console.error(JSON.stringify(res))
    _this.setData({
     personImgs: _this.data.personImgs.concat(res.tempFiles),
     personImgAll: _this.data.personImgAll.concat(tempFilePath)
    })
   }
  })
 },
 // 预览图片
 perviewPic: function (e) {

  var thisPic = e.currentTarget.dataset.pic;
  // console.log(thisPic);
  var urls = [];
  urls.push(thisPic)
  wx.previewImage({
   urls: urls,
  })
 },
 // 图片上传
 fileUpLoad: function (path, num) {
  console.error(path + '这是上传图片路径');
  var _this = this;
  var params = {};
  wx.uploadFile({
   url: app.globalData.uploadPath + '/hone/applet/cos/uploadFile', // 附件上传
   filePath: path,
   name: 'file',
   formData: params,
   header: {
    'Content-Type': 'multipart/form-data'
   },
   success(response) {
    // console.error(JSON.stringify(response));
    var response = JSON.parse(response.data);
    // 数据返回成功
    if (response.errorCode == '0') {
     // 上传成功
     wx.showToast({
      title: '上传成功',
      icon: 'none'
     })
     _this.data.imagNum++;
     app.globalData.creatOrderData.pics = response.data.fileName + ',' + app.globalData.creatOrderData.pics;
     //console.log(app.globalData.creatOrderData);
     if (_this.data.imagNum == num) {
      if (app.globalData.saveOrderDetail.offerPic){
       // 继续提交审核
       _this.submitOrderAgain();
      }else{
       // 提交审核
       _this.submitOrder();
      }
      
     }
    } else {
     // 数据返回失败
     wx.showToast({
      title: response.msg || '',
      icon: 'none'
     })
    }
   }
  })
 },
 submitCheck: function (e) {
  console.error(JSON.stringify(app.globalData.creatOrderData) + '创建订单提交数据');

  var _this = this;
  //console.log(JSON.stringify(e));
  _this.data.formId = e.detail.formId;
  if (!app.globalData.creatOrderData.templateName || app.globalData.creatOrderData.templateName == '') {
   _this.popToast('请先选择服务类型！');
   return false;
  } else if (_this.data.personImgs == '') {
   _this.popToast('请上传商品照片！');
   return false;
  } else if (_this.data.personImgs.length > 6) {
   //console.log(_this.data.personImgAll)
   _this.popToast('最多上传6张图片！');
   return false;
  }

  // 弹出提示框
  _this.setData({
   isShow: true
  })


 },
 // 确认提交
 submitYourInfo: function () {
  var _this = this;
console.error('11111111111111');
  // 如果是修改
  if (app.globalData.saveOrderDetail && _this.data.personImgAll.length == 0){
   // 继续提交审核
   _this.submitOrderAgain();
   return false;
  }

  // 显示后进行上传(微信小程序只能单个文件上传)
  _this.data.imagNum = 0;
  for (var i = 0, len = _this.data.personImgAll.length; i < len; i++) {
   _this.fileUpLoad(_this.data.personImgAll[i], _this.data.personImgAll.length);
  }
 },
 // 提示语
 popToast: function (info) {
  wx.showToast({
   title: info || '',
   icon: 'none'
  })
 },
 // 提交商品审核数据
 submitOrder: function () {
  var _this = this;
  app.globalData.creatOrderData.pics = app.globalData.creatOrderData.pics.substr(0, app.globalData.creatOrderData.pics.lastIndexOf(','));

  var params = app.globalData.creatOrderData;
  console.error(JSON.stringify(params) + '商品订单1');
  app.fetch('/hone/applet/offer/relase', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    var offerId = response.data.offerId;
    //console.log(offerId + '支付的id');
    // 获取需求id
    // 先支付后，审核完成，才会在大厅中查看
    _this.startPay(offerId);
   } else {
    // 数据返回失败
    wx.showToast({
     title: response.msg || '',
     icon: 'none'
    })
   }
  })
 },
 // 继续提交
 submitOrderAgain:function(){
  var _this = this;
  if (app.globalData.creatOrderData.pics.indexOf(',') != -1) {
   // 有
   app.globalData.creatOrderData.pics = app.globalData.creatOrderData.pics.substr(0, app.globalData.creatOrderData.pics.lastIndexOf(','));
  }
  
  app.globalData.creatOrderData.offerId = app.globalData.saveOrderDetail.offerId;
  var params = app.globalData.creatOrderData;
  console.error(JSON.stringify(params) + '商品订单2');
  app.fetch('/hone/applet/offer/edit', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    var offerId = response.data.offerId;
    // 跳转到我的首页（tabbar）
    wx.switchTab({
     url: '../businesshall/businesshall',
    })
   } else {
    // 数据返回失败
    wx.showToast({
     title: response.msg || '',
     icon: 'none'
    })
   }
  })
 },
 // 先支付
 startPay: function (offerId) {
  var _this = this;
  if (app.globalData.creatOrderData.price == 0){
   wx.showToast({
    title: '价格不可为0，请重新选择！' || '',
    icon: 'none'
   })
   return false;
  }

  var params = {
   offerId: offerId,
   openid: app.globalData.openid,
   userId: app.globalData.userId,
   totalMoney: app.globalData.creatOrderData.price
   // app.globalData.creatOrderData.price
  };
  //console.error(JSON.stringify(params) + '商品订单');
  app.fetch('/hone/applet/wxpay/callPay', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    var data = response.data.map;
    //console.error(JSON.stringify(response));

    wx.requestPayment({
     timeStamp: data.timeStamp,
     nonceStr: data.nonce_str,
     package: 'prepay_id=' + data.prepay_id, // 注意
     signType: 'MD5',
     paySign: data.paySign,
     success: function (res) {
      //console.error(JSON.stringify(res) + '支付成功');
      // 发送支付的模板消息
      _this.sendModelMsg(data.prepay_id, data.out_trade_no);
     }
    })
   } else {
    // 数据返回失败
    wx.showToast({
     title: response.msg || '',
     icon: 'none'
    })
   }
  })
 },
 // 发送模板消息
 sendModelMsg: function (formId, out_trade_no) {
  var _this = this;
  var params = {
   formId: _this.data.formId,
   openId: app.globalData.openid,
   userId: app.globalData.userId,
   outTradeNo: out_trade_no
  };
  //console.error(JSON.stringify(params) + '');
  app.fetch('/hone/applet/wx/formId', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    // 跳转到我的首页（tabbar）
    wx.switchTab({
     url: '../businesshall/businesshall',
    })
   } else {
    // 数据返回失败
    wx.showToast({
     title: response.msg || '',
     icon: 'none'
    })
   }
  })
 },
 // 图片删除
 deleteImage: function (e) {
  var _this = this;
  var deleteSrc = e.currentTarget.dataset.pic;
  var index = e.currentTarget.dataset.index;
  _this.data.personImgs.splice(index, 1);
  _this.data.personImgAll.splice(index, 1);

  _this.setData({
   personImgs: _this.data.personImgs,
   personImgAll: _this.data.personImgAll
  })
  wx.showToast({
   title: '删除成功',
   icon: 'none'
  })
  //console.error(_this.data.personImgAll + '图片')
 },
 // 关闭
 closePop: function () {
  this.setData({
   isShow: !this.data.isShow
  })
 },
})