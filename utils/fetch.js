// 接口调用

// 直接通过文件名调用
module.exports = function(path, params) {
  // 1正式
  var isTest = '0';

  // 测试：apiTests
  // 正式：api
 var api = 'https://hongonew.com';
  var apiTest = 'http://192.168.0.166:8080'; // 测试服务器，映射http://l1838324x8.imwork.net

  if (isTest == '0') {
    var url = apiTest + path;
  } else {
    var url = api + path;
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