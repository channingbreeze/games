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
    	
    	//load
    	//this.load.audio('music', 'assets/music.mp3');
    	game.load.image('MainMenu','assets/MainMenu.jpg');
    	game.load.image('gameBg','assets/gameBg.jpg');
    	game.load.image('resultBg','assets/resultBg.jpg');
    	game.load.image('fudai','assets/fudai.png');
    	game.load.image('cover','assets/cover.png');
    	game.load.atlas('ico', 'assets/ico.png?'+Math.random()*1000+'', 'assets/ico.json?'+Math.random()*1000+'');
    	
        this.load.start();
    },
    fileComplete:function(progress){
        this.text.setText( + progress + "%");
    },
    loadComplete:function(){
        this.state.start('MainMenu');
        //this.state.start('Result');
    }
};