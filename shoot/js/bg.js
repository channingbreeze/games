function bgobj(){
	this.bg;
	this.pa;
	this.pb;
	this.create = function(){
		this.bg = game.add.tileSprite(0,0,800,600,"s","bg.jpg");
		this.pa = game.add.sprite(0,0,"s","p1.png");
		this.pa.x = w-this.pa.width;
		this.pa.y = -30;
		this.pb = game.add.sprite(0,0,"s","p2.png");
		this.pb.x = 30;
		this.pb.y = 400;
	}
	this.update = function(){

	}
	this.create();
}