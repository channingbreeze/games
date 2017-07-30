var Bullet = function (game, key) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;




};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

    gx = gx || 0;
    gy = gy || 0;

    this.reset(x, y);
    this.scale.set(1);


    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

    this.angle = angle;


    this.body.gravity.set(gx, gy);


};

Bullet.prototype.update = function () {



};




Weapon = function (game) {



    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);






    for (var i = 0; i < 150; i++)
    {
        this.add(new Bullet(game, 'bullet'), true);
    }

    return this;

};

Weapon.prototype = Object.create(Phaser.Group.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.fire = function (source,rotation,bulletSpeed,weaponType) {

    var x = source.x;
    var y = source.y + 6.5;




    switch(weaponType)
    {
        case 1:
            this.getFirstExists(false).fire(x, y, 0+rotation, bulletSpeed, 0, 0);
            break;
        case 2:

            this.getFirstExists(false).fire(x, y, -5 + rotation, bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 5 + rotation, bulletSpeed, 0, 0);
            break;
        case 3:

            this.getFirstExists(false).fire(x, y, -10 + rotation, bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 0 + rotation, bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 10 + rotation, bulletSpeed, 0, 0);
            break;

        case 4:
            this.getFirstExists(false).fire(x, y, -15 + rotation, bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, -5 + rotation, bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 5 + rotation, bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 15 + rotation, bulletSpeed, 0, 0);
            break;
        case 5:
            this.getFirstExists(false).fire(x, y, -20 + rotation, bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, -10 + rotation, bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 0 + rotation, bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 10 + rotation, bulletSpeed, 0, 0);
            this.getFirstExists(false).fire(x, y, 20 + rotation, bulletSpeed, 0, 0);
            break;
    }


};

