
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

	create: function () {

		this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('gem');
        this.map.addTilesetImage('platforms');
        this.map.setTileIndexCallback(61,this.hitCoin,this);
        this.map.setTileIndexCallback(24,this.dead,this);
        this.map.setTileIndexCallback(25,this.dead,this);

        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
        this.map.setCollisionBetween(1,10);
        this.map.setCollisionBetween(13,20);
        this.map.setCollisionBetween(23,37);
        this.map.setCollisionBetween(39,45);
        this.map.setCollisionBetween(49,60);

        this.sprite = this.game.add.sprite(75,600,'hero');
        this.sprite.animations.add('run',[0,1,2,3,4,5,6,7],16,true);
        this.game.physics.enable(this.sprite);

        this.sprite.body.bounce.set(0);
        this.sprite.body.tilePadding.set(64);
        this.game.camera.follow(this.sprite);
        this.sprite.body.gravity.y = 1200;

        this.game.input.onDown.add(this.jump,this);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.TILE_BIAS = 50;
        this.playing = true;

	},

    jump: function() {
        if (this.sprite.body.blocked.down) {
            this.sprite.body.velocity.y = -720;
            this.sprite.animations.stop();
            this.sprite.frame = 2;
        }

    },

	update: function () {

		this.game.physics.arcade.collide(this.sprite,this.layer);
        if (this.sprite.body.blocked.right) {
            this.sprite.body.velocity.x = 0;
        } else {
            this.sprite.body.velocity.x = 300;
        }

        if (this.sprite.body.blocked.down) {
            this.sprite.animations.play('run');
        }
        if (this.sprite.x > 7460) {
            console.log("win");
            this.playing=false;
        }
        if (this.sprite.y > 760) {
            this.dead();
        }
        this.quitGame(this.playing);

	},

	quitGame: function (pointer) {

		if(!this.playing) {
            delete this.map;
            delete this.layer;
            delete this.sprite;
            //takes us back to Main Menu
            this.state.start('MainMenu');
        }
	},

    hitCoin: function (sprite,tile) {
        if (tile.alpha != 0) {
            tile.alpha = 0;
            this.layer.dirty = true;
            return false;
        }
    },

    dead: function () {
        console.log("dead");
        this.playing=false;
    }

};
