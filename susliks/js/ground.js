function groundobj(){
	this.s;
	var me = this;
	this.create = function(){
		this.s = game.add.sprite(0,0,"s","ground.png");
		this.s.width = 800;
		this.s.height = 160;
		this.s.y = h - this.s.height;
		this.s.inputEnabled = true;
	}
	this.update = function(){

	}
	this.create();
}