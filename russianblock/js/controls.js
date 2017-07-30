var controlsState = {
	create: function(){
		drawPatternBG("#880000", "225555");
		buttonTint = 0x77efbe;
		game.add.nineSlice(110, 145, "sliced_panel", "sliced_panel", 420, 250);
		waitingKeyPress = false;
		tmpUserKeys = loadUserKeys();
		var titleLabel = game.add.text(80, 80, getText('Controls', 0),getStyle("title"));
		var buttonStyle = getStyle("button_regular");
	    
		popupPanel = game.add.sprite(game.world.width / 2, game.world.height / 2, 'popupPanel');
		popupPanel.anchor.x = 0.5;
		popupPanel.anchor.y = 0.5;
		popupPanel.visible = false;

		popupText = game.add.text(game.world.width / 2, (game.world.height / 2), "PLACE_HOLDER", {font: '32px Arial', fill:'#080808', align:'center'});
		popupText.anchor.x = 0.5;
		popupText.anchor.y = 0.5;
		popupText.visible = false;

		createKeyAssignmentButtons();

		popupGroup = game.add.group();
		popupGroup.add(popupPanel);
		popupGroup.add(popupText);

		saveCancelStyle = getStyle("button_small");

		tmpX = (game.world.width / 2) - 100;
		tmpY = (game.world.height / 2) + 200;
		btnSave = btnSettings = game.add.button(tmpX, tmpY, 'medium_button', saveControls, this, 1, 2, 0);
		btnSave.anchor.setTo(0.5, 0.5);
		btnSave.tint = buttonTint;
		lblSave = game.add.text(tmpX, tmpY + 4, getText("Standard", 0), saveCancelStyle);
		lblSave.anchor.setTo(0.5, 0.5);

		tmpX = (game.world.width / 2);
		btnCancel = btnSettings = game.add.button(tmpX, tmpY, 'medium_button', goBack, this, 1, 2, 0);
		btnCancel.anchor.setTo(0.5, 0.5);
		btnCancel.tint = buttonTint;
		lblCancel = game.add.text(tmpX, tmpY + 4, getText("Standard", 1), saveCancelStyle);
		lblCancel.anchor.setTo(0.5, 0.5);

		tmpX = (game.world.width / 2) + 100;
		btnReset = btnSettings = game.add.button(tmpX, tmpY, 'medium_button', resetKeys, this, 1, 2, 0);
		btnReset.anchor.setTo(0.5, 0.5);
		btnReset.tint = buttonTint;
		lblReset = game.add.text(tmpX, tmpY + 4, getText("Standard", 3), saveCancelStyle);
		lblReset.anchor.setTo(0.5, 0.5);

		game.world.bringToTop(popupGroup);
		isPopupShown = false;
	},

	update: function(){
		if(isPopupShown){
			if(!waitingKeyPress){
				waitingKeyPress = true;
			}
			game.input.keyboard.onDownCallback = function(){
				changeKey(game.input.keyboard.event.keyCode);
			}
		}
	}
};

function assignKey(keyIndex){
	if(!isPopupShown){
		console.log(keyIndex);
		keyModified = keyIndex;
		isPopupShown = true;
		popupPanel.visible = true;
		popupText.text = getText("Controls", 10)+"\n" + actionTexts[keyIndex];
		popupText.visible = true;
	}
}

function createKeyAssignmentButtons(){
	keysButtons = [];
	//actionTexts = ['Move Left','Move Right','Rotate Clockwise','Rotate Counter-Clockwise','Soft Drop','Hard Drop','Hold', 'Menu Confirm', 'Menu Back'];
	actionTexts = [];
	for(i = 1; i < 10; i++){
		actionTexts.push(getText("Controls", i));
	}

	var actionLabelStyle = getStyle("controls_action");

    var keysLabelStyle = getStyle("controls_key");

	keysLabels = [];
	actionLabels = [];

	i = 0;
	keysButtons.push(game.add.button(120, 144 + (i * 26), 'key_assign_button', function(){assignKey(0)}, this, 0, 0, 1));//if I could change this line I could put all this inside a for
	actionL = game.add.text(0, 0, actionTexts[i], actionLabelStyle);
	actionL.setTextBounds(120, 150 + (i * 26), 400, 32);
	actionLabels.push(actionL);

	game.add.sprite(120, 170 + (i * 26), 'line400');

	keysL = game.add.text(0, 0, getKeyName(tmpUserKeys[i]), keysLabelStyle);
	keysL.setTextBounds(120, 150 + (i * 26), 400, 32);
	keysLabels.push(keysL);

	i++;
	keysButtons.push(game.add.button(120, 144 + (i * 26), 'key_assign_button', function(){assignKey(1)}, this, 0, 0, 1));//if I could change this line I could put all this inside a for
	actionL = game.add.text(0, 0, actionTexts[i], actionLabelStyle);
	actionL.setTextBounds(120, 150 + (i * 26), 400, 32);
	actionLabels.push(actionL);

	game.add.sprite(120, 170 + (i * 26), 'line400');

	keysL = game.add.text(0, 0, getKeyName(tmpUserKeys[i]), keysLabelStyle);
	keysL.setTextBounds(120, 150 + (i * 26), 400, 32);
	keysLabels.push(keysL);

	i++;
	keysButtons.push(game.add.button(120, 144 + (i * 26), 'key_assign_button', function(){assignKey(2)}, this, 0, 0, 1));//if I could change this line I could put all this inside a for
	actionL = game.add.text(0, 0, actionTexts[i], actionLabelStyle);
	actionL.setTextBounds(120, 150 + (i * 26), 400, 32);
	actionLabels.push(actionL);

	game.add.sprite(120, 170 + (i * 26), 'line400');

	keysL = game.add.text(0, 0, getKeyName(tmpUserKeys[i]), keysLabelStyle);
	keysL.setTextBounds(120, 150 + (i * 26), 400, 32);
	keysLabels.push(keysL);

	i++;
	keysButtons.push(game.add.button(120, 144 + (i * 26), 'key_assign_button', function(){assignKey(3)}, this, 0, 0, 1));//if I could change this line I could put all this inside a for
	actionL = game.add.text(0, 0, actionTexts[i], actionLabelStyle);
	actionL.setTextBounds(120, 150 + (i * 26), 400, 32);
	actionLabels.push(actionL);

	game.add.sprite(120, 170 + (i * 26), 'line400');

	keysL = game.add.text(0, 0, getKeyName(tmpUserKeys[i]), keysLabelStyle);
	keysL.setTextBounds(120, 150 + (i * 26), 400, 32);
	keysLabels.push(keysL);

	i++;
	keysButtons.push(game.add.button(120, 144 + (i * 26), 'key_assign_button', function(){assignKey(4)}, this, 0, 0, 1));//if I could change this line I could put all this inside a for
	actionL = game.add.text(0, 0, actionTexts[i], actionLabelStyle);
	actionL.setTextBounds(120, 150 + (i * 26), 400, 32);
	actionLabels.push(actionL);

	game.add.sprite(120, 170 + (i * 26), 'line400');

	keysL = game.add.text(0, 0, getKeyName(tmpUserKeys[i]), keysLabelStyle);
	keysL.setTextBounds(120, 150 + (i * 26), 400, 32);
	keysLabels.push(keysL);

	i++;
	keysButtons.push(game.add.button(120, 144 + (i * 26), 'key_assign_button', function(){assignKey(5)}, this, 0, 0, 1));//if I could change this line I could put all this inside a for
	actionL = game.add.text(0, 0, actionTexts[i], actionLabelStyle);
	actionL.setTextBounds(120, 150 + (i * 26), 400, 32);
	actionLabels.push(actionL);

	game.add.sprite(120, 170 + (i * 26), 'line400');

	keysL = game.add.text(0, 0, getKeyName(tmpUserKeys[i]), keysLabelStyle);
	keysL.setTextBounds(120, 150 + (i * 26), 400, 32);
	keysLabels.push(keysL);

	i++;
	keysButtons.push(game.add.button(120, 144 + (i * 26), 'key_assign_button', function(){assignKey(6)}, this, 0, 0, 1));//if I could change this line I could put all this inside a for
	actionL = game.add.text(0, 0, actionTexts[i], actionLabelStyle);
	actionL.setTextBounds(120, 150 + (i * 26), 400, 32);
	actionLabels.push(actionL);

	game.add.sprite(120, 170 + (i * 26), 'line400');

	keysL = game.add.text(0, 0, getKeyName(tmpUserKeys[i]), keysLabelStyle);
	keysL.setTextBounds(120, 150 + (i * 26), 400, 32);
	keysLabels.push(keysL);

	i++;
	keysButtons.push(game.add.button(120, 144 + (i * 26), 'key_assign_button', function(){assignKey(7)}, this, 0, 0, 1));//if I could change this line I could put all this inside a for
	actionL = game.add.text(0, 0, actionTexts[i], actionLabelStyle);
	actionL.setTextBounds(120, 150 + (i * 26), 400, 32);
	actionLabels.push(actionL);

	game.add.sprite(120, 170 + (i * 26), 'line400');

	keysL = game.add.text(0, 0, getKeyName(tmpUserKeys[i]), keysLabelStyle);
	keysL.setTextBounds(120, 150 + (i * 26), 400, 32);
	keysLabels.push(keysL);

	i++;
	keysButtons.push(game.add.button(120, 144 + (i * 26), 'key_assign_button', function(){assignKey(8)}, this, 0, 0, 1));//if I could change this line I could put all this inside a for
	actionL = game.add.text(0, 0, actionTexts[i], actionLabelStyle);
	actionL.setTextBounds(120, 150 + (i * 26), 400, 32);
	actionLabels.push(actionL);

	game.add.sprite(120, 170 + (i * 26), 'line400');

	keysL = game.add.text(0, 0, getKeyName(tmpUserKeys[i]), keysLabelStyle);
	keysL.setTextBounds(120, 150 + (i * 26), 400, 32);
	keysLabels.push(keysL);
}

function changeKey(newKey){
	tmpUserKeys[keyModified] = newKey;
	keysLabels[keyModified].text = getKeyName(tmpUserKeys[keyModified]);
	isPopupShown = false;
	waitingKeyPress = false;
	popupPanel.visible = false;
	popupText.visible = false;
	game.input.keyboard.onDownCallback = null;
}

function saveControls(){
	saveUserKeys(tmpUserKeys);
	userKeys = tmpUserKeys;
	goBack();
}

function resetKeys(){
	tmpUserKeys = getDefaultUserKeys();
	updateAllUserKeys();
}

function updateAllUserKeys(){
	for(i =0; i < 9; i++){
		console.log(tmpUserKeys[i]);
		keysLabels[i].text = getKeyName(tmpUserKeys[i]);
	}
}
