// 最初始场景，用来加载进度条
var BootScene = {
  // 加载进度条
  preload: function() {
    game.load.image('loading', 'assets/preloader.gif');
  },
  // 跳转到加载场景
  create: function() {
    game.state.start('preload');
  }
}
