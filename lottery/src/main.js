
var Phaser = Phaser || {};
var BirdsAnimals = BirdsAnimals || {};

// 游戏大小 670x432
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO);

// 添加场景
game.state.add("BootState", new BirdsAnimals.BootState());
game.state.add("PreloadState", new BirdsAnimals.PreloadState());
game.state.add("StartState", new BirdsAnimals.StartState());

// 启动 Boot 场景
game.state.start("BootState");
