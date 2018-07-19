
var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game');

game.state.add("BootState", new CrazyBird.BootState());
game.state.add("PreloadState", new CrazyBird.PreloadState());
// game.state.add("MenuState", new CrazyBird.MenuState());
game.state.add("StartState", new CrazyBird.StartState());
// game.state.add("WinState", new CrazyBird.WinState());
game.state.start("BootState");
