var guessCache = new Object();

//初始化
exports.initDigitalNumber = function(token) {
  guessCache[token] = null;

  var queue = new Array();
  queue.push(createDigital());
  queue.push(Date.now()+"");
  guessCache[token] = queue;
}

//猜数字并返回答案
exports.guessDigitalNumber = function(token, number) {
  var queue = guessCache[token];
  if (!queue) {
    this.initDigitalNumber(token);
    queue = guessCache[token];
  }

  queue.push(number + ":" + parseDigital(number, queue[0]) + "," +calculateTime(queue[1]));

  var sb = "";
  for (var i = 2; i < queue.length; i ++) {
    sb += queue[i] + "\n";
  }
  return sb;
}

//time
function calculateTime(startStr) {
  var current = Date.now();
  var start = +startStr;
  start = current - start;

  var day = Math.floor(start / (24 * 60 * 60 * 1000));
  var hour = Math.floor(start / (60 * 60 * 1000) - day * 24);
  var min = Math.floor((start / (60 * 1000)) - day * 24 * 60 - hour * 60);
  var s = Math.floor(start / 1000 - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60);
  return (day==0?"":(day+"d")) + (day==0&&hour==0?"":(hour+"h")) + min + "m" + s + "s";
}

//创建随机数字
function createDigital() {
  var r = "";

  while (r.length < 4) {
    var s = "";
    do {
      s = Math.floor(Math.random()*10)+"";
    } while (r.indexOf(s) != -1);
    r += s;
  }
  return r;
}

//分析结果
function parseDigital(answer, source) {
  if (answer == null || answer.length != 4) return "WRONG FORMAT";
  if (answer == source) return "RIGHT";
  var a = 0, b = 0;
  for (var i = 0; i < 4; i ++) {
    for (var j =0; j < 4; j ++) {
      if (answer.charAt(i) == source.charAt(j)) {
        if (i == j) a++;
        else b++;
      }
    }
  }
  return a + "A" + b + "B";
}

/**
//以下为测试代码
//创建随机数
console.log(createDigital());
//计算时间1475500000000
console.log(calculateTime('1475500000000'));
//分析结果
console.log(parseDigital('4396', '4396'));
console.log(parseDigital('4396', '4390'));
console.log(parseDigital('4396', '3390'));
//猜数字
console.log(this.guessDigitalNumber("1", "1234"));
console.log(this.guessDigitalNumber("1", "5678"));
console.log(this.guessDigitalNumber("1", "0912"));
console.log(this.guessDigitalNumber("1", "7843"));
console.log(guessCache);
**/
