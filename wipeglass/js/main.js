var game = new Phaser.Game(1920, 1080, Phaser.CANVAS, "games");
var MyGame = function(){};
MyGame.prototype = {
	startLoad: function() {
		this.load.image('park-bg', 'assets/park-bg.jpg');
		this.load.image('park-mask', 'assets/park-mask.jpg');
		this.load.image('rag', 'assets/rag.png');
		this.load.start();
	},
	loadStart: function() {
		this.text.setText("加载中 ...");
	},
	fileComplete: function(progress) {
		this.text.setText( + progress + "%");
	},
	loadComplete: function() {
		this.text.setText("启动中 ...");
		this.text.destroy();
		this.iniGame();
	},
	create: function() {
		//this.stage.backgroundColor = '#8cddfe';
		//背景渐变
		var bg=this.add.bitmapData(1920, 1080);
			bg.addToWorld();
		var gra = bg.context.createLinearGradient(0, 0, 0,1080);
		    gra.addColorStop(0, '#8cddfe');
		    gra.addColorStop(1, '#bae8ff');
		    bg.context.fillStyle = gra;
			bg.fill();

		//适应屏幕
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//失去焦点是否继续游戏
		this.stage.disableVisibilityChange = true;
		//开启鼠标事件
		this.input.mouse.capture = true;
		//load提示
		this.text = this.add.text(this.world.centerX, this.world.centerY, '', {font: "50px myFont", fill: '#fff' ,});
		this.text.anchor.set(0.5);
		this.text.setShadow(3, 3, 'rgba(0,0,0,0.2)', 2);
		this.load.onLoadStart.add(this.loadStart, this);//开始
		this.load.onFileComplete.add(this.fileComplete, this);//加载中
		this.load.onLoadComplete.add(this.loadComplete, this);//加载结束
		this.startLoad();
	},
	iniGame: function(){
		this.gameGroup = this.add.group();
		//缓存计算透明度的bmd
		this.bmdTemp = this.make.bitmapData(544, 306);
		this.gameBg = this.add.sprite(0, 0, 'park-mask');
		this.bmd = this.make.bitmapData(1920, 1080);
		this.bmd.addToWorld();
		this.gameMaskBtm = new this.draw(this);
		this.rag = this.add.sprite(500, 500, 'rag');
		this.rag.anchor.setTo(0.5, 0.5);
		this.rag.inputEnabled = true;
		this.rag.input.enableDrag();
		this.rag.events.onDragUpdate.add(this.onUpdate, this);

		this.scoreTable = this.add.graphics(1720,0).beginFill('0X000000').drawRoundedRect(0,0,200,100,10).endFill();
		this.scoreTable.alpha = 0.5;

		this.score = this.add.text(0, 0, "0%", {font: "50px", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"});
		this.score.setTextBounds(this.scoreTable.x, this.scoreTable.y, this.scoreTable.width, this.scoreTable.height);


		this.gameGroup.addMultiple([
			this.gameMaskBtm.sprite,
			this.gameBg
		]);
	},
	onUpdate: function(e){
		this.bmdTemp.copy(this.bmd, 0, 0, this.game.width, this.game.height, null, null, 544, 306)
		this.gameMaskBtm.onDraw(e.x, e.y);
		this.bmd.alphaMask('park-bg', this.gameMaskBtm.sprite);
		this.score.text = this.getTransparentPercent() + "%";
	},
	getTransparentPercent: function() {
        var imgData = this.bmdTemp.ctx.getImageData(0, 0, 544, 306),
            pixles = imgData.data,
            transPixs = [];
        for (var i = 0, j = pixles.length; i < j; i += 4) {
            var a = pixles[i + 3];
            if (a < 128) {
                transPixs.push(i);
            };
        };
        return parseInt(100 - transPixs.length / (pixles.length / 4) * 100);
    },
	draw: function(that){
		this.bmd = that.make.bitmapData(1920, 1080);
		this.bmd.ctx.beginPath();
		this.bmd.ctx.strokeStyle = "#000";
		this.bmd.ctx.lineWidth = 155;
		this.bmd.ctx.lineJoin = "round";
		this.sprite = that.add.sprite(0,0,this.bmd);
		this.temX = 500;
		this.temY = 500;
		this.onDraw = function(x, y){
			this.bmd.ctx.beginPath();
			this.bmd.ctx.moveTo(this.temX, this.temY);
			this.bmd.ctx.lineTo(x, y);
			this.bmd.ctx.closePath();
			this.bmd.ctx.stroke();
			this.temX = x;
			this.temY = y;
		};
	}
};

game.state.add('Game', MyGame);
game.state.start('Game');