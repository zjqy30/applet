// pages/mine/identificationoffer2/identificationoffer2.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  defaultCard: '../../image/wx-default.png', // 默认的上传图片
  handCard: '', // 手持
  platPic: '', // 平台截图

 },
 // 身份证照上传
 uploadImg: function(e) {
  var _this = this;
  var type = e.currentTarget.dataset.type;
  wx.chooseImage({
   sourceType: ['album', 'camera'], // 可选择性开放访问相册、相机
   count: 1, // 仅能上传一张
   success(res) {
    // 返回的数数组，可多选
    var tempFilePaths = res.tempFilePaths;
    // console.log(JSON.stringify(res));
    switch (type) {
     case '0':
      // 手持身份证
      _this.setData({
       handCard: tempFilePaths
      })
      break;
     case '3':
      // 平台截图
      _this.setData({
       platPic: tempFilePaths
      })
      break;
    }
    // 显示后进行上传(单张))
    _this.fileUpLoad(tempFilePaths[0], type);

   }
  })
 },
 // 预览图片
 previewPic: function(e) {
  // console.log(JSON.stringify(e));
  var thisPic = e.currentTarget.dataset.pic;
  var tempArr = [];
  tempArr.push(thisPic);
  wx.previewImage({
   urls: tempArr,
  })
 },
 // 单张照片上传
 fileUpLoad: function(tempFilePaths, type) {
  var _this = this;
  var params = {};
  wx.uploadFile({
   url: app.globalData.uploadPath + '/hone/applet/cos/uploadFile', // 附件上传
   filePath: tempFilePaths,
   name: 'file',
   formData: params,
   success(response) {
    // console.error(JSON.stringify(response)+'上传的图片的返回路径');
    var response = JSON.parse(response.data);
    console.error(response.data.fileName);
    // 数据返回成功
    if (response.errorCode == '0') {

     // 全局保存
     switch (type) {
      case '0':
       // 手持身份证
       app.globalData.stepOneData1.idCardPic = response.data.fileName;
       _this.setData({
        handCard: response.data.fileName
       })
       break;
      case '3':
       // 平台截图
       app.globalData.stepOneData1.businessLicense = response.data.fileName;
       _this.setData({
        platPic: response.data.fileName
       })
       break;
     }
     // 上传成功
     wx.showToast({
      title: '上传成功',
      icon: 'none'
     })
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
 // 查看模板
 skipModel: function(e) {
  var type = e.currentTarget.dataset.type;
  wx.navigateTo({
   url: '../template1/template1?id=' + type,
  })
 },
 // 提交审核
 submitCheck: function(e) {
  var _this = this;
  console.log(JSON.stringify(e));
  _this.data.formId = e.detail.formId;
  if (!app.globalData.stepOneData1.idCardPic || app.globalData.stepOneData1.idCardPic == '') {
   _this.popToast('请上传手持身份证照！');
   return false;
  } else if (!app.globalData.stepOneData1.businessLicense || app.globalData.stepOneData1.businessLicense == '') {
   _this.popToast('请上传营业执照！');
   return false;
  }

  // 提交审核
  console.error(app.globalData.stepOneData);
  _this.submitYourInfo();
 },
 // 提示语
 popToast: function(info) {
  wx.showToast({
   title: info || '',
   icon: 'none'
  })
 },
 // 提交认证的资料
 submitYourInfo: function() {

  var _this = this;
  app.globalData.stepOneData1.certLicense = '';
  var params = app.globalData.stepOneData1;
  console.error(JSON.stringify(params));
  app.fetch('/hone/applet/userBasic/seller/applyApproved', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    wx.showToast({
     title: '提交成功',
     duration: 2000
    })

    // 发送支付的模板消息
    _this.sendModelMsg();
   } else {
    // 数据返回失败
    wx.showToast({
     title: '数据获取失败' || '',
     icon: 'none'
    })
   }
  })
 },
 // 发送模板消息
 sendModelMsg: function() {
  var _this = this;
  var params = {
   formId: _this.data.formId,
   openId: app.globalData.openid,
   userId: app.globalData.userId,
   outTradeNo: ''
  };
  console.error(JSON.stringify(params) + '');
  app.fetch('/hone/applet/wx/formId', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    // 跳转到我的首页（tabbar）
    // 保存一下
    app.globalData.ifApproved = '0';
    wx.switchTab({
     url: '../mineindex/mineindex',
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
 // 图片删除
 deleteImage: function(e) {
  var _this = this;
  var deleteSrc = e.currentTarget.dataset.pic;
  var type = e.currentTarget.dataset.type;
  var params = {
   fileName: deleteSrc
  }
  app.fetch('/hone/applet/cos/delFile', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    if (type == '0') {
     _this.setData({
      handCard: ''
     })
     app.globalData.stepOneData1.idCardPic = '';
    } else if (type == '3') {
     _this.setData({
      platPic: ''
     })
     app.globalData.stepOneData1.businessLicense = '';
    }

    wx.showToast({
     title: '删除成功',
     icon: 'none'
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
})