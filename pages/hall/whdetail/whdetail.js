// 获取应用实例
const app = getApp();
Page({
  data: {
    whId:'',
    userExtraInfo:{},
    userBasicInfo:{},
    tabMenu: ['城市', '性别', '年龄', '星座'],
    whId: ''
  },
  onLoad: function (options) {
    
    if (options.whId) {
      this.data.whId = options.whId;
      // 获取网红的基本信息
      this.getWhDetail();
    } else {
      this.data.whId = '9c4488c75cd37dcc0e8add4304529e2b';
      // 获取网红的基本信息
      this.getWhDetail();
    }
  },
  // 获基本信息
  getWhDetail: function () {
    var _this = this;
    var params = {
      userId: _this.data.whId
    }
    app.fetch('/hone/applet/userBasic/userStarInfo', params).then((response) => {
      // 数据返回成功
      if (response.errorCode == '0') {
        _this.setData({
          userExtraInfo: response.data.userExtraInfo,
          userBasicInfo: response.data.userBasicInfo
        })
        console.log(userBasicInfo);
      } else {
        // 数据返回失败
        wx.showToast({
          title: '数据获取失败' || '',
          icon: 'none'
        })
      }
    })
  },
  // 粉丝画像
  fansCount: function (e) {
    var that = this
    // 城市
    var stCitys = this.data.stsj.citys
    var stAges = this.data.stsj.ages
    var stGenders = this.data.stsj.genders
    var stConstellations = this.data.stsj.constellations
    function cvCity(canvas, width, height) {
      let data = stCitys.map(function (k) {
        let ret = {
          city: k.city,
          count: k.ratio
        }
        return ret;
      })
      console.log(data)
      chart = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chart.source(data, {
        count: {
          tickCount: 7,
          formatter: item => (item * 100).toFixed(1) + '%'
        }
      });
      chart.tooltip({
        showItemMarker: false,
        onShow(ev) {
          const {
            items
          } = ev;
          items[0].name = items[0].title;
          items[0].value = (items[0].origin.count * 100).toFixed(0) + '%';
        }
      });
      chart.interval().position('city*count');
      chart.render();
      return chart;
    }
    //  年龄
    function cvAge(canvas, width, height) {
      let data = stAges.map(function (k) {
        let ret = {
          age: k.age_part,
          count: k.ratio
        }
        switch (k.age_part) {
          case 1:
            ret.agename = '6-17'
            break;
          case 2:
            ret.agename = '17-24'
            break;
          case 3:
            ret.agename = '24-30'
            break;
          case 4:
            ret.agename = '30-35'
            break;
          case 5:
            ret.agename = '35-40'
            break;
          case 6:
            ret.agename = '40+'
            break;
        }
        return ret;
      }).sort(compare('age'))
      console.log('修改后的数据', data)
      chart = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chart.source(data, {
        count: {
          tickCount: 10,
          formatter: item => (item * 100).toFixed(0) + '%'
        }
      });
      chart.tooltip({
        showItemMarker: false,
        onShow(ev) {
          const {
            items
          } = ev;
          items[0].name = items[0].title + '岁';
          items[0].value = (items[0].origin.count * 100).toFixed(0) + '%';
        }
      });
      chart.interval().position('agename*count');
      chart.render();
      return chart;
    }
    // 性别
    function genderCur(canvas, width, height) {
      const map = {
        '男': (stGenders[1].ratio * 100).toFixed(0) + '%',
        '女': (stGenders[0].ratio * 100).toFixed(0) + '%',
      };
      const data = [{
        name: '男',
        percent: stGenders[1].ratio,
        a: '1'
      },
      {
        name: '女',
        percent: stGenders[0].ratio,
        a: '1'
      },
      ];
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
          return val + '  ' + map[val];
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
        .color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
        .adjust('stack')
        .style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round'
        })
        .animate({
          appear: {
            duration: 1200,
            easing: 'bounceOut'
          }
        });
      chart.render();
      return chart;
    }
    // 星座
    function mapConstellations(canvas, width, height) {
      const data = stConstellations;
      chart = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chart.source(data, {
        ratio: {
          formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      chart.legend({
        position: 'right',
        itemFormatter(val) {
          let item = data.find(item => item.constellation == val)
          return val + ' ' + (item.ratio * 100).toFixed(0) + '%';
        }
      });
      chart.tooltip(false);
      chart.coord('polar', {
        transposed: true,
        radius: 0.85
      });
      chart.axis(false);
      chart.interval()
        .position('a*ratio')
        .color('constellation', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#FF6600', '#2C72C7', '#E85A90', '#B33D5A', '#FE9431', '#E890B0', '#C0ABFF', '#90D8E8', '#9EFFA3'])
        .adjust('stack')
        .style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round'
        })
        .animate({
          appear: {
            duration: 1200,
            easing: 'bounceOut'
          }
        });
      chart.render();
      return chart;
    }
    that.setData({
      active_tab: 0,
      genderCur: {
        onInit: genderCur
      },
      mapConstellations: {
        onInit: mapConstellations
      },
      cvAge: {
        onInit: cvAge
      },
      cvCity: {
        onInit: cvCity
      },
    })
  },
  verify: function (rec) {
    let that = this
    if (!rec.terrace_iconid || !rec.terrace_id) {
      return false
    }
    wx.showLoading({
      title: '获取中...',
    })
    let iconid = rec.terrace_iconid || 0
    let data = JSON.stringify({
      password: "ysc123...", //酸桃配置密码
      platformId: iconid, //抖音平台
      identityCode: rec.terrace_id, //抖音号
      type: 1
    });
    wx.cloud.callFunction({
      name: 'st_Get_Data',
      data: {
        c_data: data
      }
    }).then(res => {
      // 加密完成，开始上传
      wx.request({
        url: 'https://www.suantao.com/open/index',
        data: {
          userName: "hongonew", //用户名
          content: res.result.encrypted,
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.data.content) {
            // 数据解密
            wx.cloud.callFunction({
              name: 'st_Plus_Data',
              data: {
                m_data: res.data.content
              }
            }).then(res => {
              wx.hideLoading()
              if (res.result.encrypted) {
                var call_back = res.result.encrypted
                var data = JSON.parse(call_back);
                that.setData({
                  load: 1,
                  stsj: data,
                })
                wx.showToast({
                  title: '获取成功',
                  icon: 'none',
                  duration: 2000,
                })
              }
              // 延时一秒再执行，给下次优化留方法
              std.sleep(1).then(() => {
                that.fansCount()
              })
            })
          } else if (res.data.content == '') {
            wx.showToast({
              title: '验证错误',
              icon: 'none',
              duration: 2000,
            })
          }
        },
        fail: function (res) {
          // 网站响应错误
          wx.showToast({
            title: '获取失败',
            icon: none,
            duration: 2000,
          })
        }
      })
    })
      .catch(console.error)
  },
  onSwitchChart: function (t) {
    var a = t.currentTarget.dataset.tab;
    if (a == this.data.active_tab) return !1;
    this.setData({
      active_tab: a
    })
  },
  doCollect: function (e) {
    var that = this
    std.dbdata('collect', { userId: that.data.USER._id, whId: that.data.user._id, }).then(data => {
      if (!data.length) {
        console.log('没查到，新建')
        std.dbsave('collect', { userId: that.data.USER._id, whId: that.data.user._id, }, true)
        that.setData({
          isCollected: true
        })
      } else {
        console.log('查到了，删除')
        // 删除数据的方法
        std.dbdelete('collect', data[0]._id)
        that.setData({
          isCollected: false
        })
      }
    })
  },
  getWhUser: function (id) {
    //取出网红详情
    let that = this
    std.dbone('users', id, true).then(rec => {
      that.setData({
        whUser: rec
      })
      console.log('网红数据', rec)
    }).catch(err => {
      console.log('get wh user err', err)
    })
  },

  callkf: function () {
    wx.makePhoneCall({
      phoneNumber: '4006033235',
    })
  },

  // 显示大图
  load_images: function (res) {
    console.log(res.currentTarget.dataset.imgs[res.currentTarget.id])
    wx.previewImage({
      current: res.currentTarget.dataset.imgs[res.currentTarget.id],
      urls: res.currentTarget.dataset.imgs
    })
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onPageScroll: function (e) {
    if (e.scrollTop > 400) {
      this.setData({
        ckHtight: false,
      })
    } else {
      this.setData({
        ckHtight: true,
      })
    }
  },
  confirmOffer: function (e) {
    //确认把单给ta做
    let data = {
      _id: this.data.offer,
      status: 3,
      whid: this.data.user._id
    }
    let that = this
    std.dbsave('offers', data, true).then(rec => {
      std.goback()
    }).catch(err => {
      console.log('dbsave offers err', err)
    })
  },
})