function playerobj(){
	this.s;
	var me = this;
	this.create = function(){
		this.s = game.add.sprite(0,0,"s","player.png");
		this.s.anchor.set(0.5);
		this.s.x = w/2;
		this.s.y = h/2;
		this.s.anchor.set(0.5);
		ar.enable(this.s);
	}
	this.update = function(){
		this.s.rotation = ar.angleToPointer(this.s);
		if(enemyarr.length>0){
			for(var i=enemyarr.length;i--;){
				ar.overlap(this.s,enemyarr[i].s,function(a,b){
					b.kill();
					var halo = new haloobj();
					halo.s.x = b.x;
					halo.s.y = b.y;
					haloarr.push(halo);
					if(life.s.width<=40){
						life.s.width=0;
						game.state.start("gameover");
					}else{
						lifevalue-=40
						life.s.width = lifevalue;
					}
					console.log(life.s.width);
					game.camera.shake(0.01);
				})
			}
		}
	}
	this.create();
}