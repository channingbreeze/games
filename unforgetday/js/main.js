var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var graphics;
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game',null, true);
game.MyState = {};
game.bgMusic = null;
game.elementA = null;
game.elementB = null;
game.elementC = null;
game.elementD = null;
game.elementE = null;
game.musicF = true;
game.musicIcon
game.MyState.boot = function() {
	this.preload = function() {
		game.load.image("loadingBg", "images/loadingBg.jpg")
		game.load.spritesheet("loading", "images/loading.jpg", 296, 242, 11)
		//this.stage.backgroundColor = "#fff"
		if(!game.device.desktop) { //判断是否是pc
			//game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;					
		}
	}
	this.create = function() {
		game.state.start('load', true)
		game.stage.disableVisibilityChange = true // 关闭失去焦点 游戏暂停的功能

	}
}
game.MyState.preload = function() {
	this.preload = function() {
		game.add.tileSprite(0, 0, game.width, game.height, 'loadingBg')
		var preloadsprite = game.add.sprite(game.world.width / 2, game.world.height / 2, 'loading');
		preloadsprite.anchor.set(0.5, 0.5)
		anim = preloadsprite.animations.add('walk');
		anim.play(10, true);
		game.load.audio('bgaudio', 'music/bgm.mp3');
		game.load.image("bg", "images/bg_shouye.jpg")
		game.load.image("boy_05", "images/boy_05.png")
		game.load.image("musicon", "images/musicon.png")
		game.load.image("btn_start", "images/btn_start.png")
		game.load.image("musicoff", "images/musicoff.png")
		game.load.image("qipao", "images/qipao.png")
		game.load.image("a_01", "images/a_01.jpg")
		game.load.image("a_02", "images/a_02.jpg")
		game.load.image("a_03", "images/a_03.jpg")
		game.load.image("a_04", "images/a_04.jpg")
		game.load.image("a_05", "images/a_05.jpg")
		game.load.image("a_06", "images/a_06.jpg")
		game.load.image("a_07", "images/a_07.jpg")
		game.load.image("a_08", "images/a_08.jpg")

		game.load.image("b_01", "images/b_01.png")
		game.load.image("b_02", "images/b_02.png")
		game.load.image("b_03", "images/b_03.png")
		game.load.image("b_04", "images/b_04.png")
		game.load.image("b_05", "images/b_05.png")
		game.load.image("b_06", "images/b_06.png")
		game.load.image("b_07", "images/b_07.png")
		game.load.image("b_08", "images/b_08.png")
		game.load.image("b_09", "images/b_09.png")
		game.load.image("b_010", "images/b_10.png")
		game.load.image("b_011", "images/b_11.png")
		game.load.image("b_012", "images/b_12.png")
		game.load.image("b_013", "images/b_13.png")
		game.load.image("b_014", "images/b_14.png")
		game.load.image("b_015", "images/b_15.png")
		game.load.image("b_016", "images/b_16.png")
		game.load.image("b_017", "images/b_17.png")
		game.load.image("b_018", "images/b_18.png")
		game.load.image("b_019", "images/b_19.png")
		game.load.image("b_020", "images/b_20.png")
		game.load.image("b_021", "images/b_21.png")

		game.load.image("c_01", "images/c_01.png")
		game.load.image("c_02", "images/c_02.png")
		game.load.image("c_03", "images/c_03.png")
		game.load.image("c_04", "images/c_04.png")
		game.load.image("c_05", "images/c_05.png")
		game.load.image("c_06", "images/c_06.png")
		game.load.image("c_07", "images/c_07.png")
		game.load.image("c_08", "images/c_08.png")
		game.load.image("c_09", "images/c_09.png")
		game.load.image("c_010", "images/c_10.png")
		game.load.image("c_011", "images/c_11.png")
		game.load.image("c_012", "images/c_12.png")

		game.load.image("d_01", "images/d_01.png")
		game.load.image("d_02", "images/d_02.png")
		game.load.image("d_03", "images/d_03.png")
		game.load.image("d_04", "images/d_04.png")
		game.load.image("d_05", "images/d_05.png")
		game.load.image("d_06", "images/d_05.png")
		game.load.image("d_07", "images/d_07.png")
		game.load.image("d_08", "images/d_08.png")
		game.load.image("d_09", "images/d_09.png")
		game.load.image("d_010", "images/d_10.png")
		game.load.image("d_011", "images/d_11.png")
		game.load.image("d_012", "images/d_12.png")
		game.load.image("d_013", "images/d_13.png")
		game.load.image("d_014", "images/d_14.png")
		game.load.image("d_015", "images/d_15.png")
		game.load.image("d_016", "images/d_16.png")
		game.load.image("d_017", "images/d_17.png")
		game.load.image("d_018", "images/d_18.png")
		game.load.image("d_019", "images/d_19.png")
		game.load.image("d_020", "images/d_20.png")
		game.load.image("d_021", "images/d_21.png")

		game.load.image("e_01", "images/e_01.png")
		game.load.image("e_02", "images/e_02.png")
		game.load.image("e_03", "images/e_03.png")
		game.load.image("e_04", "images/e_04.png")
		game.load.image("e_05", "images/e_05.png")
		game.load.image("e_06", "images/e_06.png")
		game.load.image("e_07", "images/e_07.png")
		game.load.image("e_08", "images/e_08.png")
		game.load.image("e_09", "images/e_09.png")
		game.load.image("e_010", "images/e_10.png")
		game.load.image("e_011", "images/e_11.png")
		game.load.image("e_012", "images/e_12.png")

		game.load.image("mirror", "images/mirror.png")
		game.load.image("delete", "images/delete.png")
		game.load.image("rotate", "images/rotate.png")
		game.load.image("scale", "images/scale.png")

		var process = game.add.text(game.world.width / 2, game.world.height / 2 + 128 + 30, 0 + "%", {
			fontSize: '32px',
			fill: '#000'
		})
		process.anchor.setTo(0.5, 0.5)
		game.load.onFileComplete.add(function(processt) {
			//console.log(arguments)
			//百分比，key,成功状态true,索引1开始，总数		
			process.text = processt + "%"
			if(processt == 100) {
				game.state.start('start', true)
				//
			}
		})
	}
	this.create = function() {

	}
}
game.MyState.start = function() {
	this.preload = function() {

	}
	this.create = function() {
		game.add.sprite(0, -160, 'bg')
		game.musicIcon = game.add.button(game.world.width - 45, 45, 'musicon') //添加音乐播放按钮
		game.musicIcon.anchor.setTo(0.5, 0.5)
		game.musicIcon.events.onInputUp.add(function() {
			console.log(game.bgMusic.isPlaying) //监听音乐是否播放
			if(game.bgMusic.isPlaying) {
				game.bgMusic.pause();
				game.musicIcon.loadTexture("musicoff") //切换皮肤
			} else {
				game.bgMusic.resume();
				game.musicIcon.loadTexture("musicon") //切换皮肤
			}
		}, this);
		this.boy_05 = game.add.sprite(game.world.width / 2, game.world.height / 2 - 50, 'boy_05')
		this.boy_05.anchor.setTo(0.5, 0) //首页小男孩

		this.qipao = game.add.sprite(game.world.width / 2 + 260, game.world.height / 2 - 80, 'qipao') //首页气泡
		this.qipao.anchor.setTo(0.5, 0)
		game.bgMusic = game.add.audio('bgaudio', 1, true) //添加音乐
		try {
			game.bgMusic.play() //音乐播放
		} catch(e) {

		}
		var startbutton = game.add.button(game.width / 2, game.height - 80, 'btn_start');
		startbutton.anchor.setTo(0.5, 0.5);
		startbutton.events.onInputUp.add(function() {
			$(".item,.btn_next_d").removeClass("none")
			game.state.start('play', true)
			swiperA.update()
		}, this);
		this.loading();
	}
	this.loading = function() {

		//game.load.start();

	}
	this.update = function() {
		game.musicIcon.rotation += 0.05
	}
}
game.MyState.play = function() {

	this.create = function() {

		game.elementA = this.createPer('a_06', 0, 0, 1)
		game.elementB = this.createPer("b_01", game.width / 2, 280, 0)
		game.elementB[1].anchor.setTo(0.5, 0.5)
		game.elementC = this.createPer("c_01", game.width / 2, 280, 0)
		game.elementC[1].anchor.setTo(0.5, 0.5)
		game.elementD = this.createPer("d_01", game.width / 2, 280, 0)
		game.elementD[1].anchor.setTo(0.5, 0.5)
		game.elementE = this.createPer("e_01", game.width / 2, 280, 0)
		game.elementE[1].anchor.setTo(0.5, 0.5)		
		game.elementB[1].visible = false
		game.elementC[1].visible = false
		game.elementD[1].visible = false
		game.elementE[1].visible = false

		game.musicIcon = game.add.button(game.world.width - 45, 45, 'musicon') //添加音乐播放按钮
		game.musicIcon.anchor.setTo(0.5, 0.5)
		game.musicIcon.events.onInputUp.add(function() {
			console.log(game.bgMusic.isPlaying) //监听音乐是否播放
			if(game.bgMusic.isPlaying) {
				game.bgMusic.pause();
				game.musicIcon.loadTexture("musicoff") //切换皮肤
			} else {
				game.bgMusic.resume();
				game.musicIcon.loadTexture("musicon") //切换皮肤
			}
		}, this);

		game.input.onDown.add(this.func, this);
		game.input.addMoveCallback(this.onDragUpdate, this)
		game.input.onUp.add(this.onUp, this)

		this.targetF = false;
		this.dragF = false;
		this.startX1 = 0;
		this.startY1 = 0;
		this.endX1 = 0;
		this.endY1 = 0;
		this.startX2 = 0;
		this.startY2 = 0;
		this.endX2 = 0;
		this.endY2 = 0;
		this.w2 = 1;
		this.old = 0;
		this.startAngle = 0;
		this.targetE = null;

	}
	this.createPer = function(key, x, y, index) {
		var g = game.add.group()
		var s = g.create(x, y, key)
		var sizeW = game.cache.getImage(key).width //获取加载图片的宽度
		var sizeH = game.cache.getImage(key).height //获取加载图片的宽度
		var mirrorBtn = game.make.sprite(-sizeW / 2 - 30, -sizeH / 2, 'mirror')
		mirrorBtn.alpha = 0
		var deleteBtn = game.make.sprite(sizeW / 2 - 10, -sizeH / 2, 'delete')
		deleteBtn.alpha = 0
		var scaleBtn = game.make.sprite(-sizeW / 2 - 30, sizeH / 2 - 10, 'scale')
		scaleBtn.alpha = 0
		var rotateBtn = game.make.sprite(sizeW / 2 - 10, sizeH / 2 - 10, 'rotate')
		rotateBtn.alpha = 0		
		if(index != 1) {
			s.addChild(mirrorBtn);
			s.addChild(deleteBtn);
			s.addChild(rotateBtn);
			s.addChild(scaleBtn);
			s.inputEnabled = true;			
			s.events.onInputDown.add(this.flagFunc, this)			
			this.blindTap(s, g)
		}
		deleteBtn.inputEnabled = true;
		deleteBtn.events.onInputDown.add(this.deleFunc, this)
		
		return [g, s]
	}
	this.blindTap = function(obj, group) {
		var bounds = new Phaser.Rectangle(0, 0, 750, 560);
		obj.inputEnabled = true;
		obj.input.enableDrag(); //接受鼠标事件
		obj.events.onDragStart.add(function() {
			game.world.bringToTop(group)
		})
		obj.input.boundsRect = bounds;
	}

	this.flagFunc = function(a, b, c, d) {
		this.targetF = true;
		a.children[0].alpha = 1
		a.children[1].alpha = 1
		a.children[2].alpha = 1
		a.children[3].alpha = 1
		this.targetE = a
		//console.log(a.children)
		
	}
	this.func = function(event, b, c, d) {
		//console.log(event, b, c, d)
		var len = game.world.children.length
		for(var i = 0; i < len; i++) {
			if(game.world.children[i].name == "group") {
				if(game.world.children[i].children[0].key) {
				if(game.world.children[i].children[0].key.indexOf("a") < 0) {
					//console.log(game.world.children[i].children[0].key)
					game.world.children[i].children[0].children[0].alpha = 0
					game.world.children[i].children[0].children[1].alpha = 0
					game.world.children[i].children[0].children[2].alpha = 0
					game.world.children[i].children[0].children[3].alpha = 0
				}
				}
			}
		}

		this.startX1 = game.input.pointer1.clientX;
		this.startY1 = game.input.pointer1.clientY;
		this.startX2 = game.input.pointer2.clientX;
		this.startY2 = game.input.pointer2.clientY;
		if(game.input.pointer2.isDown) {
			this.first = false
			XvectorS = this.startX1 - this.startX2
			YvectorS = this.startY1 - this.startY2
			this.s1 = Math.sqrt(XvectorS * XvectorS + YvectorS * YvectorS)
			this.startAngle = game.physics.arcade.angleBetween(this.targetE, game.input.pointer2)
			//console.log(this.endAngle)
		}
	}
	this.onDragUpdate = function(event, b, c, d) {
			if(!d) {
				this.dragF = true
				if(game.input.pointer2.isDown && this.dragF && this.targetF) {

					this.endAngle = game.physics.arcade.angleBetween(this.targetE, game.input.pointer2);

					this.endX1 = game.input.pointer1.clientX;
					this.endY1 = game.input.pointer1.clientY;

					this.endX2 = game.input.pointer2.clientX;
					this.endY2 = game.input.pointer2.clientY;

					XvectorD = this.endX1 - this.endX2
					YvectorD = this.endY1 - this.endY2
					var s2 = Math.sqrt(XvectorD * XvectorD + YvectorD * YvectorD)

					this.w2 = s2 - this.s1
					this.curAngle = this.endAngle - this.startAngle

					this.targetE.rotation = this.targetE.rotation + this.curAngle*0.8
					//console.log(this.curAngle)
					this.startAngle = this.endAngle
					if(this.targetE.scale.x > 0.5){
						this.targetE.scale.x = this.targetE.scale.x + this.w2 * 0.004
						this.targetE.scale.y = this.targetE.scale.y + this.w2 * 0.004
					}
					
					this.s1 = s2;
				}
			}
		},
		this.onUp = function() {
			this.targetF = false;
			this.dragF = false;
		}
		this.deleFunc =  function(a,b,c,d){
			//console.log(a,b,c,d)
			a.parent.loadTexture(null)
		}
	this.update = function() {
		game.musicIcon.rotation += 0.05;
		//console.log(game.world)			

	}

}

game.state.add('boot', game.MyState.boot)
game.state.add('load', game.MyState.preload)
game.state.add('start', game.MyState.start)
game.state.add('play', game.MyState.play)
game.state.start('boot', true) //默认是true 执行场景的时候 它会把world 里面的方法全部清空一下