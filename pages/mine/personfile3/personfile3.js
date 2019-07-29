// pages/mine/identification4/identification4.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  isAgree: [], // 是否同意条款
  // serviceArr: [], // 已选择的服务类型
  isShow: false,
  defaultCard: '../../image/wx-default.png', // 默认的上传图片
  platPic: '', // 平台截图
 },
 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  console.log(app.globalData.saveWhDetail + '第二步更改数据');
  var _this = this;

  _this.setData({
   userBasicInfo: app.globalData.saveWhDetail0.userBasicInfo,
   userExtraInfo: app.globalData.saveWhDetail0.userExtraInfo
  })
  console.log(_this.data.userExtraInfo);
  app.globalData.saveWhDetail.personalIntroduce = _this.data.userBasicInfo.personalIntroduce;
  app.globalData.saveWhDetail.serviceTemplateList = app.globalData.saveWhDetail0.userExtraInfo.serviceTemplateList;

 },
 // 身份证照上传
 uploadImg: function (e) {
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
 // 单张照片上传
 fileUpLoad: function (tempFilePaths, type) {
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
      case '3':
       // 平台截图
       _this.setData({
        platPic: response.data.fileName
       })
       app.globalData.saveWhDetail.platformImgs = response.data.fileName;
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
 skipModel: function (e) {
  var type = e.currentTarget.dataset.type;
  wx.navigateTo({
   url: '../template1/template1?id=' + type,
  })
 },
 // 获取个人介绍
 getIntroduce: function(e) {
  app.globalData.saveWhDetail.personalIntroduce = e.detail.value;
 },
 // 页面显示
 onShow: function() {
  console.error(this.data.isShow)
  // console.error('******');
  // 从服务类型页面返回
  if (app.globalData.saveWhDetail.serviceTemplateList) {
   this.setData({
    userExtraInfo: {
     serviceTemplateList: app.globalData.saveWhDetail.serviceTemplateList
    }
   })
  }


  // 修改下数组格式
  if (app.globalData.saveWhDetail.serviceTemplateList){
   var unArr = app.globalData.saveWhDetail.serviceTemplateList;
  }else{
   var unArr = app.globalData.saveWhDetail0.userExtraInfo.serviceTemplateList;
  }
  
  app.globalData.saveWhDetail.serviceTemplateIds = '';
  if (unArr) {
   for (var i = 0, len = unArr.length; i < len; i++) {
    app.globalData.saveWhDetail.serviceTemplateIds = unArr[i].id + '-' + unArr[i].price + ',' + app.globalData.saveWhDetail.serviceTemplateIds;
   }
  }
 },
 // 选择服务类型
 selectService: function() {
  wx.navigateTo({
   url: '../servicetype/servicetype',
  })
 },
 // 提交审核
 submitCheck: function(e) {
  console.log(app.globalData.saveWhDetail0.userExtraInfo.serviceTemplateList.length+'原始的');
  console.log(app.globalData.saveWhDetail0.userExtraInfo.serviceTemplateList.length == 0);
  var _this = this;
  console.log(JSON.stringify(e) + '获取formID');
  _this.data.formId = e.detail.formId;
  // 非空校验
  if (!app.globalData.saveWhDetail.personalIntroduce || app.globalData.saveWhDetail.personalIntroduce == '') {
   _this.popToast('请输入个人介绍！');
   return false;
  }else if (app.globalData.saveWhDetail.serviceTemplateList && app.globalData.saveWhDetail.serviceTemplateList.length == 0){
   _this.popToast('请选择服务类型！');
   return false;
  } else if (!app.globalData.saveWhDetail.platformImgs || app.globalData.saveWhDetail.platformImgs == '') {
   _this.popToast('请上传平台截图！');
   return false;
  }
  console.error(JSON.stringify(app.globalData.saveWhDetail)+'所有的数据');
  // 弹出提示信息
  _this.setData({
   isShow: !_this.data.isShow
  })

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
  app.globalData.saveWhDetail.serviceTemplateList = '';
  var _this = this;
  // app.globalData.stepOneData.serviceTemplateIds = app.globalData.stepOneData.serviceTemplateIds.substr(0, app.globalData.stepOneData.serviceTemplateIds.lastIndexOf(','));


  // app.globalData.stepOneData.personalImgs = app.globalData.stepOneData.personalImgs.substr(0, app.globalData.stepOneData.personalImgs.lastIndexOf(','));
  var params = app.globalData.saveWhDetail;
  console.error(JSON.stringify(params)+'这是修改个人资料的参数');
  app.fetch('/hone/applet/userBasic/updateStarSelfInfo', params).then((response) => {
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
   openId: app.globalData.openid || 'o562H5Cz3QpYBiD4uhnDSQQqUzWA',
   userId: app.globalData.userId || '95f7e4e8574149c0a4affe89b34fcd54',
   outTradeNo: ''
  };
  console.error(JSON.stringify(params) + '');
  app.fetch('/hone/applet/wx/formId', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    // 跳转到我的首页（tabbar）
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
 // 关闭
 closePop: function() {
  this.setData({
   isShow: !this.data.isShow
  })
 },
 // 图片删除
 deleteImage: function (e) {
  var _this = this;
  var deleteSrc = e.currentTarget.dataset.pic;
  var params = {
   fileName: deleteSrc
  }
  app.fetch('/hone/applet/cos/delFile', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    _this.setData({
     platPic: ''
    })
    app.globalData.saveWhDetail.platformImgs = '';
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
 }
})