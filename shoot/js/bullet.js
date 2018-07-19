function bulletobj(){
	this.sa;
	this.sb;
	this.sc;
	this.create = function(){
		this.sa = game.add.weapon(30,"b");
		this.sa.bulletAngleOffset = 0;
		this.sa.bulletSpeed = 700
		this.sa.bulletAngleVariance = 0;
		this.sa.trackSprite(player.s);

		this.sb = game.add.weapon(30,"b");
		this.sb.bulletAngleOffset = 0;
		this.sb.bulletSpeed = 700
		this.sb.bulletAngleVariance = 0;
		this.sb.trackSprite(player.s);

		this.sc = game.add.weapon(30,"b");
		this.sc.bulletAngleOffset = 0;
		this.sc.bulletSpeed =700
		this.sc.bulletAngleVariance = 0;
		this.sc.trackSprite(player.s);

		console.log(this.sa.bullets)
	}
	this.update = function(){
		this.sa.fireAngle = player.s.angle;
		this.sb.fireAngle = player.s.angle + 20;
		this.sc.fireAngle = player.s.angle - 20;
	}
	this.create();
}