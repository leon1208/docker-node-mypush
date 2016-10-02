var express = require('express');
var bodyParser = require('body-parser');
var apn = require('./apn');
var app = express();


app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('Hi Docker');
});

app.post('/pushmsg', function (req, res) {
  console.log(req.body);
  var msg = "来自:" + req.body.from + "\n" + req.body.msg;
  console.log(msg);
  apn.pushMsg(msg);
  res.send('OK');
});

var server = app.listen(8888, function () {
  //var host = server.address().address;
  //var port = server.address().port;
  //console.log("应用实例，访问地址为 http://%s:%s", host, port)
});
