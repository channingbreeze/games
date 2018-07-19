function killallobj(){
	this.create = function(){
		game.camera.flash();
		if(enemyarr.length>0){
			for(var i=enemyarr.length;i--;){
				enemyarr[i].s.kill();
			}
		}
	}
	this.create();
}