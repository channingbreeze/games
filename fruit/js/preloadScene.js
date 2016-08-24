// 加载其他资源的场景
var PreloadScene = {
  // 加载其他所有资源
  preload: function() {
    var preloadSprite = game.add.sprite(10, game.height/2, 'loading');
    game.load.setPreloadSprite(preloadSprite);
    game.load.image('apple', 'assets/apple.png');
    game.load.image('apple-1', 'assets/apple-1.png');
    game.load.image('apple-2', 'assets/apple-2.png');
    game.load.image('background', 'assets/background.jpg');
    game.load.image('banana', 'assets/banana.png');
    game.load.image('banana-1', 'assets/banana-1.png');
    game.load.image('banana-2', 'assets/banana-2.png');
    game.load.image('basaha', 'assets/basaha.png');
    game.load.image('basaha-1', 'assets/basaha-1.png');
    game.load.image('basaha-2', 'assets/basaha-2.png');
    game.load.image('best', 'assets/best.png');
    game.load.image('bomb', 'assets/bomb.png');
    game.load.image('dojo', 'assets/dojo.png');
    game.load.image('game-over', 'assets/game-over.png');
    game.load.image('home-desc', 'assets/home-desc.png');
    game.load.image('home-mask', 'assets/home-mask.png');
    game.load.image('logo', 'assets/logo.png');
    game.load.image('lose', 'assets/lose.png');
    game.load.image('new-game', 'assets/new-game.png');
    game.load.image('ninja', 'assets/ninja.png');
    game.load.image('peach', 'assets/peach.png');
    game.load.image('peach-1', 'assets/peach-1.png');
    game.load.image('peach-2', 'assets/peach-2.png');
    game.load.image('quit', 'assets/quit.png');
    game.load.image('sandia', 'assets/sandia.png');
    game.load.image('sandia-1', 'assets/sandia-1.png');
    game.load.image('sandia-2', 'assets/sandia-2.png');
    game.load.image('score', 'assets/score.png');
    game.load.image('shadow', 'assets/shadow.png');
    game.load.image('smoke', 'assets/smoke.png');
    game.load.image('x', 'assets/x.png');
    game.load.image('xf', 'assets/xf.png');
    game.load.image('xx', 'assets/xx.png');
    game.load.image('xxf', 'assets/xxf.png');
    game.load.image('xxx', 'assets/xxx.png');
    game.load.image('xxxf', 'assets/xxxf.png');
    game.load.bitmapFont('number', 'assets/bitmapFont.png', 'assets/bitmapFont.xml');
  },
  // 跳转到开始界面
  create: function() {
    game.state.start('main');
  }
};
