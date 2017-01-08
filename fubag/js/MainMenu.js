MyGame.MainMenu = function(game) {

};
MyGame.MainMenu.prototype = {
    create: function() {
       game.add.image(0,0,'MainMenu');
       
       game.startBtn = GameUI.btn('game.startBtn', game.world.centerX, game.world.height - 260, 'start-btn', 0.5, 1, function() {
			game.state.start('Game')
		});

       
		GameUI.cutscenes()
    },
    update: function() {
    }
};

