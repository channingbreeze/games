//import './js/libs/weapp-adapter'
//import Phaser from './js/libs/phaser-wx.js'

  var gameScore = 0;
  var game = new Phaser.Game({
    width: 320,
    height: 568,
    renderer: Phaser.CANVAS,
    //canvas: canvas,
  });
  game.state.add('boot', bootState);
  game.state.add('loader', loaderState);
  game.state.add('main', mainState);
  game.state.add('gameover',gameoverState);
  game.state.start('boot');