
var Phaser = Phaser || {};
var Tacit = Tacit || {};

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game');

game.state.add("BootState", new Tacit.BootState());
game.state.add("PreloadState", new Tacit.PreloadState());
game.state.add("MenuState", new Tacit.MenuState());
game.state.add("StartState", new Tacit.StartState());
game.state.add("WinState", new Tacit.WinState());
game.state.start("BootState");
