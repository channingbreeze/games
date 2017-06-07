function tipsobj(){
	this.text;
	this.num=0;
	this.alpha = 0;
	this.create = function(){
		var style = {"fontSize":26,"fill":"#ffffff"}
		this.text = game.add.text(100,100,"+1",style);
	}
	this.update = function(){
		this.text.y--;
		this.num++;
		this.text.alpha = 1-(this.num)/100;
		if(this.num>100){
			this.text.kill();
			this.num = 0;
		}
		for(var i=tipsarr.length;i--;){
			if(tipsarr[i].text.exists ==false){
				tipsarr.splice(i,1);
				break;
			}
		}
	}
	this.create();
}
