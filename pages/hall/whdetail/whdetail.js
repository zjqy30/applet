// 网红详情页
// 获取应用实例
const app = getApp();
import F2 from '../../component/f2-canvas/lib/f2';
let chart = null;

Page({
 data: {
  whId: '', // 网红id
  defaultImg: ['../../image/wx_nopic.png'],
  userExtraInfo: '',
  userBasicInfo: '',
  personalImgs: [],
  perImgLength: 0,
  currentIndex: 1,
  serviceTemplateList: [], // 服务类型
  genderDatas: [],
  type: null, // 粉丝画像类型1城市，2性别，3年龄，4星座
  isShow: false // 商家确认锁单提醒
 },
 onLoad: function(options) {
 
  this.setData({
   whId: options.whId,
   offerId: options.offerId,
   pageType: options.pageType,
  })
  if(options.webnum){
   console.log(options.webnum + '返回页面');
   this.data.webnum = options.webnum;
  }
  
  // 获取网红的基本信息
  this.getWhDetail();
  // 获取粉丝画像
  this.getFansData();
  // 是否收藏
  this.isCollect();
 },
 // 获基本信息
 getWhDetail: function() {
  var _this = this;
  var params = {
   userId: _this.data.whId
  }
  app.fetch('/hone/applet/userBasic/userStarInfo', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    var unDeal = response.data;
    // 后期请确认地区显示
    if (unDeal.userBasicInfo.country.indexOf('上海') != -1) {
     unDeal.userBasicInfo.country = '上海';
    } else if (unDeal.userBasicInfo.country.indexOf('天津') != -1) {
     unDeal.userBasicInfo.country = '天津';
    } else if (unDeal.userBasicInfo.country.indexOf('北京') != -1) {
     unDeal.userBasicInfo.country = '北京';
    } else if (unDeal.userBasicInfo.country.indexOf('重庆') != -1) {
     unDeal.userBasicInfo.country = '重庆';
    } else if (unDeal.userBasicInfo.country.indexOf('香港') != -1) {
     unDeal.userBasicInfo.country = '香港';
    } else if (unDeal.userBasicInfo.country.indexOf('澳门') != -1) {
     unDeal.userBasicInfo.country = '澳门';
    } else if (unDeal.userBasicInfo.country.indexOf('区') != -1) {
     unDeal.userBasicInfo.country = unDeal.userBasicInfo.country.substr(0, unDeal.userBasicInfo.country.indexOf('区')+1);
    } else if (unDeal.userBasicInfo.country.indexOf('省') != -1) {
     unDeal.userBasicInfo.country = unDeal.userBasicInfo.country.substr(0, unDeal.userBasicInfo.country.indexOf('省'));
    }else{
     unDeal.userBasicInfo.country = '暂无';
    }

    // 粉丝数
    unDeal.userExtraInfo.fansNums = parseInt(parseInt(unDeal.userExtraInfo.fansNums) / 10000);
    if (unDeal.userExtraInfo.fansNums < 1) {
     unDeal.userExtraInfo.fansNums = 1;
    }
    unDeal.userExtraInfo.thumbUpNums = parseInt(parseInt(unDeal.userExtraInfo.thumbUpNums) / 10000);
   
    // 形象照
    var imgsArr = [];

    if (unDeal.userExtraInfo.personalImgs) {
     if (unDeal.userExtraInfo.personalImgs.indexOf(',') == '-1') {
      // 未找到,说明只有一张照片
      imgsArr.push(unDeal.userExtraInfo.personalImgs);
     } else {
      // 多张照片
      imgsArr = unDeal.userExtraInfo.personalImgs.split(',');
      // imgsArr.splice(imgsArr.length - 1, 1);
     }
    } else {
     imgsArr = ['../../image/wx_nopic.jpg'];
    }

    // 个人简介
    if (!unDeal.userBasicInfo.personalIntroduce) {
     unDeal.userBasicInfo.personalIntroduce = '暂无';
    }
    console.log(_this.data.personalImgs)
    _this.setData({
     userExtraInfo: unDeal.userExtraInfo,
     userBasicInfo: unDeal.userBasicInfo,
     personalImgs: _this.data.personalImgs.concat(imgsArr),
     perImgLength: imgsArr.length,
    })
    // console.log(userBasicInfo);
   } else {
    // 数据返回失败
    wx.showToast({
     title: '数据获取失败' || '',
     icon: 'none'
    })
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
 // 粉丝画像切换
 changeType: function(e) {
  var type = e.currentTarget.dataset.type;
  this.setData({
   type: type
  })
 },
 // 获取粉丝画像
 getFansData: function() {
  var _this = this;
  var params = {
   userId: _this.data.whId,
   platId: '',
   platUserId: ''
  }
  app.fetch('/hone/applet/suantao/fanPortraits', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {

    var unDeal = JSON.parse(response.data.content);

    // 城市数据
    var tempCity = [];
    for (var i = 0, len = unDeal.citys.length; i < len; i++) {
     tempCity.push({
      year: unDeal.citys[i].city,
      sales: unDeal.citys[i].ratio
     })
    }

    _this.data.cityDatas = tempCity;
    _this.setData({
     cityDatas: tempCity
    })

    // 性别
    var tempGender = [];
    for (var i = 0, len = unDeal.genders.length; i < len; i++) {
     // name为字符串
     if (unDeal.genders[i].gender == 0) {
      unDeal.genders[i].gender = '男';
     } else {
      unDeal.genders[i].gender = '女';
     }
     tempGender.push({
      name: unDeal.genders[i].gender,
      percent: unDeal.genders[i].ratio
     })
    }

    _this.data.genderDatas = tempGender;

    // 年龄
    var tempAge = [];
    var tempAge1 = [];
    for (var i = 0, len = unDeal.ages.length; i < len; i++) {
     switch (unDeal.ages[i].age_part) {
      case 1:
       unDeal.ages[i].ageArea = '6-17';
       tempAge1[0] = unDeal.ages[i];
       break;
      case 2:
       unDeal.ages[i].ageArea = '17-24';
       tempAge1[1] = unDeal.ages[i];
       break;
      case 3:
       unDeal.ages[i].ageArea = '24-30';
       tempAge1[2] = unDeal.ages[i];
       break;
      case 4:
       unDeal.ages[i].ageArea = '30-35';
       tempAge1[3] = unDeal.ages[i];
       break;
      case 5:
       unDeal.ages[i].ageArea = '35-40';
       tempAge1[4] = unDeal.ages[i];
       break;
      case 6:
       unDeal.ages[i].ageArea = '40+';
       tempAge1[5] = unDeal.ages[i];
       break;
     }
    }

    for (var i = 0, len = tempAge1.length; i < len; i++) {
     tempAge.push({
      year: tempAge1[i].ageArea,
      sales: tempAge1[i].ratio
     })
    }

    _this.data.ageDatas = tempAge;
    // 星座
    var tempStar = [];
    for (var i = 0, len = unDeal.constellations.length; i < len; i++) {
     // name为字符串

     tempStar.push({
      name: unDeal.constellations[i].constellation,
      percent: unDeal.constellations[i].ratio
     })
    }
    _this.data.starDatas = tempStar;

    console.log(JSON.stringify(_this.data.cityDatas) + '城市');
    console.log(JSON.stringify(_this.data.genderDatas) + '性别');
    console.log(JSON.stringify(_this.data.ageDatas) + '年龄');
    console.log(JSON.stringify(_this.data.starDatas) + '星座');
    // 初始化图表
    _this.initChart();

   } else {
    // 数据返回失败
    wx.showToast({
     title: '数据获取失败' || '',
     icon: 'none'
    })
   }
  })
 },
 // 初始化图表
 initChart: function() {

  var _this = this;
  // 柱状-city
  function cityData(canvas, width, height) {
   const data = _this.data.cityDatas;
   chart = new F2.Chart({
    el: canvas,
    width,
    height
   });

   chart.source(data, {
    sales: {
     tickCount: 6
    }
   });
   chart.tooltip({
    showItemMarker: false,
    onShow(ev) {
     const {
      items
     } = ev;
     items[0].name = null;
     items[0].name = items[0].title;
     items[0].value = '' + items[0].value;
    }
   });
   chart.interval().position('year*sales').color(['#F03D37']);
   chart.render();
   return chart;
  }
  // 柱状-age
  function ageData(canvas, width, height) {
   const data = _this.data.ageDatas;
   chart = new F2.Chart({
    el: canvas,
    width,
    height
   });

   chart.source(data, {
    sales: {
     tickCount: 6
    }
   });
   chart.tooltip({
    showItemMarker: false,
    onShow(ev) {
     const {
      items
     } = ev;
     items[0].name = null;
     items[0].name = items[0].title;
     items[0].value = ' ' + items[0].value;
    }
   });
   chart.interval().position('year*sales').color(['#F03D37']);
   chart.render();
   return chart;
  }

  // 圆形
  function genderData(canvas, width, height) {
   const data = _this.data.genderDatas;
   chart = new F2.Chart({
    el: canvas,
    width,
    height
   });
   chart.source(data, {
    percent: {
     formatter(val) {
      return val * 100 + '%';
     }
    }
   });
   chart.legend({
    position: 'right',
    itemFormatter(val) {
     let item = data.find(item => item.name == val)
     return val + ' ' + (item.percent * 100).toFixed(0) + '%';
    }
   });
   chart.tooltip(false);
   chart.coord('polar', {
    transposed: true,
    radius: 0.85
   });
   chart.axis(false);
   chart.interval()
    .position('a*percent')
    .color('name', ['#1890FF', '#13C2C2'])
    .adjust('stack')
    .style({
     lineWidth: 0.5,
     stroke: '#fff',
     lineJoin: 'round',
     lineCap: 'round'
    })
    .animate({
     appear: {
      duration: 1000,
      easing: 'bounceOut'
     }
    });

   chart.render();
   return chart;
  }
  // 圆形-星座
  function starData(canvas, width, height) {
   const data = _this.data.starDatas;
   chart = new F2.Chart({
    el: canvas,
    width,
    height
   });
   chart.source(data, {
    percent: {
     formatter(val) {
      return val * 100 + '%';
     }
    }
   });
   chart.legend({
    position: 'right',
    itemFormatter(val) {
     let item = data.find(item => item.name == val)
     return val + ' ' + (item.percent * 100).toFixed(0) + '%';
    }
   });
   chart.tooltip(false);
   chart.coord('polar', {
    transposed: true,
    radius: 0.85
   });
   chart.axis(false);
   chart.interval()
    .position('a*percent')
    .color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#FF6600', '#2C72C7', '#E85A90', '#B33D5A', '#FE9431', '#E890B0', '#C0ABFF', '#90D8E8', '#9EFFA3'])
    .adjust('stack')
    .style({
     lineWidth: 0.5,
     stroke: '#fff',
     lineJoin: 'round',
     lineCap: 'round'
    })
    .animate({
     appear: {
      duration: 1000,
      easing: 'bounceOut'
     }
    });

   chart.render();
   return chart;
  }
  console.error(_this.data.type + '类型');
  _this.setData({
   type: '1',
   cityData: {
    onInit: cityData // 城市画像
   },
   ageData: {
    onInit: ageData // 画像
   },
   genderData: {
    onInit: genderData // 性别画像
   },
   starData: {
    onInit: starData // 画像
   }
  })
 },
 // 轮播图切换图片时计数改变
 changePic: function(e) {
  // console.log(JSON.stringify(e));
  this.setData({
   currentIndex: e.detail.current + 1,
  })
 },
 // 点击收藏
 toCollect: function() {

  console.error('点击收藏啦');
  var _this = this;
  if (app.globalData.ifApproved != '1') {
   // 未认证或审核
   wx.showToast({
    title: '请先进行身份认证！',
    icon: 'none'
   })
  } else {
   if (_this.data.isCollect == '0') {
    // 收藏
    _this.saveCollect();
   } else {
    // 取消收藏
    _this.cancelCollect();
   }
  }
 },
 // 保存收藏
 saveCollect: function() {
  var _this = this;
  var params = {
   userId: app.globalData.userId,
   objectId: _this.data.whId
  }
  app.fetch('/hone/applet/collect/save', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    _this.isCollect();
    wx.showToast({
     title: '收藏成功',
     icon: 'none'
    })
   } else {
    // 数据返回失败
    wx.showToast({
     title: '收藏失败，请稍后再试' || '',
     icon: 'none'
    })
   }
  })
 },
 // 取消收藏
 cancelCollect: function() {
  var _this = this;
  var params = {
   userId: app.globalData.userId,
   objectId: _this.data.whId
  }
  app.fetch('/hone/applet/collect/cancel', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    _this.isCollect();

    wx.showToast({
     title: '已取消收藏',
     icon: 'none'
    })
   } else {
    // 数据返回失败
    wx.showToast({
     title: '收藏失败，请稍后再试' || '',
     icon: 'none'
    })
   }
  })
 },
 // 是否收藏
 isCollect: function() {
  var _this = this;
  var params = {
   userId: app.globalData.userId,
   objectId: _this.data.whId
  }
  app.fetch('/hone/applet/collect/ifCollect', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    if (response.data.ifCollect == '1') {
     _this.setData({
      isCollect: '1'
     })
    } else {
     _this.setData({
      isCollect: '0'
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
 // 联系经纪人
 callContact: function(e) {
  wx.makePhoneCall({
   phoneNumber: '400-6033-235',
   success: function(res) {},
   fail: function(res) {},
   complete: function(res) {},
  })
 },
 // 从商家发布中选择网红的订单列表进入，进行锁单操作
 lockOrder: function() {
  var _this = this;
  _this.setData({
   isShow: !_this.data.isShow
  })
 },
 closePop: function() {
  var _this = this;
  _this.setData({
   isShow: !_this.data.isShow
  })
 },
 // 商家锁单
 sureLockOrder: function() {
  var _this = this;
  var params = {
   offerId: _this.data.offerId,
   userId: _this.data.whId
  }
  app.fetch('/hone/applet/offer/lock', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    wx.navigateBack({
     delta: parseInt(_this.data.webnum)
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