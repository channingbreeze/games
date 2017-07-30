

require('./Boot.js');
require('./Preloader.js');
require('./MainMenu.js');
require('./Home.js');
require('./Kard.js');
require('./Game.js');
require('./Result.js');
require('./Rank.js');
require('./UI.js');
require('./Player.js');
require('./Monster.js');
require('./Weapon.js');



var gameDiv = document.getElementById("game-box");
	Phaser.myScaleManager=new MyScaleManager(gameDiv);

    game = new Phaser.Game(1206, 750, Phaser.CANVAS, 'game-box');
	Phaser.myScaleManager.boot();
    game.state.add('Boot', MyGame.Boot);
    game.state.add('Preloader', MyGame.Preloader);
    game.state.add('MainMenu', MyGame.MainMenu);
    game.state.add('Home', MyGame.Home);
    game.state.add('Kard', MyGame.Kard);
    game.state.add('Game', MyGame.Game);
    game.state.add('Result', MyGame.Result);
    game.state.add('Rank', MyGame.Rank);
    game.state.start('Boot');



