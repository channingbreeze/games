// 游戏场景
var PlayScene = {
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bg = game.add.image(0, 0, 'background');
    this.gravity = 1000;
    this.fruits = [];
    this.score = 0;
    this.playing = true;
    this.bombExplode = false;
    this.blade = new Blade({
      game: game
    });
    this.blade.allowBlade();
    // 没切到的水果数
    this.lostCount = 0;
    this.scoreAnim();
    this.scoreTextAnim();
    this.bestAnim();
    this.xxxAnim();
  },
  update: function() {
    // 检查是否有fruit出了边界
    if(!this.bombExplode) {
      for(var i=0; i<this.fruits.length; i++) {
        var fruit = this.fruits[i];
        if(fruit.sprite().body.velocity.y > 0 && !fruit.sprite().inWorld) {
          if(fruit.isFruit) {
            this.onOut(fruit);
          }
          fruit.sprite().kill();
          fruit = null;
          this.fruits.splice(i, 1);
        }
      }
    }
    if(this.playing && this.fruits.length == 0 && !this.bombExplode) {
      this.startFruit();
    }
    // 开始有刀光
    this.blade.update();
    if(!this.bombExplode) {
      for(var i=0; i<this.fruits.length; i++) {
        var fruit = this.fruits[i];
        this.blade.checkCollide(fruit.sprite(), function() {
          if(fruit.isFruit) {
            this.onKill(fruit);
            this.fruits.splice(i, 1);
          } else {
            this.onBomb(fruit);
          }
        }.bind(this));
      }
    }
  },
  scoreAnim: function() {
    this.scoreImage = game.add.image(8, 8, 'score');
    this.scoreImage.x = -this.scoreImage.width;
    game.add.tween(this.scoreImage).to({x: 8}, 300, Phaser.Easing.Sinusoidal.InOut, true);
  },
  bestAnim: function() {
    this.best = game.add.image(8, 52, 'best');
    this.best.x = -this.best.width;
    game.add.tween(this.best).to({x: 5}, 300, Phaser.Easing.Sinusoidal.InOut, true);
  },
  scoreTextAnim: function() {
    this.scoreText = game.add.bitmapText(75, 40, 'number', this.score + '', 32);
    this.scoreText.x = -this.scoreText.width;
    game.add.tween(this.scoreText).to({x: 75}, 300, Phaser.Easing.Sinusoidal.InOut, true);
  },
  xxxAnim: function() {
    this.xxxGroup = game.add.group();
    this.x = game.add.image(0, 0, 'x');
    this.xx = game.add.image(22, 0, 'xx');
    this.xxx = game.add.image(49, 0, 'xxx');
    this.xxxGroup.addChild(this.x);
    this.xxxGroup.addChild(this.xx);
    this.xxxGroup.addChild(this.xxx);
    this.xxxGroup.x = game.width;
    this.xxxGroup.y = 5;
    game.add.tween(this.xxxGroup).to({x: game.width-86}, 300, Phaser.Easing.Sinusoidal.InOut, true);
  },
  startFruit: function() {
    var number = mathTool.randomMinMax(1, 5);
    var hasBomb = Math.floor(Math.random() * 2);
    var bombIndex = -1;
    if(hasBomb) {
      bombIndex = Math.floor(Math.random() * number);
    }
    for(var i=0; i<number; i++) {
      if(i == bombIndex) {
        this.fruits.push(this.randomFruit(false));
      } else {
        this.fruits.push(this.randomFruit(true));
      }
    }
  },
  randomFruit: function(isFruit) {
    var fruitArray = ["apple", "banana", "basaha", "peach", "sandia"];
    var index = Math.floor(Math.random() * fruitArray.length);
    var x = mathTool.randomPosX();
    var y = mathTool.randomPosY();
    var vx = mathTool.randomVelocityX(x);
    var vy = mathTool.randomVelocityY();
    var fruit;
    if(isFruit) {
      fruit = new Fruit({
        game: game,
        key: fruitArray[index],
        x: x,
        y: y
      });
    } else {
      fruit = new Bomb({
        game: game,
        x: x,
        y: y
      });
    }
    fruit.isFruit = isFruit;
    fruit.sprite().body.velocity.x = vx;
    fruit.sprite().body.velocity.y = vy;
    fruit.sprite().body.gravity.y = this.gravity;
    return fruit;
  },
  onOut: function(fruit) {
    var x;
    var y;
    // 从下面出去
    if(fruit.sprite().y > game.height) {
      x = fruit.sprite().x;
      y = game.height - 30;
    } else if(fruit.sprite().x < 0) {
    // 从左边出去
      x = 30;
      y = fruit.sprite().y;
    } else {
    // 从右边出去
      x = game.width - 30;
      y = fruit.sprite().y;
    }
    var lose = game.add.sprite(x, y, 'lose');
    lose.anchor.setTo(0.5, 0.5);
    lose.scale.setTo(0.0, 0.0);
    this.loseTweenShow = game.add.tween(lose.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Sinusoidal.InOut, false);
    this.loseTweenHide = game.add.tween(lose.scale).to({x: 0.0, y: 0.0}, 300, Phaser.Easing.Sinusoidal.InOut, false, 1000);
    this.loseTweenHide.owner = lose;
    this.loseTweenShow.chain(this.loseTweenHide);
    this.loseTweenShow.start();
    this.loseTweenHide.onComplete.add(function(target, tween) {
      tween.owner.kill();
    }, this);
    this.lostCount++;
    this.loseCount();
  },
  onKill: function(fruit) {
    // 计算角度
    var deg = this.blade.collideDeg();
    fruit.half(deg, true);
    this.score = this.score + 1;
    this.scoreText.text = this.score + '';
  },
  onBomb: function(bomb) {
    this.bombExplode = true;
    for(var i=0; i<this.fruits.length; i++) {
      this.fruits[i].sprite().body.gravity.y = 0;
      this.fruits[i].sprite().body.velocity.y = 0;
      this.fruits[i].sprite().body.velocity.x = 0;
    }
    bomb.explode(function() {
      for(var i=0; i<this.fruits.length; i++) {
        this.fruits[i].sprite().kill();
      }
      this.fruits.splice(0, this.fruits.length);
    }.bind(this), function() {
      this.gameOver();
    }.bind(this));
  },
  loseCount: function() {
    if(this.lostCount == 1) {
      this.lostAnim(this.x, 'xf');
    } else if(this.lostCount == 2) {
      this.lostAnim(this.xx, 'xxf');
    } else if(this.lostCount == 3) {
      this.lostAnim(this.xxx, 'xxxf');
      this.gameOver();
    }
  },
  lostAnim: function(removeObj, addKey) {
    this.xxxGroup.removeChild(removeObj);
    removeObj.kill();
    this[addKey] = game.add.sprite(0, 0, addKey);
    this[addKey].reset(removeObj.x + this[addKey].width/2, removeObj.y + this[addKey].height/2);
    this.xxxGroup.addChild(this[addKey]);
    this[addKey].anchor.setTo(0.5, 0.5);
    this[addKey].scale.setTo(0, 0);
    game.add.tween(this[addKey].scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Sinusoidal.InOut, true);
  },
  gameOver: function() {
    this.playing = false;
    var gameOverSprite = game.add.sprite(0, 0, 'game-over');
    gameOverSprite.anchor.setTo(0.5, 0.5);
    gameOverSprite.scale.setTo(0, 0);
    gameOverSprite.reset(game.width/2, game.height/2);
    game.add.tween(gameOverSprite.scale).to({x: 1.0, y: 1.0}, 300, Phaser.Easing.Sinusoidal.InOut, true);
    game.input.onUp.add(this.restartGame, this);
  },
  restartGame: function() {
    game.state.start('main');
  }
};
