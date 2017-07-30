var loadState = {
	preload: function(){
		game.plugins.add(PhaserNineSlice.Plugin);

		var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill:'#ffffff'});
		game.load.atlas('blocoatlas', 'img/blocoatlas_v3.png', 'js/blocoatlas_v2.json');
		game.load.json('tetraminosJSON', 'js/tetraminos.json');
		game.load.json('langs', 'js/gameTexts.json');
		game.load.json('styles', 'js/styles.json');
		game.load.image('board', 'img/bg1.png');
		game.load.image('pattern_bg', 'img/tetrominos_pattern_bg.png');
		game.load.image('line400', 'img/line.png');
		game.load.image('popupPanel', 'img/popupPanel.png');
		game.load.image('logo', 'img/Tetris Clone Logo.png');
		game.load.image('pause_icon', 'img/pause_icon.png');
		game.load.image('upArrow', 'img/upParticle.png');
		// game.load.nineSlice('sliced_button', 'img/9patchButton.png', 8);
		game.load.nineSlice('sliced_panel', 'img/9patchPanel.png', 8);
		game.load.spritesheet('button', 'img/Button.png', 46, 46);
		game.load.spritesheet('medium_button', 'img/medium_button.png', 92, 46);
		game.load.spritesheet('big_button', 'img/big_button.png', 276, 46);
		game.load.spritesheet('small_button', 'img/small_button.png', 32, 32);
		game.load.spritesheet('key_assign_button', 'img/keyAssignButton.png', 400, 32);
		game.load.spritesheet('flags', 'img/flags.png', 32, 32);
		//bgs
		bgsNames = ["img/phaser_universe_bg.png", "img/bg_PROERD.png", "img/Kremlin.png", "img/virgilio_pokemon_ghosts.png", "img/virgilio_master_sword.png","img/ratinho.png"];
		bgsTexts = ["Phaser Universe\nby Phaser", "Proerd\nby Nestablo Ramos", "Kremlin's\nSurveillance Regime\nby Bruno Moraes", "Pokemon Ghosts\nby Virgilio Silveira", "Master Sword\nby Virgilio Silveira", "Ratinho in space\nby Caio Marchi"];
		var bgsCount = bgsNames.length;
		for(var i=0; i < bgsCount; i++){
			game.load.image('bg'+i,bgsNames[i]);
		}
		//load sounds
		game.load.audio('piecePlaced', 'snd/placed.ogg');
		game.load.audio('lineClear', 'snd/clear.ogg');
		game.load.audio('tetris', 'snd/tetris.ogg');
		game.load.audio('combo', 'snd/combo_ext.ogg');
		game.load.audio('move', 'snd/move.ogg');
		game.load.audio('rotate', 'snd/rotate.ogg');
		game.load.audio('hold', 'snd/hold.ogg');
		game.load.audio('theme-a', 'snd/themeA.ogg');
		game.load.audio('chaves', 'snd/chaves.ogg');
		createSounds();
		//loads data from disk
		curBg = parseInt(localStorage.curBg);

		initLang();
		createSounds();
	},

	update: function(){
		//only start the game after songs being ready
		if(game.cache.isSoundDecoded('theme-a') && game.cache.isSoundDecoded('chaves')){
			console.log("music decoded");
			game.state.start('menu');
		}
	}
};
