// 主场景
var MainScene = {
  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bg = game.add.image(0, 0, 'background');
    this.blade = new Blade({
      game: game
    });
    // 开始动画了
    this.homeGroupAnim();
  },
  update: function() {
    this.updateRotate();
    // 是否该跳场景了
    if(this.start) {
      this.gotoNextScene();
    }
    // 开始有刀光
    this.blade.update();
    if(this.sandia && this.sandia.sprite().alive && !this.start) {
      this.blade.checkCollide(this.sandia.sprite(), function() {
        this.startGame();
      }.bind(this));
    }
  },
  homeGroupAnim: function() {
    this.homeGroup = game.add.group();
    this.home_mask = game.add.image(0, 0, 'home-mask');
    this.logo = game.add.image(20, 0, 'logo');
    this.homeGroup.addChild(this.home_mask);
    this.homeGroup.addChild(this.logo);
    this.homeGroup.y = -this.home_mask.height;
    this.homeGroupTween = game.add.tween(this.homeGroup).to({y: 0}, 400, Phaser.Easing.Sinusoidal.InOut, true);
    this.homeGroupTween.onComplete.add(this.titleAnim, this);
  },
  titleAnim: function() {
    this.ninja = game.add.image(328, 0, 'ninja');
    this.ninja.y = -this.ninja.height;
    this.ninjaTween = game.add.tween(this.ninja).to({y: 40}, 500, Phaser.Easing.Bounce.Out, true);
    this.ninjaTween.onComplete.add(this.homeDescAnim, this);
  },
  homeDescAnim: function() {
    this.home_desc = game.add.image(10, 125, 'home-desc');
    this.home_desc.x = -this.home_desc.width;
    this.homeDescTween = game.add.tween(this.home_desc).to({x: 10}, 300, Phaser.Easing.Sinusoidal.InOut, true);
    this.homeDescTween.onComplete.add(this.fruitAnim, this);
  },
  fruitAnim: function() {
    // 桃子动画
    this.peachGroup = game.add.group();
    this.peachGroup.x = 97;
    this.peachGroup.y = 378;
    this.dojo = game.add.image(0, 0, 'dojo');
    this.dojo.anchor.setTo(0.5, 0.5);
    this.dojoRotateSpeed = 0.3;
    this.peach = new Fruit({
      game: game,
      key: 'peach'
    });
    this.peachRotateSpeed = 1.2;
    this.peachGroup.addChild(this.dojo);
    this.peachGroup.addChild(this.peach.sprite());
    this.peachGroup.scale.setTo(0, 0);
    game.add.tween(this.peachGroup.scale).to({x:1, y:1}, 500, Phaser.Easing.Linear.None, true);
    // 西瓜动画
    this.sandiaGroup = game.add.group();
    this.sandiaGroup.x = 323;
    this.sandiaGroup.y = 373;
    this.new_game = game.add.image(0, 0, 'new-game');
    this.new_game.anchor.setTo(0.5, 0.5);
    this.newGameRotateSpeed = -0.3;
    this.sandia = new Fruit({
      game: game,
      key: 'sandia'
    });
    this.sandiaRotateSpeed = 0.9;
    this.sandiaGroup.addChild(this.new_game);
    this.sandiaGroup.addChild(this.sandia.sprite());
    this.sandiaGroup.scale.setTo(0, 0);
    game.add.tween(this.sandiaGroup.scale).to({x:1, y:1}, 500, Phaser.Easing.Linear.None, true);
    // 炸弹动画
    this.bombGroup = game.add.group();
    this.bombGroup.x = 550;
    this.bombGroup.y = 400;
    this.quit = game.add.image(0, 0, 'quit');
    this.quit.anchor.setTo(0.5, 0.5);
    this.quitRotateSpeed = 0.3;
    this.bombGroup.addChild(this.quit);
    this.bomb = new Bomb({
      game: game
    });
    this.bombGroup.addChild(this.bomb.sprite());
    this.bombGroup.scale.setTo(0, 0);
    this.bombAnim = game.add.tween(this.bombGroup.scale).to({x:1, y:1}, 500, Phaser.Easing.Linear.None, true);
    // 炸弹动画结束后，可以进行鼠标操作
    this.bombAnim.onComplete.add(this.allowBlade, this);
  },
  // 转圈
  updateRotate: function() {
    if(this.dojo) {
      this.dojo.angle += this.dojoRotateSpeed;
    }
    if(this.peach) {
      this.peach.sprite().angle += this.peachRotateSpeed;
    }
    if(this.new_game) {
      this.new_game.angle += this.newGameRotateSpeed;
    }
    if(this.sandia) {
      this.sandia.sprite().angle += this.sandiaRotateSpeed;
    }
    if(this.quit) {
      this.quit.angle += this.quitRotateSpeed;
    }
  },
  allowBlade: function() {
    this.blade.allowBlade();
  },
  // 开始游戏
  startGame: function() {
    this.start = true;
    game.add.tween(this.homeGroup).to({y: -this.home_mask.height}, 200, Phaser.Easing.Sinusoidal.InOut, true);
    game.add.tween(this.ninja).to({y: -this.ninja.height}, 200, Phaser.Easing.Sinusoidal.InOut, true);
    game.add.tween(this.home_desc).to({x: -this.home_desc.width}, 200, Phaser.Easing.Sinusoidal.InOut, true);
    this.dojo.kill();
    this.new_game.kill();
    this.quit.kill();
    // 桃子动画
    this.peachRotateSpeed = 0;
    this.peach.sprite().body.velocity.x = -200;
    this.peach.sprite().body.velocity.y = -200;
    this.peach.sprite().body.gravity.y = 2000;
    // 炸弹动画
    this.bombRotateSpeed = 0;
    this.bomb.sprite().body.velocity.x = 100;
    this.bomb.sprite().body.velocity.y = -200;
    this.bomb.sprite().body.gravity.y = 2000;
    // 西瓜动画
    var deg = this.blade.collideDeg();
    this.sandia.half(deg);
  },
  gotoNextScene: function() {
    if(this.peach && this.peach.sprite() && !this.peach.sprite().inWorld
      && this.bomb && this.bomb.sprite() && !this.bomb.sprite().inWorld) {
      this.resetScene();
      game.state.start('play');
    }
  },
  resetScene: function() {
    // 可重入场景重置化
    this.sandia = null;
    this.peach = null;
    this.bomb = null;
    this.start = false;
  }
};
