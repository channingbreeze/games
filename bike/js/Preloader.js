MyGame.Preloader = function(game){
};
MyGame.Preloader.prototype = {
    create:function(){
        this.load.onFileComplete.add(this.fileComplete, this);
        this.load.onLoadComplete.add(this.loadComplete, this);
        this.text = this.add.text(this.world.width/2, this.world.height/2-50, '', { fill: '#fff' });
        this.text.anchor.set(0.5);
        this.start();
    },
    start:function(){
    	this.load.image('road','assets/road.jpg');
    	this.load.image('gameBg_0','assets/gameBg_0.jpg');
    	this.load.image('gameBg_1','assets/gameBg_1.jpg');
    	this.load.image('gameBg_2','assets/gameBg_2.jpg');
    	this.load.image('result_bg','assets/result_bg.jpg');
    	this.load.image('MainMenu_bg','assets/MainMenu_bg.jpg');
    	this.load.image('myLotto_bg','assets/myLotto_bg.jpg');
    	this.load.image('rank_bg','assets/rank_bg.jpg');
    	this.load.image('select_bg','assets/select_bg.jpg');
    	
    	this.load.spritesheet('bird','assets/bird.png',54,55);
    	this.load.image('title','assets/title.png');
    	this.load.image('rod','assets/rod.png');
    	this.load.image('pep','assets/pep.png');
    	this.load.image('play_way','assets/play_way.png');
    	
    	this.load.image('PAI_330_125','assets/PAI_330_125.png');
    	this.load.image('PAI_205_75','assets/PAI_205_75.png');
    	
    	
    	this.load.image('lou_0','assets/lou_0.png');
    	this.load.image('lou_1','assets/lou_1.png');
    	this.load.image('lou_2','assets/lou_2.png');
    	this.load.atlas('ico', 'assets/ico.png?4', 'assets/ico.json?4');
    	this.load.atlasJSONHash('player', 'assets/player_json.png', 'assets/player_json.json');
    	/*this.load.atlasJSONHash('bird', 'assets/bird_json.png', 'assets/bird_json.json');*/
    	
      this.load.start();
    },
    fileComplete:function(progress){
        this.text.setText( + progress + "%");
    },
    loadComplete:function(){
        this.state.start('MainMenu');
    }
};