function lifeobj(){
	this.bg;
	this.g;
	this.s;
	this.create = function(){
		this.bg = game.add.graphics(w-10-200,10);
		this.bg.lineStyle(2,0xffffff);
		this.bg.drawRoundedRect(0,0,200,10);

		this.g = game.add.graphics(w-10-200,10);
		this.g.beginFill(0xff6600);
		this.g.drawRoundedRect(0,0,200,10);

		this.s = game.add.sprite(0,0,this.g.generateTexture());
		this.s.width = lifevalue;
		this.s.x = w-210;
		this.s.y = 10
		this.g.kill();
	}
	this.update = function(){
	}
	this.create();
}