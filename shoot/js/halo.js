function haloobj(){
	this.s;
	this.g;
	var me = this;
	this.create = function(){
		this.g = game.add.graphics(0,0);
		this.g.lineStyle(10,0xffffff);
		this.g.drawCircle(0,0,100,100);
		this.s = game.add.sprite(0,0,this.g.generateTexture());
		this.g.kill();
		this.s.x = 100;
		this.s.y = 100;
		this.s.width = 0;
		this.s.height = 0;
		this.s.anchor.set(0.5);
	}
	this.update = function(){
		this.s.width+=4;
		this.s.height+=4;
		this.s.alpha = 1-this.s.width/80;
		if(this.s.width>80){
			this.s.kill();
		}
	}
	this.create();
}