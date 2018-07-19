/**
 *
 * @authors H.yingzi (h.yingzi@gmail.com)
 * @date    2015-03-03 12:01:03
 *
 */

Car.Menu = function(game) {}

Car.Menu.prototype = {
	create: function() {
		bgMusic = this.add.audio('bg-audio', 1, true)
		bgMusic.play('', 0, 1, true)
		this.state.start('game')
		return
		var fontStyle = {
			font: "18px 微软雅黑",
			fill: "#000",
			align: "right"
		}
		var popIntro = document.getElementById('game-intro')
		var popClose = document.getElementsByClassName("game-intro-close")[0]

		this.add.sprite(0, 0, 'index-bg')
		var btnWX = this.add.sprite(Car.W - 100, 40, 'btn-weixin')
		this.add.text(Car.W - 150, 120, "关注一汽奔腾", fontStyle)
		var btnRank = this.add.sprite(Car.W - 100, 160, 'btn-rank-index')
		this.add.text(Car.W - 96, 240, "排行榜", fontStyle)
		var btnPrize = this.add.sprite(Car.W - 100, 270, 'btn-prize')
		this.add.text(Car.W - 96, 350, "礼物盒", fontStyle)
		var btnAd = this.add.sprite(Car.W - 260, 0, 'btn-ad')

		var btnIntro = this.add.sprite(30, Car.H - 180, 'btn-intro')
		var btnDrive = this.add.sprite(448, Car.H - 180, 'btn-drive')
		btnIntro.inputEnabled = true
		btnDrive.inputEnabled = true
		btnIntro.events.onInputDown.add(function() {
			popIntro.style.display = "block"
		}, this);
		popClose.ontouchend = function(){
			popIntro.style.display = "none"
		}

		this.add.button(Car.W / 2 - 92, Car.H - 240, 'btn-start', this.startGame, this, 0, 0, 1)
			//btnStrat.onInputDown.add(this.startGame, this)

	},
	startGame: function() {
		this.state.start('game')
	}
}