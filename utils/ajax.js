// 接口调用

// 直接通过文件名调用
module.exports = function (path, params) {
  // 1正式
  var isTest = '0';

  // 测试：apiTest
  // 正式：api
  var api = 'http://192.168.0.131:8080';
  var apiTest = 'http://192.168.0.167:8080'; // 测试服务器，映射http://l1838324x8.imwork.net

  if (isTest == '0') {
    var url = apiTest + path;
  } else {
    var url = api + path;
  }
  // 第一步： 获得XMLHttpRequest对象
  var ajax = new XMLHttpRequest();
  // 第二步： 设置状态监听函数
  ajax.onreadystatechange = function () {
    console.log(ajax.readyState);
    console.log(ajax.status);
    // 第五步：在监听函数中，判断readyState=4 && status=200表示请求成功
    if (ajax.readyState == 4 && ajax.status == 200) {
      // 第六步： 使用responseText、responseXML接受响应数据，并使用原生JS操作DOM进行显示
      console.log(ajax.responseText);
      console.log(ajax.responseXML); // 返回不是XML，显示null
      console.log(JSON.parse(ajax.responseText));
      console.log(eval("(" + ajax.responseText + ")"));
    }
  }
  // 第三步： open一个链接
  ajax.open("post", url, false); //true异步请求，false同步

  // 第四步： send一个请求。 可以发送对象和字符串，不需要传递数据发送null
  ajax.send(params);



  // 打印参数和接口地址
  // console.log(JSON.stringify(params) + '***' + url);
  // return new Promise((resolve, reject) => { // 返回Promise对象

  //   wx.request({
  //     url: url, // 字符串模板
  //     data: JSON.stringify(params), // 把参数转化为JSON对象
  //     header: {
  //       'Content-Type': 'application/json'
  //     },
  //     method: 'POST',
  //     dataType: 'json',
  //     success: function (response) {
  //       if (response && response.data && response.data.ReturnInfo && response.data.ReturnInfo.Code != '1') {
  //         reject(response);
  //         return;
  //       }
  //       if (response && response.data && response.data.BusinessInfo && response.data.BusinessInfo.Code != '1') {
  //         reject(response);
  //         return;
  //       }
  //       resolve(response.data);
  //     },
  //     fail: reject
  //   })



  // })
}