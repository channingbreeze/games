var gameoverState = {
	create: function(){
		drawPatternBG("#222222", "#444444");
		buttonTint = 0xbbbbbb;
		nowPlaying = false;
		game.add.nineSlice(70, 190, "sliced_panel", "sliced_panel", 490, 120);
		resetNav();
		music.stop();
		var gameoverLabel = game.add.text(80, 80, getText("Gameover", 0), getStyle("title"));
		var finalLevelLabel = game.add.text(80, game.world.height - 280, getText("Gameover", 3) + curScore, getStyle("text_big"));
		var finalLevelLabel = game.add.text(80, game.world.height - 250, getText("Gameover", 4) + level, getStyle("text_big"));
		var finalLinesLabel = game.add.text(80, game.world.height - 220, getText("Gameover", 5) + lineCount, getStyle("text_big"));

		var buttonStyle = getStyle("button_regular");

		btnMainMenu = game.add.button(game.world.width / 2, (game.world.height / 2) + 160, 'big_button', function(){show('menu')}, this, 1, 2, 0);
		btnMainMenu.anchor.setTo(0.5, 0.5);
		btnMainMenu.tint = buttonTint;
		lblMainMenu = game.add.text(game.world.width / 2, (game.world.height / 2) + 160, getText("Gameover", 1), buttonStyle);
		lblMainMenu.anchor.setTo(0.5, 0.5);

		btnPlayAgain = game.add.button(game.world.width / 2, (game.world.height / 2) + 100, 'big_button', function(){show('singlePlayerPrep')}, this, 1, 2, 0);
		btnPlayAgain.anchor.setTo(0.5, 0.5);
		btnPlayAgain.tint = buttonTint;
		lblPlayAgain = game.add.text(game.world.width / 2, (game.world.height / 2) + 100, getText("Gameover", 2), buttonStyle);
		lblPlayAgain.anchor.setTo(0.5, 0.5);

		if(submitScore(curScore) == 0){
			showNewHighscore();
		}
	},
	start: function(){
		game.state.start('menu');
	}
}

function showNewHighscore(){
	var finalLinesLabel = game.add.text(80, game.world.height - 320, getText("Gameover", 6), getStyle("text_warning_big"));
	name = prompt(getText("Gameover", 7), "");if (name) {updatePlayerName(name);updateLeaderboard();}
}
