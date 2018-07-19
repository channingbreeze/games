
var game = new Phaser.Game(270, 480, Phaser.CANVAS, '');

game.States = {};

game.States.boot = function() {
    this.preload = function() {
    	if(typeof(GAME) !== "undefined") {
    		this.load.baseURL = GAME + "/";
    	}
        if(!game.device.desktop){
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.forcePortrait = true;
            this.scale.refresh();
        }
        game.load.image('loading', 'assets/preloader.gif');
    };
    this.create = function() {
        game.state.start('preload');
    };
};

game.States.preload = function() {
    this.preload = function() {
        var preloadSprite = game.add.sprite(25, game.height/2, 'loading');
        game.load.setPreloadSprite(preloadSprite);
        game.load.image('background', 'assets/background.png');
        game.load.image('prescene1', 'assets/prescene1.png');
        game.load.image('scene1', 'assets/scene1.png');
        game.load.image('ground', 'assets/ground.png');
        game.load.image('heart', 'assets/heart.png');
        game.load.spritesheet('man', 'assets/man.png', 20, 60);
        game.load.spritesheet('woman', 'assets/woman.png', 20, 60);
        game.load.image('leftpad', 'assets/leftpad.png');
        game.load.image('rightpad', 'assets/rightpad.png');
        game.load.image('uppad', 'assets/uppad.png');
    };
    this.create = function() {
        //game.state.start('start');
        game.state.start('scene2');
    };
};

game.States.start = function() {
    this.create = function() {
        game.add.sprite(0, 0, 'background');
        this.man = game.add.sprite(20, 292, 'man');
        this.woman = game.add.sprite(230, 292, 'woman');
        this.man.animations.add('left', [0, 1, 2, 3], 10, true);
        this.man.animations.add('right', [5, 6, 7, 8], 10, true);
        this.woman.animations.add('left', [0, 1, 2, 3], 10, true);
        this.woman.animations.add('right', [5, 6, 7, 8], 10, true);
        this.man.frame = 4;
        this.woman.frame = 4;
        game.physics.arcade.enable(this.man);
        game.physics.arcade.enable(this.woman);
        game.time.events.add(1000, function() {
            this.man.animations.play('right');
            this.woman.animations.play('left');
            this.man.body.velocity.x = 60;
            this.woman.body.velocity.x = -60;
        }, this);
    };
    this.update = function() {
        game.physics.arcade.collide(this.man, this.woman, this.met, null, this);
    };
    this.met = function() {
        this.man.animations.stop();
        this.woman.animations.stop();
        this.man.frame = 4;
        this.woman.frame = 4;
        game.add.sprite(this.man.position.x, this.man.position.y + 10, 'heart');
        game.time.events.add(1000, function() {
            game.state.start('prescene1');
        }, this);
    };
};

game.States.prescene1 = function() {
    this.create = function() {
        game.add.sprite(0, 0, 'prescene1');
        game.time.events.add(2000, function() {
            game.state.start('scene1');
        }, this);
    };
};

game.States.scene1 = function() {
    var left = false;
    var right = false;
    var up = false;
    var play = true;
    this.create = function() {
        game.add.sprite(0, 0, 'scene1');
        this.ground = game.add.sprite(7, 352, 'ground');
        this.man = game.add.sprite(20, 272, 'man');
        this.woman = game.add.sprite(230, 272, 'woman');
        this.man.animations.add('left', [0, 1, 2, 3], 10, true);
        this.man.animations.add('right', [5, 6, 7, 8], 10, true);
        this.woman.animations.add('left', [0, 1, 2, 3], 10, true);
        this.woman.animations.add('right', [5, 6, 7, 8], 10, true);
        
        this.woman.frame = 4;
        this.woman.alpha = 0.5;
        
        leftpad = game.add.button(10, 400, 'leftpad');
        uppad = game.add.button(100, 400, 'uppad');
        rightpad = game.add.button(190, 400, 'rightpad');
        
        leftpad.events.onInputOver.add(function(){left = true;});
        leftpad.events.onInputOut.add(function(){left = false;});
        leftpad.events.onInputDown.add(function(){left = true;});
        leftpad.events.onInputUp.add(function(){left = false;});
        rightpad.events.onInputOver.add(function(){right = true;});
        rightpad.events.onInputOut.add(function(){right = false;});
        rightpad.events.onInputDown.add(function(){right = true;});
        rightpad.events.onInputUp.add(function(){right = false;});
        uppad.events.onInputOver.add(function(){up = true;});
        uppad.events.onInputOut.add(function(){up = false;});
        uppad.events.onInputDown.add(function(){up = true;});
        uppad.events.onInputUp.add(function(){up = false;});
        
        game.physics.arcade.enable(this.man);
        game.physics.arcade.enable(this.woman);
        game.physics.arcade.enable(this.ground);
        this.man.body.collideWorldBounds = true;
        
        this.man.body.gravity.y = 200;
        this.woman.body.gravity.y = 200;
        this.ground.body.immovable = true;
    };
    this.update = function() {
        game.physics.arcade.collide(this.man, this.ground);
        game.physics.arcade.collide(this.woman, this.ground);
        game.physics.arcade.collide(this.man, this.woman, function() {
            this.man.frame = 4;
            this.woman.alpha = 1;
            play = false;
            this.man.body.velocity.x = 0;
            this.man.animations.stop();
            this.man.frame = 4;
            this.woman.body.velocity.x = 0;
            game.add.sprite(this.man.position.x, this.man.position.y + 10, 'heart');
            game.time.events.add(1000, function() {
                game.state.start('prescene2');
            }, this);
        }, null, this);
        if(play && left) {
            this.man.body.velocity.x = -60;
            this.man.animations.play('left');
        } else if(play && right) {
            this.man.body.velocity.x = 60;
            this.man.animations.play('right');
        } else if(play && up && this.man.body.touching.down) {
            this.man.body.velocity.x = 0;
            this.man.body.velocity.y = -150;
            this.man.animations.stop();
            this.man.frame = 4;
        } else if(play) {
            this.man.body.velocity.x = 0;
            this.man.animations.stop();
            this.man.frame = 4;
        }
    };
};

game.States.prescene2 = function() {
    this.create = function() {
        game.add.sprite(0, 0, 'prescene1');
        game.time.events.add(2000, function() {
            game.state.start('scene2');
        }, this);
    };
};

game.States.scene2 = function() {
    var left = false;
    var right = false;
    var up = false;
    var play = true;
    this.create = function() {
        game.add.sprite(0, 0, 'scene1');
        this.grounds = game.add.group();
        var ground1 = this.grounds.create(7, 352, 'ground');
        ground1.scale.setTo(0.3, 1);
        var ground2 = this.grounds.create(92, 302, 'ground');
        ground2.scale.setTo(0.3, 1);
        var ground3 = this.grounds.create(177, 252, 'ground');
        ground3.scale.setTo(0.3, 1);
        this.man = game.add.sprite(20, 272, 'man');
        this.woman = game.add.sprite(230, 172, 'woman');
        this.man.animations.add('left', [0, 1, 2, 3], 10, true);
        this.man.animations.add('right', [5, 6, 7, 8], 10, true);
        this.woman.animations.add('left', [0, 1, 2, 3], 10, true);
        this.woman.animations.add('right', [5, 6, 7, 8], 10, true);
        
        this.woman.frame = 4;
        this.woman.alpha = 0.5;
        
        leftpad = game.add.button(10, 400, 'leftpad');
        uppad = game.add.button(100, 400, 'uppad');
        rightpad = game.add.button(190, 400, 'rightpad');
        
        leftpad.events.onInputOver.add(function(){left = true;});
        leftpad.events.onInputOut.add(function(){left = false;});
        leftpad.events.onInputDown.add(function(){left = true;});
        leftpad.events.onInputUp.add(function(){left = false;});
        rightpad.events.onInputOver.add(function(){right = true;});
        rightpad.events.onInputOut.add(function(){right = false;});
        rightpad.events.onInputDown.add(function(){right = true;});
        rightpad.events.onInputUp.add(function(){right = false;});
        uppad.events.onInputOver.add(function(){up = true;});
        uppad.events.onInputOut.add(function(){up = false;});
        uppad.events.onInputDown.add(function(){up = true;});
        uppad.events.onInputUp.add(function(){up = false;});
        
        game.physics.arcade.enable(this.man);
        game.physics.arcade.enable(this.woman);
        game.physics.arcade.enable(this.grounds);
        this.man.body.collideWorldBounds = true;
        this.woman.body.collideWorldBounds = true;
        
        this.man.body.gravity.y = 200;
        this.woman.body.gravity.y = 200;
        
        ground1.body.immovable = true;
        ground2.body.immovable = true;
        ground3.body.immovable = true;
    };
    this.update = function() {
        game.physics.arcade.collide(this.man, this.grounds);
        game.physics.arcade.collide(this.woman, this.grounds);
        game.physics.arcade.collide(this.man, this.woman, function() {
            this.man.frame = 4;
            this.woman.alpha = 1;
            play = false;
            this.man.body.velocity.x = 0;
            this.man.animations.stop();
            this.man.frame = 4;
            this.woman.body.velocity.x = 0;
            game.add.sprite(this.man.position.x, this.man.position.y + 10, 'heart');
            game.time.events.add(1000, function() {
                game.state.start('prescene3');
            }, this);
        }, null, this);
        if(play && left) {
            this.man.body.velocity.x = -60;
            this.man.animations.play('left');
        } else if(play && right) {
            this.man.body.velocity.x = 60;
            this.man.animations.play('right');
        } else if(play && up && this.man.body.touching.down) {
            this.man.body.velocity.x = 0;
            this.man.body.velocity.y = -150;
            this.man.animations.stop();
            this.man.frame = 4;
        } else if(play) {
            this.man.body.velocity.x = 0;
            this.man.animations.stop();
            this.man.frame = 4;
        }
    };
};

game.States.prescene3 = function() {
    this.create = function() {
        game.add.sprite(0, 0, 'prescene1');
        game.time.events.add(2000, function() {
            game.state.start('scene3');
        }, this);
    };
};

game.States.scene3 = function() {
    var left = false;
    var right = false;
    var up = false;
    var play = true;
    this.create = function() {
        game.add.sprite(0, 0, 'scene1');
        this.grounds = game.add.group();
        var ground1 = this.grounds.create(7, 352, 'ground');
        ground1.scale.setTo(0.3, 1);
        var ground2 = this.grounds.create(92, 302, 'ground');
        ground2.scale.setTo(0.3, 1);
        var ground3 = this.grounds.create(177, 252, 'ground');
        ground3.scale.setTo(0.3, 1);
        this.man = game.add.sprite(20, 272, 'man');
        this.woman = game.add.sprite(230, 172, 'woman');
        this.man.animations.add('left', [0, 1, 2, 3], 10, true);
        this.man.animations.add('right', [5, 6, 7, 8], 10, true);
        this.woman.animations.add('left', [0, 1, 2, 3], 10, true);
        this.woman.animations.add('right', [5, 6, 7, 8], 10, true);
        
        this.woman.frame = 4;
        this.woman.alpha = 0.5;
        
        leftpad = game.add.button(10, 400, 'leftpad');
        uppad = game.add.button(100, 400, 'uppad');
        rightpad = game.add.button(190, 400, 'rightpad');
        
        leftpad.events.onInputOver.add(function(){left = true;});
        leftpad.events.onInputOut.add(function(){left = false;});
        leftpad.events.onInputDown.add(function(){left = true;});
        leftpad.events.onInputUp.add(function(){left = false;});
        rightpad.events.onInputOver.add(function(){right = true;});
        rightpad.events.onInputOut.add(function(){right = false;});
        rightpad.events.onInputDown.add(function(){right = true;});
        rightpad.events.onInputUp.add(function(){right = false;});
        uppad.events.onInputOver.add(function(){up = true;});
        uppad.events.onInputOut.add(function(){up = false;});
        uppad.events.onInputDown.add(function(){up = true;});
        uppad.events.onInputUp.add(function(){up = false;});
        
        game.physics.arcade.enable(this.man);
        game.physics.arcade.enable(this.woman);
        game.physics.arcade.enable(this.grounds);
        this.man.body.collideWorldBounds = true;
        this.woman.body.collideWorldBounds = true;
        
        this.man.body.gravity.y = 200;
        this.woman.body.gravity.y = 200;
        
        ground1.body.immovable = true;
        ground2.body.immovable = true;
        ground3.body.immovable = true;
    };
    this.update = function() {
        game.physics.arcade.collide(this.man, this.grounds);
        game.physics.arcade.collide(this.woman, this.grounds);
        game.physics.arcade.collide(this.man, this.woman, function() {
            this.man.frame = 4;
            this.woman.alpha = 1;
            play = false;
            this.man.body.velocity.x = 0;
            this.man.animations.stop();
            this.man.frame = 4;
            this.woman.body.velocity.x = 0;
            game.add.sprite(this.man.position.x, this.man.position.y + 10, 'heart');
            game.time.events.add(1000, function() {
                game.state.start('prescene4');
            }, this);
        }, null, this);
        if(play && left) {
            this.man.body.velocity.x = -60;
            this.man.animations.play('left');
        } else if(play && right) {
            this.man.body.velocity.x = 60;
            this.man.animations.play('right');
        } else if(play && up && this.man.body.touching.down) {
            this.man.body.velocity.x = 0;
            this.man.body.velocity.y = -150;
            this.man.animations.stop();
            this.man.frame = 4;
        } else if(play) {
            this.man.body.velocity.x = 0;
            this.man.animations.stop();
            this.man.frame = 4;
        }
    };
};

game.state.add('boot', game.States.boot);
game.state.add('preload', game.States.preload);
game.state.add('start', game.States.start);
game.state.add('prescene1', game.States.prescene1);
game.state.add('prescene2', game.States.prescene2);
game.state.add('prescene3', game.States.prescene3);
game.state.add('scene1', game.States.scene1);
game.state.add('scene2', game.States.scene2);
game.state.add('scene3', game.States.scene3);

game.state.start('boot');
