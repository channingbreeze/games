
var game = new Phaser.Game(240, 400, Phaser.CANVAS, 'game');

game.States = {};

game.States.boot = function() {
  this.preload = function() {
    if(typeof(GAME) !== "undefined") {
      this.load.baseURL = GAME + "/";
    }
    if(!game.device.desktop){
      this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
      this.scale.forcePortrait = true;
      this.scale.refresh();
    }
    game.load.image('loading', 'assets/preloader.gif');
  };
  this.create = function() {
    game.state.start('preload');
  };
};

game.States.preload = function() {
  this.preload = function() {
    var preloadSprite = game.add.sprite(10, game.height/2, 'loading');
    game.load.setPreloadSprite(preloadSprite);
    game.load.image('whitejian', 'assets/whitejian.png');
    game.load.image('greenjian', 'assets/greenjian.png');
    for(var i=0; i<PERSONS.length; i++) {
      game.load.image(PERSONS[i], 'assets/' + PERSONS[i] + '.jpg');
    }
    //game.load.audio('laugh', 'assets/laugh.mp3');
    //game.load.audio('message', 'assets/message.mp3');
  };
  this.create = function() {
    game.state.start('main');
  };
};

game.States.main = function() {
  this.create = function() {
    // 背景
    game.stage.backgroundColor = '#EBEBEB';
    // 文字样式
    this.textStyle = {
      font: "14px Arial",
      fill: '#000000',
      wordWrap: true,
      wordWrapWidth: game.width - 80
    };
    this.myStyle = {
      font: "14px Arial",
      fill: '#ff0000',
      wordWrap: true,
      wordWrapWidth: game.width - 80
    };
    // 间隙
    this.ellipse = 30;
    // 数组
    this.words = [];
    //this.message = game.add.audio('message', 1, false);
    //this.laugh = game.add.audio('laugh', 0.5, false);
    var count = -1;
    var $this = this;
    var ran = function() {
      if(count < 0) {
        var ranTime = 1;
      } else {
        var ranTime = GSENS[count].time;
      }
      game.time.events.add(Phaser.Timer.SECOND * ranTime, function() {
        count++;
        if(count >= GSENS.length) {
          //$this.laugh.play();
          document.getElementById('share').style.display = 'block';
          return;
        }
        $this.say(GSENS[count].name, GSENS[count].str, GSENS[count].me);
        if(count == 0) {
          //$this.message.play();
        }
        ran();
      }, this);
    }
    ran();
  };
  this.say = function(head, text, me) {
    // 虚拟一个text来计算宽高
    var tmp = game.add.text(0, 0, text, this.textStyle);
    tmp.lineSpacing = -3;
    var width = tmp.width;
    var height = tmp.height;
    tmp.kill();
    // 都上移一个高度
    for(var i=0; i<this.words.length; i++) {
      var newpos = this.words[i].pos - height - this.ellipse;
      if(newpos < 0 - this.words[i].height) {
        this.words[i].sprite.kill();
        this.words.splice(0, 1);
        i--;
      } else {
        game.add.tween(this.words[i].sprite).to({y: newpos}, 100, Phaser.Easing.Linear.None, true);
        this.words[i].pos = newpos;
      }
    }
    // 创建一个sprite
    if(me) {
      var sprite = game.add.sprite(game.width - 40, game.height, head);
    } else {
      var sprite = game.add.sprite(10, game.height, head);
    }
    // 背景
    var rounded = game.make.graphics(0, 0);
    if(me) {
      rounded.beginFill(0xa0e75a);
      rounded.drawRoundedRect(-width-29, 0, width+17, height+7, 4);
    } else {
      rounded.beginFill(0xffffff);
      rounded.drawRoundedRect(42, 0, width+17, height+7, 4);
    }
    rounded.endFill();
    sprite.addChild(rounded);
    // 尖尖
    if(me) {
      var jian = game.make.sprite(-12, 10, 'greenjian');
    } else {
      var jian = game.make.sprite(37, 10, 'whitejian');
    }
    sprite.addChild(jian);
    // 文本
    if(me) {
      var txt = game.make.text(-width-19, 7, text, this.textStyle);
    } else {
      var txt = game.make.text(52, 7, text, this.textStyle);
    }
    txt.lineSpacing = -3;
    sprite.addChild(txt);
    game.add.tween(sprite).to({y: game.height - height - this.ellipse}, 100, Phaser.Easing.Linear.None, true);
    this.words.push({
      sprite: sprite,
      height: height,
      pos: game.height - height - this.ellipse
    });
  };
};

game.state.add('boot', game.States.boot);
game.state.add('preload', game.States.preload);
game.state.add('main', game.States.main);

game.state.start('boot');

if(TITLE) {
  document.title = TITLE;
}

window.onload = function() {
  if(LOGO) {
    document.getElementById('logo').src = LOGO;
  }
}
