// 商家需求模板
const app = getApp();
Page({

 /**
  * 页面的初始数据
  */
 data: {
  typeArr: [],
  isShow: true, // 控制底部弹出
  priceItem: '',
  priceArr: [],
  selectPrice: [],
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function(options) {
  this.getServiceTemplate();
 },
 // 获取服务类型
 getServiceTemplate: function() {
  var _this = this;
  var params = {};
  app.fetch('/hone/applet/offerTemplate/list', params).then((response) => {
   // 数据返回成功
   if (response.errorCode == '0') {
    var unDeal = response.data.templateList;
    _this.setData({
     typeArr: unDeal,
     selectPrice: _this.data.selectPrice
    })
    console.log(_this.data.typeArr)
   } else {
    // 数据返回失败
    wx.showToast({
     title: response.msg || '',
     icon: 'none'
    })
   }
  })
 },
 // 获取价格
 getprice: function(e) {
  console.log(e.detail.value);
  var _this = this;
  var index = e.currentTarget.dataset.index;
  _this.data.minprice = e.currentTarget.dataset.minprice;
  _this.data.maxprice = e.currentTarget.dataset.maxprice;
  _this.data.tplid = e.currentTarget.dataset.tplid;
  _this.data.tpltitle = e.currentTarget.dataset.templatename;
  _this.data.price = e.detail.value;
  console.log(_this.data);
 },
 // 判断价格
 jugeprice: function(e) {

 },
 // 点击多选框
 checkboxChange: function(e) {
  var _this = this;
  console.log(JSON.stringify(e));
  app.globalData.creatOrderData.templateId = e.detail.value;
  for (var i = 0, len = _this.data.typeArr.length; i < len; i++) {
   if (e.detail.value == _this.data.typeArr[i].id) {
    app.globalData.creatOrderData.templateName = _this.data.typeArr[i].title;
   }
  }
  console.log(app.globalData.creatOrderData)
 },
 // 选择服务类型，弹出价格选择
 // selectPrice: function(e) {
 //  var _this = this;
 //  console.error(_this.data.typeArr);
 //  var which = e.currentTarget.dataset.which;
 //  _this.data.selectPrice[which] = _this.data.typeArr[which].priceArr[e.detail.value];
 //  _this.data.typeArr[which].price = _this.data.typeArr[which].priceArr[e.detail.value];
 //  // console.log('选择的价格', e.detail.value);
 //  _this.setData({
 //   priceItem: e.detail.value,
 //   selectPrice: _this.data.selectPrice
 //  })
 //  // 测试值
 //  app.globalData.creatOrderData.price = _this.data.typeArr[which].price;
 //  if (app.globalData.creatOrderData.price == '0.00' || app.globalData.creatOrderData.price == '' || !app.globalData.creatOrderData.price) {
 //   wx.showToast({
 //    title: '请选择价格！',
 //    icon: 'none'
 //   })
 //  }

 // },
 // 点击确定返回
 overBack: function() {
  var _this = this;
  // console.error(number(_this.data.price))
  if (!_this.data.price || !_this.data.tpltitle){
   wx.showToast({
    title: '请选择并输入价格！',
    icon: 'none'
   })
   return false;
  }

  if (parseFloat(_this.data.price) > parseFloat(_this.data.maxprice) || parseFloat(_this.data.price) < parseFloat(_this.data.minprice)) {
   wx.showToast({
    title: '请在规定区域内定制价格！',
    icon: 'none'
   })
   return false;
  }
 // 校验输入的格式
  if (isNaN(_this.data.price)) {
   wx.showToast({
    title: '请输入正确的价格！',
    icon: 'none'
   })
   return false;
  }
  // 存一下全局 
  app.globalData.creatOrderData.price = parseFloat(_this.data.price);
  app.globalData.creatOrderData.templateName = _this.data.tpltitle;
  app.globalData.creatOrderData.templateId = _this.data.tplid;

  wx.navigateBack({
   delta: '1'
  })
 }
})