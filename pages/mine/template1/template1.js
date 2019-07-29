Page({
  data: {

  },
  onLoad: function (options) {
    console.log(options.id);
    if (options.id == 'pingtai') {
      this.setData({
        mode_img: 'cloud://hongwan-5b0f54.686f-hongwan-5b0f54/system/mode/pingtai.jpg'
      })
    } else if (options.id == "shouchi") {
      this.setData({
        mode_img: 'cloud://hongwan-5b0f54.686f-hongwan-5b0f54/system/mode/shouchi.jpg'
      })
    } else if (options.id == "shenfenzheng") {
      this.setData({
        mode_img: 'cloud://hongwan-5b0f54.686f-hongwan-5b0f54/system/mode/shenfenzheng.jpg'
      })
    } else if (options.id == "yingyezhizhao") {
      this.setData({
        mode_img: 'cloud://hongwan-5b0f54.686f-hongwan-5b0f54/system/mode/yingyezhizhao.jpg'
      })
    } else if (options.id == "shouquanzyhengshu") {
      this.setData({
        mode_img: 'cloud://hongwan-5b0f54.686f-hongwan-5b0f54/system/mode/shouquanzyhengshu.jpg'
      })
    }
  },

  onReady: function () {

  },
  back: function (res) {
    wx.navigateBack({
      delta: 1,
    })
  },
  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})