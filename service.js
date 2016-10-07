var express = require('express');
var bodyParser = require('body-parser');
var apn = require('./apn');
var wechat = require('./wechat');
var mychat = require('./mychat');
var guessit = require('./guessit');
var schedule = require("node-schedule");
var app = express();

process.env.TZ = 'Asia/Shanghai';

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));

//测试根目录
app.get('/', function (req, res) {
  res.status(200).send('Hi Docker');
});

//guessit and mychat
app.all('/wechat/sample/push.jsp', function (req, res) {
  var method = req.query.method;
  var token = req.body.token;
  var realToken = req.body.token1;
  var msg = req.body.msg;

  res.set({'content-type': 'text/html;charset=UTF-8'});

  if ("reg" == method) {
		mychat.registrateDeviceToken(token, realToken);
		res.status(200).send("OK");
	} else if ("send" == method) {
		mychat.sendMsg(token, msg);
		res.status(200).send("OK");
	} else if ("receive" == method) {
		msg = mychat.receiveMsg(token);
    res.status(200).send(msg);
	} else if ("view" == method) {
		msg = mychat.viewQueue();
		res.status(200).send(msg);
	} else if ("clear" == method) {
		msg = mychat.clearQueue();
		res.status(200).send(msg);
	} else if ("cache" == method) {
		msg = mychat.viewMsgs(token);
		res.status(200).send(msg);
	} else if ("count" == method) {
    msg = mychat.viewMsgCount(token);
		res.status(200).send(msg);
	} else if ("read" == method) {
    msg = mychat.isMsgRead(token)
		res.status(200).send(msg);
	} else if ("init" == method) {
		guessit.initDigitalNumber(token);
		res.status(200).send("OK");
	} else if ("guess" == method) {
    msg = guessit.guessDigitalNumber(token, msg);
    res.status(200).send(msg);
	} else {
    console.log(method+token+realToken+msg);
    res.status(200).send("OK");
  }
});

//转发短信
app.post('/pushmsg', function (req, res) {
  console.log(req.body);
  var msg = "来自:" + req.body.from + "\n" + req.body.msg;
  try {
    apn.pushMsg(msg);
  } catch (e) {
    console.error(e);
  }
  try {
    wechat.pushSMS(req.body.from, req.body.msg);
  } catch (e) {
    console.error(e);
  }
  res.status(200).send("OK");
});

//启动定时执行
//不知道该怎么改时区
var j = schedule.scheduleJob('0 10 * * *', function(){
  console.log('The answer to life, the universe, and everything!');
  wechat.sendMsg(TOKEN1, ALERT_MSG1);
  wechat.sendMsg(TOKEN2, ALERT_MSG1);
});


//启动应用
var server = app.listen(8888, function () {
  //var host = server.address().address;
  //var port = server.address().port;
  //console.log("应用实例，访问地址为 http://%s:%s", host, port)
});
