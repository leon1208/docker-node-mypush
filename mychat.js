var moment = require('moment');
var schedule = require("node-schedule");
var apn = require('./apn');
var wechat = require('./wechat');

let TOKEN1 = "297a3f20ae8fddff6a460313f53235aab3b3a6b7bc0f7a5ea9aa399bc1c50df2"; //ME
let TOKEN2 = "3deb1be695091e5067cb08ab575c09221c0d9f9f750567c28009692d8786bb60"; //THIRE

let TOKEN = [TOKEN1, TOKEN2];
let OPENID = ["o0dZUv0gdwqOa2osmkONzaAyuXiE", "o0dZUvynotZC7qNQ8Q5wxkVrJpp8"];


let ALERT_MSG1 = "hgSB8S9EaoZ5eYFWvFxOzZ7x9qrkAy4hXlG+7SvFd70=";

//真的token缓存
var TOKEN_MAP = new Object();
//队列池
var messageQueuePool = new Object();
//缓存池
var messageCache = new Array();

//发送消息
exports.sendMsg = function (sendToken, msg) {
  var q = checkToken(sendToken);
  if (!q) return "";

  for (var token in messageQueuePool) {
    if (token != sendToken) {
      var q = checkToken(token);
      if (!q) continue;

      //加入消息
      q.push(formatCurrentTime() + ":" + msg);

      //发送weixin的服务
      pushWechatMsg(sendToken, q.length);
      //发送apnProvider
      pushNotificationMsg(token, q.length);
    }
  }

  //缓存队列
  if (TOKEN1 == sendToken) {
    messageCache.push("A:" + formatCurrentTime() + ":" + msg);
  } else if (TOKEN2 == sendToken) {
    messageCache.push("B:" + formatCurrentTime() + ":" + msg);
  }
  if (messageCache.length > 100) messageCache.shift();
}


//查看缓存里的信息
exports.viewMsgs = function(viewToken) {
  var q = checkToken(viewToken);
  if (!q) return "";

  //判断是谁来查
  var isA = true;
  if (TOKEN1 == viewToken ) {
    isA = true;
  } else if (TOKEN2 == viewToken) {
    isA = false;
  } else return "";

  //拼装msg
  var sb = "";
  for (var i = 0;i < messageCache.length;i++) {
    var msg = messageCache[i];
    //当前查询人自己发的信息，空格
    if ((msg.startsWith("A:") && isA) ||
        (msg.startsWith("B:") && !isA)) {
      sb += "B:";
    } else {
      sb += "A:";
    }
    sb += msg.substring(2) + "\n";
  }

  return sb;
}

//查询消息数量
exports.viewMsgCount = function(viewToken) {
  var q = checkToken(viewToken);
  if (q) return q.length+"";
  else return "0";
}

//查看对方消息是否被提取
exports.isMsgRead = function(fromToken) {
  if (TOKEN1==fromToken) {
    return this.viewMsgCount(TOKEN2);
  } else if (TOKEN2==fromToken) {
    return this.viewMsgCount(TOKEN1);
  } else return "0";
}

//消息接收方
//查看自己的消息队列，取出所有的消息
//入参token为本机的token，接收方token
exports.receiveMsg = function(receiveToken) {
  var q = checkToken(receiveToken);
  if (!q) return "";

  var sb = "";
  while (q.length != 0) {
    sb += q.shift() + "\n";
  }
  if (sb.length == 0) return "";
  else return sb.substring(0, sb.length-1);
}

//注册设备号信息.
//将设备号对应关系放入map中
exports.registrateDeviceToken = function(deviceToken, realToken) {
  checkToken(deviceToken);

  if (deviceToken == null || deviceToken.length < 64) return;
  if (realToken == null || realToken.length < 64) return;
  TOKEN_MAP[deviceToken] = realToken;
  console.log("token register:token1="+deviceToken+",token2="+realToken);
}

//查看信息
exports.viewQueue = function() {
  return messageQueuePool;
}

//清除所有信息
exports.clearQueue = function() {
  for (var i in messageQueuePool) {
    if (i && messageQueuePool[i]) {
      messageQueuePool[i].length = 0
    }
  }
  return this.viewQueue();
}

//当前时间
function formatCurrentTime() {
  return moment().utc().utcOffset(8).format("MM-DD HH:mm")
}

//检查token并加入token
function checkToken(token) {
  if (token == null || token.length < 64) return null;

  if (messageQueuePool[token]) {
    return messageQueuePool[token];
  } else {
    var ret = new Array();
    messageQueuePool[token] = ret;
    return ret;
  }
}

//发送微信消息
function pushWechatMsg(token, badge) {
  try {
    if (TOKEN1 == token) {
      wechat.pushWechat(OPENID[1], badge);
    } else if (TOKEN2 == token) {
      wechat.pushWechat(OPENID[0], badge);
    }
  } catch (e) {
    console.error(e);
  }
}

//发送apn推送
function pushNotificationMsg(token, badge) {
  try {
    if (TOKEN_MAP[token]) {
      apn.pushNotification(TOKEN_MAP[token], badge, null);
    }
  } catch (e) {
    console.error(e);
  }
}

//初始化注册
this.registrateDeviceToken(TOKEN1);
this.registrateDeviceToken(TOKEN2);
console.log(this.viewQueue());

//启动定时执行
var j = schedule.scheduleJob('0 18 * * *', function(){
  console.log('The answer to life, the universe, and everything!');
  this.sendMsg(TOKEN1, ALERT_MSG1);
  this.sendMsg(TOKEN2, ALERT_MSG1);
});


/**
//下为测试代码
console.log(TOKEN_MAP);
console.log("发消息测试...");
//token1放入消息
this.sendMsg(TOKEN1, "token1 msg1");
this.sendMsg(TOKEN1, "token1 msg2");
//token2放入消息
this.sendMsg(TOKEN2, "token2 msg1");
console.log(this.viewQueue());

console.log("消息数测试...");
//查看token1的消息数
console.log(this.viewMsgCount(TOKEN1));
//查看token2的消息数
console.log(this.viewMsgCount(TOKEN2));
//查看token1的未读数
console.log(this.isMsgRead(TOKEN1));
//查看token2的未读数
console.log(this.isMsgRead(TOKEN2));

console.log("读取消息测试...");
//token1读取消息
console.log(this.receiveMsg(TOKEN1));
//token2读取消息
console.log(this.receiveMsg(TOKEN2));
//查看token1的未读数
console.log(this.isMsgRead(TOKEN1));
//查看token2的未读数
console.log(this.isMsgRead(TOKEN2));

console.log("读取历史测试...");
//token1查看历史
console.log(this.viewMsgs(TOKEN1));
//token2查看历史
console.log(this.viewMsgs(TOKEN2));

//清除队列
console.log(this.clearQueue());
**/
