  var mainState = function (game) {
    this.create = function () {
      this.score = 0;
      this.imageA = this.game.add.image(-100, 0, 'yellowblock');
      this.imageB = this.game.add.image(-100, 0, 'bluecircle');
      this.background = game.add.tileSprite(0, 0, game.world.width, game.world.height,'background');
      this.background.autoScroll(0, 20);
      this.playerfirst = game.add.image(0, 0, 'playerfirst');
      this.playerfirst.anchor.set(.5);
      this.playerfirst.scale.set(.5);
      this.playerfirst.x = this.playerfirst.width/2;
      this.playerfirst.y = game.world.height - this.playerfirst.height - 40;
      createEmitter(this.playerfirst);
      this.playersecond = game.add.image(0, 0, 'playersecond');
      this.playersecond.anchor.set(.5);
      this.playersecond.scale.set(.5);
      this.playersecond.x = game.world.width - this.playersecond.width + this.playersecond.width/2;
      this.playersecond.y = game.world.height - this.playersecond.height - 40;
      createEmitter(this.playersecond);
      game.input.onDown.add(function () {
        if (game.input.activePointer.x < this.playerfirst.width) {
          //console.log('第1列');
          tween(this.playerfirst,0,300);
        }
        if (game.input.activePointer.x > this.playerfirst.width && game.input.activePointer.x < this.playerfirst.width * 2) {
          //console.log('第2列');
          tween(this.playerfirst, 1, 300);
        }
        if (game.input.activePointer.x > this.playerfirst.width*2 && game.input.activePointer.x < this.playerfirst.width * 3) {
          //console.log('第3列');
          tween(this.playersecond, 2, 300);
        }
        if (game.input.activePointer.x > this.playerfirst.width*3) {
          //console.log('第4列');
          tween(this.playersecond, 3, 300);
        }
      }, this);
      this.solids = this.game.add.group();
      this.solids.enableBody = true;
    }
    this.dt = 0;
    this.update = function () {
      this.dt++;
      if (this.dt % 70 == 0) { //rnd*2 == x && class        
        this.solid = this.solids.create(0, -50, 'yellowblock');
        this.solid.scale.set(.5);
        this.solid.tag = 'yellowblock';
        this.rndNum = this.game.rnd.between(1, 2);
        this.solid.x = (this.playerfirst.width - this.solid.width) / 2 + this.playerfirst.width * (this.rndNum - 1);
        this.rndClass = this.game.rnd.between(1,3);
        if (this.rndClass == 3) {
          this.solid.texture = this.imageB.texture;
          this.solid.tag = 'bluecircle';
        }
      }
      if (this.dt % 70 == 0) { //rnd*2 == x && class        
        this.solid = this.solids.create(0, -50, 'yellowblock');
        this.solid.scale.set(.5);
        this.solid.tag = 'yellowblock';
        this.rndNum = this.game.rnd.between(3, 4);
        this.solid.x = (this.playerfirst.width - this.solid.width) / 2 + this.playerfirst.width * (this.rndNum - 1);
        this.rndClass = this.game.rnd.between(1, 3);
        if (this.rndClass == 1) {
          this.solid.texture = this.imageB.texture;
          this.solid.tag = 'bluecircle';
        }
      }
      if (this.solids.length > 0){ 
        for (var i = 0; i < this.solids.length; i++) {
          if (this.solids.getChildAt(i).y + this.solids.getChildAt(i).height > this.game.world.height) {
            if (this.solids.getChildAt(i).tag == 'bluecircle') { 
              this.solids.getChildAt(i).destroy();
              this.game.state.start('gameover');
            }
          }
          if (this.solids.getChildAt(i).y > this.game.world.height) {
            this.solids.getChildAt(i).destroy();
          }
          this.solids.getChildAt(i).y += 3;
        }
      }
      for (var i = 0; i < this.solids.length; i++) {
        if (checkOverlap(this.playerfirst, this.solids.getChildAt(i))) {//firstPlane
          if (this.solids.getChildAt(i).tag == 'yellowblock') {
            console.log(this.solids.getChildAt(i).tag);
            this.game.state.start('gameover');
          }
          this.solids.getChildAt(i).destroy();
        }
        if (checkOverlap(this.playersecond, this.solids.getChildAt(i))) {//secondPlane
          if (this.solids.getChildAt(i).tag == 'yellowblock') {
            console.log(this.solids.getChildAt(i).tag);
            this.game.state.start('gameover');
          }
          this.solids.getChildAt(i).destroy();
        }
      }
      this.score++;
      gameScore = this.score;
    }
  }