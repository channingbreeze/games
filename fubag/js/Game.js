MyGame.Game = function(game) {
	
	game.playerTimer = 10;
};
var that;
var score = 0;
MyGame.Game.prototype = {
    create: function() {
		that = this;
		game.bg = game.add.image(0,0,'gameBg');
		
		
		game.timerText = game.add.text(game.world.centerX, 100, "00:"+game.playerTimer+"", { font: "bold 40px Arial", fill: "#ec3d39"});
		game.timerText.anchor.set(0.5,0)
		
		game.addPokeTime = game.time.create(false);
		game.addPokeTime.loop(500, this.addPoke, this);
		
		
		game.GameTimer = game.time.create(false);
		game.GameTimer.loop(1000, function(){
			
			if(game.playerTimer<=0)
			{
				that.gameover()
			}
			else
			{
				game.playerTimer--
				
				if(game.playerTimer<10)
				{
					game.timerText.setText("00:0"+game.playerTimer+"")
				}
				else
				{
					game.timerText.setText("00:"+game.playerTimer+"")
				}
				
				
			}
		}, this);
		
		
		game.pokeGroup = game.add.group();
		
		
		
		game.player = GameUI.ico('game.player', game.world.centerX, game.world.height - 400, 'player', 0.5, 0);
		game.physics.arcade.enable(game.player);
		game.player.body.immovable = true;
		
		
		game.cover = game.add.sprite(0,0,'cover');
		game.cover.inputEnabled = true;
		game.cover.events.onInputDown.add(function(){
			that.gamestart()
		}, this);

		
		GameUI.cutscenes()
    },
    
    gamestart : function(){
    	game.cover.visible = false;
    	game.addPokeTime.start();
    	game.GameTimer.start();
    	
    	game.player.inputEnabled = true;
		game.player.input.enableDrag();
		game.player.input.allowVerticalDrag = false;
		game.player.input.boundsSprite = game.bg;
    },
    gameover : function(){
    	game.addPokeTime.stop();
    	game.GameTimer.stop();
    	game.state.start('Result')
    },
    
    addPoke : function(){
    	game.poke = new Poke(game, game.rnd.between(50, game.world.width-50), -50);
		game.add.existing(game.poke);
		game.pokeGroup.add(game.poke);
    },
    update: function() {
    	
    	game.physics.arcade.overlap(game.pokeGroup,game.player , null, function(player,poke){
    		score++;
    		poke.destroy()
    	}, this);
    	
    }
};


Poke = function(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, "fudai");
	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.gravity.y = game.rnd.between(100, 500);
	this.anchor.set(0.5);
};
Poke.prototype = Object.create(Phaser.Sprite.prototype);
Poke.prototype.constructor = Poke;

Poke.prototype.update = function(){
	if(this.y>=game.world.height)
    {
        this.destroy()
    }
}

