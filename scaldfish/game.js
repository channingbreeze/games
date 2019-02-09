
var game = new Phaser.Game(
	500,
	890,
	Phaser.CANVAS,
	'container'
);

game.run = true; 
game.score = 0;


var overState = function(game){
	this.create = function(){ 
		this.add.image(0,0,'menu_bg');
		this.button = this.add.image(0,0,'btnReStart');
		this.button.anchor.set(.5); 
		this.button.x = this.world.centerX;
		this.button.y = 890 - this.button.height*2;
		this.button.inputEnabled = true;
		this.button.events.onInputDown.add(function(){
			this.state.start('game'); 
		},this);
		this.textScore = this.add.text(0,0,game.score,{fill:'#fff',fontSize:'72px', align: "center"});
		this.textScore.anchor.set(.5); 
		this.textScore.y = 890 - this.button.height * 4.4;
		this.textScore.x = this.world.centerX;
	} 
}
 
var gameState = function(game){
	this.init = function(){
		game.score = 0;
		game.run = true; 
	}
	this.create = function(){		
		this.world.setBounds(0, 0, 500, 3560);//*4
		this.camera.y = 890*3;//*3
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.bgB = this.add.group();
		this.bgB.create(0,890*0,'bg');
		this.bgB.create(0,890*1,'bg');
		this.bgB.create(0,890*2,'bg');
		this.bgB.create(0,890*3,'bg'); 
		this.bg = this.add.image(0,890*3,'game_bg'); 
		this.textBorder = this.add.image(0,0,'textBorder'); 
		this.textBorder.y = this.textBorder.width + 0;
		this.textBorder.fixedToCamera = true;
		this.textScore = this.add.text(0,0,game.score,{fill:'#fff',fontSize:'33px', align: "center"});
		this.textScore.y = this.textBorder.y + 5;
		this.textScore.x = this.textBorder.width/2 - 5;
		this.textScore.fixedToCamera = true;
		
		 
		this.cloud = this.add.image(0,890*3,'cloud');
		this.cloud.y = this.cloud.height + 890*3;
		this.sp = this.add.group();
		this.sp.enableBody = true;
		this.sp_1 = this.sp.create(0,this.camera.y,'sp_1');
		this.sp_1.anchor.set(0.5,0.1);
		this.sp_1.sx = 0;
		this.sp_1.x = this.world.centerX;
		this.sp.sX = 1;
		this.sp.sXDF = -0.1;
		this.sp.sf = true;
		this.sp.sx = 0;
		this.sp.a = 0;
		this.sp.b = [];
		this.sp.t = 0;
		this.sp.bH = this.world.height - 260;
		this.bgB.setAll('inputEnabled',"true");
		for (var i = 0; i < this.bgB.length; i++) {
			this.bgB.getChildAt(i).events.onInputDown.add(function(){
				this.sp.sf = false;
				this.sp.getChildAt(this.sp.length-1).body.velocity.y = 600;
			},this);
		}	
		
	}
	this.dt = 0; 
	this.update = function(){
		if (!game.run) {
			return false;
		}
		this.dt++;
		if (this.sp.sf) {
			if (this.dt%10==0) {
				this.sp.sX += this.sp.sXDF;
				if (this.sp.sX<=0.2) {
					this.sp.sXDF = 0.1;
				}
				if (this.sp.sX>=1) { 
					this.sp.sXDF = -0.1;
				}
				this.sp.getChildAt(this.sp.length-1).scale.set(this.sp.sX,1);
			}
		} else {
			if (this.sp.getChildAt(this.sp.length-1).top + this.sp.getChildAt(this.sp.length-1).height>= this.sp.bH - this.sp.getChildAt(this.sp.length-1).height*(this.sp.length-1)) {
				this.sp.getChildAt(this.sp.length-1).body.velocity.y = 0;
				
				this.sp.a = this.sp.sX;
				this.sp.b[this.sp.t] = this.sp.a;
				this.sp.t++;
				// console.log("上一个" + this.sp.a + ';;;' + '数组：' +  this.sp.b);
				// console.log(this.sp.b.length);
				if (this.sp.a > this.sp.b[this.sp.b.length-2]) {
					game.run = false;
					
					this.huajuan = this.add.image(0,0,'huajuan');
					this.huajuan.anchor.set(.5);
					this.huajuan.x = this.world.centerX;
					this.huajuan.y = this.huajuan.height;
					this.huajuan.sx = 0.1;
					this.huajuan.dt = 0;
					this.huajuan.run = true;
					this.huajuan.update = function(){
						this.dt++;
						if (this.dt%2==0) {
							if (this.run) {
								this.sx+=0.1;
								if (this.sx>=1) {  
									this.run = false;
									game.state.start('over');
								}
								this.scale.set(this.sx,1);
							}
						}
					}
					this.huajuan.fixedToCamera = true;
				} else {
					this.sp_1 = this.sp.create(0,this.camera.y,'sp_1');
					this.sp_1.anchor.set(0.5,0.1);
					this.sp_1.sx = 0;
					this.sp_1.x = this.world.centerX;
					this.sp.sf = true;
					this.camera.y -= this.sp_1.height ;
					game.score++;
					this.textScore.setText(game.score);
				}
			}
		}
	}
}

var menuState = function(game){
	this.create = function(){
		this.add.image(0,0,'menu_bg');
		this.button = this.add.image(0,0,'btnStart');
		this.button.anchor.set(.5);
		this.button.x = this.world.centerX;
		this.button.y = this.world.height - this.button.height*4;
		this.button.inputEnabled = true;
		this.button.events.onInputDown.add(function(){
			this.state.start('game');
		},this);
	}
}

var bootState = function(game){  
	this.init = function () {  
		if (!game.device.desktop) {
			var scaleX = window.innerWidth / 500;
			var scaleY = window.innerHeight / 889;
			this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.game.scale.setUserScale(scaleX, scaleY);
		} else {
			game.scale.pageAlignHorizontally=true;
			game.scale.pageAlignVertically=true;
			var scaleY = window.innerHeight / 889;
			this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			this.game.scale.setUserScale(1, scaleY);
		}
	}
    this.preload = function(){
		this.load.image('bg','./assets/bg.jpg');
		this.load.image('btnReStart','./assets/btnReStart.jpg');
		this.load.image('btnStart','./assets/btnStart.jpg');
		this.load.image('cloud','./assets/cloud.png');
		this.load.image('game_bg','./assets/game_bg.png');
		this.load.image('huajuan','./assets/huajuan.png');
		this.load.image('icon','./assets/icon.jpg');
		this.load.image('menu_bg','./assets/menu_bg.jpg');
		this.load.image('textBorder','./assets/textBorder.png');
		this.load.image('sp_1','./assets/sp_1.png');
		this.load.image('sp_2','./assets/sp_2.png');
		this.load.image('sp_3','./assets/sp_3.png'); 
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