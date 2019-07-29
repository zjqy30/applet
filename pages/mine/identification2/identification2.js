// pages/mine/identification2/identification2.js
//获取应用实例
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  defaultCard: '../../image/wx-default.png', // 默认的上传图片
  handCard: '', // 手持
  cardPic1: '', // 正面
  cardPic2: '', // 反面
  platPic: '', // 平台截图

 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  console.log(app.globalData.stepOneData);
 },
 // 获取身份证
 getCardId: function(e) {
  // console.log(JSON.stringify(e));
  app.globalData.stepOneData.idCardNumber = e.detail.value;
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
     case '1':
      // 身份证正面
      _this.setData({
       cardPic1: tempFilePaths
      })
      break;
     case '2':
      // 身份证反面
      _this.setData({
       cardPic2: tempFilePaths
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
       app.globalData.stepOneData.idCardPic = response.data.fileName;
       _this.setData({
        handCard: response.data.fileName
       })
       break;
      case '1':
       // 身份证正面
       app.globalData.stepOneData.idCardUpPic = response.data.fileName;
       _this.setData({
        cardPic1: response.data.fileName
       })
       break;
      case '2':
       // 身份证反面
       app.globalData.stepOneData.idCardDownPic = response.data.fileName;
       _this.setData({
        cardPic2: response.data.fileName
       })
       break;
      case '3':
       // 平台截图
       app.globalData.stepOneData.platFormImgs = response.data.fileName;
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
 skipModel: function(e) {
  var type = e.currentTarget.dataset.type;
  // console.log(type);
  // 非tabbar页面
  wx.navigateTo({
   url: '../template1/template1?id=' + type,
  })
 },
 // 下一步
 skipNext: function() {
  var _this = this;
  console.log(app.globalData.stepOneData);
  if (!app.globalData.stepOneData.idCardNumber || app.globalData.stepOneData.idCardNumber == '') {
   _this.popToast('请输入身份证号！');
   return false;
  } else if (!app.string.idcard.validate(app.globalData.stepOneData.idCardNumber)) {
   _this.popToast('请输入正确的身份证号！');
   return false;
  } else if (!app.globalData.stepOneData.idCardPic || app.globalData.stepOneData.idCardPic == '') {
   _this.popToast('请上传手持身份证照！');
   return false;
  } else if (!app.globalData.stepOneData.idCardUpPic || app.globalData.stepOneData.idCardUpPic == '') {
   _this.popToast('请上传身份证正面照！');
   return false;
  } else if (!app.globalData.stepOneData.idCardDownPic || app.globalData.stepOneData.idCardDownPic == '') {
   _this.popToast('请上传身份证反面照！');
   return false;
  } else if (!app.globalData.stepOneData.platFormImgs || app.globalData.stepOneData.platFormImgs == '') {
   _this.popToast('请上传平台截图！');
   return false;
  }
  wx.navigateTo({
   url: '../identification3/identification3',
  })
 },
 // 提示语
 popToast: function(info) {
  wx.showToast({
   title: info || '',
   icon: 'none'
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
     app.globalData.stepOneData.idCardPic = '';
    } else if (type == '1') {
     _this.setData({
      cardPic1: ''
     })
     app.globalData.stepOneData.idCardUpPic = '';
    } else if (type == '2') {
     _this.setData({
      cardPic2: ''
     })
     app.globalData.stepOneData.idCardDownPic = '';
    } else if (type == '3') {
     _this.setData({
      platPic: ''
     })
     app.globalData.stepOneData.platFormImgs = '';
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