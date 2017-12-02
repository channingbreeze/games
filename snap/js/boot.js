/**
 *
 * @authors H.yingzi (h.yingzi@gmail.com)
 * @date    2015-03-02 16:03:32
 *
 */

var Car = Car || {}
Car.Boot = function(game) {}
Car.Boot.prototype = {
	preload: function() {
		//this.load.image('preloaderBar', 'images/preloader-bar.jpg')
	},
	create: function() {
		// 触摸点数
		this.input.maxPointers = 1;
		// 缩放方式
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// 水平居中
		this.scale.pageAlignHorizontally = true;
		// 垂直居中
		this.scale.pageAlignVertically = true;
		this.state.start('preloader');
		Car.W = this.game.width
		Car.H = this.game.height
	}
}