var menuState = {
	create: function(){
		//prevent page from moving around
		this.input.keyboard.addKeyCapture([Phaser.Keyboard.UP,
			Phaser.Keyboard.DOWN,
			Phaser.Keyboard.LEFT,
			Phaser.Keyboard.RIGHT,
			Phaser.Keyboard.SPACEBAR]);


		nowPlaying = false;
		resetNav();
		drawPatternBG("#888800", "222277");
		//buttonTint = 0xa3d0e5;
		buttonTint = 0xbce2f4;
		logo = game.add.sprite(game.world.width / 2, 80, 'logo', );
		logo.anchor.setTo(0.5, 0.5);

		var titleLabel = game.add.text(game.world.width / 2, 180, getText("MainMenu", 0), getStyle("text_regular"));
		titleLabel.anchor.setTo(0.5, 0.5);
		titleLabel.align = "center";
		//var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		var buttonStyle = getStyle("button_regular");

		//enterKey.onDown.addOnce(this.start, this);

		btnNewGame = game.add.button(game.world.width / 2, game.world.height / 2, 'big_button', function(){show('singlePlayerPrep')}, this, 1, 2, 0);
		btnNewGame.anchor.setTo(0.5, 0.5);
		btnNewGame.tint = buttonTint;
		lblNewGame = game.add.text(game.world.width / 2, game.world.height / 2, getText("MainMenu", 1), buttonStyle);
		lblNewGame.anchor.setTo(0.5, 0.5);

		btnSettings = game.add.button(game.world.width / 2, (game.world.height / 2) + 60, 'big_button', function(){show('settings')}, this, 1, 2, 0);
		btnSettings.anchor.setTo(0.5, 0.5);
		btnSettings.tint = buttonTint;
		lblSettings = game.add.text(game.world.width / 2, (game.world.height / 2) + 60, getText("MainMenu", 2), buttonStyle);
		lblSettings.anchor.setTo(0.5, 0.5);

		btnLeaderboard = game.add.button(game.world.width / 2, (game.world.height / 2) + 120, 'big_button', function(){show('leaderboard')}, this, 1, 2, 0);
		btnLeaderboard.anchor.setTo(0.5, 0.5);
		btnLeaderboard.tint = buttonTint;
		lblLeaderboard = game.add.text(game.world.width / 2, (game.world.height / 2) + 120, getText("MainMenu", 3), buttonStyle);
		lblLeaderboard.anchor.setTo(0.5, 0.5);

		btnCredits = game.add.button(game.world.width / 2, (game.world.height / 2) + 180, 'big_button', function(){show('credits')}, this, 1, 2, 0);
		btnCredits.anchor.setTo(0.5, 0.5);
		btnCredits.tint = buttonTint;
		lblCredits = game.add.text(game.world.width / 2, (game.world.height / 2) + 180, getText("MainMenu", 4), buttonStyle);
		lblCredits.anchor.setTo(0.5, 0.5);
		
		createLanguageFlags();
	},
	start: function(){
		game.state.start('singlePlayerPrep');
	}
};
