
/**
* PreloadState，加载其他资源，设置加载动画
*/

var Phaser = Phaser || {};
var BirdsAnimals = BirdsAnimals || {};

// 继承 Phaser.State
BirdsAnimals.PreloadState = function () {
  Phaser.State.call(this);
};

BirdsAnimals.PreloadState.prototype = Object.create(Phaser.State.prototype);
BirdsAnimals.PreloadState.prototype.constructor = BirdsAnimals.PreloadState;

BirdsAnimals.PreloadState.prototype.preload = function () {
  game.load.image('bg', 'assets/bg.jpg');
  game.load.spritesheet('items', 'assets/items.png', 46, 50, 10);
  game.load.spritesheet('choices', 'assets/choices.png', 72, 72, 10);

  game.load.spritesheet('runGezi', 'assets/run_gezi.jpg', 60, 60, 5);
  game.load.spritesheet('runYinshayu', 'assets/run_yinshayu.jpg', 60, 60, 5);
  game.load.spritesheet('runYanzi', 'assets/run_yanzi.jpg', 60, 60, 5);
  game.load.spritesheet('runJinshayu', 'assets/run_jinshayu.jpg', 60, 60, 5);
  game.load.spritesheet('runTuzi', 'assets/run_tuzi.jpg', 60, 60, 5);
  game.load.spritesheet('runHouzi', 'assets/run_houzi.jpg', 60, 60, 5);
  game.load.spritesheet('runXiongmao', 'assets/run_xiongmao.jpg', 60, 60, 5);
  game.load.spritesheet('runLaoying', 'assets/run_laoying.jpg', 60, 60, 5);
  game.load.spritesheet('runShizi', 'assets/run_shizi.jpg', 60, 60, 5);
  game.load.spritesheet('runKongque', 'assets/run_kongque.jpg', 60, 60, 5);
  
  game.load.spritesheet('bigXiongmao', 'assets/anim_xiongmao.png', 354, 354, 5);
  game.load.spritesheet('bigLaoying', 'assets/anim_laoying.png', 354, 354, 5);
  game.load.spritesheet('bigShizi', 'assets/anim_shizi.png', 354, 354, 5);
  game.load.spritesheet('bigHouzi', 'assets/anim_houzi.png', 354, 354, 5);
  game.load.spritesheet('bigGezi', 'assets/anim_gezi.png', 354, 354, 5);
  game.load.spritesheet('bigKongque', 'assets/anim_kongque.png', 354, 354, 5);
  game.load.spritesheet('bigYanzi', 'assets/anim_yanzi.png', 354, 354, 5);
  game.load.spritesheet('bigTuzi', 'assets/anim_tuzi.png', 354, 354, 5);

  game.load.image('bigYinshayu', 'assets/anim_yinshayu.png');
  game.load.image('bigJinshayu', 'assets/anim_jinshayu.png');
  game.load.spritesheet('bigShayubg', 'assets/anim_shayubg.png', 660, 660, 3);
  
  game.load.spritesheet('fish1', 'assets/fish1.png', 222, 97, 3);
  game.load.spritesheet('fish2', 'assets/fish2.png', 124, 124, 2);
  game.load.spritesheet('fish3', 'assets/fish3.png', 124, 124, 2);

  game.load.audio('sound-bg-silent', 'assets/bg_silent.mp3');
  game.load.audio('sound-bg-play', 'assets/bg_play.mp3');

  game.load.audio('sound-xiongmao', 'assets/xiongmao.mp3');
  game.load.audio('sound-yinshayu', 'assets/yinshayu.mp3');
  game.load.audio('sound-jinshayu', 'assets/jinshayu.mp3');
  game.load.audio('sound-laoying', 'assets/laoying.mp3');
  game.load.audio('sound-shizi', 'assets/shizi.mp3');
  game.load.audio('sound-houzi', 'assets/houzi.mp3');
  game.load.audio('sound-tuzi', 'assets/tuzi.mp3');
  game.load.audio('sound-kongque', 'assets/kongque.mp3');
  game.load.audio('sound-yanzi', 'assets/yanzi.mp3');
  game.load.audio('sound-gezi', 'assets/gezi.mp3');

};

BirdsAnimals.PreloadState.prototype.create = function () {
  // 去开始界面
  game.state.start('StartState');
};
