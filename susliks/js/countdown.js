function countdownobj(){
	this.text;
	this.timer = 0
	this.create = function(){
		var style = { font: "bold 28px Arial", fill: "#ffffff",boundsAlignH: "center"};
		var x = 0;
		var y =30;
		var str = '00:00:'+time;
		this.text = game.add.text(x,y,str,style);
		this.text.setTextBounds(0, 0, 800, 600);
	}
	this.update = function(){
		this.timer = this.timer+delta;
		if(this.timer>=1000){
			time--;
			this.text.setText('00:00:'+time);
			if(time<=0){
				time=0;
				this.text.setText('00:00:00');
				over = new overobj();
				time = 30;
			}else if(time<10){
				this.text.setText('00:00:0'+time);
			}
			this.timer=0;
		}
	}
	this.create();
}