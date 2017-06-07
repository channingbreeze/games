function countobj(){
	this.text;
	this.create = function(){
		var style = { font: "bold 28px Arial", fill: "#ffffff",boundsAlignH: "left"};
		var x = 0;
		var y =30;
		var str = '打中'+score+'个怪物';
		this.text = game.add.text(x,y,str,style);
		this.text.setTextBounds(30, 0, 800, 600);
	}
	this.update = function(){
		var str = '打中'+score+'个怪物';
		this.text.setText(str);
	}
	this.create();
}