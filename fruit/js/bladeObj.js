/*
  new Blade({
    game: game
  });
*/
var Blade = function(envConfig) {
  var env = {};
  var game = null;
  var points = [];
  var blade = null;
  var graphics = null;
  var POINTLIFETIME = 200;
  var allowBlade = false;
  var lastPoint = null;
  var init = function() {
    env = envConfig;
    game = env.game;
    blade = new Phaser.Polygon();
    graphics = game.add.graphics(0, 0);
  };
  var update = function() {
    // 开始有刀光
    if(allowBlade) {
      graphics.clear();
      if (game.input.mousePointer.isDown) {
        var point = new Phaser.Point(game.input.x, game.input.y);
        if(!lastPoint) {
          lastPoint = point;
          point.time = new Date().getTime();
          points.push(point);
        } else {
          var dis = (lastPoint.x - point.x) * (lastPoint.x - point.x) + 
                    (lastPoint.y - point.y) * (lastPoint.y - point.y);
          if(dis > 300) {
            lastPoint = point;
            point.time = new Date().getTime();
            points.push(point);
          }
        }
      }
      if(points.length < 1) {
        return;
      }
      if(new Date().getTime() - points[0].time > POINTLIFETIME) {
        points.shift();
      }
      if(points.length < 1) {
        return;
      }
      blade.setTo(mathTool.generateBlade(points));
      graphics.beginFill(0xffffff);
      graphics.drawPolygon(blade.points);
      graphics.endFill();
    }
  };
  var checkCollide = function(sprite, onCollide) {
    if (allowBlade && game.input.mousePointer.isDown && points.length > 2) {
      // this.sandia要是sprite，并且启动物理引擎
      for(var i=0; i<points.length; i++) {
        if(Phaser.Rectangle.contains(sprite.body, points[i].x, points[i].y)) {
          onCollide();
          break;
        }
      }
    }
  };
  var collideDeg = function() {
    var deg;
    var len = points.length;
    if(points[0].x == points[len-1].x) {
      deg = 90;
    } else {
      var val = (points[0].y - points[len-1].y) / (points[0].x - points[len-1].x);
      deg = Math.round(Math.atan(val) / Math.PI * 180);
    }
    if(deg < 0) {
      deg = deg + 180;
    }
    return deg;
  };
  init(envConfig);
  //导出
  this.allowBlade = function() {
    allowBlade = true;
  };
  this.update = update;
  this.checkCollide = checkCollide;
  this.collideDeg = collideDeg;
};