/*
  new Bomb({
    game: game,
    x: x,
    y: y
  });
*/
var Bomb = function(envConfig) {
  var env = {};
  var game = null;
  var sprite = null;
  var init = function() {
    env = envConfig;
    game = env.game;
    // 把数据放入cache
    var bitmap = game.add.bitmapData(50, 50);
    generateFlame(bitmap);
    game.cache.addBitmapData('flameParticle', bitmap);
    // 创建sprite
    initSprite();
  };
  // 定义炸弹的Flame纹理
  var generateFlame = function(bitmap) {
    var len = 5;
    bitmap.context.fillStyle = "#FFFFFF";
    bitmap.context.beginPath();
    bitmap.context.moveTo(25 + len, 25 - len);
    bitmap.context.lineTo(25 + len, 25 + len);
    bitmap.context.lineTo(25 - len, 25 + len);
    bitmap.context.lineTo(25 - len, 25 - len);
    bitmap.context.closePath();
    bitmap.context.fill();
  };
  var initSprite = function() {
    sprite = game.add.sprite(env.x || 0, env.y || 0);
    var bombImage = game.add.sprite(0, 0, 'bomb');
    bombImage.anchor.setTo(0.5, 0.5);
    // 烟雾
    var bombSmoke = game.add.sprite(-55, -55, 'smoke');
    // 粒子发射器
    var bombEmit = game.add.emitter(-30, -30, 20);
    // 设置粒子，使用我们自定义的粒子
    bombEmit.particleClass = FlameParticle;
    bombEmit.makeParticles();
    // 设置属性
    bombEmit.setScale(1, 0.8, 1, 0.8, 1500);
    bombEmit.setAlpha(1, 0.1, 1500);
    // 发射
    bombEmit.start(false, 500, 50);
    // 什么时候用Group，什么时候用sprite，一个炸弹，是一个sprite，刚体，速度，旋转都一致。group里面的东西可以速度不一致。
    sprite.addChild(bombImage);
    sprite.addChild(bombEmit);
    sprite.addChild(bombSmoke);
    // 物理属性
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.enableBody = true;
  };
  var explode = function(onWhite, onComplete) {
    var lights = [];
    var startDeg = Math.floor(Math.random() * 360);
    for(var i=0; i<8; i++) {
      var light = game.add.graphics(sprite.body.x, sprite.body.y);
      var points = [];
      points[0] = new Phaser.Point(0, 0);
      points[1] = new Phaser.Point(Math.floor(800*mathTool.degCos(startDeg + i*45)), Math.floor(800*mathTool.degSin(startDeg + i*45)));
      points[2] = new Phaser.Point(Math.floor(800*mathTool.degCos(startDeg + i*45 + 10)), Math.floor(800*mathTool.degSin(startDeg + i*45 + 10)));
      light.beginFill(0xffffff);
      light.drawPolygon(points);
      light.endFill();
      light.alpha = 0;
      lights.push(light);
    }
    lights = mathTool.shuffle(lights);
    var firstTween;
    var lastTween;
    for(var i=0; i<8; i++) {
      var light = lights[i];
      var tween = game.add.tween(light).to({alpha: 1}, 100, "Linear", false);
      if(i == 0) {
        firstTween = tween;
      }
      if(lastTween) {
        lastTween.chain(tween);
      }
      lastTween = tween;
      if(i == 7) {
        tween.onComplete.add(function() {
          var whiteScreen = game.add.graphics(0, 0);
          whiteScreen.beginFill(0xffffff);
          whiteScreen.drawRect(0, 0, game.width, game.height);
          whiteScreen.endFill();
          whiteScreen.alpha = 0;
          var tween = game.add.tween(whiteScreen).to({alpha: 1}, 100, "Linear", true);
          // 开始和结束的回调
          tween.onComplete.add(function() {
            onWhite();
            for(var i=0; i<8; i++) {
              var light = lights[i];
              light.kill();
            }
            var tweenBack = game.add.tween(whiteScreen).to({alpha: 0}, 100, "Linear", true);
            tweenBack.onComplete.add(function() {
              onComplete();
            });
          });
        });
      }
    }
    firstTween.start();
  };
  init();
  // 导出
  this.sprite = function() {
    return sprite;
  };
  this.explode = explode;
};