/**
 * Level state.
 */
function Level() {
	Phaser.State.call(this);
	// TODO: generated method.
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State.prototype);
Level.prototype = proto;
Level.prototype.constructor = Level;

Level.prototype.init = function() {

	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	this.world.resize(2200, 1800);
	this.world.setBounds(0, 0, 2200, 1800);

	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.physics.arcade.gravity.y = 800;

};

Level.prototype.preload = function() {

	this.load.pack("level", "assets/assets-pack.json");

};

Level.prototype.create = function() {

	this.scene = new Scene1(this.game);

	// camera
	this.camera.follow(this.scene.fPlayer, Phaser.Camera.FOLLOW_PLATFORMER);

	// background
	this.scene.fBG.fixedToCamera = true;
	
	// set the physics properties of the collision sprites
	this.scene.fCollisionLayer.setAll("body.immovable", true);
	this.scene.fCollisionLayer.setAll("body.allowGravity", false);
	// hide all objects of the collision layer
	this.scene.fCollisionLayer.setAll("renderable", false);
	this.scene.fCollisionLayer.setAll("body.checkCollision.left", false);
	this.scene.fCollisionLayer.setAll("body.checkCollision.right", false);
	this.scene.fCollisionLayer.setAll("body.checkCollision.down", false);

	this.cursors = this.input.keyboard.createCursorKeys();

	// to keep the fruits in the air
	this.scene.fFruits.setAll("body.allowGravity", false);
	this.scene.fFruits.setAll("anchor.x", 0.5);
	this.scene.fFruits.setAll("anchor.y", 0.5);
	
	// water
	this.add.tween(this.scene.fWater.tilePosition).to({
		x : 25
	}, 2000, "Linear", true, 0, -1, true);
};

Level.prototype.update = function() {

	// collide the player with the platforms
	this.physics.arcade.collide(this.scene.fPlayer, this.scene.fCollisionLayer);

	if (this.cursors.left.isDown) {
		// move to the left
		this.scene.fPlayer.body.velocity.x = -200;
	} else if (this.cursors.right.isDown) {
		// move to the right
		this.scene.fPlayer.body.velocity.x = 200;
	} else {
		// dont move in the horizontal
		this.scene.fPlayer.body.velocity.x = 0;
	}

	// a flag to know if the player is (down) touching the platforms
	var touching = this.scene.fPlayer.body.touching.down;

	if (touching && this.cursors.up.isDown) {
		// jump if the player is on top of a platform and the up key is pressed
		this.scene.fPlayer.body.velocity.y = -700;
	}

	if (touching) {
		if (this.scene.fPlayer.body.velocity.x == 0) {
			// if it is not moving horizontally play the idle
			this.scene.fPlayer.play("idle");
		} else {
			// if it is moving play the walk
			this.scene.fPlayer.play("walk");
		}
	} else {
		// it is not touching the platforms so it means it is jumping.
		this.scene.fPlayer.play("jump");
	}

	// update the facing of the player
	if (this.cursors.left.isDown) {
		// face left
		this.scene.fPlayer.scale.x = -1;
	} else if (this.cursors.right.isDown) {
		// face right
		this.scene.fPlayer.scale.x = 1;
	}

	// catch when the player overlaps with a fruit
	this.physics.arcade.overlap(this.scene.fPlayer, this.scene.fFruits,
			this.playerVsFruit, null, this);
};

/**
 * @param {Phaser.Sprite}
 *            player
 * @param {Phaser.Sprite}
 *            fruit
 */
Level.prototype.playerVsFruit = function(player, fruit) {
	fruit.body.enable = false;
	
	this.add.tween(fruit).to({
		y : fruit.y - 50
	}, 1000, "Expo.easeOut", true);
	
	this.add.tween(fruit.scale).to({
		x : 2,
		y : 2
	}, 1000, "Linear", true);

	this.add.tween(fruit).to({
		alpha : 0.2
	}, 1000, "Linear", true).onComplete.add(fruit.kill, fruit);
};