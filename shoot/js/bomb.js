function bombobj(){
	this.text;
	this.s;
	this.create = function(){
		this.s = game.add.sprite(0,0,"s","bomb.png");
		this.s.anchor.set(0.5);
		this.s.x = w*0.5-30;
		this.s.y = h-this.s.height - 10;

		var style = { font: "bold 18px Arial", fill: "#ffffff",boundsAlignH: "center", boundsAlignV: ""};
		var x = 0;
		var y =h-19-this.s.height;
		var str = bombvalue;
		this.text = game.add.text(x,y,str,style);
		this.text.setTextBounds(0, 0, 800, 600);
	}
	this.update = function(){
		this.text.setText(bombvalue);
	}
	this.create();
}