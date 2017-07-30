var musicValue = 0;
var fxValue = 0;

var curMusicVolume = 0;
var curFxVolume = 0;
var labelInfo = 0;
var soundMenuState = {
	create: function(){
		drawPatternBG("#880088", "228822");
		buttonTint = 0x95f497;
		game.add.nineSlice(15, 210, "sliced_panel", "sliced_panel", 240, 60);
		game.add.nineSlice(15, 310, "sliced_panel", "sliced_panel", 240, 60);
		game.add.nineSlice(385, 210, "sliced_panel", "sliced_panel", 240, 160);
		music.stop();
		createSounds();
		music.loopFull(music.volume);
		var titleLabel = game.add.text(80, 80, getText("SoundMenu", 0), getStyle("title"));
		var buttonStyle = getStyle("button_regular");
		var labelStyle = getStyle("text_big");
		var musicLabel = game.add.text(game.world.width / 5, 200, getText("SoundMenu", 1), labelStyle);
		musicLabel.anchor.setTo(0.5, 0.5);
		var fxLabel = game.add.text(game.world.width / 5 ,300, getText("SoundMenu", 2), labelStyle);
		fxLabel.anchor.setTo(0.5, 0.5);
		var valueStyle = getStyle("text_big");
		musicValue = game.add.text(140, (game.world.height / 2), "70%", valueStyle);
		musicValue.anchor.setTo(0.5, 0.5);
		fxValue = game.add.text(140, (game.world.height / 2) + 100, "70%", valueStyle);
		fxValue.anchor.setTo(0.5, 0.5);

		//Music
		btnMusicMinus= game.add.button( 50, (game.world.height / 2), 'button', musicMinusButton, this, 1, 2, 0);
		btnMusicMinus.anchor.setTo(0.5, 0.5);
		btnMusicMinus.tint = buttonTint;
		lblMusicMinus = game.add.text(50 , (game.world.height / 2), "-", buttonStyle);
		lblMusicMinus.anchor.setTo(0.5, 0.5);

		btnMusicPlus = game.add.button((game.world.width / 2) - 100, (game.world.height / 2), 'button', musicPlusButton, this, 1, 2, 0);
		btnMusicPlus.anchor.setTo(0.5, 0.5);
		btnMusicPlus.tint = buttonTint;
		lblMusicPlus = game.add.text((game.world.width / 2) - 100, (game.world.height / 2), "+", buttonStyle);
		lblMusicPlus.anchor.setTo(0.5, 0.5);
		//Sound FX
		btnFxMinus= game.add.button( 50, (game.world.height / 2) + 100, 'button', fxMinusButton, this, 1, 2, 0);
		btnFxMinus.anchor.setTo(0.5, 0.5);
		btnFxMinus.tint = buttonTint;
		lblFxMinus = game.add.text(50 , (game.world.height / 2) + 100, "-", buttonStyle);
		lblFxMinus.anchor.setTo(0.5, 0.5);

		btnFxPlus = game.add.button((game.world.width / 2) - 100, (game.world.height / 2) + 100, 'button', fxPlusButton, this, 1, 2, 0);
		btnFxPlus.anchor.setTo(0.5, 0.5);
		btnFxPlus.tint = buttonTint;
		lblFxPlus = game.add.text((game.world.width / 2) - 100, (game.world.height / 2) + 100, "+", buttonStyle);
		lblFxPlus.anchor.setTo(0.5, 0.5);

		//change Track
		trackInfoTitle = game.add.text(500, game.world.height / 2 - 50, getText("SoundMenu", 3), labelStyle);
		trackInfoTitle.anchor.setTo(0.5, 0.5);
		var trackInfoTextStyle = getStyle("track_info");
	    trackInfoText = trackDesc[trackNames.indexOf(music.name)];
	    labelInfo = game.add.text(0, 0, trackInfoText, trackInfoTextStyle);
	    labelInfo.setTextBounds(game.world.width / 2 + 100, game.world.height / 2 -40, 200, 100);

	    btnPrevTrack = game.add.button((game.world.width / 2) + 100, (game.world.height / 2) + 100, 'button', function(){prevTrack();updateLabels()}, this, 1, 2, 0);
		btnPrevTrack.anchor.setTo(0.5, 0.5);
		btnPrevTrack.tint = buttonTint;
		lblPrevTrack = game.add.text((game.world.width / 2) + 100 , (game.world.height / 2) + 100, "<<", buttonStyle);
		lblPrevTrack.anchor.setTo(0.5, 0.5);

		btnNextTrack = game.add.button((game.world.width) -50, (game.world.height / 2) + 100, 'button', function(){nextTrack();updateLabels()}, this, 1, 2, 0);
		btnNextTrack.anchor.setTo(0.5, 0.5);
		btnNextTrack.tint = buttonTint;
		lblNextTrack = game.add.text((game.world.width) -50, (game.world.height / 2) + 100, ">>", buttonStyle);
		lblNextTrack.anchor.setTo(0.5, 0.5);

		//save / cancel
		saveCancelStyle = getStyle("button_small");
		tmpX = (game.world.width / 2) - 50;
		tmpY = (game.world.height / 2) + 200;
		btnSave = btnSettings = game.add.button(tmpX, tmpY, 'medium_button', saveAudioSettings, this, 1, 2, 0);
		btnSave.anchor.setTo(0.5, 0.5);
		btnSave.tint = buttonTint;
		lblSave = game.add.text(tmpX, tmpY + 4, getText("Standard", 0), saveCancelStyle);
		lblSave.anchor.setTo(0.5, 0.5);

		tmpX = (game.world.width / 2) + 50;
		btnCancel = btnSettings = game.add.button(tmpX, tmpY, 'medium_button', cancelSoundSettings, this, 1, 2, 0);
		btnCancel.anchor.setTo(0.5, 0.5);
		btnCancel.tint = buttonTint;
		lblCancel = game.add.text(tmpX, tmpY + 4, getText("Standard", 1), saveCancelStyle);
		lblCancel.anchor.setTo(0.5, 0.5);

		updateLabels();
	}
};

function updateLabels(){
	mVol = music.volume;
	fVol = fxMove.volume;

	musicValue.text = (mVol * 50).toFixed(0) + "%";
	fxValue.text = (fVol * 50).toFixed(0) + "%";
	labelInfo.text = trackDesc[trackNames.indexOf(music.name)];
}

function musicMinusButton(){
	curMusicVolume = music.volume;
	if(curMusicVolume > 0){
		curMusicVolume -= 0.1;
		if(curMusicVolume < 0){
			curMusicVolume = 0;
		}
		setMusicVolume(curMusicVolume);
		updateLabels();
	}
}

function musicPlusButton(){
	console.log(typeof(music.volume));
	curMusicVolume = music.volume;
	if(curMusicVolume < 2){
		curMusicVolume += 0.1;
		setMusicVolume(curMusicVolume);
		updateLabels();
	}
}

function fxMinusButton(){
	curFxVolume = fxMove.volume;
	if(curFxVolume > 0){
		curFxVolume -= 0.1;
		if(curFxVolume < 0){
			curFxVolume = 0;
		}
		fxMove.volume = curFxVolume;
	}
	fxMove.play();
	updateLabels();
}

function fxPlusButton(){
	curFxVolume = fxMove.volume;
	if(curFxVolume < 2){
		curFxVolume += 0.1;
		fxMove.volume = curFxVolume;
	}
	fxMove.play();
	updateLabels();
}

function cancelSoundSettings(){
	music.stop();
	goBack();
}

function saveAudioSettings(){
	saveSoundSettings(music.volume, fxMove.volume, music.name);
	music.stop();
	goBack();
}
