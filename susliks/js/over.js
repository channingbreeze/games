function overobj(){
	this.s;
	this.child;
	this.g;
	var me = this;

	this.create = function(){
		this.g = game.add.graphics(0,0);
		this.g.beginFill(0x000000);
		this.g.drawRect(0,0,800,600);
		this.s = game.add.sprite(0,0,this.g.generateTexture());
		this.g.kill();
		this.s.alpha = 0;
		this.child = game.add.sprite(0,0,"over");
		this.child.anchor.set(0.5);
		this.child.x = w/2;
		this.child.y = h/2;
		this.s.inputEnabled = true;
		this.s.events.onInputDown.add(function(){
			me.gameInit();
		});
		this.child.events.onInputDown.add(function(){
			me.gameInit();
		})
	}
	this.update = function(){

	}
	this.gameInit = function(){
		time = 30;
		score = 0;
		me.s.kill();
		me.child.kill();
	}
	this.create();
}