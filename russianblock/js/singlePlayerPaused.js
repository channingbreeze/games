var singlePlayerPausedState = {
	create: function(){
		drawPatternBG("#000088", "#944d94");
		buttonTint = 0xeeaffe;
		music.stop();
		var titleLabel = game.add.text(80, 80, getText("SinglePlayerPaused", 0),getStyle("title"));
		var buttonStyle = getStyle("button_regular");

		btnResume = game.add.button(game.world.width / 2, (game.world.height / 2) - 60, 'big_button', goBack, this, 1, 2, 0);
		btnResume.anchor.setTo(0.5, 0.5);
		btnResume.tint = buttonTint;
		lblResume = game.add.text(game.world.width / 2, (game.world.height / 2) - 60, getText("SinglePlayerPaused",1) , buttonStyle);
		lblResume.anchor.setTo(0.5, 0.5);

		btnNewGame = game.add.button(game.world.width / 2, game.world.height / 2, 'big_button', function (){show('changeBgSt')}, this, 1, 2, 0);
		btnNewGame.anchor.setTo(0.5, 0.5);
		btnNewGame.tint = buttonTint;
		lblNewGame = game.add.text(game.world.width / 2, game.world.height / 2, getText("Settings",2), buttonStyle);
		lblNewGame.anchor.setTo(0.5, 0.5);

		btnSettings = game.add.button(game.world.width / 2, (game.world.height / 2) + 60, 'big_button', function(){show('soundMenu')}, this, 1, 2, 0);
		btnSettings.anchor.setTo(0.5, 0.5);
		btnSettings.tint = buttonTint;
		lblSettings = game.add.text(game.world.width / 2, (game.world.height / 2) + 60, getText("Settings",3), buttonStyle);
		lblSettings.anchor.setTo(0.5, 0.5);

		btnCredits = game.add.button(game.world.width / 2, (game.world.height / 2) + 120, 'big_button', function(){show('controls')}, this, 1, 2, 0);
		btnCredits.anchor.setTo(0.5, 0.5);
		btnCredits.tint = buttonTint;
		lblCredits = game.add.text(game.world.width / 2, (game.world.height / 2) + 120, getText("Settings",4), buttonStyle);
		lblCredits.anchor.setTo(0.5, 0.5);

		btnQuit = game.add.button(game.world.width / 2, (game.world.height / 2) + 180, 'big_button', function(){show('menu')}, this, 1, 2, 0);
		btnQuit.anchor.setTo(0.5, 0.5);
		btnQuit.tint = buttonTint;
		lblQuit = game.add.text(game.world.width / 2, (game.world.height / 2) + 180, getText("Gameover",1), buttonStyle);
		lblQuit.anchor.setTo(0.5, 0.5);

	}
};
