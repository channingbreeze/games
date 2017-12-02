/**
 *
 * @authors H.yingzi (h.yingzi@gmail.com)
 * @date    2015-03-02 19:21:12
 *
 */

Car.Game = function(game) {
	this._car = null
	this._over = false
	this._ok = false
	this._play = true
	this.photoCount = 0
	this.photoItem = []
	this.photoAnim = true
	this.speed = 3000
	this.level = 1
	this.isUp = null

	Car.photo = 0
	Car.film = 5
	Car.filmText = null
	Car.photoText = null
}

Car.Game.prototype = {
	create: function() {
		var _this = this
		this.add.sprite(0, 0, 'map')
		this._car = this.add.sprite(150, -300, 'car', 0)

		setTimeout(function() {
			_this.resetCar()
		}, 1000)

		this._fontStyle = {
			font: "36px 微软雅黑",
			fill: "#fff",
			strokeThickness: 1,
			align: "center"
		}

		Car.photoText = this.add.text(294, 55, "0", this._fontStyle)
		Car.filmText = this.add.text(115, 55, Car.film, this._fontStyle)

		var mark = this.add.sprite(24, -43, 'mark')
		var kuang = this.add.sprite(Car.GAME_W / 2 - 241, 211, 'kuang')
		this.btnPai = this.add.button(Car.GAME_W / 2 - 148, 1008, 'btn-pai', null, this, 0, 0, 1)

		kuang.alpha = 0

		this.add.tween(mark).to({
			y: 43
		}, 500, Phaser.Easing.Linear.None, true, false)

		this.add.tween(kuang).to({
			alpha: 1
		}, 500, Phaser.Easing.Linear.None, true, false)

		this.add.tween(this.btnPai).to({
			y: 710
		}, 500, Phaser.Easing.Linear.None, true, false)
		this.btnPai.onInputDown.add(this.pai, this)

		this.photoMusic = this.add.audio('photo-audio')
		this.paiMusic = this.add.audio('pai-audio')
		this.overMusic = this.add.audio('gameover-audio')
		this.btnMusic = this.add.audio('btn-audio')

		this.cloud1 = this.add.sprite(-300, 200, 'cloud-01')
		this.cloud2 = this.add.sprite(-300, 50, 'cloud-02')
		this.cloud3 = this.add.sprite(0, 1008, 'cloud-03')
		this.cloud1.visible = false
		this.cloud2.visible = false
		this.cloud3.visible = false
			//this.dataURI = this.game.canvas.toDataURL()
			//this.input.addMoveCallback(this.getPoint, this);
	},
	getPoint: function(p, x, y) {
		console.log("X: " + x, "  Y: " + y)
	},
	managePause: function() {
		if (this._play) {
			this.tween.pause()
		} else {
			this.tween.resume()
		}
		this._play = !this._play
	},
	update: function() {
		if (this._car !== null) {
			if (this._car.y === (this.isUp ? -300 : 1008)) {
				if (this._ok) {
					this.resetCar()
					this._ok = false
				} else {
					this.overMusic.play()
					this.gameOver()
				}
			}
		}
	},
	record: function() {
		//ajax
	},
	resetCar: function() {
		var num = Math.floor(Math.random() * 8)
		this.isUp = num > 3 ? true : false
		this._car.frame = num
		this._car.x = this.isUp ? 370 : 150
		this._car.y = this.isUp ? 1008 : -300
			//this._car.angle = Math.random() > 0.5 ? -Math.floor(Math.random() * 40) : Math.floor(Math.random() * 40)
		this.add.tween(this._car).to({
			y: this.isUp ? -300 : 1008
		}, this.speed, Phaser.Easing.Linear.None, true, false)
		this.addCloud()
	},
	removePhoto: function(obj) {
		obj && obj.destroy()
	},
	gameOver: function() {
		this.game.paused = true
		console.log("游戏结束！")
		this.overMusic.play()

		if (Car.film === 0) {
			this.input.onDown.remove(this.again, this)
			alert("没有胶卷啦！")
		} else {
			Car.film--;
			this.input.onDown.add(this.again, this)
		}

		Car.filmText.setText(Car.film)

		this.speed = 3000

		this.share = this.add.sprite(0, 0, 'share')
		this.btnAgain = this.add.sprite(Car.GAME_W / 2 - 131, 506, 'btn-again')
		this.btnRank = this.add.sprite(Car.GAME_W / 2 - 131, 608, 'btn-rank')


	},
	again: function(e) {
		var c = Car.GAME_W / 2
		var x1 = c - 131,
			y1 = 506,
			x2 = c + 131,
			y2 = 589,
			y3 = 608,
			y4 = 691;
		var _this = this
		if (this.game.paused) {
			// 再试一次
			if (e.x > x1 && e.x < x2 && e.y > y1 && e.y < y2) {
				this.btnMusic.play()
				console.log("再来一次")
				if (this.photoItem) {
					for (var key in this.photoItem) {
						this.removePhoto(this.photoItem[key])
					}
				}
				Car.photo = 0
				Car.photoText.setText(Car.photo)
				this.share.destroy()
				this.btnAgain.destroy()
				this.btnRank.destroy()
				this.resetCar()
				this.photoCount = 0
				this.photoItem.length = 0

				_this.game.paused = false
			} else if (e.x > x1 && e.x < x2 && e.y > y3 && e.y < y4) {
				// 排行榜
				this.btnMusic.play()
				console.log("排行榜")
			} else {
				return
			}
		}
	},
	photoToScore: function(callback) {
		var _this = this
		var length = this.photoItem.length
		for (var key in this.photoItem) {
			this.add.tween(this.photoItem[key]).to({
				x: 226,
				y: 49,
				width: 40,
				height: 40,
				angle: 0,
			}, 1000, Phaser.Easing.Back.In, true, false).delay(key).onComplete.add(this.removePhoto, this)
		}
		this.photoMusic.play()
		this.photoCount = 0
		this.photoItem.length = 0
	},
	addPhoto: function() {
		if (this.photoCount === 5) {
			this.photoToScore()
		}
		var item = this.add.sprite(222, 376, 'photo')
		var angle = Math.floor(Math.random() * 10) > 5 ? Math.floor(Math.random() * 30) : -Math.floor(Math.random() * 30)
		item.alpha = .1
		this.photoCount++;
		this.photoItem.push(item)
		this.add.tween(item).to({
			x: 597,
			y: 224 + (this.photoCount === 1 ? 0 : this.photoCount * 90),
			alpha: 1,
			angle: angle
		}, 1000, Phaser.Easing.Back.Out, true, false);
	},
	pai: function(e) {
		this.paiMusic.play()
		console.log(this._car.y)
		if (this._car.y > 200 && this._car.y < 410) {
			document.getElementById('shan').style.display = "block"
			Car.photo++;
			Car.photoText.setText(Car.photo)
			this.updateLevel()
			setTimeout(function() {
				document.getElementById('shan').style.display = "none"
			}, 100)
			this.addPhoto()
			this._ok = true
		} else {
			this.gameOver()
		}
	},
	updateLevel: function() {
		if (Car.photo % 5 === 0 && this.speed > 900) {
			this.speed = this.speed - 300
		} else if (this.speed < 900) {
			this.speed = this.speed - 10
		} else {
			this.speed = this.speed - 50
		}
		this.level = 1 + Car.photo / 5
		console.log(this.level)
	},
	addCloud: function() {
		if (this.level === 3) {
			this.cloud1.visible = true
			this.add.tween(this.cloud1).to({
				x: 640
			}, 3000, Phaser.Easing.Linear.None, true, false)
		} else if (this.level === 4) {
			this.cloud2.visible = true
			this.add.tween(this.cloud2).to({
				x: 640
			}, 3000, Phaser.Easing.Linear.None, true, false)
		} else if (this.level === 5) {
			this.cloud3.visible = true
			this.add.tween(this.cloud3).to({
				y: 900
			}, 3000, Phaser.Easing.Linear.None, true, false)
		}
	},
	render:function(){

		//this.game.debug.body(this._car)
		//this.game.debug.spriteInfo(this._car, 32, 32);
	}
}