MyGame.Game = function(game) {
	game.speed = 7;
	game.run = false;
	game.onFloor = false;
	game.win = false;
	game.playerDead = false;
	game.direction = 1;
};
MyGame.Game.prototype = {
  create: function() {
    self = this;
    this.sound = game.add.audio('music');
    
    game.stage.backgroundColor = '#a8e6ff';
    game.cloud = this.add.tileSprite(0,0,2079,851,'cloud');
    game.cloud.fixedToCamera = true;
    game.city1 = this.add.tileSprite(0,690,1798,359,'city1');
    game.city1.fixedToCamera = true;
    game.city2 = this.add.tileSprite(0,700,1353,580,'city2');
    game.city2.fixedToCamera = true;
    
    game.player = game.add.sprite(300,game.world.height - 36 - 60 ,'player');
    game.player.anchor.set(0,0.5)
    game.player.animations.add('player');
    
    
    game.physics.enable([game.player],Phaser.Physics.ARCADE);
    
    game.map = game.add.tilemap('game_map');
    game.map.addTilesetImage('map','map');
    game.hinder = game.map.createLayer('world');
    game.hinder.resizeWorld();
    
    game.map.setCollisionBetween(1,4);

    game.input.onTap.add(this.playerJump, this);
    
    
    game.cover = game.add.graphics(0, 0);
    game.cover.beginFill(0x000000,.7);
    game.cover.drawRect(0, 0, 784,game.world.height);
    game.cover.endFill();
    game.wayPic = game.add.image(30,100,'gameway');
    game.go = this.add.button(400,game.world.height - 260,'go',function(){
      this.gameStart()
    },this);
    game.go.anchor.set(0.5)
    game.add.tween(game.go.scale).to({x:.95,y:.95},500,Phaser.Easing.Linear.None,true,0,-1,true)
    game.cover.addChild(game.wayPic);
    game.cover.addChild(game.go);
      
  },
  update: function() {
    if(!game.run) return;
    
    game.onFloor = false;
    game.physics.arcade.collide(game.player, game.hinder,function(){
      game.onFloor = true;
    });
    if(!game.win)
    {
      if(game.player.x >= game.world.bounds.right - 100)
      {
        this.gamewin();
      }
    }
    if(!game.playerDead)
    {
      game.camera.x += game.speed;
      if(game.camera.x >= game.player.x + game.player.width){
        this.gameover();
      }
      game.player.body.velocity.y = 800 * game.direction;
      game.player.body.velocity.x = game.speed * 60;
    }
  },
  gameStart : function(){
    game.run = true;
    game.cover.destroy();
    this.sound.loopFull(1);
    game.player.animations.play('player',game.speed * 4,true);
    game.cloud.autoScroll(-game.speed*10,0);
    game.city1.autoScroll(-game.speed*20,0);
    game.city2.autoScroll(-game.speed*30,0);
    game.player.autoCull = true;
    game.player.checkWorldBounds = true;
    game.player.events.onOutOfBounds.add(this.gameover, this);
      
  },
  playerJump : function(){
    if(game.onFloor)
    {
      game.direction == 1 ? game.direction = -1 : game.direction = 1;
      game.player.scale.y = game.direction;
    }
  },
  gamewin : function(){
    game.win = true;
    game.cloud.autoScroll(0,0);
    game.city1.autoScroll(0,0);
    game.city2.autoScroll(0,0);
    
    if(Math.random() * 100 <= config.change)
    {
      GameUI.showPoil(true)
    }
    else
    {
      GameUI.showPoil(false)
    }
    
  },
  gameover : function(){
    
    if(game.win) return;
    
    game.playerDead = true;
    game.cloud.autoScroll(0,0);
    game.city1.autoScroll(0,0);
    game.city2.autoScroll(0,0);
    
    game.graphics = game.add.graphics(0, 0);
    game.graphics.beginFill(0xff0000,.7);
    game.graphics.drawRect(0, 0, game.world.width,game.world.height);
    game.graphics.endFill();
      game.add.tween(game.graphics).to({alpha:0},200,Phaser.Easing.Linear.None,true,0,2).onComplete.add(function(){
      game.graphics.kill();
      this.gamerest();
    },this);
  },
  gamerest : function(){
    game.playerDead = false;
    game.win = false;
    game.camera.x = 0;
    game.player.x = 300;
    game.player.y = game.world.height - 103 - 36;
    game.direction = 1;
    game.player.scale.y = game.direction;
    game.cloud.autoScroll(-game.speed*10,0);
    game.city1.autoScroll(-game.speed*20,0);
    game.city2.autoScroll(-game.speed*30,0);
  },
  render : function(){    	
    //game.debug.body(game.player);
  }
};

