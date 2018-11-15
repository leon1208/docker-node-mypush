var apn = require('apn');
let myDeviceToken = '574973cc6894f09fe241c41e09337664cf61fd1b6123bff9ce2eff7acbaa017b'; //长度为64的设备Token

var options = {
  "production": false,
  "cert": "guessit-cert.pem",                 /* Certificate file path */
  "key":  "guessit-key.pem"                  /* Key file path */
}

//var apnProvider = new apn.Provider(options);
var apnProvider = new apn.Provider(options);

exports.pushMsg = function(msg) {
  var note = new apn.Notification();

  note.expiry = Math.floor(Date.now() / 1000) + 60;
  note.badge = 0;
  note.sound = "default";
  note.alert = msg;
  //note.payload = {'messageFrom': '13916918807'};

  apnProvider.send(note, myDeviceToken).then((result) => {
    console.log(result);
  });
}

exports.pushNotification = function(token, badge, msg) {
  var note = new apn.Notification();

  note.expiry = Math.floor(Date.now() / 1000) + 60;
  note.badge = badge?badge:0;
  note.sound = "default";
  if (msg) note.alert = msg;

  apnProvider.send(note, token).then((result) => {
    console.log(result);
  });
}

//以下为测试代码
//this.pushNotification(myDeviceToken,1,'')
//this.pushMsg('')
