var score = 0,
	countTime = 0.0,
	_Config = {
		speed: {
			min: 12,
			max: 48
		},
		view: {
			width: 750,
			height: 1334
		},
	},
	_Con_sprite = {
		buddy_menu: {
			height: 310,
			width: 240,
			frameNumber: 4,
			type: "spritesheet"
		},
		buddy: {
			height: 310,
			width: 240,
			frameNumber: 4,
			type: "spritesheet"
		},
		button: {
			height: 200,
			width: 190,
			frameNumber: 4,
			type: "spritesheet"
		},
		ground: {
			height: 554,
			width: 750,
			frameNumber: 1,
			type: "tilesprite"
		},
		background: {
			height: 1334,
			width: 4738,
			frameNumber: 1,
			type: "tilesprite"
		},
		earth: {
			height: 703,
			width: 671,
		},
		box: {
			height: 22,
			width: 24
		}
	},
	gameSpeed = _Config.speed.min,
	distanceTime = 50;


(function() {
	HTMLDocument.prototype.delegate = delegate;
	HTMLElement.prototype.delegate = delegate;

	function delegate(events, selector, fn) {
		function getTarget(parent, target) {
			var children = parent.querySelectorAll(selector);
			for (var i = 0, l = children.length; i < l; i++) {
				if (children[i] === target) {
					return children[i];
				} else if(children[i].contains(target)){
					return children[i];
				}
			}
			return false;
		}
		var parent = this;

		events.split(" ").forEach(function(evt) {
			parent.addEventListener(evt, function(e) {
				var target = getTarget(parent, e.target);
				if (!target) {
					return false;
				}
				fn.apply(target, arguments);
			}, false);
		})
	}
})();

var hideElems = (function(){
	return function(){
		var elems = document.querySelectorAll("[data-hide]"),
		arr = Array.prototype.slice.call(elems);
		arr.forEach(function(element) {
			element.style.display = "none";
		}, this);
	}
})(),
changeHeight = 200;

function prefixInteger(str, length) {
	return Array(length + 1).join("0").split("").concat(String(str).split(""))
		.slice(-length).join("");
}

var game = new Phaser.Game(_Config.view.width, _Config.view.height, Phaser.CANVAS);
game.States = {};
game.States.boot = function() {
	this.preload = function() {
		if (typeof(GAME) !== "undefined") {
			this.load.baseURL = GAME + "/";
		}
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.refresh();
	}; 
	this.create = function() {
		game.state.start('preload');
	};
};

game.States.preload = function() {
	this.preload = function() {
		game.load.image("bk", "assets/bk.jpg");
		game.load.image("background", "assets/background.jpg");
		game.load.image('ground', 'assets//ground.jpg');
		game.load.image('loading', 'assets/preloader.gif');
		game.load.image("earth", 'assets/earth.png');
		game.load.image("box", 'assets/box.png');
		game.load.image('flag', 'assets/flag.png');
		game.load.image('btn-ready', 'assets/btn-ready.png');
		game.load.image("time",'assets/time.png');
		game.load.image("game_end",'assets/gameend.jpg');
		//load sprite
		game.load.spritesheet('buddy_menu', 'assets/badi.png', _Con_sprite.buddy.width, _Con_sprite.buddy.height, _Con_sprite.buddy.frameNumber);
		game.load.spritesheet('buddy', 'assets/buddy.png', _Con_sprite.buddy.width, _Con_sprite.buddy.height, _Con_sprite.buddy.frameNumber);
		game.load.spritesheet('button', 'assets/button.png', _Con_sprite.button.width, _Con_sprite.button.height, _Con_sprite.button.frameNumber);
		//voice
		game.load.audio('player_sound', 'assets/play.mp3');
		game.load.audio('score_sound', 'assets/score.mp3');
		// font
		game.load.bitmapFont('flappy_font', 'assets/flappyfont.png', 'assets/flappyfont.xml');
		game.load.bitmapFont('time_count', 'assets/flappyfont.png', 'assets/flappyfont.xml');
	};
	this.create = function() {
		game.state.start('menu');
	};
};

game.States.menu = function() {
	this.create = function() {
		game.add.tileSprite(0, 0, game.width, game.height, 'bk');
		var titleGroup = game.add.group();
		titleGroup.create(0, 0, 'earth');
		var badi = titleGroup.create((titleGroup.width - _Con_sprite.buddy.width) / 2, (titleGroup.height - _Con_sprite.buddy.height - 200) / 2, 'buddy');
		badi.animations.add('move');
		badi.animations.play('move', gameSpeed, true);
		titleGroup.x = (game.width - _Con_sprite.earth.width) / 2;
		titleGroup.y = (game.height - _Con_sprite.earth.width) / 2;
		game.add.button((game.width - 381) / 2, 1334 - 330, 'btn-ready', function() {
			game.state.start('play');
		});
	};
};

game.States.play = function() {
	var that = this,
		plusEvent = 0,
		isGameOver = false,
		distance = 4000,
		going = 0,
		changeHeight = 200;
	this.create = function() {
		hideElems();
		// 物理系统
		game.physics.startSystem(Phaser.Physics.ARCADE);
		// 背景
		this.bg = game.add.tileSprite(0, 0, _Con_sprite.background.width, _Con_sprite.background.height, 'background');
		this.ground = game.add.tileSprite(0, game.height - _Con_sprite.ground.height , game.width, _Con_sprite.ground.height , 'ground');
		this.scoreBox = game.add.sprite(game.world.centerX - 130,15,"box");
		this.scoreText = game.add.bitmapText(game.world.centerX - 20, 30, 'flappy_font', '0', 36);
		this.timeImg = game.add.sprite(20,15,"time");
		this.timeText = game.add.bitmapText(120, 30, "time_count", 0, 36);

		var btnLeft = game.add.button(game.world.centerX - 162 - 50, 1138 -150 , "button", this.runLeft, this, 2, 2, 0);
		var btnRight = game.add.button(game.world.centerX + 50, 1138 -150 , "button", this.runRight, this, 3, 3, 1);

		this.flag = game.add.sprite(600, game.height - _Con_sprite.buddy.height / 2 - _Con_sprite.ground.height , "flag");
		this.flag.visible = false;

		//voice
		this.soundPlay = game.add.sound('player_sound');
		this.soundScore = game.add.sound('score_sound');
		this.soundPlay.loop = true;
		this.soundPlay.play();

		//player
    this._buddyPos = game.height - _Con_sprite.buddy.height -(_Con_sprite.ground.height * 2 / 3) - 60;
		this._buddy = game.add.sprite(0, this._buddyPos, "buddy");
		//this._buddy.anchor.setTo(0.5, 0.5);
		this._buddy.animations.add('move');
		this._buddy.animations.play('move', gameSpeed, true);

		//  障碍物
		this.boxGroup = game.add.group();
		this.boxGroup.enableBody = true;
		this.hinderGroup = game.add.group();
		this.hinderGroup.enableBody = true;

		game.physics.arcade.enable(this._buddy);
		game.physics.arcade.enable(this.ground);
		game.physics.arcade.enable(this.boxGroup);

		this._buddy.body.collideWorldBounds = true;

		// 动画
		var tween = game.add.tween(this._buddy).to({
			x: (game.width - _Con_sprite.buddy.width) / 3
		}, 1000, Phaser.Easing.Sinusoidal.InOut, true);
		tween.onComplete.add(this.onStart, this);
		//监听循环
		//game.input.touch.touchEndCallback = _.throttle(this.plusSpeed,1000);
		game.time.events.loop(Phaser.Timer.SECOND * 2.5, this.subSpeed, this);
		
	};
  this.runLeft = function() {
    this._buddyPos = game.height - _Con_sprite.buddy.height -(_Con_sprite.ground.height * 2 / 3) - 60;
    this._buddy.y = this._buddyPos;
  };
  this.runRight = function() {
    this._buddyPos = game.height - _Con_sprite.buddy.height -(_Con_sprite.ground.height * 2 / 3) + 60;
    this._buddy.y = this._buddyPos;
  };
	this.checkSpeed = function() {
		if (gameSpeed < _Config.speed.min) {
			gameSpeed = _Config.speed.min;
		} else if (gameSpeed > _Config.speed.max) {
			gameSpeed = _Config.speed.max;
		} else {

		}
	};
	this.speedFlag = (function() {
		var speedFlag = false;
		return {
			set: function(flag) {
				speedFlag = flag;
			},
			get: function() {
				return speedFlag;
			}
		}
	})();
	this.plusSpeed = function() {
		if(!isGameOver){
			if (gameSpeed >= _Config.speed.max) {
				return;
			}
			that.speedFlag.set(true);
			++gameSpeed;
			console.log("trigger PLUS Speed: " + gameSpeed);
			that._buddy.animations.stop('move');
			that._buddy.animations.play('move', gameSpeed, true);
			that.bg.stopScroll();
			that.ground.stopScroll();
			that.bg.autoScroll(-gameSpeed * 15, 0);
			that.ground.autoScroll(-gameSpeed * 30, 0);
			that.speedFlag.set(false);
		}
	
	};
	this.subSpeed = function() {
		if(!isGameOver){
			if (gameSpeed <= _Config.speed.min || this.speedFlag.get()) {
				return;
			}
			console.log("trigger sub Speed: " + gameSpeed);
			gameSpeed -= 0.5;
			this._buddy.animations.stop('move');
			this._buddy.animations.play('move', gameSpeed, true);
			this.bg.stopScroll();
			this.ground.stopScroll();
			this.bg.autoScroll(-gameSpeed * 20, 0);
			this.ground.autoScroll(-gameSpeed * 40, 0);
		}

	};
	this.onStart = function() {
		this.score = 0;
		this._buddy.body.velocity.x = 10;
		this.bg.autoScroll(-gameSpeed * 15, 0);
		this.ground.autoScroll(-gameSpeed * 30, 0);
		this.startTime = Date.now();
	};
	this.generateBoxs = function() {
		if (Math.random() * 1000 < 3) {
			game.add.sprite(game.width, (game.height - (_Con_sprite.ground.height * 3 / 10) - _Con_sprite.buddy.height) , 'box', 0, this.boxGroup);
			this.boxGroup.setAll('body.velocity.x', -gameSpeed * 9);
			this.boxGroup.setAll('checkWorldBounds', true);
			this.boxGroup.setAll('outOfBoundsKill', true);
		}
	};
	this.collectBox = function(player, box) {
		box.kill();
		this.scoreText.text = ++this.score;
		score = this.scoreText.text;
		game.add.tween(this._buddy).to({
			x: (game.width - _Con_sprite.buddy.width) / 3
		}, 1000, Phaser.Easing.Sinusoidal.InOut, true);
		this.soundScore.play();
	};
	this.updateTime = function() {
		if (!isGameOver) {
			var str = prefixInteger(Date.now() - this.startTime, 6),
				text = str.substr(0, 3);
			this.timeText.text = text;
			countTime = text;
			if (going > distance) {
				this.generateflag();
			}
		}
	};
	this.generateflag = function() {	
		this.flag.visible = true;
		game.physics.arcade.enable(this.flag);
		this.flag.body.velocity.x = -gameSpeed * 5;
		this.flag.body.checkWorldBounds = true;
		this.flag.body.outOfBoundsKill = true;
	};
	this.hitFlag = function() {
		that._buddy.body.velocity.x += 20;
		that.gameover();
	};
	this.goDistance = function() {
		if(!isGameOver){
			going += game.time.elapsed * 10 * 0.001 * gameSpeed;
		}
	};
	this.gameover = function() {
		isGameOver = true;
		that._buddy.body.velocity.x = game.width - _Con_sprite.buddy.width * 3 / 4;
		that._buddy.animations.stop('move');
		that._buddy.animations.stop();
		that.bg.autoScroll(0, 0);
		that.ground.autoScroll(0, 0);
		that.flag.body.velocity = 0;
		that._buddy.body.velocity = 0;
		that.boxGroup.setAll('body.velocity.x', 0);
		that.boxGroup.setAll('body.velocity.y', 0);
		game.state.start('over');

	};
	this.update = function() {
		if(!isGameOver){
			this.goDistance();
			this.updateTime();
			this.checkSpeed();
			this.generateBoxs();
		}
		game.physics.arcade.collide(this._buddy, this.boxGroup, this.collectBox, null, this);
		game.physics.arcade.collide(this._buddy, this.hinderGroup, this.collectBox, null, this);
		game.physics.arcade.overlap(this._buddy, this.flag, this.hitFlag, null, null, this);
	};

};

game.States.over = function() {
	this.create = function() {
		this.bg = game.add.tileSprite(0, 0, _Con_sprite.background.width, _Con_sprite.background.height, 'background');
		this.ground = game.add.tileSprite(0, game.height - _Con_sprite.ground.height  , game.width, _Con_sprite.ground.height , 'ground');
		this.scoreBox = game.add.sprite(game.world.centerX - 130,15,"box");
		this.scoreText = game.add.bitmapText(game.world.centerX - 20, 30, 'flappy_font', '0', 36);
		this.timeImg = game.add.sprite(20,15,"time");
		this.timeText = game.add.bitmapText(120, 30, "time_count", 0, 36);

		this.scoreText.text = score;
		this.timeText.text = countTime;

		var url = 'https://github.com/channingbreeze/games',
        random = Date.now();
		game.add.button((game.width - 580) / 2, 200, 'game_end', function() {
			location.href = url;
		});
	};
}

game.state.add('boot', game.States.boot);
game.state.add('preload', game.States.preload);
game.state.add('menu', game.States.menu);
game.state.add('play', game.States.play);
game.state.add('over', game.States.over);

game.state.start('boot');