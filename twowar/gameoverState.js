  var gameoverState = function (game) {
    this.create = function () {
      this.game.stage.backgroundColor = '#2d2d2d';
      this.linefirst = this.game.add.image(0, 0, 'white');//up
      this.linefirst.anchor.set(.5);
      this.linefirst.width = this.linefirst.width/10;
      this.linefirst.x = this.game.world.centerX;
      this.linefirst.y = -this.linefirst.height/2;
      this.linesecond = this.game.add.image(0, 0, 'white');//left
      this.linesecond.anchor.set(.5);
      this.linesecond.height = this.linesecond.height / 10;
      this.linesecond.x = -this.linesecond.width/2;
      this.linesecond.y = this.game.world.centerY;
      this.linethird = this.game.add.image(100, 100, 'white');//right
      this.linethird.anchor.set(.5);
      this.linethird.height = this.linethird.height / 10;
      this.linethird.x = this.game.world.width + this.linethird.width/2;
      this.linethird.y = this.game.world.centerY;
      this.linefourth = this.game.add.image(0, 0, 'white');//down
      this.linefourth.anchor.set(.5);
      this.linefourth.width = this.linefourth.width / 10;
      this.linefourth.x = this.game.world.centerX;
      this.linefourth.y = this.game.world.height + this.linefourth.height/2;
      var that = this;
      this.game.add.tween(this.linefirst).to({ height: this.game.world.height }, 2000, "Linear", true);
      this.game.add.tween(this.linesecond).to({ width: this.game.world.width }, 2000, "Linear", true);
      this.game.add.tween(this.linethird).to({ width: this.game.world.width }, 2000, "Linear", true);
      this.game.add.tween(this.linefourth).to({ height: this.game.world.height }, 2000, "Linear", true).onComplete.add(function () {
        that.linefirst.destroy();
        that.linesecond.destroy();
        that.linethird.destroy();
        that.linefourth.destroy();
        that.scoreText = that.game.add.text(0, 0, '9000');
        that.scoreText.setText(gameScore);
        that.scoreText.fill = '#FF7F00';
        that.scoreText.fontSize = 54;
        that.scoreText.anchor.set(.5);
        that.scoreText.x = that.game.world.centerX;
        that.scoreText.y = that.game.world.centerY;
        that.backText = that.game.add.text(0, 0, 'replay', { fill: '#0ff', fontSize: 27 });
        that.backText.anchor.set(.5);
        that.backText.x = that.game.world.centerX;
        that.backText.y = that.game.world.height / 3 * 2;
        that.backText.inputEnabled = true;
        that.backText.events.onInputDown.addOnce(function () {
          that.game.state.start('main');
        }, this);
      });
    };
  }