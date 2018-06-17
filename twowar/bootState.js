  var bootState = function (game) {
  this.init = function () {
    var scaleX = window.innerWidth / 320;
    var scaleY = window.innerHeight / 568;
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(scaleX, scaleY);
  }
    this.preload = function () {
      //game.load.image('loading', 'assets/preloader.gif');
    };
    this.create = function () {
      game.state.start('loader');
    };
  }