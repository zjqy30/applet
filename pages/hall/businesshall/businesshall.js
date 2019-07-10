// 订单大厅
// 获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOpen: 1,
    stationType: '1',
    isShow: false,
    // isShow2:false
    isCheck: false,
    orderList: [],
    hasData: false,
    pageNumber: '1',
    stationArray: [],
    labelArray: [],
    selectedNum: 0, // 已选平台的计数
    selectedNum1: 0, // 更多的基数，暂时不用
    selectedStation: '', // 已选的平台
    selectedLabel: '', // 已选的标签
    selectFans: '', // 已选的粉丝要求
    selectOrder: '', // 无须desc/asc,已选的价格排序
    hasmore: 'none',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取网红列表
    this.getOrder();
    // 获取平台
    this.getWHdic('platType');
    // 获取标签--更多
    this.getWHdic('label');
  },
  // 点击tab
  clickSelect: function(e) {
    var type = e.currentTarget.dataset.type;
    this.setData({
      stationType: type,
      isShow: !this.data.isShow
    })
    if (type == '3') {
      // 价格排序点击
      if (this.data.selectOrder == 'desc') {
        this.setData({
          selectOrder: 'asc'
        })
      } else {
        this.setData({
          selectOrder: 'desc'
        })
      }
      this.setData({
        orderList: [],
        selectedLabel: '',
        selectedStation: '',
        selectSex: ''
      })
      this.getOrder();
    } else if (type == '2') {
      // 粉丝要求
      // 价格排序点击
      if (this.data.selectFans == 'desc') {
        this.setData({
          selectFans: 'asc'
        })
      } else {
        this.setData({
          selectFans: 'desc'
        })
      }
      this.setData({
        orderList: [],
        selectedLabel: '',
        selectedStation: '',
        selectSex: ''
      })
      this.getOrder();
    }
  },
  // 点击平台
  clickStation: function(e) {
    var id = e.currentTarget.dataset.id;
    var status = e.currentTarget.dataset.status;
    for (var i = 0, len = this.data.stationArray.length; i < len; i++) {
      if (this.data.stationArray[i].id == id) {
        if (status == '0') {
          if (this.data.stationArray[i].id != '') {
            this.data.selectedNum++;
          } else {
            this.data.selectedNum = this.data.stationArray.length;
          }

          // 未选变已选
          this.data.stationArray[i].status = '1';
        } else if (status == '1') {
          // 已选变未选
          if (this.data.stationArray[i].id != '') {
            this.data.selectedNum--;
          } else {
            this.data.selectedNum = 0;
          }
          this.data.stationArray[i].status = '0';
        }
      }
    }
    // console.log(this.data.selectedNum);
    this.setData({
      stationArray: this.data.stationArray,
      selectedNum: this.data.selectedNum
    })
  },
  // 点击标签
  clickLabel: function(e) {
    var id = e.currentTarget.dataset.id;
    var status = e.currentTarget.dataset.status;
    for (var i = 0, len = this.data.labelArray.length; i < len; i++) {
      if (this.data.labelArray[i].id == id) {
        if (status == '0') {
          // this.data.selectedNum1 ++;
          // 未选变已选
          this.data.labelArray[i].status = '1';
        } else if (status == '1') {
          // 已选变未选
          // this.data.selectedNum1 --;
          this.data.labelArray[i].status = '0';
        }
      }
    }
    // console.log(this.data.selectedNum1);
    this.setData({
      labelArray: this.data.labelArray,
      // selectedNum: this.data.selectedNum1
    })
  },
  // 重置标签
  clearAll: function() {
    for (var i = 0, len = this.data.stationArray.length; i < len; i++) {
      this.data.stationArray[i].status = '0';
    }
    for (var i = 0, len = this.data.labelArray.length; i < len; i++) {
      this.data.labelArray[i].status = '0';
    }
    // console.log(this.data.labelArray);
    this.setData({
      stationArray: this.data.stationArray,
      labelArray: this.data.labelArray,
      selectedNum: 0
    })
  },
  // 确定平台筛选
  sureStation: function(e) {
    this.setData({
      isShow: false
    })
    var selectedStation = '';
    for (var i = 0, len = this.data.stationArray.length; i < len; i++) {
      if (this.data.stationArray[i].status == '1') {
        selectedStation += this.data.stationArray[i].id + ',';
      }
    }
    this.data.selectedStation = selectedStation;
    this.setData({
      orderList: [],
      selectedLabel: '',
      selectSex: '',
      selectOrder: '',
      pageNumber: '1',
    })
    this.getOrder();
  },
  // 确定标签筛选
  sureLabel: function(e) {
    this.setData({
      isShow: false
    })
    var selectedLabel = '';
    for (var i = 0, len = this.data.labelArray.length; i < len; i++) {
      if (this.data.labelArray[i].status == '1') {
        selectedLabel += this.data.labelArray[i].id + ',';
      }
    }
    this.data.selectedLabel = selectedLabel;
    this.setData({
      orderList: [],
      selectedStation: '',
      selectSex: '',
      selectOrder: '',
      pageNumber: '1',
    })
    this.getOrder();
  },
  // 性别选择
  radioChange: function(e) {
    this.setData({
      isShow: false
    })
    // console.log(JSON.stringify(e) + '****这是单选按钮');
    // 取选中的标签
    this.data.selectSex = e.detail.value;
    this.setData({
      orderList: [],
      selectedLabel: '',
      selectedStation: '',
      selectOrder: '',
      pageNumber: '1',
    })
    this.getOrder();
  },
  // 粉丝排序
  fansOrder: function() {

  },
  // 获取订单列表
  getOrder: function() {
    var _this = this;
    var params = {
      "pageNumber": _this.data.pageNumber,
      "pageSize": "10",
      "tag": _this.data.selectedLabel, // 标签,多个用逗号隔开
      "fansNumsOrderBy": _this.data.fansOrder, // 粉丝的排序
      "priceOrderBy": _this.data.selectOrder, // asc升序
      "platIds": _this.data.selectedStation
    }
    app.fetch('/hone/applet/offer/list', params).then((response) => {
      // 数据返回成功0
      // console.log(response);
      if (response.errorCode == '0') {
        var unDeal = response.data.pageData.list;
        if (unDeal.length != 0) {
          for (var i = 0, len = unDeal.length; i < len; i++) {
            var tagArr = unDeal[i].tag.split(',');
            unDeal[i].tagArr = tagArr;
          }

          this.setData({
            orderList: _this.data.orderList.concat(response.data.pageData.list)
          })
        } else {
          this.setData({
            hasData: true
          })
        }
        wx.hideLoading();
      } else {
        // 数据返回失败
        wx.showToast({
          title: '数据返回失败' || '',
          icon: 'none'
        })
        wx.hideLoading();
      }
    })
  },
  // 获取网红平台/标签
  getWHdic: function(type) {
    var _this = this;

    var params = {
      type: type
    }
    app.fetch('/hone/applet/dict/listByType', params).then((response) => {
      // 数据返回成功
      if (response.errorCode == 0) {
        var unDeal = response.data.dictList;
        unDeal.unshift({
          "id": "",
          "createDate": "",
          "updateDate": "",
          "enableFlag": "",
          "dictType": type,
          "dictValue": "全部",
          "dictDesc": "00",
          "dictSort": "",
          "pid": "",
          "dictPic": null
        })
        for (var i = 0, len = unDeal.length; i < len; i++) {
          unDeal[i].status = '0';
        }
        if (type == 'platType') {
          _this.setData({
            stationArray: unDeal
          })
        } else if (type == 'label') {
          _this.setData({
            labelArray: unDeal
          })
        }
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
  getWHLabel: function() {
    var _this = this;

    var params = {
      pages: '1'
    }
    app.fetch('/hone/applet/dict/listByType', params).then((response) => {
      // 数据返回成功
      if (response.data.custom && response.data.status.code == '200') {
        if (response.data.custom.code != '0') {

        } else {
          wx.showToast({
            title: response.data.custom.text || '',
            icon: 'none'
          })
        }

      } else {
        // 数据返回失败
        wx.showToast({
          title: response.data.custom.text || '',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户上拉
   */
  onReachBottom: function() {
    console.log('触到底部');
    if (this.data.hasmore != 'block') {
      console.log('触到底部');
      this.loadMore();
    }
  },
  // 上拉加载更多
  loadMore: function() {
    var _this = this;
    wx.showLoading({
      title: '拼命加载中...'
    });
    var nowpage = parseInt(_this.data.pageNumber) + 1;
    _this.setData({
      pageNumber: nowpage
    });
    _this.getOrder();
  },
  /**
* 页面相关事件处理函数--监听用户下拉动作
*/
  onPullDownRefresh: function () {
    this.refresh();
  },
  /*
 *刷新
 */
  refresh: function () {
    wx.showLoading({
      title: '拼命刷新中...'
    });
    this.setData({
      orderList: [],
      selectedLabel: '',
      selectedStation: '',
      selectOrder: '',
      selectFans:'',
      pageNumber: '1',
    })
    this.getOrder();
  },
  // 发布需求订单
  clickPublic: function() {
    wx.navigateTo({
      url: '',
    })
  },

})