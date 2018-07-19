
var game = new Phaser.Game(414,736,Phaser.CANVAS,'');

// 场景一 预先加载
var bootState = function(game) {
  this.preload = function() {
    game.load.atlasXML('loadImg','assets/loading/sprites.png','assets/loading/sprites.xml');
  };
  this.create = function() {
    //在第一个场景运行好之后，启动第二个场景
    game.state.start('loader');
    game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;    
  };
}

// 场景二 LOADING
var loaderState = function(game){
  var progressText;//百分比文字
  var loadImg;
  this.init = function() {
    loadImg = game.add.sprite(game.world.centerX -10, game.world.centerY -40, 'loadImg');
    loadImg.anchor.set(0.5, 0.5);
    loadImg.animations.add('loadImg_away',[0, 1, 2, 3, 4]);
    loadImg.play('loadImg_away', 10, true);
    progressText = game.add.text(game.world.centerX -50, game.world.centerY + 70,'0%',{fill:'#fff',fontSize:'16px'});
    progressText.font = '微软雅黑';
  }
  this.preload = function(){
    game.load.atlasXML('bg_sprites','assets/run_bg/sprites.png','assets/run_bg/sprites.xml');
    game.load.atlasXML('running','assets/running/sprites.png','assets/running/sprites.xml');
    game.load.image('bg_sy','assets/bg_sy.png');
    game.load.atlasXML('he_run','assets/he/sprites.png','assets/he/sprites.xml');
    game.load.atlasXML('startBtn','assets/btn/sprites.png','assets/btn/sprites.xml');
    game.load.image('titimg','assets/titimg.png');
    game.load.image('stopBtn','assets/stopBtn.png');
    game.load.image('stopBg','assets/stopBg.png');
    game.load.onFileComplete.add(function(progress) {
      progressText.text ='游戏加中' + progress + '%...';
      if(progress == 100) {
        game.state.start('jmBgState');
      }
    });
  }
}

// 场景3 登场了！！！！！！颤抖吧！！凡人！！！！
var jmBgState = function(game) {
  var bgsy;
  var titimg;
  var startBtn;
  var tween;

  this.init = function(){
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  }
  this.create = function(){
    game.world.setBounds(0,0,414,1600);
    bgsy = game.add.image(0,0 ,'bg_sy');
    bgsy.scale.set(0.7);
    titimg = game.add.image(game.world.centerX, game.world.centerY-620 ,'titimg');
    titimg.scale.set(0.7);
    titimg.anchor.set(0.5, 0.5);
    btnRight = game.add.button(game.world.centerX-150, game.world.centerY-270 ,'startBtn',function(){
      game.state.start('runState');
    },game,0,0,3,0);
    //BTN动画
    btnRight.animations.add('btnRight_running_away',[0, 1,2,3]);
    btnRight.play('btnRight_running_away', 10, true);
    tween = game.add.tween(titimg);
    tween.from({y:game.world.centerY-820},2000,Phaser.Easing.Bounce.Out,true);
  }
  this.update = function() {
  }
}

// 场景4 开跑！
var runState = function(game){
  var emitter;
  var emitterLeft;
  var emitterRight;
  var bgrunning;
  var runningMan;
  var progressTextScore;
  var score= 0;
  var progressTextTime;
  var timeText = 60; //默认时间

  this.create = function(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0,0,414,1600);
    //运动背景
    bg_sprites = game.add.sprite(0, 0, 'bg_sprites');
    bgrunning = bg_sprites.animations.add('qs_walk_away',[0, 1, 2, 3, 4,5]);
    bgrunning.play( 10, true);
    bg_sprites.scale.set(0.7);
    //跑男
    running = game.add.sprite(140, 150, 'running');
    runningMan = running.animations.add('running_away',[0, 1]);
    runningMan.play( 10, true);
    running.scale.set(0.7);
    var pointer = game.input.activePointer;
    console.log(pointer);
    game.input.onUp.add(function(){			
      if(pointer.position.x > running.x && running.x < 210 && pointer.position.y > running.y){
        running.x+=70;
      }else if(pointer.position.x < running.x && running.x > 70 && pointer.position.y > running.y){
        running.x-=70;
      }else if(pointer.position.y < running.y && running.y > 80){
        running.y-=70;
        running.animations.add('running_away',[2]);
        running.play('running_away', 10, true);
        running.scale.set(0.7);
        setTimeout("running.y+=70",500);
        setTimeout("running.animations.add('running_away',[0,1])",500);
        setTimeout(" running.play('running_away', 10, true)",500);
        setTimeout(" running.scale.set(0.7)",500);
      }
    });
    
    //中间
    emitter = game.add.emitter(200,700);
    emitter.makeParticles('he_run',2);
    emitter.setXSpeed(30,30);//设置X速度 最小值 最大值
    emitter.setYSpeed(-400,-400);//设置Y速度 最小值 最大值
    emitter.setScale(1,0,1,0,5000);
    emitter.setAlpha(1,0,5000);
    emitter.setRotation(0,0);
    emitter.start(false,900,Math.random()*10000+1000,0);

    emitter1 = game.add.emitter(200,700);
    emitter1.makeParticles('he_run',0);
    emitter1.setXSpeed(30,30);//设置X速度 最小值 最大值
    emitter1.setYSpeed(-400,-400);//设置Y速度 最小值 最大值
    emitter1.setScale(1,0,1,0,5000);
    emitter1.setAlpha(1,0,5000);
    emitter1.setRotation(0,0);
    emitter1.start(false,900,Math.random()*15000+1000,0);

    //左
    emitterLeft = game.add.emitter(80,700);
    emitterLeft.makeParticles('he_run',2);
    emitterLeft.setXSpeed(80,80);//设置X速度 最小值 最大值
    emitterLeft.setYSpeed(-500,-500);//设置Y速度 最小值 最大值
    emitterLeft.setScale(1,0,1,0,5000);
    emitterLeft.setAlpha(1,0,5000);
    emitterLeft.setRotation(0,0);
    emitterLeft.start(false,900,Math.random()*8000+1000,0);

    emitterLeft1 = game.add.emitter(80,700);
    emitterLeft1.makeParticles('he_run',0);
    emitterLeft1.setXSpeed(80,80);//设置X速度 最小值 最大值
    emitterLeft1.setYSpeed(-500,-500);//设置Y速度 最小值 最大值
    emitterLeft1.setScale(1,0,1,0,5000);
    emitterLeft1.setAlpha(1,0,5000);
    emitterLeft1.setRotation(0,0);
    emitterLeft1.start(false,900,Math.random()*9500+1000,0);

    //右
    emitterRight = game.add.emitter(400,700);
    emitterRight.makeParticles('he_run',2);
    emitterRight.setXSpeed(-110,-110);//设置X速度 最小值 最大值
    emitterRight.setYSpeed(-500,-500);//设置Y速度 最小值 最大值
    emitterRight.setScale(1,0,1,0,5000);
    emitterRight.setAlpha(1,0,5000);
    emitterRight.setRotation(0,0);
    emitterRight.start(false,900,Math.random()*9000+1000,0);

    emitterRight1 = game.add.emitter(400,700);
    emitterRight1.makeParticles('he_run',0);
    emitterRight1.setXSpeed(-110,-110);//设置X速度 最小值 最大值
    emitterRight1.setYSpeed(-500,-500);//设置Y速度 最小值 最大值
    emitterRight1.setScale(1,0,1,0,5000);
    emitterRight1.setAlpha(1,0,5000);
    emitterRight1.setRotation(0,0);
    emitterRight1.start(false,900,Math.random()*9500+1000,0);

    game.physics.enable(running,Phaser.Physics.ARCADE);
    game.physics.enable(emitter,Phaser.Physics.ARCADE);
    running.enableBody = true;
    progressTextScore  = game.add.text(30, 30,'得分： '+score,{fill:'#414141',fontSize:'20px'});
    progressTextScore.font = '微软雅黑';
    progressTextTime  = game.add.text(250, 30,'剩余时间： ' +timeText,{fill:'#414141',fontSize:'20px'});
    progressTextTime.font = '微软雅黑';
    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

    function updateCounter() {
      if(timeText >0){
        score+=5;
        timeText--;
        progressTextScore.text ='得分：' + score ;
        progressTextTime.text ='剩余时间： ' + timeText;
      }
      if(timeText ==0){
        bgrunning.loop = false;
        runningMan.loop = false;
        emitter1.kill(); 
        emitter.kill();
        emitterLeft1.kill(); 
        emitterLeft.kill();
        emitterRight1.kill(); 
        emitterRight.kill();
        progressTextScore.text ='得分：' + score ;
        progressTextTime.text ='剩余时间： ' + timeText;
        var stopBg = game.add.image(30,150,'stopBg');
        stopBg.scale.set(1.2);
        var stopTextSmall  = game.add.text(70, 190,'恭喜你本次得分为',{fill:'#414141',fontSize:'20px'});	
        stopTextSmall.font = '微软雅黑';	
        var stopTextBigScore =	game.add.text(90, 220,score,{fill:'#414141',fontSize:'150px'});
        //我在游戏结束时给你了个BUTTON,用于跳转到分数页，晚一点给你
        //传完值之后顺便地址给个跳转到游戏分数页，这个页面等等我做一个给你吧(还没做好，晚一点发你)
        game.add.button(50,370 ,'stopBtn',function(){
          //游戏暂停，alert分数
          alert('我被点击了，分数：' + score + '，去发ajax吧！');
        },game);
      }
    }
  }
  this.update = function(){
    //被中树撞
    game.physics.arcade.overlap(emitter, running,function(){
      if(running.x ==140 && emitter.x ==200){
        score+=-5;
        progressTextScore.text ='得分：' + score ;
      }
    });
    //中金币
    game.physics.arcade.overlap(emitter1, running,function(){
      if(running.x ==140){
        score+=5;
        progressTextScore.text ='得分：' + score ;
      }
    });
    //左树
    game.physics.arcade.overlap(emitterLeft, running,function(){
      if(running.x ==70){
        score-=5;
        progressTextScore.text ='得分：' + score ;
      }
    });
    //左金币
    game.physics.arcade.overlap(emitterLeft1, running,function(){
      if(running.x ==70){
        score+=5;
        progressTextScore.text ='得分：' + score ;
      }
    });

    game.physics.arcade.overlap(emitterRight, running,function(){
      if(running.x ==210){
        score-=5;
        progressTextScore.text ='得分：' + score ;
      }
    });
    game.physics.arcade.overlap(emitterRight1, running,function(){
      if(running.x ==210){
        score+=5;
        progressTextScore.text ='得分：' + score ;
      }
    });
  }
}

game.state.add('boot',bootState);
game.state.add('loader',loaderState);
game.state.add('jmBgState',jmBgState);
game.state.add('runState',runState);
game.state.start('boot');//启动第一个场景
  