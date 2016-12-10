
//宽高，渲染类型，渲染参数
var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('sky', 'assets/sky.jpg'); //加载游戏背景图
  game.load.image('ground', 'assets/platform.png'); //加载游戏地面
  game.load.image('star', 'assets/star.png'); //加载星星图片
  game.load.image('diamond', 'assets/diamond.png'); //加载钻石图片
  game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32); //敌人
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48); //加载单身狗图片
  game.load.image('firstaid', 'assets/firstaid.png', 32, 32);
}

var platforms;
var player;
var enemy_left;
var enemy_right;

var cursors;

var stars;
var diamonds;
var aid;
var playerV = 150;

var score = 0;
var diam = 0;
var scoreText;
var diamText;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE); //开启游戏物理系统
  game.add.sprite(0,0,'sky');//添加背景图
	platforms = game.add.group();//添加到组里
	platforms.enableBody = true; //在body上绑定触发
  var ground = platforms.create(0,game.world.height - 64,'ground');//创建地面
	ground.scale.setTo(2,2);//比例缩放
	ground.body.immovable = true; //固定定位
	var ledge = platforms.create(500,400,'ground');//坐标设置右上角2障碍物
  ledge.body.immovable = true;//使内容不因为碰撞而发生变化
	var ledge = platforms.create(550,200,'ground');//坐标设置右上角1障碍物
	ledge.body.immovable = true;
	var ledge = platforms.create(-140,250,'ground');//左2
	ledge.body.immovable = true;
  var ledge = platforms.create(-160,100,'ground');//左1
	ledge.body.immovable = true;
	var ledge = platforms.create(-110,400,'ground');//左3
	ledge.body.immovable = true;
	var ledge = platforms.create(-50,600,'ground');//左4
	ledge.body.immovable = true;
	player = game.add.sprite(32,game.world.height - 200,'dude'); //小人位置
	game.physics.arcade.enable(player); //速度，加速度，角速度，角加速度
  player.body.bounce.y = 0.2;//跳跃反弹计算
	player.body.gravity.y = 150;//跳跃重力值
	player.body.collideWorldBounds = true;//小人与边界进行碰撞开启检测
	player.animations.add('left',[0,1,2,3],10,true);
	//添加动画，左执行1-4帧，10帧每秒速度播放，循环播放
	player.animations.add('right',[5,6,7,8],10,true);
  //添加动画，右执行1-4帧，10帧每秒速度播放，循环播放
  enemy_left = game.add.sprite(20,game.world.height - 300,'baddie'); //敌人1位置
  game.physics.arcade.enable(enemy_left); //速度，加速度，角速度，角加速度
  enemy_left.body.bounce.y = 0.5;//跳跃反弹计算
  enemy_left.body.gravity.y = 300;//跳跃重力值
  enemy_left.body.collideWorldBounds = true;//敌人与边界进行碰撞开启检测
  enemy_left.animations.add('baddie');
  enemy_left.animations.play('baddie',8,true); 
  game.add.tween(enemy_left).to({ x:260 },5000,null,true,0,Number.MAX_VALUE,true);
  enemy_right = game.add.sprite(790,game.world.height - 500,'baddie'); //右侧敌人1位置
  game.physics.arcade.enable(enemy_right); //速度，加速度，角速度，角加速度
  enemy_right.body.bounce.y = 0.5;//跳跃反弹计算
  enemy_right.body.gravity.y = 300;//跳跃重力值
  enemy_right.body.collideWorldBounds = true;//敌人与边界进行碰撞开启检测
  enemy_right.animations.add('baddie');
  enemy_right.animations.play('baddie',8,true); 
  game.add.tween(enemy_right).to({ x:530 },6000,null,true,0,Number.MAX_VALUE,true); 
  aid = game.add.sprite(600,370,'firstaid');
  game.physics.arcade.enable(aid);
  aid.body.immovable = true;
  cursors = game.input.keyboard.createCursorKeys();//键盘事件
  stars = game.add.group();//星星组
  stars.enableBody = true;//开启速度
  diamonds = game.add.group();//钻石组
  diamonds.enableBody = true;//开启速度
  for(var i = 0; i < 24;i++){//创建星星
    var star = stars.create(i * 33,0,'star');
    var diamond = diamonds.create(i * 250,0,'diamond');
    star.body.gravity.y = 150;//重力150
    star.body.bounce.y = 0.5 + Math.random() * 0.2;//随即弹性
    diamond.body.gravity.y = 350;//重力150
    diamond.body.bounce.y = 0.5 + Math.random() * 0.2;//随即弹性
	}
  //添加分数计量器->X,Y,分数默认值,字体大小，字体填充颜色
	scoreText = game.add.text(16,16,'星星的分:0',{ fontSize : '32px',fill: '#FFF'});
	diamText = game.add.text(600,16,'钻石得分:0',{ fontSize : '32px',fill: 'red'});
}

function update() {
  game.physics.arcade.collide(player, platforms);//小人与platforms组碰撞
  game.physics.arcade.collide(enemy_left,player); //敌人1与小人碰撞
  game.physics.arcade.collide(enemy_left,platforms);//敌人1与platforms组碰撞
  game.physics.arcade.collide(enemy_right,player); //敌人3与小人碰撞
  game.physics.arcade.collide(enemy_right,platforms);//敌人3与platforms组碰撞
  game.physics.arcade.collide(stars,platforms);//星星与platforms组碰撞
  game.physics.arcade.collide(diamonds,platforms);//钻石与地面碰撞
  game.physics.arcade.overlap(player,aid,becomeStrong);//小人与血碰撞
  game.physics.arcade.overlap(player,stars,collectStar,null,this);//小人星星检测物理碰撞效果
  game.physics.arcade.overlap(player,diamonds,collectDiam,null,this);//小人与钻石碰撞效果
  game.physics.arcade.overlap(player,enemy_left,alert_enemy,null,this);
  game.physics.arcade.overlap(player,enemy_right,alert_enemy,null,this);   
  player.body.velocity.x = 0;//加速度默认值0
  if (cursors.left.isDown) {
    player.body.velocity.x = -playerV;
    player.animations.play('left');
  } else if (cursors.right.isDown) {
    player.body.velocity.x = playerV;
    player.animations.play('right');
  } else {
    player.animations.stop();
    player.frame = 4;//第四帧
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -250;//按上时候Y=-250，不允许小人在空中在此跳跃
  }
}

function collectStar (player,star,diamond){
  star.kill(); //触碰星星后自动销毁
  score += 10;
  scoreText.text = '星星的分:' +score ;
}

function collectDiam (player,diamond) {
  diamond.kill();
  diam += 20;
  diamText.text = '钻石得分:' +diam;
}

function alert_enemy(player, enemy) {
  player.kill();
  var gameoverText = game.add.text(game.width/2,game.height/2,'GameOver',{ fontSize : '32px',fill: '#000'});
  gameoverText.anchor.setTo(0.5,0.5)
}

function becomeStrong(player, aid) {
  //如果单身狗吃到了钻石，那么小人将以每秒100帧的速度开始播放(快腿功能)
  player.animations.add('left',[0,1,2,3],100,true);
  player.animations.add('right',[5,6,7,8],100,true);
  playerV = 600;
  aid.kill();
}
