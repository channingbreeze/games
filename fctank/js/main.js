var Phaser = Phaser || {};
var GameTank = GameTank || {};

var game = new Phaser.Game(512, 416, Phaser.CANVAS, 'game');
game.state.add("BootState", new GameTank.BootState());
game.state.add("PreloadState", new GameTank.PreloadState());
game.state.add("StartState", new GameTank.StartState());
game.state.add("GameState", new GameTank.GameState());
game.state.add("OverState", new GameTank.OverState());
game.state.start("BootState");
