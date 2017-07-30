var changeBgState = {
	create: function(){
		game.stage.backgroundColor = "#000000";
		btns = [,,,,,]; //buttons
		lbls = [,,,,,]; //labels
		bg = game.add.sprite(0, 0, 'bg'+curBg);
		tmpBg = curBg;
		game.add.sprite(0, 0, 'board');
		textStyle = getStyle("text_big");
		text = game.add.text(game.world.width / 2, 50, getText("ChangeBackground", 0), textStyle);
		text.anchor.setTo(0.5, 0.5);
		var bgArtStyle = getStyle("bg_art");
	    var bgArtText = bgsTexts[curBg];
	    labelArt = game.add.text(0, 0, bgArtText, bgArtStyle);
	    labelArt.setTextBounds(463, 378, 154, 92);
		createButtons();
	}
};

function changeBg(bgIndex){
	bg.loadTexture('bg'+bgIndex);
	labelArt.text = bgsTexts[bgIndex];
	tmpBg = bgIndex;
}

function createButtons(){
	lblStyle = getStyle("button_regular");
	tmpX = (game.world.width / 2) - 25;
	tmpY = (game.world.height / 2);
	btns[0] = btnSettings = game.add.button(tmpX, tmpY, 'button', function(){changeBg(0)}, this, 1, 2, 0);
	btns[0].anchor.setTo(0.5, 0.5);
	lbls[0] = game.add.text(tmpX, tmpY, "1", lblStyle);
	lbls[0].anchor.setTo(0.5, 0.5);

	tmpX = (game.world.width / 2) + 25;
	btns[1] = btnSettings = game.add.button(tmpX, tmpY, 'button', function(){changeBg(1)}, this, 1, 2, 0);
	btns[1].anchor.setTo(0.5, 0.5);
	lbls[1] = game.add.text(tmpX, tmpY, "2", lblStyle);
	lbls[1].anchor.setTo(0.5, 0.5);

	tmpX = (game.world.width / 2) - 25;
	tmpY = (game.world.height / 2) + 50;
	btns[2] = btnSettings = game.add.button(tmpX, tmpY, 'button', function(){changeBg(2)}, this, 1, 2, 0);
	btns[2].anchor.setTo(0.5, 0.5);
	lbls[2] = game.add.text(tmpX, tmpY, "3", lblStyle);
	lbls[2].anchor.setTo(0.5, 0.5);

	tmpX = (game.world.width / 2) + 25;
	btns[3] = btnSettings = game.add.button(tmpX, tmpY, 'button', function(){changeBg(3)}, this, 1, 2, 0);
	btns[3].anchor.setTo(0.5, 0.5);
	lbls[3] = game.add.text(tmpX, tmpY, "4", lblStyle);
	lbls[3].anchor.setTo(0.5, 0.5);

	tmpX = (game.world.width / 2) - 25;
	tmpY = (game.world.height / 2) + 100;
	btns[4] = btnSettings = game.add.button(tmpX, tmpY, 'button', function(){changeBg(4)}, this, 1, 2, 0);
	btns[4].anchor.setTo(0.5, 0.5);
	lbls[4] = game.add.text(tmpX, tmpY, "5", lblStyle);
	lbls[4].anchor.setTo(0.5, 0.5);

	tmpX = (game.world.width / 2) + 25;
	btns[5] = btnSettings = game.add.button(tmpX, tmpY, 'button', function(){changeBg(5)}, this, 1, 2, 0);
	btns[5].anchor.setTo(0.5, 0.5);
	lbls[5] = game.add.text(tmpX, tmpY, "6", lblStyle);
	lbls[5].anchor.setTo(0.5, 0.5);

	saveCancelStyle = getStyle("button_small");

	tmpX = (game.world.width / 2) - 50;
	tmpY = (game.world.height / 2) + 200;
	btnSave = btnSettings = game.add.button(tmpX, tmpY, 'medium_button', saveSettings, this, 1, 2, 0);
	btnSave.anchor.setTo(0.5, 0.5);
	lblSave = game.add.text(tmpX, tmpY + 4, getText("Standard", 0), saveCancelStyle);
	lblSave.anchor.setTo(0.5, 0.5);

	tmpX = (game.world.width / 2) + 50;
	btnCancel = btnSettings = game.add.button(tmpX, tmpY, 'medium_button', goBack, this, 1, 2, 0);
	btnCancel.anchor.setTo(0.5, 0.5);
	lblCancel = game.add.text(tmpX, tmpY + 4, getText("Standard", 1), saveCancelStyle);
	lblCancel.anchor.setTo(0.5, 0.5);
}

function saveSettings(){
	curBg = tmpBg;
	localStorage.curBg = curBg;
	goBack();
}
