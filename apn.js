var apn = require('apn');

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

  var deviceToken = 'd4e5aafb98d0ba217e392f2d44b8d8091ae45224660d3aab035377626ba291bf'; //长度为64的设备Token
  apnProvider.send(note, deviceToken).then((result) => {
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
