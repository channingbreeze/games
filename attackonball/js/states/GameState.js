
var Phaser = Phaser || {};
var AttackOnBall = AttackOnBall || {};

AttackOnBall.GameState = function () {
  "use strict";
  Phaser.State.call(this);
};

AttackOnBall.GameState.prototype = Object.create(Phaser.State.prototype);
AttackOnBall.GameState.prototype.constructor = AttackOnBall.GameState;

AttackOnBall.GameState.prototype.init = function (landIndex) {
  "use strict";
  this.landIndex = landIndex;
};

AttackOnBall.GameState.prototype.preload = function () {
  "use strict";
  
};

AttackOnBall.GameState.prototype.create = function () {
  "use strict";
  
  // 为了地震效果，将world的边界扩张一下
  var margin = 50;
  // 四边都增加一个margin
  var x = -margin;
  var y = -margin;
  var w = game.world.width + margin * 2;
  var h = game.world.height + margin * 2;
  // 设置游戏区域
  game.world.setBounds(x, y, w, h);

  game.physics.startSystem(Phaser.Physics.ARCADE);

  // 背景
  var bg = game.add.image(0, 0, 'bg');

  // 地
  this.land = game.add.sprite(0, HEIGHT - 204, 'land' + this.landIndex);
  game.physics.arcade.enable(this.land);
  this.land.body.setSize(1216, 184, 0, 20);
  this.land.body.immovable = true;

  // 小人
  this.hero = game.add.sprite(WIDTH / 2, HEIGHT - 204 + 20);

  // 小人 spine
  var stickman = game.add.spine(0, 0, 'stickman');
  stickman.scale.setTo(1.5, 1.5);

  stickman.setAnimationByName(0, 'Idle', true);

  this.hero.stickman = stickman;
  this.hero.addChild(stickman);

  // 影子
  this.shadow = game.add.sprite(0, stickman.bottom, 'shadow');
  this.shadow.anchor.setTo(0.5, 0.5);
  this.shadow.scale.x = stickman.width / this.shadow.width;
  this.hero.addChild(this.shadow);

  this.hero.dir = 0;
  game.physics.arcade.enable(this.hero);
  this.hero.anchor.setTo(0.5, 0.5);
  this.hero.body.setSize(80, 80, -40, -80);
  // tap数组
  this.hero.taps = [];

  game.input.onDown.add(this.tapDown, this);
  game.input.onUp.add(this.tapUp, this);

  // 球们
  this.balls = game.add.group();
  this.balls.enableBody = true;

  this.ballTimer = game.time.events.loop(Phaser.Timer.SECOND * 1, this.generateBall, this);
  this.leftBall = true;

  // 加分数字们
  this.numberItems = game.add.group();
  this.balls.enableBody = true;

  this.numberTimer = game.time.events.loop(Phaser.Timer.SECOND * 5, this.generateNumber, this);

  // 时间条
  this.gauge = game.add.sprite(0, 0, 'gauge');
  this.gauge.count = 0;
  this.gauge.scale.x = this.game.width / this.gauge.width;
  this.gauge.tint = Math.random() * 0xffffff;
  this.gaugeCropRect = new Phaser.Rectangle(0, 0, 0, this.gauge.height);
  this.gauge.crop(this.gaugeCropRect);
  this.gaugeHead = game.add.sprite(0, 0, 'gaugeHead');
  game.time.events.loop(Phaser.Timer.SECOND * 0.1, function() {
    this.gaugeHead.tint = Math.random() * 0xffffff;
  }, this);

  this.timeTimer = game.time.events.loop(Phaser.Timer.SECOND * 0.1, function() {
    this.gauge.count++;
    this.updateTimeNumber();
  }, this);

  // 时间数字
  this.timeIntegerText = game.add.bitmapText(this.gaugeHead.x, this.gaugeHead.bottom, 'numberTime', '0', 32);
  this.timeIntegerText.tint = 0x000000;
  this.dot = game.add.image(this.timeIntegerText.right + 2, this.gaugeHead.bottom + this.timeIntegerText.height - 5, 'white4');
  this.dot.tint = 0x000000;
  this.timeDecimalText = game.add.bitmapText(this.dot.right, this.gaugeHead.bottom, 'numberTime', '00', 32);
  this.timeDecimalText.tint = 0x000000;

  // 更改大地颜色
  this.floorTimer = game.time.events.loop(Phaser.Timer.SECOND * 10, function() {
    this.land.loadTexture("landWhite");
    game.time.events.repeat(Phaser.Timer.SECOND * 0.1, 10, function() {
      this.land.tint = Math.random() * 0xffffff;
    }, this);
    game.time.events.add(Phaser.Timer.SECOND * 1, function() {
      this.land.loadTexture("land" + game.rnd.integerInRange(0, 5));
    }, this);
  }, this);
};

AttackOnBall.GameState.prototype.update = function () {
  "use strict";
  // 限制小人移动范围
  if(this.hero.x < 0) {this.hero.x = 0;}
  if(this.hero.x > WIDTH) {this.hero.x = WIDTH;}
  game.physics.arcade.collide(this.land, this.balls);
  game.physics.arcade.collide(this.land, this.bloodEmitter);
  game.physics.arcade.collide(this.land, this.deadPartsEmitter);
  game.physics.arcade.collide(this.land, this.numberItems);
  game.physics.arcade.overlap(this.hero, this.balls, this.dead, null, this);
  game.physics.arcade.overlap(this.hero, this.numberItems, this.collectNumber, null, this);
};

AttackOnBall.GameState.prototype.render = function () {
  "use strict";
  // game.debug.body(this.land);
  // game.debug.body(this.hero);
  // this.balls.forEach(function(ball) {
  //   game.debug.body(ball);
  // }, this);
  // this.numberItems.forEach(function(numberItem) {
  //   game.debug.body(numberItem);
  // }, this);
};

AttackOnBall.GameState.prototype.tapDown = function(pointer) {
  if(pointer.x > WIDTH / 2) {
    this.hero.dir = 1;
    this.hero.scale.x = 1;
    this.hero.body.velocity.x = heroSpeed;
  } else {
    this.hero.dir = -1;
    this.hero.scale.x = -1;
    this.hero.body.velocity.x = -heroSpeed;
  }
  // 记录pointer.id
  this.hero.taps.push({id: pointer.id, dir: this.hero.dir});
  var randomIndex = game.rnd.integerInRange(0, 4);
  if(randomIndex == 0) {
    this.hero.stickman.setAnimationByName(0, 'Run0', true);
  } else if(randomIndex == 1) {
    this.hero.stickman.setAnimationByName(0, 'Run1', true);
  } else if(randomIndex == 2) {
    this.hero.stickman.setAnimationByName(0, 'Run2', true);
  } else if(randomIndex == 3) {
    this.hero.stickman.setAnimationByName(0, 'Run3', true);
  } else if(randomIndex == 4) {
    this.hero.stickman.setAnimationByName(0, 'RunSmile', true);
  }
}

AttackOnBall.GameState.prototype.tapUp = function(pointer) {
  // 把相应pointer.id去除
  for(var i = this.hero.taps.length - 1; i >= 0; i--) {
    if(this.hero.taps[i].id == pointer.id) {
      this.hero.taps.splice(i, 1);
    }
  }
  if(this.hero.taps.length == 0) {
    this.hero.dir = 0;
    this.hero.body.velocity.x = 0;
    var randomIndex = game.rnd.integerInRange(0, 1);
    if(randomIndex == 0) {
      this.hero.stickman.setAnimationByName(0, 'Idle', true);
    } else {
      this.hero.stickman.setAnimationByName(0, 'IdleSmile', true);
    }
  } else {
    this.hero.dir = this.hero.taps[this.hero.taps.length - 1].dir;
    this.hero.scale.x = this.hero.dir;
    this.hero.body.velocity.x = this.hero.dir * heroSpeed;
  }
}

AttackOnBall.GameState.prototype.dead = function(hero, ball) {

  // 血块序列帧动画，单张图片形式播放
  this.playEffectBlood(hero);

  // 粒子血滴效果
  this.playParticleBlood(hero);

  // 身体部分分裂效果
  this.playDeadParts(hero);

  // 地震效果
  this.earthQuake();

  // 红色光晕
  this.redBorder();

  // 停掉时间
  game.time.events.remove(this.numberTimer);
  game.time.events.remove(this.timeTimer);
  game.time.events.remove(this.floorTimer);

  // 2s后出现结束画面
  game.time.events.add(Phaser.Timer.SECOND * 2, this.over, this);

  hero.kill();

}

AttackOnBall.GameState.prototype.playEffectBlood = function(hero) {
  
  var count = 0;
  var effectBlood = game.add.sprite(hero.x, hero.y - 45, 'effectBlood' + count);
  effectBlood.anchor.setTo(0.5, 0.5);

  var timer = game.time.events.loop(Phaser.Timer.SECOND * 0.05, function() {
    if(count < 10) {
      count++;
      effectBlood.loadTexture('effectBlood' + count);
    } else {
      game.time.events.remove(timer);
    }
  }, this);

}

AttackOnBall.GameState.prototype.playParticleBlood = function(hero) {
  
  this.bloodEmitter = game.add.emitter(0, 0, 50);

  this.bloodEmitter.makeParticles('blood', 0, 50, true);
  // 重力
  this.bloodEmitter.gravity = 1000;
  // 弹性
  this.bloodEmitter.bounce.setTo(0, 0.2);
  // 速度
  this.bloodEmitter.setXSpeed(-300, 300);
  this.bloodEmitter.setYSpeed(-1000, 0);
  // 缩放
  this.bloodEmitter.minParticleScale = 0.2;
  this.bloodEmitter.maxParticleScale = 1.5;
  // x方向阻力
  this.bloodEmitter.particleDrag.x = 100;

  this.bloodEmitter.x = hero.x;
  this.bloodEmitter.y = hero.y - 45;

  this.bloodEmitter.start(true, -1, null, 50);

}

AttackOnBall.GameState.prototype.playDeadParts = function(hero) {

  this.deadPartsEmitter = game.add.emitter(0, 0, 8);

  this.deadPartsEmitter.makeParticles(deadPartsKeys, 0, 8, true, true);
  // 重力
  this.deadPartsEmitter.gravity = 1000;
  // 弹性
  this.deadPartsEmitter.bounce.setTo(0, 0.2);
  // 速度
  this.deadPartsEmitter.setXSpeed(-800, 800);
  this.deadPartsEmitter.setYSpeed(-1000, 0);
  // x方向阻力
  this.deadPartsEmitter.particleDrag.x = 100;

  this.deadPartsEmitter.x = hero.x;
  this.deadPartsEmitter.y = hero.y - 45;

  this.deadPartsEmitter.start(true, -1, null, 8);

}

AttackOnBall.GameState.prototype.earthQuake = function() {
  // 振幅
  var rumbleOffset = 10;
  // tween参数
  var propertiesX = { x : game.camera.x - rumbleOffset };
  var propertiesY = { y : game.camera.y - rumbleOffset };
  // 给camera tween就是地震效果
  game.add.tween(game.camera).to(propertiesX, 110, Phaser.Easing.Bounce.InOut, true, 0, 4, true);
  game.add.tween(game.camera).to(propertiesY, 120, Phaser.Easing.Bounce.InOut, true, 0, 4, true);
}

AttackOnBall.GameState.prototype.redBorder = function() {
  this.effectHit = game.add.image(0, 0, 'effectHit');
  this.effectHit.scale.setTo(game.width/this.effectHit.width, game.height/this.effectHit.height);
  this.effectHit.alpha = 0;
  game.add.tween(this.effectHit).to({alpha: 1}, 480, Phaser.Easing.Bounce.InOut, true, 0, 1, true);
}

AttackOnBall.GameState.prototype.generateBall = function() {
  var x, dir;
  if(this.leftBall) {
    x = -70;
    dir = 1;
  } else {
    x = game.width + 70;
    dir = -1
  }
  this.leftBall = !this.leftBall;
  var ball = this.balls.getFirstExists(false);
  var rate = game.rnd.realInRange(1.2, 1.5);
  if(ball) {
    ball.reset(x, game.rnd.integerInRange(-50, 150));
  } else {
    ball = game.make.sprite(x, game.rnd.integerInRange(-50, 150), 'ball' + game.rnd.integerInRange(0, 4));
    ball.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(ball);
    ball.outOfBoundsKill = true;
    ball.checkWorldBounds = true;
    ball.body.moves = true;
    ball.body.bounce.y = 1;
    ball.body.gravity.y = 950;
    ball.body.setSize(100 * 0.75, 98, 100 * 0.25 / 2, 0);
    var shadow = game.add.sprite(0, HEIGHT - this.land.height + 20, 'shadow');
    shadow.anchor.setTo(0.5, 0.5);
    ball.shadow = shadow;
    ball.update = function() {
      ball.shadow.x = ball.x;
      ball.shadow.scale.x = 0.5 + (ball.y / (HEIGHT - this.land.height + 20)) / 2;
      ball.shadow.alpha = 0.5 + (ball.y / (HEIGHT - this.land.height + 20)) / 2;
    }.bind(this);
    this.balls.add(ball);
  }
  ball.scale.setTo(rate, rate);
  ball.body.velocity.x = dir * game.rnd.integerInRange(150, 200);
}

AttackOnBall.GameState.prototype.generateNumber = function() {
  var numberItem = this.numberItems.getFirstExists(false);
  if(numberItem) {
    numberItem.reset(game.rnd.integerInRange(0, game.width), -20);
    numberItem.angle = game.rnd.angle();
    numberItem.loadTexture('numberItem' + game.rnd.integerInRange(1, 4));
  } else {
    numberItem = game.make.sprite(game.rnd.integerInRange(0, game.width), -20, 'numberItem' + game.rnd.integerInRange(1, 4));
    numberItem.angle = game.rnd.angle();
    game.physics.arcade.enable(numberItem);
    numberItem.anchor.setTo(0.5, 0.5);
    numberItem.body.moves = true;
    numberItem.body.bounce.y = 0.2;
    numberItem.timer = game.time.events.loop(Phaser.Timer.SECOND * 0.2, function() {
      numberItem.tint = Math.random() * 0xffffff
    }, this);
    this.numberItems.add(numberItem);
  }
  numberItem.update = function() {
    if(numberItem.body.velocity.y > 1) {
      numberItem.angle += 1;
    }
  }
  numberItem.body.gravity.y = 950;
}

AttackOnBall.GameState.prototype.updateTimeNumber = function(a) {
  this.gaugeCropRect.width = (this.gauge.count % 100 + 1) / 100 * (game.width - 80);
  this.gauge.crop(this.gaugeCropRect);
  this.gaugeHead.x = this.gaugeCropRect.width * this.gauge.scale.x - 10;

  // 更新时间数字
  this.timeIntegerText.text = Math.floor(this.gauge.count / 10) + "";
  this.timeDecimalText.text = this.gauge.count % 10;
  this.timeIntegerText.x = this.gaugeHead.x - (this.timeIntegerText.width + this.dot.width + this.timeDecimalText.width);
  if(this.timeIntegerText.x < 0) {
    this.timeIntegerText.x = 0;
  }
  this.dot.x = this.timeIntegerText.right + 2;
  this.timeDecimalText.x = this.dot.right;
}

AttackOnBall.GameState.prototype.collectNumber = function(hero, numberItem) {
  numberItem.body.gravity.y = 0;
  numberItem.update = function() {
    game.physics.arcade.moveToObject(numberItem, this.gaugeHead, 1000);
    if(numberItem.y < 10) {
      numberItem.kill();
      numberItem.update = function() {};
      var reg = /(\d+)/gi;
      var res = reg.exec(numberItem.key);
      var number = parseInt(res[1]);
      this.gauge.count += number * 10;
      this.updateTimeNumber();
      game.time.events.repeat(Phaser.Timer.SECOND * 0.1, 10, function() {
        this.gauge.tint = Math.random() * 0xffffff;
      }, this);
    }
  }.bind(this);
}

AttackOnBall.GameState.prototype.over = function() {
  // 白色遮罩
  this.whiteMask = game.add.graphics(0, 0);
  this.whiteMask.beginFill(0xFFFFFF, 0.8);
  this.whiteMask.drawRect(0, 0, game.width, game.height);

  // 左边按钮
  this.buttonGamecenter = game.add.sprite(120, HEIGHT + 304, 'buttonGamecenter0');
  this.buttonGamecenter.anchor.setTo(0.5, 0.5);
  this.buttonGamecenter.inputEnabled = true;
  this.buttonGamecenter.events.onInputDown.add(this.buttonDown, this);
  this.buttonGamecenter.events.onInputUp.add(this.buttonUp, this);
  game.add.tween(this.buttonGamecenter).to({y: HEIGHT - 304}, 500, Phaser.Easing.Bounce.Out, true);

  // 右边按钮
  this.buttonShare = game.add.image(WIDTH - 120, HEIGHT + 304, 'buttonShare0');
  this.buttonShare.anchor.setTo(0.5, 0.5);
  this.buttonShare.inputEnabled = true;
  this.buttonShare.events.onInputDown.add(this.buttonDown, this);
  this.buttonShare.events.onInputUp.add(this.buttonUp, this);
  game.add.tween(this.buttonShare).to({y: HEIGHT - 304}, 500, Phaser.Easing.Bounce.Out, true);

  // 中间按钮
  this.buttonStart = game.add.sprite(WIDTH / 2, HEIGHT + 284, 'buttonPlay0');
  this.buttonStart.anchor.setTo(0.5, 0.5);
  this.buttonStart.inputEnabled = true;
  this.buttonStart.events.onInputDown.add(this.buttonDown, this);
  this.buttonStart.events.onInputUp.add(this.buttonUp, this);
  game.add.tween(this.buttonStart).to({y: HEIGHT - 304}, 500, Phaser.Easing.Bounce.Out, true, 200);

  // best
  var bestScore = window.localStorage && window.localStorage.getItem("bestScore");
  if(bestScore && bestScore > this.gauge.count) {
    this.bestScore = bestScore;
  } else {
    this.bestScore = this.gauge.count;
    window.localStorage && window.localStorage.setItem("bestScore", this.gauge.count);
  }
  this.bestGroup = game.add.sprite(-250, HEIGHT / 2 - 200);
  this.bestText = game.add.image(0, 0, 'wordBest');
  this.bestText.tint = 0x000000;
  this.bestIntegerText = game.add.bitmapText(0, this.bestText.bottom + 30, 'numberScoreEnd', '0', 32);
  this.bestIntegerText.tint = 0x000000;
  this.bestIntegerText.text = Math.floor(this.bestScore / 10) + "";
  this.bestDot = game.add.image(this.bestIntegerText.right + 2, this.bestIntegerText.bottom - 10, 'dot');
  this.bestDot.tint = 0x000000;
  this.bestDecimalText = game.add.bitmapText(this.bestDot.right, this.bestIntegerText.top, 'numberScoreEnd', '00', 32);
  this.bestDecimalText.tint = 0x000000;
  this.bestDecimalText.text = this.bestScore % 10;
  this.bestText.x = (this.bestDecimalText.right - this.bestIntegerText.left - this.bestText.width) / 2;
  this.bestGroup.addChild(this.bestText);
  this.bestGroup.addChild(this.bestIntegerText);
  this.bestGroup.addChild(this.bestDot);
  this.bestGroup.addChild(this.bestDecimalText);
  game.add.tween(this.bestGroup).to({x: WIDTH / 2 - 150 - (this.bestDecimalText.right - this.bestIntegerText.left)}, 500, Phaser.Easing.Cubic.Out, true, 200);

  // your
  this.yourScore = this.gauge.count;
  this.yourGroup = game.add.sprite(-250, HEIGHT / 2 - 200);
  this.yourText = game.add.image(0, 0, 'wordYour');
  this.yourText.tint = 0x2ad8d8;
  this.yourIntegerText = game.add.bitmapText(0, this.yourText.bottom + 30, 'numberScoreEnd', '00', 32);
  this.yourIntegerText.tint = 0x000000;
  this.yourIntegerText.text = Math.floor(this.yourScore / 10) + "";
  this.yourDot = game.add.image(this.yourIntegerText.right + 2, this.yourIntegerText.bottom - 10, 'dot');
  this.yourDot.tint = 0x000000;
  this.yourDecimalText = game.add.bitmapText(this.yourDot.right, this.yourIntegerText.top, 'numberScoreEnd', '00', 32);
  this.yourDecimalText.tint = 0x000000;
  this.yourDecimalText.text = this.yourScore % 10;
  this.yourText.x = (this.yourDecimalText.right - this.yourIntegerText.left - this.yourText.width) / 2;
  this.yourGroup.addChild(this.yourText);
  this.yourGroup.addChild(this.yourIntegerText);
  this.yourGroup.addChild(this.yourDot);
  this.yourGroup.addChild(this.yourDecimalText);
  game.time.events.loop(Phaser.Timer.SECOND * 0.1, function() {
    var color = Math.random() * 0xffffff;
    this.yourIntegerText.tint = color;
    this.yourDot.tint = color;
    this.yourDecimalText.tint = color;
  }, this);
  game.add.tween(this.yourGroup).to({x: WIDTH / 2 + 150}, 500, Phaser.Easing.Cubic.Out, true, 200);
}

AttackOnBall.GameState.prototype.buttonDown = function(button, point) {
  var len = button.key.length;
  var mainKey = button.key.substring(0, len-1);
  button.loadTexture(mainKey + '1');
  button.animTween = game.add.tween(button.scale).to({x: 1.1, y: 1.1}, 100, "Linear", true);
}

AttackOnBall.GameState.prototype.buttonUp = function(button, point) {
  var len = button.key.length;
  var mainKey = button.key.substring(0, len-1);
  button.animTween.stop();
  button.loadTexture(mainKey + '0');
  button.scale.setTo(1, 1);

  if(mainKey === "buttonGamecenter") {
    this.onGamecenter();
  } else if(mainKey === "buttonShare") {
    this.onShare();
  } else if(mainKey === "buttonPlay") {
    this.onPlay();
  }
}

AttackOnBall.GameState.prototype.onGamecenter = function() {
  console.log('onGamecenter');
}

AttackOnBall.GameState.prototype.onShare = function() {
  console.log('onShare');
}

AttackOnBall.GameState.prototype.onPlay = function() {
  game.state.start("MenuState", true, false, this.bestScore);
}



















