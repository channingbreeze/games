function tween(obj, num, tmr) {
  if (num == 0 || num == 2) {
    obj.angle = -15;
  }
  if (num == 1 || num ==3 ) {
    obj.angle = 15;
  }
  var tween = game.add.tween(obj).to({ x: obj.width*num+obj.width/2 }, tmr, "Linear", true);
  tween.onComplete.add(function () { 
    obj.angle = 0;
  });
  game.add.tween(obj.emitter).to({ x: obj.width * num + obj.width / 2 }, tmr, "Linear", true);
}