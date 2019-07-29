// pages/mine/identificationoffer/identificationoffer.js
//获取应用实例
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  cardPic1: '', // 正面
  cardPic2: '', // 反面
  inviteCode: '', // 邀请码
  defaultCard: '../../image/wx-default.png', // 默认的上传图片
  // 这是picker选择器默认的数组
  multiArray: [],
  // 这是转化后的数组
  objectArrayDiseaseData: [],
  multiIndex: [0, 0, 0], // 这是每一列选择的下标
 },
 bindMultiPickerChange: function(e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  // this.setData({
  //  multiIndex: e.detail.value
  // })
 },
 // 每一列的数据发生改变
 //这个是主要的，改变选项即会触发
 bindMultiPickerColumnChange: function(e) {
  var _this = this;
  console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  var multiArray = this.data.multiArray;
  var multiIndex = this.data.multiIndex;
  multiIndex[e.detail.column] = e.detail.value;
  switch (e.detail.column) {
   case 0: //改变第一列
    console.log(multiIndex);
    multiIndex[1] = 0; //将二、三列的index设为0，即第一个值
    multiIndex[2] = 0;
    //设置二、三列的列表
    multiArray[1] = this.data.objectArrayDiseaseData[multiIndex[0]].childsList;
    multiArray[2] = this.data.objectArrayDiseaseData[multiIndex[0]].childsList[0].childsList;
    console.log(multiArray[2][multiIndex[2]].name + '1111');
    break;
   case 1: //改变第二列
    console.log(multiIndex);
    multiIndex[2] = 0;
    //设置第三列列表
    multiArray[2] = this.data.objectArrayDiseaseData[multiIndex[0]].childsList[multiIndex[1]].childsList;
    console.log(multiIndex);
    break;
  }
  this.setData({ //将设置好的列表和选项index赋值
   multiArray: [multiArray[0], multiArray[1], multiArray[2]],
   multiIndex: multiIndex,
   //id: this.data.objectArrayDiseaseData[multiIndex[0]].childsList[multiIndex[1]].childsList[multiIndex[2]].id
  });
  //这里可以获取到最后一列选项对应的id


  if (_this.data.multiArray[2][multiIndex[2]].id == '' && multiArray[1][multiIndex[1]].id != '') {
   console.log('这是第三项无');
   app.globalData.stepOneData1.industryId = _this.data.multiArray[1][multiIndex[1]].id;
  } else if (_this.data.multiArray[2][multiIndex[2]].id == '' && multiArray[1][multiIndex[1]].id == '') {
   console.log('这是第二项无');
   app.globalData.stepOneData1.industryId = _this.data.multiArray[0][multiIndex[0]].id;
  } else if (_this.data.multiArray[2][multiIndex[2]].id != '' && multiArray[1][multiIndex[1]].id != '') {
   app.globalData.stepOneData1.industryId = _this.data.multiArray[2][multiIndex[2]].id;
  }
  console.log(this.data.multiIndex)
  console.error(app.globalData.stepOneData1.industryId + '这是选择的行业类型');
 },
 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  console.log(app.globalData.stepOneData);
  this.setData({
   inviteCode: app.globalData.inviteCode
  })
  app.globalData.stepOneData1.inviteCode = this.data.inviteCode;
  this.getSellerTagRepo();
 },
 // 获取商家的行业选择
 getSellerTagRepo: function() {
  var _this = this;
  var params = {};
  app.fetch('/hone/applet/dict/sellerTagRepo', params).then((response) => {

   // 数据返回成功
   if (response.errorCode == '0') {
    var unDeal = response.data.sellerTagList;

    // 第一层数据
    var floorOne = [];
    // 第二层数据
    var floorTwo = [];
    // 第三层数据
    var floorThree = [];

    // 处理非空情况
    // 如果childsList为null自动添加下空数组
    // if (unDeal) {
    //  for (var i = 0, len = unDeal.length; i < len; i++) {
    //   if (unDeal[i].childsList) {
    //    for (var j = 0, len1 = unDeal[i].childsList.length; j < len1; j++) {
    //     if (!unDeal[i].childsList[j].childsList) {
    //      console.log('第二层的第' + j + '下面没有子元素');
    //      unDeal[i].childsList[j].childsList = [{
    //       id: '',
    //       name: '无',
    //       childsList: null
    //      }]
    //     }
    //    }
    //   } else {
    //    console.log('第一层的第' + i + '下面没有子元素');
    //    unDeal[i].childsList = [{
    //     id: '',
    //     name: "无",
    //     childsList: [{
    //      id: '',
    //      name: "无",
    //      childsList: null
    //     }]
    //    }]
    //   }
    //  }
    // }
    // console.log(JSON.stringify(unDeal) + '之前的数据')
    var newDeal = unDeal.filter(item => item.childsList);
  
    
    for (var i = 0, len = newDeal.length; i < len; i++) {
     for (var j = 0, len1 = newDeal[i].childsList.length; j < len1; j++) {
      var newDeal1 = newDeal[i].childsList.filter(item => item.childsList);
      newDeal[i].childsList = newDeal1; 
      }
     }
    // console.log(JSON.stringify(newDeal) + '去空后的数据filter')
    unDeal = newDeal;
    if (unDeal) {
     for (var i = 0, len = unDeal.length; i < len; i++) {
      // 处理第一层数据
      floorOne.push({
       id: unDeal[i].id,
       name: unDeal[i].name
      })
      if (unDeal[i].childsList) {
       for (var j = 0, len1 = unDeal[i].childsList.length; j < len1; j++) {
        floorTwo.push({
         id: unDeal[i].childsList[j].id,
         name: unDeal[i].childsList[j].name
        })

        if (unDeal[i].childsList[j].childsList) {
         for (var r = 0, len2 = unDeal[i].childsList[j].childsList.length; r < len2; r++) {
          floorThree.push({
           id: unDeal[i].childsList[j].childsList[r].id,
           name: unDeal[i].childsList[j].childsList[r].name
          })
         }
        }
       }
      }
     }
    }
    var multiArray = [];
    multiArray[0] = floorOne;
    multiArray[1] = floorTwo;
    multiArray[2] = floorThree;
    // console.error(JSON.stringify(multiArray));

    _this.setData({
     objectArrayDiseaseData: unDeal,
     multiArray: multiArray
    })

    if (_this.data.multiArray[2][0].id == '' && multiArray[1][0].id != '') {
     console.log('这是第三项无');
     app.globalData.stepOneData1.industryId = _this.data.multiArray[1][0].id;
    } else if (_this.data.multiArray[2][0].id == '' && multiArray[1][0].id == '') {
     console.log('这是第二项无');
     app.globalData.stepOneData1.industryId = _this.data.multiArray[0][0].id;
    } else if (_this.data.multiArray[2][0].id != '' && multiArray[1][0].id != '') {
     app.globalData.stepOneData1.industryId = _this.data.multiArray[2][0].id;
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
      case '1':
       // 身份证正面
       app.globalData.stepOneData1.idCardUpPic = response.data.fileName;
       _this.setData({
        cardPic1: response.data.fileName
       })
       break;
      case '2':
       // 身份证反面
       app.globalData.stepOneData1.idCardDownPic = response.data.fileName;
       _this.setData({
        cardPic2: response.data.fileName
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
 skipModel: function() {
  var type = 'shenfenzheng';
  wx.navigateTo({
   url: '../template1/template1?id=' + type,
  })
 },
 // 获取邀请码
 getInviteCode: function(e) {
  // 
  app.globalData.stepOneData1.inviteCode = e.detail.value;
 },
 // 获取填写的身份证
 getCardId: function(e) {
  // 
  app.globalData.stepOneData1.idCardNumber = e.detail.value;
 },
 // 下一步
 skipNext: function() {
  // 非空校验
  var _this = this;
  app.globalData.stepOneData1.userId = app.globalData.userId;
  app.globalData.stepOneData1.openid = app.globalData.openid;
  console.log(JSON.stringify(app.globalData.stepOneData1) + '111');
  if (!app.globalData.stepOneData1.idCardNumber || app.globalData.stepOneData1.idCardNumber == '') {
   _this.popToast('请输入身份证号！');
   return false;
  } else if (!app.string.idcard.validate(app.globalData.stepOneData1.idCardNumber)) {
   _this.popToast('请输入正确的身份证号！');
   return false;
  } else if (!app.globalData.stepOneData1.idCardUpPic || app.globalData.stepOneData1.idCardUpPic == '') {
   _this.popToast('请上传身份证正面照！');
   return false;
  } else if (!app.globalData.stepOneData1.idCardDownPic || app.globalData.stepOneData1.idCardDownPic == '') {
   _this.popToast('请上传身份证反面照！');
   return false;
  }

  wx.navigateTo({
   url: '../identificationoffer2/identificationoffer2',
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
    if (type == '1') {
     _this.setData({
      cardPic1: ''
     })
     app.globalData.stepOneData1.idCardUpPic = '';
    } else if (type == '2') {
     _this.setData({
      cardPic2: ''
     })
     app.globalData.stepOneData1.idCardDownPic = '';
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
 }
})