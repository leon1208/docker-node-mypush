var WechatAPI = require('wechat-api');
var fs = require("fs");
let templateId = 'pe4G6xS4ZYjUViGetMR75KW10CHpLVDFSebKc-n74tw';
let appId = 'wx3de2742296b5b267';
let appSecret = 'a351088ffbcf0500b7390a9a792888c2';

var api = new WechatAPI(appId, appSecret, function (callback) {
  // 传入一个获取全局token的方法
  fs.readFile('access_token.txt', 'utf8', function (err, txt) {
    //文件不存在创建
    if (err && err.code == 'ENOENT') {return callback(null, null);}
    else if (err) {return callback(err)}
    callback(null, JSON.parse(txt));
  });
}, function (token, callback) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  fs.writeFile('access_token.txt', JSON.stringify(token), callback);
});


// URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
// var url = 'http://weixin.qq.com/download';

exports.pushWechat = function(openid, result) {
  var data = {
     "first": {
       "value":"服务器瓦特了",
       "color":"#173177"
     },
     "performance":{
       "value":"请赶紧处理一下",
       "color":"#173177"
     },
     "time": {
       "value":"已经发生"+result,
       "color":"#173177"
     },
     "remark":{
       "value":"请联系一下资源中心说明下情况",
       "color":"#173177"
     }
  };
  api.sendTemplate(openid, templateId, null, data, function (err, data, res) {
    console.log(err);
    console.log(data);
    console.log(res);
  });
}


exports.pushSMS = function(openid, sender, content) {
  var data = {
     "first": {
       "value":"短信来了",
       "color":"#173177"
     },
     "performance":{
       "value":sender,
       "color":"#173177"
     },
     "time": {
       "value":sender.substring(sender.length-11),
       "color":"#173177"
     },
     "remark":{
       "value":content,
       "color":"#173177"
     }
  };
  api.sendTemplate(openid, templateId, null, data, function (err, data, res) {
    console.log(err);
    console.log(data);
    console.log(res);
  });
}
