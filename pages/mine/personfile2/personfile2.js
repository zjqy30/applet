// pages/mine/identification3/identification3.js
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  defaultImg: '../../image/wx-add.png',
  labelArr: [],
  labelNum: 0, // 已选的标签的个数
  personImgs: [], // 网红的形象照
  personImgAll: [], // 上传的字符串照片
  imgNum: 0, // 上传的图片的个数
  offerPicArr: [], // 临时数组
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  var _this = this;

  _this.setData({
   userBasicInfo: app.globalData.saveWhDetail0.userBasicInfo,
   userExtraInfo: app.globalData.saveWhDetail0.userExtraInfo
  })
  console.log(JSON.stringify(app.globalData.saveWhDetail) + '第一步更改数据');

  // 处理原有数据并渲染
  _this.dealInitData();
  // 获取标签
  _this.getWhLabel();
 },
 dealInitData: function() {
  var _this = this;

  if (_this.data.userExtraInfo.personalImgs.indexOf(',') == -1) {
   console.log('无，1张');
   _this.data.offerPicArr.push({
    path: _this.data.userExtraInfo.personalImgs
   });
  } else {
   var offerPicArrs = _this.data.userExtraInfo.personalImgs.split(',');
   _this.data.offerPicArr = offerPicArrs;
   // for (var i in offerPicArrs) {
   //  _this.data.offerPicArr.push({
   //   path: offerPicArrs[i]
   //  })
   // }
  }

  if (_this.data.userExtraInfo.personalImgs != '') {
   _this.setData({
    personImgs: _this.data.personImgs.concat(_this.data.offerPicArr),
   })
   // app.globalData.saveWhDetail.personalImgs = app.globalData.saveWhDetail0.userExtraInfo.personalImgs;
  }
  console.error(_this.data.personImgs + '已有的图片');


 },
 // 获取网红平台/标签
 getWhLabel: function() {
  var _this = this;

  var params = {
   type: 'label'
  }
  app.fetch('/hone/applet/dict/listByType', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == 0) {

    var unDeal = response.data.dictList;
    for (var i = 0, len = unDeal.length; i < len; i++) {
     unDeal[i].status = '0';
    }

    var hadTags = [];
    hadTags = _this.data.userExtraInfo.tags.split(',');
    _this.data.labelNum = hadTags.length;

    for (var i = 0, len = unDeal.length; i < len; i++) {
     for (var j = 0, len1 = hadTags.length; j < len1; j++) {
      if (unDeal[i].dictValue == hadTags[j]) {
       unDeal[i].status = '1';
      }
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
  // console.log(this.data.labelNum)

  var _this = this;
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
 // 上传形象照
 uploadImg: function() {
  var _this = this;
  if (_this.data.personImgs.length > 6) {
   console.log(_this.data.personImgs)
   _this.popToast('最多上传6张图片！');
   return false;
  }

  wx.chooseImage({
   sourceType: ['album', 'camera'], // 可选择性开放访问相册、相机
   count: 6, // 仅能上传6张
   success(res) {
    console.error(JSON.stringify(res));
    // 返回的数数组，可多选
    var tempFilePath = res.tempFilePaths;

    _this.setData({
     // personImgs: _this.data.personImgs.concat(tempFilePath),
     personImgAll: tempFilePath
    })
    // 上传图片
    // 显示后进行上传(微信小程序只能单个文件上传)
    _this.data.imagNum = 0;
    for (var i = 0, len = _this.data.personImgAll.length; i < len; i++) {
     _this.fileUpLoad(_this.data.personImgAll[i], _this.data.personImgAll.length);
    }

   }
  })
 },
 // 预览图片
 perviewPic: function(e) {

  var thisPic = e.currentTarget.dataset.pic;
  // console.log(thisPic);
  var urls = [];
  urls.push(thisPic)
  wx.previewImage({
   urls: urls,
  })
 },
 // 图片上传
 fileUpLoad: function(path, num) {
  // console.error(path + '这是上传图片路径');
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

     // app.globalData.saveWhDetail.personalImgs = response.data.fileName + ',' + app.globalData.saveWhDetail.personalImgs;
     _this.data.personImgs.push(response.data.fileName);
     if (_this.data.imagNum == num) {
      _this.setData({
       personImgs: _this.data.personImgs,
      })

      console.error(_this.data.personImgs);
      wx.showToast({
       title: '上传完成',
      })
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
 // 下一步
 skipNext: function() {
  var _this = this;
  var abilityIds = '';
  for (var i = 0, len = _this.data.labelArr.length; i < len; i++) {
   if (_this.data.labelArr[i].status == '1') {
    // 已选
    abilityIds += _this.data.labelArr[i].id + ','
   }
  }

  if (abilityIds == '') {
   _this.popToast('请选择标签！');
   return false;
  } else if (_this.data.personImgs == '') {
   _this.popToast('请上传形象照！');
   return false;
  } else if (_this.data.personImgs.length > 6) {
   console.log(_this.data.personImgs)
   _this.popToast('最多上传6张图片！');
   return false;
  }
  // 存储已选的标签
  app.globalData.saveWhDetail.tagIds = abilityIds;

  // 形象照未更改
  // if (_this.data.personImgAll.length == 0) {
  // 下一步
  var tempArr = '';
  for (var i in _this.data.personImgs) {
   tempArr = _this.data.personImgs[i] + ',' + tempArr;
  }
  app.globalData.saveWhDetail.personalImgs = tempArr.substr(0, tempArr.lastIndexOf(','));
  wx.navigateTo({
   url: '../personfile3/personfile3',
  })
  // return false;
  // }

  // // 显示后进行上传(微信小程序只能单个文件上传)
  // _this.data.imagNum = 0;
  // for (var i = 0, len = _this.data.personImgAll.length; i < len; i++) {
  //  _this.fileUpLoad(_this.data.personImgAll[i], _this.data.personImgAll.length);
  // }

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
  var index = e.currentTarget.dataset.index;
  _this.data.personImgs.splice(index, 1);
  // _this.data.personImgAll.splice(index, 1);

  _this.setData({
   personImgs: _this.data.personImgs,
   // personImgAll: _this.data.personImgAll
  })
  // var tempArr = '';
  // for (var i in _this.data.personImgs) {
  //  tempArr = _this.data.personImgs[i] + ',' + tempArr;
  // }
  // app.globalData.saveWhDetail.personalImgs = tempArr.substr(0, tempArr.lastIndexOf(','))
  wx.showToast({
   title: '删除成功',
   icon: 'none'
  })
  // console.error(_this.data.personImgAll + '图片')
 }
})