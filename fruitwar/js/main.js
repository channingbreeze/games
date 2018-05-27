var WIDTH = window.innerWidth * 2;
var HEIGHT = window.innerHeight * 2;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game')
game.MyState = {}
game.MyState.boot = {
	preload: function() {
		if(!game.device.desktop) { //判断是否是pc
			game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true
		}
	},
	create: function() {
		game.state.start('load', true)
		//game.stage.disableVisibilityChange = true 关闭失去焦点 游戏暂停的功能
	}
}
game.MyState.preload = {//加载资源图片
	preload: function() {
		//this.stage.backgroundColor = "#ff0000";
		game.load.image('background', 'images/bg_apple.png')
		game.load.image('bg', 'images/bg_lianxu.png')
		game.load.image('start', 'images/start.png')
		game.load.image('apple_ground', 'images/apple_ground.png')
		game.load.image('applewater_qian', 'images/applewater_qian.png')
		game.load.image('applewater_hou', 'images/applewater_hou.png')
		game.load.image('water1', 'images/water1.png')
		game.load.image('water2', 'images/water2.png')
		game.load.image('orange', 'images/orange.png')
		game.load.image('restart', 'images/restart.png')
		game.load.image('player', 'images/player1.png')
		game.load.image('lemon', 'images/lemon.png')
		game.load.image('orange', 'images/orange.png')
		game.load.image('restart', 'images/restart.png')
	},
	create: function() {
		game.state.start('start', true)
	}
}
game.MyState.start = {
	create: function() {
//		game.state.start('play', true)
//		return false
		var background = game.add.sprite(0, 0, 'background') //背景
		background.scale.set(this.game.width / 512, this.game.height / 1024);
		background.alpha = 1

		var bg = game.add.sprite(0, this.game.height, 'bg');
		bg.tint = 15000000 //Math.random()*0XFFFFFF
		//console.log(bg.tint) //13743738.656000825 15000000
		bg.scale.set(2, 2);
		//bg.blendMode = 0
		bg.alpha = 1

		this.bg2 = game.add.tileSprite(0, 0, this.game.width, this.game.height, bg.generateTexture())

		this.player = game.add.sprite(game.width / 2, this.game.height - 236, 'player')
		game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE)
		this.player.anchor.set(0.5, 0.5)
		this.player.scale.set(0.5, 0.5);
		this.player.body.collideWorldBounds = true;
		this.player.body.immovable = true;

		this.fruitGroup = game.add.group()
		this.fruitGroup.enableBody = true;
		//var size = game.cache.getImage('lemon').width
		this.lemon = this.fruitGroup.create(game.width / 2, 200, 'lemon')
		this.lemon.anchor.set(0.5, 0.5)
		this.lemon.scale.set(0.5, 0.5);
		this.lemon.ff = true;

		var applewater_hou = game.add.tileSprite(0, this.game.height - 140, 1024, 128, 'applewater_hou')
		var applewater_qian = game.add.tileSprite(0, this.game.height - 128, 1024, 128, 'applewater_qian')
		applewater_qian.autoScroll(-80, 0)
		applewater_hou.autoScroll(80, 0)
		applewater_qian.scale.set(2, 2);
		applewater_hou.scale.set(2, 2);
		
		var water1 = game.add.sprite(0, this.game.height - 180,'water1')
		var water2 = game.add.sprite(0, this.game.height - 150,'water2')
		water1.scale.set(0.7 , 0.7);
		water2.scale.set(0.7, 0.7);
		var tweenwater1 = game.add.tween(water1).to( { y: this.game.height - 150 }, 2000, "Linear", true, 0, -1);
		tweenwater1.yoyo(true, 0);
		var tweenwater2 = game.add.tween(water2).to( { y: this.game.height - 180 }, 2000, "Linear", true, 0, -1);
		tweenwater2.yoyo(true, 0);

		this.apple_ground = game.add.sprite(0, this.game.height - 236, 'apple_ground')
		this.apple_ground.scale.set(this.game.width / 1024, 0.5);


		var startbutton = game.add.button(game.width / 2, game.height / 2, 'start');
		startbutton.scale.set(0.5, 0.5);

		startbutton.inputEnabled = true;
		startbutton.anchor.setTo(0.5, 0.5); //设置按钮的中心点		
		startbutton.events.onInputUp.add(function() {
			game.state.start('play', true)
		}, this);
	}
}

game.MyState.play = {
	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//game.world.setBounds(0, 0,600 ,5000);
		//var add = game.TweenManager(game)
		var background = game.add.sprite(0, 0, 'background') //背景
		background.scale.set(this.game.width / 512, this.game.height / 1024);
		background.alpha = 1

		var bg = game.add.sprite(0, this.game.height, 'bg');
		bg.tint = 15000000 //Math.random()*0XFFFFFF
		//console.log(bg.tint) //13743738.656000825 15000000
		bg.scale.set(2, 2);
		//bg.blendMode = 0
		bg.alpha = 1

		this.bg2 = game.add.tileSprite(0, 0, this.game.width, this.game.height, bg.generateTexture())

		this.player = game.add.sprite(game.width / 2, this.game.height - 236, 'player')
		game.physics.arcade.enable(this.player, Phaser.Physics.ARCADE)
		this.player.anchor.set(0.5, 0.5)
		this.player.scale.set(0.5, 0.5);
		this.player.body.collideWorldBounds = true;
		this.player.body.immovable = true;

		this.fruitGroup = game.add.group()
		this.fruitGroup.enableBody = true;
		//var size = game.cache.getImage('lemon').width
		this.lemon = this.fruitGroup.create(game.width / 2, 350, 'lemon')
		this.lemon.anchor.set(0.5, 0.5)
		this.lemon.scale.set(0.5, 0.5);
		game.physics.arcade.enable(this.lemon, Phaser.Physics.ARCADE)
		this.lemon.ff = true;

		var applewater_hou = game.add.tileSprite(0, this.game.height - 140, 1024, 128, 'applewater_hou')
		var applewater_qian = game.add.tileSprite(0, this.game.height - 128, 1024, 128, 'applewater_qian')
		applewater_qian.autoScroll(-80, 0)
		applewater_hou.autoScroll(80, 0)
		applewater_qian.scale.set(2, 2);
		applewater_hou.scale.set(2, 2);
		
		var water1 = game.add.sprite(0, this.game.height - 180,'water1')
		var water2 = game.add.sprite(0, this.game.height - 150,'water2')
		water1.scale.set(0.7 , 0.7);
		water2.scale.set(0.7, 0.7);
		var tweenwater1 = game.add.tween(water1).to( { y: this.game.height - 150 }, 2000, "Linear", true, 0, -1);
		tweenwater1.yoyo(true, 0);
		var tweenwater2 = game.add.tween(water2).to( { y: this.game.height - 180 }, 2000, "Linear", true, 0, -1);
		tweenwater2.yoyo(true, 0);

		this.apple_ground = game.add.sprite(0, this.game.height - 236, 'apple_ground')
		this.apple_ground.scale.set(this.game.width / 1024, 0.5);
		game.physics.arcade.enable(this.apple_ground, Phaser.Physics.ARCADE)

		game.input.onTap.add(this.downEvents, this)		

		this.tcenterX = this.lemon
		this.tcenterY = 0
		this.target = null;
		this.angle = 3;
		this.lemonspeed = 0;
		this.playerspeed = 0;
		this.playerTime = 0
		this.overlapFlag = false;
		this.tapupFlag = false
		this.tapdownFlag = false
		this.lastBulletTime = 0
		this.lemonF = false
		this.firstFlag = 1;
		this.tleft = null;
		this.tright = null;
		this.fruitAngle = true
	},
	downEvents: function(a, b) {
		if(this.tapdownFlag) return false;
		Xvector = (this.player.x - this.tcenterX.x) * 4
		Yvector = (this.player.y - this.tcenterX.y) * 4
		this.lemonF = false;
		this.tapdownFlag = true;
		this.overlapFlag = true;
		this.bg2.autoScroll(0, 300)
		this.apple_ground.body.velocity.setTo(0, 300)
		if(this.firstFlag == 1) {
			this.player.body.velocity.setTo(0, -1000)
			this.firstFlag = 2
		} else {
			this.player.body.velocity.setTo(Xvector, Yvector)
		}

	},
	update: function() {
		if(this.player.body.blocked.left || this.player.body.blocked.down || this.player.body.blocked.right||this.player.body.blocked.up) {
			this.lemonF = false;
			this.overlapFlag = false;
			this.bg2.autoScroll(0, 0)
			this.player.body.velocity.setTo(0, 0)
			this.fruitGroup.setAll('body.velocity.y', 0);
			game.tweens.pauseAll()
			this.fruitGroup.setAll('rotation',0);
			this.fruitAngle = false;			
			var restart = game.add.button(WIDTH/2, HEIGHT-300, 'restart', this.actionOnClick, this);
			restart.anchor.set(0.5, 0.5)
			restart.scale.set(0.5, 0.5);

		}
		if(this.fruitAngle){
			this.lemonspeed += Math.PI / 180 * this.angle
			//this.lemon.rotation = this.lemonspeed;
			this.fruitGroup.setAll('rotation', this.lemonspeed);
		}
		
		if(this.lemonF) {
			this.creatFruit();
			this.playerspeed += Math.PI / 180 * this.angle
			this.player.x = this.tcenterX.x + Math.sin(-this.playerspeed) * 160;
			this.player.y = this.tcenterY.y + Math.cos(-this.playerspeed) * 160;
			this.player.rotation = -Math.PI / 2 + game.physics.arcade.angleBetween(this.player, this.target)
		}
		if(this.overlapFlag) {
			game.physics.arcade.overlap(this.player, this.fruitGroup, this.rotationEvents, null, this)
		}

	},

	//	getAngel:function (obj,target){
	//      return Math.atan2(obj.y - target.y, obj.x - target.x)*180/Math.PI;
	// },
	rotationEvents: function(player, lemon) {
		if(lemon.ff) {
			player.body.velocity.setTo(0, 0)
			var overangle = game.physics.arcade.angleBetween(player, lemon) + Math.PI / 2
			this.playerspeed = overangle
			this.lemonF = true;
			this.tapFlag = true;
			this.overlapFlag = false;
			this.tapdownFlag = false;
			this.tapupFlag = false;
			lemon.ff = false;
			this.tcenterX = lemon
			this.tcenterY = lemon
			this.target = lemon

		}
	},
	creatFruit: function() {
		var now = game.time.now
		if(now - this.lastBulletTime > 1500) {

			var size = game.cache.getImage('lemon').width
			var x = game.rnd.integerInRange(size / 4, game.width - size / 4)
			var y = 0;
			var fruit = this.fruitGroup.getFirstExists(false, true, x, -size / 4, 'lemon');
			fruit.anchor.set(0.5, 0.5)
			fruit.scale.set(0.5, 0.5);
			fruit.body.setSize(size, size)
			fruit.checkWorldBounds = true //边界判定 写法不同和上面我方飞机子弹原理相同
			fruit.outOfBoundsKill = true //回收
			fruit.ff = true;
			if(fruit.x > size / 4 && fruit.x < WIDTH / 2) {
				this.tleft = game.add.tween(fruit).to({
					x: WIDTH - size / 4
				}, 5000, Phaser.Easing.Linear.None, true);
			} else {
				this.tright = game.add.tween(fruit).to({
					x: size / 4
				}, 5000, Phaser.Easing.Linear.None, true)
			}
			this.lastBulletTime = now
		}
		this.fruitGroup.setAll('body.velocity.y', 300);
	},
	actionOnClick:function(){
		game.state.start('play', true)
	}

}
game.state.add('boot', game.MyState.boot)
game.state.add('load', game.MyState.preload)
game.state.add('start', game.MyState.start)
game.state.add('play', game.MyState.play)
game.state.start('boot', true) //默认是true 执行场景的时候 它会把world 里面的方法全部清空一下