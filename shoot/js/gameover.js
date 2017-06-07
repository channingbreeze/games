function gameoverobj(){
	this.ta;
	this.tb;
	this.tc;
	this.s;
	this.create = function(){
		var tastyle = { font: "bold 50px Arial", fill: "#fff",boundsAlignH: "center", boundsAlignV: ""};
		var tax = 0;
		var tay =100;
		var tastr = 'GAME OVER';
		this.ta = game.add.text(tax,tay,tastr,tastyle);
		this.ta.setTextBounds(0, 0, 800, 600);

		var tbstyle = { font: "bold 28px Arial", fill: "#fff",boundsAlignH: "center", boundsAlignV: ""};
		var tbx = 0;
		var tby =200;
		var tbstr = '打掉'+game.kill+'架敌机';
		this.tb = game.add.text(tbx,tby,tbstr,tbstyle);
		this.tb.setTextBounds(0, 0, 800, 600);

		var tcstyle = { font: "bold 28px Arial", fill: "#fff",boundsAlignH: "center", boundsAlignV: ""};
		var tcx = 0;
		var tcy =300;
		var tcstr = '<  RESTART';
		this.tc = game.add.text(tcx,tcy,tcstr,tcstyle);
		this.tc.setTextBounds(0, 0, 800, 600);

		this.s = game.make.sprite(0,0,"");
		this.tc.addChild(this.s);
		this.s.width = this.tc.width;
		this.s.height = this.tc.height;
		this.s.inputEnabled = true;
		this.s.input.useHandCursor = true;
		this.s.events.onInputDown.add(function(){
			game.state.start("main");
		});
	}
	this.update = function(){

	}
	this.create();
}