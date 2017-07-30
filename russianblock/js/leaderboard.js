var leaderboardState = {
	create: function(){
		drawPatternBG("#008888", "#882222");
		buttonTint = 0xf9b4a7;
		game.add.nineSlice(120, 170, "sliced_panel", "sliced_panel", 400,200);
		var titleLabel = game.add.text(80, 80, getText('Leaderboard', 0), getStyle("title"));
		var buttonStyle = getStyle("button_regular");
		updateLeaderboardText();

		tmpX = (game.world.width / 2) - 50;
		tmpY = (game.world.height / 2) + 200;
		btnReset = btnSettings = game.add.button(tmpX, tmpY, 'medium_button', function(){resetLeaderboard();game.state.start("leaderboard");}, this, 1, 2, 0);
		btnReset.anchor.setTo(0.5, 0.5);
		btnReset.tint = buttonTint;
		lblReset = game.add.text(tmpX, tmpY + 4, getText("Standard", 3), getStyle("button_small"));
		lblReset.anchor.setTo(0.5, 0.5);

		tmpX = (game.world.width / 2) + 50;
		btnBack = btnSettings = game.add.button(tmpX, tmpY, 'medium_button', goBack, this, 1, 2, 0);
		btnBack.anchor.setTo(0.5, 0.5);
		btnBack.tint = buttonTint;
		lblBack = game.add.text(tmpX, tmpY + 4, getText("Standard", 2), getStyle("button_small"));
		lblBack.anchor.setTo(0.5, 0.5);
	}
};

function updateLeaderboardText(){
	getLeaderboard();
	var boardStyle = getStyle("text_big");
	leader0 = game.add.text(game.world.width / 2, (game.world.height / 2) - 50, leaderNames[0] + " - " + highscores[0], boardStyle);
	leader0.anchor.setTo(0.5, 0.5);
	leader1 = game.add.text(game.world.width / 2, (game.world.height / 2) - 10, leaderNames[1] + " - " + highscores[1], boardStyle);
	leader1.anchor.setTo(0.5, 0.5);
	leader2 = game.add.text(game.world.width / 2, (game.world.height / 2) + 30, leaderNames[2] + " - " + highscores[2], boardStyle);
	leader2.anchor.setTo(0.5, 0.5);
	leader3 = game.add.text(game.world.width / 2, (game.world.height / 2) + 70, leaderNames[3] + " - " + highscores[3], boardStyle);
	leader3.anchor.setTo(0.5, 0.5);
	leader4 = game.add.text(game.world.width / 2, (game.world.height / 2) + 110, leaderNames[4] + " - " + highscores[4], boardStyle);
	leader4.anchor.setTo(0.5, 0.5);
}
