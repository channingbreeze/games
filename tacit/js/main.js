
var Phaser = Phaser || {};
var Tatic = Tatic || {};

var game = new Phaser.Game(1920, 1080, Phaser.CANVAS, 'game');

game.state.add("BootState", new Tatic.BootState());
game.state.add("PreloadState", new Tatic.PreloadState());
game.state.add("MenuState", new Tatic.MenuState());
game.state.add("StartState", new Tatic.StartState());
game.state.add("WinState", new Tatic.WinState());
game.state.start("BootState");
