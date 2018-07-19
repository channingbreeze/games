/*
  new Fruit({
    game: game,
    key: 'peach',
    x: 10,
    y: 10
  });
*/
var Fruit = function(envConfig) {
  var env = {};
  var game = null;
  var sprite = null;
  // 粒子效果的map
  var emitterMap = {
    "apple": 0xFFC3E925,
    "banana": 0xFFFFE337,
    "basaha": 0xFFEB2D13,
    "peach": 0xFFF8C928,
    "sandia": 0xFF739E0F
  };
  var bitmap;
  var emitter;
  var halfOne;
  var halfTwo;
  var init = function() {
    env = envConfig;
    game = env.game;
    sprite = game.add.sprite(env.x || 0, env.y || 0, env.key);
    sprite.anchor.setTo(0.5, 0.5);
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    // 把数据放入cache
    bitmap = game.add.bitmapData(60, 60);
    game.cache.addBitmapData('flameParticle', bitmap);
    // 粒子发射器
    emitter = game.add.emitter(0, 0, 200);
    // 设置粒子，使用我们自定义的粒子
    emitter.particleClass = FlameParticle;
    emitter.makeParticles();
    // 设置属性
    emitter.setScale(0.1, 1, 0.1, 1, 1500);
    emitter.setAlpha(1, 0.1, 1500);
    emitter.minParticleSpeed.setTo(-400, -400);
    emitter.maxParticleSpeed.setTo(400, 400);
    emitter.gravity = 0;
  };
  var half = function(deg, shouldEmit) {
    // 两半
    halfOne = game.add.sprite(sprite.body.x + sprite.width/2, sprite.body.y + sprite.height/2, env.key + '-1');
    halfOne.anchor.setTo(0.5, 0.5);
    halfOne.rotation = deg + 45;
    game.physics.enable(halfOne, Phaser.Physics.ARCADE);
    halfOne.body.velocity.x = 100 + sprite.body.velocity.x;
    halfOne.body.velocity.y = sprite.body.velocity.y;
    halfOne.body.gravity.y = 2000;
    halfOne.checkWorldBounds = true;
    halfOne.outOfBoundsKill = true;
    halfTwo = game.add.sprite(sprite.body.x + sprite.width/2, sprite.body.y + sprite.height/2, env.key + '-2');
    halfTwo.anchor.setTo(0.5, 0.5);
    halfTwo.rotation = deg + 45;
    game.physics.enable(halfTwo, Phaser.Physics.ARCADE);
    halfTwo.body.velocity.x = -100 + sprite.body.velocity.x;
    halfTwo.body.velocity.y = sprite.body.velocity.y;
    halfTwo.body.gravity.y = 2000;
    halfTwo.checkWorldBounds = true;
    halfTwo.outOfBoundsKill = true;
    sprite.kill();
    if(shouldEmit) {
      // 粒子效果
      var emitColor = emitterMap[sprite.key];
      generateFlame(bitmap, emitColor);
      // 粒子发射器
      emitter.x = sprite.x;
      emitter.y = sprite.y;
      // 发射
      emitter.start(true, 4000, null, 10);
    }
  };
  var generateFlame = function(bitmap, color) {
    var len = 30;
    bitmap.context.clearRect(0, 0, 2*len, 2*len);
    var radgrad = bitmap.ctx.createRadialGradient(len, len, 4, len, len, len);
    color = Phaser.Color.getRGB(color);
    radgrad.addColorStop(0, Phaser.Color.getWebRGB(color));
    color.a = 0;
    radgrad.addColorStop(1, Phaser.Color.getWebRGB(color));
    bitmap.context.fillStyle = radgrad;
    bitmap.context.fillRect(0, 0, 2*len, 2*len);
  };
  init();
  // 导出
  this.sprite = function() {
    return sprite;
  };
  this.half = half;
};