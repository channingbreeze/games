  var loaderState = function (game) {
    var progressText;
    this.init = function () {
      //var sprite = game.add.image(game.world.centerX, game.world.centerY, 'loading');
      //sprite.anchor = { x: 0.5, y: 0.5 };
      progressText = game.add.text(game.world.centerX, game.world.centerY + 30, '0%', { fill: '#fff', fontSize: '30px' });
      progressText.anchor = { x: 0.5, y: 0.5 };
    };
    this.preload = function () {
      game.load.image('background', './images/background.jpg');//图片加载
      game.load.image('playerfirst', './images/playerfirst.png');
      game.load.image('playersecond', './images/playersecond.png');
      game.load.image('yellowblock', './images/yellowblock.png');
      game.load.image('bluecircle', './images/bluecircle.png');
      game.load.image('white', './images/white.png');
      game.load.image('pink', './images/pink.png');
      game.load.image('cyan', './images/cyan.png');
      game.load.image('blue', './images/blue.png');
      game.load.onFileComplete.add(function (progress) {
        progressText.text = progress + '%';
      });
    };
    this.create = function () {
      if (progressText.text == "100%") {
        game.state.start('main');
      }
    };
  }