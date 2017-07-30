var settingsState = {
	create: function(){
		drawPatternBG("#000088", "777722");
		buttonTint = 0xf9f2a7;
		var titleLabel = game.add.text(80, 80, getText("Settings", 0),getStyle("title"));
		var buttonStyle = getStyle("button_regular");

		btnResetSettings = game.add.button(game.world.width / 2, (game.world.height / 2) - 60, 'big_button', DeleteLocalSettings, this, 1, 2, 0);
		btnResetSettings.anchor.setTo(0.5, 0.5);
		btnResetSettings.tint = buttonTint;
		lblResetSettings = game.add.text(game.world.width / 2, (game.world.height / 2) - 60, getText("Settings",1) , buttonStyle);
		lblResetSettings.anchor.setTo(0.5, 0.5);

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

		btnBack = game.add.button(game.world.width / 2, (game.world.height / 2) + 180, 'big_button', goBack, this, 1, 2, 0);
		btnBack.anchor.setTo(0.5, 0.5);
		btnBack.tint = buttonTint;
		lblBack = game.add.text(game.world.width / 2, (game.world.height / 2) + 180, getText("Standard",1), buttonStyle);
		lblBack.anchor.setTo(0.5, 0.5);
		
	}
};

function DeleteLocalSettings(){
	localStorage.clear();
	game.stage.backgroundColor = "#000000";
	alert(getText("Standard",4)+"\n\n"+getText("Standard",5));
	game.state.start('boot');
}
