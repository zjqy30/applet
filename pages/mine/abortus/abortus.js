// 获取应用实例
const app = getApp();
Page({
  data: {
    autohight: 10,
    user_admin: 'cloud://hongwan-5b0f54.686f-hongwan-5b0f54/system/user_admin.png',
    user_bg: 'cloud://hongwan-5b0f54.686f-hongwan-5b0f54/system/bg.png',
    loginName:'',
    loginPsd:''
  },
  onLoad: function () {
    var that = this;
    console.log(app.md5.hexMD5('1111'));
  },
  formSubmit: function (e) {
    var _this = this
    console.log(JSON.stringify(e)+'*****这是密码');
    _this.data.loginName = e.detail.value.Account_number;
    _this.data.loginPsd = e.detail.value.Password;

    if (_this.data.loginName == '' || _this.data.loginPsd == '') {
      wx.showToast({
        title: '请输入账号和密码后再登录',
        icon: 'none',
        duration: 1000,
      })
      return
    }
    // 管理员登录
    _this.managerLogin();
  },
  // 管理员登录
  managerLogin:function(){
    var _this = this;
    var params = {
      "userName": _this.data.loginName,
      "passWord": app.md5.hexMD5(_this.data.loginPsd + _this.data.loginName)
    }
    app.fetch('/hone/backend/sysUser/login', params).then((response) => {
      // 数据返回成功0
      // console.log(response);
      if (response.errorCode == '0') {
        

      } else {
        // 数据返回失败
        console.log('登录失败')
        wx.showToast({
          title: '账号或密码错误',
          icon: 'none',
          duration: 1000,
        })
      }
    })
  },
  gouser: function (res) {
    console.log('单击事件')
    var that = this
    that.setData({
      autohight: 10,
    })
    wx.pauseBackgroundAudio()
  },
  go_admin(res) {
    var that = this;
    console.log('长按事件')
    var hight = res.target.id
    that.setData({
      autohight: 688
    })
    // wx.playBackgroundAudio({
    //   dataUrl: 'http://www.170mv.com/kw/other.web.ra01.sycdn.kuwo.cn/resource/n2/79/5/3090040516.mp3',
    //   title: '欢迎进入后台系统',
    //   coverImgUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1541355659444&di=15915361b39acec0be52d25400dceb07&imgtype=0&src=http%3A%2F%2Fimg5q.duitang.com%2Fuploads%2Fitem%2F201409%2F08%2F20140908140908_EnvtG.thumb.700_0.png',
    //   success: function (res) {

    //   },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })

    console.log('开始执行，进入后台')
  }
});
