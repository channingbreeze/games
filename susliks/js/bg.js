function bgobj(){
	this.s;
	var me = this;
	this.create = function(){
		this.s = game.add.tileSprite(0,0,800,600,"s","bg.png");
		this.s.y = -120;
		this.s.autoScroll(50,0);
	}
	this.update = function(){

	}
	this.create();
}