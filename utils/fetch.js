// 接口调用

// 直接通过文件名调用
module.exports = function(path, params) {
  // 0测试，1正式
  var isTest = '1';
  var api = '';
  var apiTest = 'http://l1838324x8.imwork.net';
  // 测试：
  // 正式：

  if (isTest == '0') {
    var url = api + path;
  } else {
    var url = apiTest + path;
  }

  // 打印参数和接口地址
  console.log(JSON.stringify(params) + '***' + url);
  return new Promise((resolve, reject) => { // 返回Promise对象
    wx.request({
      url: url, // 字符串模板
      data: JSON.stringify(params), // 把参数转化为JSON对象
      header: {
        'Content-Type': 'application/json'
      },

      method: 'POST',
      dataType: 'json',
      success: function(response) {
        if (response && response.data && response.data.ReturnInfo && response.data.ReturnInfo.Code != '1') {
          reject(response);
          return;
        }
        if (response && response.data && response.data.BusinessInfo && response.data.BusinessInfo.Code != '1') {
          reject(response);
          return;
        }
        resolve(response.data);
      },
      fail: reject
    })
  })
}