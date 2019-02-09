
var game = new Phaser.Game(
	448,
	846,
	Phaser.CANVAS,
	'container'
);
  
game.score = 0;
var gameover = false;

  var overState = function(game){
      this.create = function(){
          this.bg = this.add.image(0,0,'background_2');
		  this.textScore = this.add.text(66.6,205,game.score,{fill:'#fff',fontSize:'162px', align: "center"});
		  this.textScore.scale.set(0.72,1);
		  this.textScore.anchor.set(.5);
		  this.textScore.x = this.world.centerX;
		  this.textScore.y = this.textScore.height*2;
		  this.btnStart = this.add.image(0,0,'btnReStart');
		  this.btnStart.anchor.set(.5);
		  this.btnStart.x = this.game.world.centerX;
		  this.btnStart.y = this.game.world.height - this.btnStart.height*1.81;
		  this.btnStart.inputEnabled = true;
		  this.btnStart.events.onInputDown.add(function(){
		  	game.state.start('game');
		  },this);	
		  this.bainian = this.add.image(0,0,'bainian');		
		  this.bainian.anchor.set(.5);
		  this.bainian.height *= 1.5;
		  this.bainian.x = this.game.world.centerX;
		  this.bainian.y = this.bainian.height * 3.6;
      }
  }
  var gameState = function(game){
	  this.init = function(){
		game.score = 0;
		gameover = false;
	  	if (this.fu) {
	  		this.fu.destroy();
	  	}
	  }
      this.create = function(){
          this.bg = this.add.image(0,0,'background_0');
          this.textScore = this.add.text(66.6,205,game.score,{fill:'#fff',fontSize:'33px', align: "center"});
          this.textScore.anchor.set(.5);
		  this.arr = ['blue','blue','red','yellow','red'];
		  this.fu = this.add.group();
		  this.dao = this.add.image(0,0,'button');
		  this.dao.y = this.world.height - this.dao.height;
		  this.dao.x = this.dao.width*0.115;
		  this.dao.inputEnabled = true;
		  this.daofu = this.add.image(0,0,'button');
		  this.daofu.y = this.dao.y;
		  this.daofu.x = this.daofu.width*1.315;
		  this.daofu.inputEnabled = true;
		  this.yun = this.add.image(0,0,'button');
		  this.yun.y = this.dao.y;
		  this.yun.x = this.world.width - this.yun.width*1.05;
		  this.yun.inputEnabled = true;
		  this.dao.alpha = this.yun.alpha = this.daofu.alpha = 0;
		  
		  this.dao.events.onInputDown.add(function(){
		  	if (this.fu.getChildAt(this.fu.length-1).key=='blue') {
		  		this.fu.getChildAt(this.fu.length-1).destroy();
				game.score++;
		  	} else {
		  		//否
				this.arr = ['blue','red','yellow'];
				this.r = this.rnd.between(0,2);
				this.fu_ = this.add.image(0,0,this.arr[this.r]);
				this.fu_.anchor.set(.5);
				this.fu_.x = this.world.centerX;
				this.fu_.y = this.fu_.height*1.41;
				this.fu_.alpha = 0;
				this.fu.add(this.fu_);
		  	}
		  },this);
		  this.daofu.events.onInputDown.add(function(){
		  	if (this.fu.getChildAt(this.fu.length-1).key=='red') {
		  		this.fu.getChildAt(this.fu.length-1).destroy();
				game.score++;
		  	} else {
		  		//否
				this.arr = ['blue','red','yellow'];
				this.r = this.rnd.between(0,2);
				this.fu_ = this.add.image(0,0,this.arr[this.r]);
				this.fu_.anchor.set(.5);
				this.fu_.x = this.world.centerX;
				this.fu_.y = this.fu_.height*1.41;
				this.fu_.alpha = 0;
				this.fu.add(this.fu_);
		  	}
		  },this);
		  this.yun.events.onInputDown.add(function(){
		  	if (this.fu.getChildAt(this.fu.length-1).key=='yellow') {
		  		this.fu.getChildAt(this.fu.length-1).destroy();
				game.score++;
		  	} else {
		  		//否
				this.arr = ['blue','red','yellow'];
				this.r = this.rnd.between(0,2);
				this.fu_ = this.add.image(0,0,this.arr[this.r]);
				this.fu_.anchor.set(.5);
				this.fu_.x = this.world.centerX;
				this.fu_.y = -this.fu_.height;
				this.fu_.alpha = 0;
				this.fu.add(this.fu_);
		  	}
		  },this);
		   
		  for (let key in this.arr) {
			this.fu_ = this.add.image(0,0,this.arr[key]);
			this.fu_.anchor.set(.5);
			this.fu_.x = this.world.centerX;
			this.fu_.y = this.fu_.height*1.414;
			this.fu.add(this.fu_);
		  }
		  
		  for (var i = 0; i < this.fu.length; i++) {
		  	if (i==0) {
		  		continue;
		  	}
			console.log(this.fu.getChildAt(i).key);
			this.fu.getChildAt(i).y = this.fu.getChildAt(i-1).y + 20;
		  }
		  
		
      }
	  game.dt = 0;
	  this.update = function(){
		if (gameover) {
			game.state.start('over');
		}
	  	game.dt++;
		if (game.dt%60==0) {//每一秒为一帧 *1
			this.arr = ['blue','red','yellow'];
			this.r = this.rnd.between(0,2);
			this.fu_ = this.add.image(0,0,this.arr[this.r]);
			this.fu_.anchor.set(.5);
			this.fu_.x = this.world.centerX;
			this.fu_.y = this.fu_.height*1.41;
			this.fu.add(this.fu_);
			console.log(this.fu.length);
			if (this.fu.length >= 22) {
				gameover = true;
			}
			for (let i = 0; i < this.fu.length; i++) {
				if (i==0) {
					continue;
				}
				this.fu.getChildAt(i).y = this.fu.getChildAt(i-1).y + 20;				
			}
			
			
			for (let i = 3; i < this.fu.length; i++) {
				this.fu.getChildAt(i).alpha=1;
			}
			
			this.textScore.setText(game.score);
		}
	  }
  }
  var menuState = function (game){
      this.create = function(){
          this.bg = this.add.image(0,0,'background_1');
		  this.btnStart = this.add.image(0,0,'btnStart');
		  this.btnStart.anchor.set(.5);
		  this.btnStart.x = this.game.world.centerX;
		  this.btnStart.y = this.game.world.height - this.btnStart.height*1.81;
		  this.btnStart.inputEnabled = true;
		  this.btnStart.events.onInputDown.add(function(){
		  	game.state.start('game');
		  },this);
      }
  }

  var bootState = function(game){
	  this.init = function () {  
		if (!game.device.desktop) {
			var scaleX = window.innerWidth / 448;
			var scaleY = window.innerHeight / 846;
			this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.game.scale.setUserScale(scaleX, scaleY);
		} else {
			game.scale.pageAlignHorizontally=true;
			game.scale.pageAlignVertically=true;
			var scaleY = window.innerHeight / 846;
			this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.game.scale.setUserScale(1, scaleY);
		}
	  }
      this.preload = function(){
              ////////////////////////////////////////////////////////////////////////////menuState
          this.load.image('background_0','./images/background.jpg');
          this.load.image('background_1','./images/background_2.png');
          this.load.image('background_2','./images/background_3.png');
          this.load.image('blue','./images/blue.png');
          this.load.image('red','./images/red.png');
          this.load.image('yellow','./images/yellow.png');
          this.load.image('btnStart','./images/btnStart.png');
          this.load.image('btnReStart','./images/btnReStart.png');
          this.load.image('button','./images/button.png');
          this.load.image('bainian','./images/bainian.png');
      }
      this.create = function(){
          game.state.start('menu');
      }
  } 

game.state.add("boot", bootState);
game.state.add("menu", menuState);
game.state.add("game", gameState);
game.state.add("over", overState);
game.state.start("boot");