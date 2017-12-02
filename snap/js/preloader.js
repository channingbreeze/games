/**
 *
 * @authors H.yingzi (h.yingzi@gmail.com)
 * @date    2015-03-02 19:17:05
 *
 */

Car.Preloader = function(game) {
	Car.GAME_W = 640
	Car.GAME_H = 1008
	this.loadText = null
}

Car.Preloader.prototype = {
	create: function() {

		this.load.onLoadStart.add(this.loadStart, this)
		this.load.onFileComplete.add(this.fileComplete, this)
		this.load.onLoadComplete.add(this.loadComplete, this)

		this.loadText = this.add.text(Car.GAME_W / 2 - 40, Car.GAME_H / 2 - 60, '0', {
			fill: '#ffffff',
			font: "100px 微软雅黑",
			align: "center"
		})

		this.loading()
	},
	loadStart: function(total) {
		console.log("load start: " + total)
	},
	/**
	 * [fileComplete description]
	 * @param  {[type]} progress    [进度百分比]
	 * @param  {[type]} cacheKey    [文件名称]
	 * @param  {[boolean]} success  [是否成功]
	 * @param  {[type]} totalLoaded [加成完成的个数]
	 * @param  {[type]} totalFiles  [文件总数]
	 * @return {[type]}             [description]
	 */
	fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
		this.loadText.setText(progress)
		console.log("File Complete: " + progress + "% - " + cacheKey + "static: " + success + " " + totalLoaded + " out of " + totalFiles)
	},
	loadComplete: function() {
		this.state.start('menu')
	},
	loading: function() {
		this.stage.backgroundColor = '#000'


		//首页
		this.load.image('index-bg', 'assets/images/index-bg.jpg')
		this.load.image('btn-ad', 'assets/images/btn-ad.png')
		this.load.image('btn-drive', 'assets/images/btn-drive.png')
		this.load.image('btn-intro', 'assets/images/btn-intro.png')
		this.load.image('btn-prize', 'assets/images/btn-prize.png')
		this.load.image('btn-drive', 'assets/images/btn-drive.png')
		this.load.image('btn-rank-index', 'assets/images/btn-rank-index.png')
		this.load.spritesheet('btn-start', 'assets/images/btn-start.png',185,187)
		this.load.image('btn-weixin', 'assets/images/btn-weixin.png')

		//游戏
		this.load.image('map', 'assets/images/map.jpg')
		this.load.image('kuang', 'assets/images/kuang.png')
		this.load.image('mark', 'assets/images/mark.png')
		this.load.image('share', 'assets/images/share.png')
		this.load.image('btn-again', 'assets/images/btn-again.png')
		this.load.image('btn-rank', 'assets/images/btn-rank.png')
		this.load.image('cloud-01', 'assets/images/cloud-01.png')
		this.load.image('cloud-02', 'assets/images/cloud-02.png')
		this.load.image('cloud-03', 'assets/images/cloud-03.png')
		this.load.spritesheet('photo', 'assets/images/photo.png', 135, 145)
		this.load.spritesheet('btn-pai', 'assets/images/btn-pai.png', 296, 296)
		this.load.spritesheet('car', 'assets/images/carsprite.png', 173, 299)

		// 音效
		this.load.audio('bg-audio', 'assets/audio/bg.mp3')
		this.load.audio('btn-audio', 'assets/audio/btn.mp3')
		this.load.audio('photo-audio', 'assets/audio/photo.mp3')
		this.load.audio('pai-audio', 'assets/audio/pai.mp3')
		this.load.audio('gameover-audio', 'assets/audio/gameover.mp3')

		this.load.start()
	}
}