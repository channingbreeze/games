var MenuState = function(){
	this.music;
	this.button_down_sfx;
	this.button_over_sfx;
};

MenuState.prototype.preload = function(){
	this.load.image("logo","assets/images/logo.png");
	this.load.image("bg","assets/images/main_bg.png");
	this.load.atlas("atlas","assets/images/sprites.png","assets/images/sprites.json");
	this.load.audio("music","assets/audio/menu.mp3","assets/audio/menu.ogg");
	this.load.audio("button_over","assets/audio/button_over.mp3","assets/audio/button_over.ogg");
	this.load.audio("button_down","assets/audio/button_down.mp3","assets/audio/button_down.ogg");
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
};

MenuState.prototype.create = function(){
	var bg = this.add.image(this.world.centerX,this.world.centerY,'bg');
	bg.anchor.setTo(0.5,0.5);

	var logo = this.add.sprite(this.world.centerX,this.world.centerY-100,'logo');
	logo.anchor.setTo(0.5,0.5);
	logo.anchor.setTo(0.5,0.5);

	var start_btn = this.add.button(this.world.centerX,this.world.centerY+200,'atlas',this.OnClick,this,'start_over_btn.png','start_btn.png','start_over_btn.png','start_btn.png');
	start_btn.onInputOver.add(this.onOver,this);
	start_btn.anchor.setTo(0.5,0.5);

	//start playing background music
	this.music = this.add.audio("music",1,true);
	this.music.play();

	this.button_down_sfx = this.add.audio("button_down");
	this.button_over_sfx = this.add.audio("button_over");
};

MenuState.prototype.update = function(){};

MenuState.prototype.onOver = function(){
	this.button_over_sfx.play();//play over sfx for button over
};

MenuState.prototype.OnClick = function(){
	this.button_down_sfx.play();//play over sfx for button down
	this.music.stop();//stop music
	this.state.start("level_one");
};