onload=function(){

  var startText;
  var welcomeState = function(game){
    this.create=function(){
      startText=game.add.text(game.world.centerX,game.world.centerY,'Click anywhere on the screen to start',{fill:'#fff',fontSize:'16px'});
      startText.anchor={x:0.5,y:0.5};
      game.input.onDown.addOnce(Down, this);
    };
  }

  var gameState = function(game){
    var player;
    var ground;
    var bridge;
    var magma;
    var stars;
    var thorns;
    var monsters;
    var left=[];
    var hp=3;
    var hp_=0;
    var heart=[];
    var door;
    var scoreText;
    var cursors;
    this.create=function(){
      game.physics.startSystem(Phaser.ARCADE);
      game.stage.backgroundColor = '#2d2d2d';

      var dudeData = [
      '.......3.....',
      '......333....',
      '....5343335..',
      '...332333333.',
      '..33333333333',
      '..37773337773',
      '..38587778583',
      '..38588888583',
      '..37888888873',
      '...333333333.',
      '.F....5556...',
      '3E34.6757.6..',
      '.E.55.666.5..',
      '......777.5..',
      '.....6..7....',
      '.....7..7....',
      ];

      var groundData = [
      'AAAAAAAAAAAAAAAAAAAA',
      'AAAAAAAAAAAAAAAAAAAA',
      'AAAAAAAAAAAAAAAAAAAA'
      ]

      var magmaData = [
      '37333373333733373373',
      '33373337333333337333',
      '37337333337333733337'
      ];

      var starData = [
      '..7..',
      '.777.',
      '77777',
      '.777.',
      '..7..'
      ];

      var thornData = [
      '..E..',
      '.EEE.',
      'EEEEE'
      ];

      var monsterData = [
      'FFFFF',
      'F7F7F',
      'FFFFF',
      'FF.FF',
      'FF.FF'
      ];

      var doorData = [
      '888888888',
      '888888888',
      '887777788',
      '887F7F788',
      '887777788',
      '8877.7788',
      '8877.7788',
      '888888888',
      '888888888'
      ];

      var heartData = [
      '.333...333.',
      '33333.33333',
      '33333333333',
      '33333333333',
      '.333333333.',
      '..3333333..',
      '...33333...',
      '....333....',
      '.....3.....'
      ];

      game.create.texture('phaserDude', dudeData, 3, 3, 0);
      player = game.add.sprite(555, 400, 'phaserDude');
      game.physics.arcade.enable(player);
      player.body.gravity.y=300;
      player.scale.setTo(0.8);
      player.anchor.set(0.5);
      player.body.collideWorldBounds=true;//创建猪脚

      game.create.texture('phaserGround', groundData, 15, 9, 0);//可用循环简化代码
      ground=game.add.group();
      ground.enableBody=true;
      bridge=ground.create(-100,70,'phaserGround');
      bridge.body.immovable=true;
      bridge=ground.create(600,70,'phaserGround');
      bridge.body.immovable=true;
      bridge=ground.create(250,170,'phaserGround');
      bridge.body.immovable=true;
      bridge=ground.create(-100,270,'phaserGround');
      bridge.body.immovable=true;
      bridge=ground.create(250,270,'phaserGround');
      bridge.body.immovable=true;
      bridge=ground.create(600,270,'phaserGround');
      bridge.body.immovable=true;
      bridge=ground.create(250,370,'phaserGround');
      bridge.body.immovable=true;
      bridge=ground.create(0,500,'phaserGround');
      bridge.body.immovable=true;
      bridge=ground.create(500,500,'phaserGround');
      bridge.body.immovable=true;//创建地板

      game.create.texture('phaserMagma', magmaData, 40, 15, 0);
      magma = game.add.sprite(0, 0, 'phaserMagma');
      magma.y=game.height-magma.height;//创建岩浆
      game.physics.arcade.enable(magma);

      game.create.texture('phaserStar', starData, 4,4, 0);
      stars=game.add.group();
      stars.enableBody=true;
      for (var i = 0; i<9; i++) {
        var star = stars.create(i*90,0,'phaserStar');
        star.body.gravity.y=300;
        star.body.bounce.y=0.7+Math.random()*0.2;
      }//创建星星
      for (var i = 0; i<9; i++) {
        for (var j = 2; j < 4; j++) {
          var star = stars.create(i*90,j*100,'phaserStar');
          star.body.gravity.y=300;
          star.body.bounce.y=0.7+Math.random()*0.2;
        }
      }

      game.create.texture('phaserThorn', thornData, 3, 3, 0);//创建地刺
      thorns=game.add.group();
      thorns.enableBody=true;
      for (var i = 0; i<9; i++) {
        for (var j = 0; j < 4; j++) {
          var thorn = thorns.create(i*90,j*100,'phaserThorn');
          thorn.body.gravity.y=300;
          if (j==1) {
            thorn.kill();
          }
        }
      }

      game.create.texture('phaserMonster', monsterData, 5, 5, 0);//创建怪物//game.add.sprite(15, 15, 'phaserMonster');
      monsters=game.add.group();
      monsters.enableBody=true;
      for (var i = 0; i<5; i++) {
        var monster = monsters.create(50+i*150,0,'phaserMonster');
        monster.body.gravity.y=300;
        monster.body.bounce.y=0.5+Math.random()*0.1;
        left[i]=monsters.getChildAt(i).x;
      }
      for (var i = 0; i<5; i++) {
        for (var j = 2; j < 4; j++) {
          if (j=2) {
            var monster = monsters.create(i*150,j*100,'phaserMonster');
            monster.body.gravity.y=300;
            monster.body.bounce.y=0.5+Math.random()*0.1;
          }
          if (j=3) {
            var monster = monsters.create(50+i*100,j*100,'phaserMonster');
            monster.body.gravity.y=300;
            monster.body.bounce.y=0.5+Math.random()*0.1;
          }
        }
      }

      game.create.texture('phaserDoor', doorData, 5, 10, 0);//门

      scoreText=game.add.text(0,5,'score：'+ score,{fontSize:'27px',fill:'#900'});//文本
      scoreText.x=(game.width-scoreText.width)/2;
      scoreText.inputEnabled = true;

      game.create.texture('phaserHeart', heartData, 3, 3, 0);
      for (var i = 0; i < hp+1; i++) {
        heart[i]=game.add.sprite(0, 0, 'phaserHeart');
        heart[i].scale.setTo(0.7);
        if (i==0) {heart[i].x=game.width-heart[i].width*3*2;}
        if (i>0) { heart[i].x=heart[i-1].x+heart[i-1].width;}
        heart[i].y=heart[i].height/1.5;
      }
      heart[3].alpha=0;
      cursors = game.input.keyboard.createCursorKeys();       
    };

    var x=1;

    this.update=function(){
      game.physics.arcade.collide(player,ground);
      game.physics.arcade.collide(stars,ground);
      game.physics.arcade.collide(monsters,ground);
      game.physics.arcade.collide(thorns,ground);
      game.physics.arcade.overlap(stars,player,collectStar,null,this);
      game.physics.arcade.overlap(monsters,player,isDead,null,this);
      game.physics.arcade.overlap(thorns,player,offDead,null,this);
      game.physics.arcade.overlap(door,player,function(){
        scoreText.text="you are won!";
        scoreText.x=(game.width-scoreText.width)/2;
        scoreText.y=(game.height-scoreText.height)/2
        var sec=0;
        game.time.events.loop(Phaser.Timer.SECOND, function(){
          sec+=1;
          if (sec==2) {
            location.reload();  
          }
        }, this);
      },null,this);

      //怪物移动
      for (var i = 0; i < monsters.length; i++) {
        monsters.getChildAt(i).x+=x;
        if (monsters.getChildAt(i).x>=left[i]+200){
          x=-x;
        }
        if (monsters.getChildAt(i).x<left[i]){
          x=-x;
        }
      }
      game.physics.arcade.overlap(magma,player,function(){
        for (var i = heart.length - 1; i >= 0; i--) {
          heart[i].kill();
        }
        hp=0;
        player.kill();
        scoreText.text="you are dead!Click to reStart";
        scoreText.x=(game.width-scoreText.width)/2;
        scoreText.y=(game.height-scoreText.height)/2;
      },null,this);
      //if ( player.y > magma.y ) {alert('')};//坠落岩浆

      if (cursors.left.isDown) {//角色移动
        player.body.velocity.x=-150;
        player.scale.x = 0.8;
      } else if (cursors.right.isDown) {
        player.body.velocity.x=150;
        player.scale.x = -0.8;
      } else {
        player.body.velocity.x=0;
      }
      if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y=-300;
      }
    }

    this.render=function(){
      if (hp>1) {
        scoreText.events.onInputDown.add(onDown, this);
      }
    }

    var score=0;
    function collectStar(player,star){
      star.kill();//消除星星
      score+=1;
      if (score==27) {
        door = game.add.sprite(0, 0, 'phaserDoor');
        game.physics.arcade.enable(door);
        door.x=(game.width-door.width)/2;
        door.y=170-door.height;
      }
      scoreText.text='score：' + score;
      scoreText.x=(game.width-scoreText.width)/2;
    }

    function isDead(player,monsters){
      monsters.kill();
      heart[hp_].kill();
      hp-=1;
      hp_+=1;
      if (hp==0) {
        player.kill();
        scoreText.text="you are dead!Click to reStart";
        scoreText.x=(game.width-scoreText.width)/2;
        scoreText.y=(game.height-scoreText.height)/2
      }
    }

    function offDead(player,thorns){
      thorns.kill();
      heart[hp_].kill();
      hp-=1;
      hp_+=1;
      if (hp==0) {
        player.kill();
        scoreText.text="you are dead!Click to reStart";
        scoreText.x=(game.width-scoreText.width)/2;
        scoreText.y=(game.height-scoreText.height)/2;
      }
    }

  }

  function Down(){
    startText.destroy();
    setTimeout(function() {
      game.state.start('main');
    }, 100)
  }

  function onDown(){
    location.reload();
  }

  var game=new Phaser.Game(800,600,Phaser.CANVAS,'container');
  game.state.add('welcome',welcomeState);
  game.state.add('main',gameState);
  game.state.start('welcome');
}

