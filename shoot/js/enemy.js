function enemyobj(){
	this.s;
	this.position = [
		{x:-10,y:10+Math.random()*500},
		{x:10+Math.random()*700,y:-10},
		{x:810,y:10+Math.random()*500},
		{x:10+Math.random()*700,y:610}
	]
	this.index = ~~(Math.random()*this.position.length);
	this.frame = [
		"enemy0.png","enemy1.png","enemy2.png"
	]
	this.frameindex = ~~(Math.random()*this.frame.length);
	this.create = function(){
		this.s = game.add.sprite(0,0,"s",this.frame[this.frameindex]);
		this.s.x = this.position[this.index].x;
		this.s.y = this.position[this.index].y;
		ar.enable(this.s);
	}
	this.update = function(){
		this.s.rotation = ar.angleToXY(this.s,player.s.x,player.s.y);
		if(player.s){
			ar.moveToObject(this.s,player.s,100,300);
		}

		ar.overlap(this.s,bullet.sa.bullets,function(a,b){
			var halo = new haloobj();
			halo.s.x = b.x;
			halo.s.y = b.y;
			haloarr.push(halo);
			a.kill();
			b.kill();
			game.kill++;
		})
		ar.overlap(this.s,bullet.sb.bullets,function(a,b){
			var halo = new haloobj();
			halo.s.x = b.x;
			halo.s.y = b.y;
			haloarr.push(halo);
			a.kill();
			b.kill();
			game.kill++;
		})
		ar.overlap(this.s,bullet.sc.bullets,function(a,b){
			var halo = new haloobj();
			halo.s.x = b.x;
			halo.s.y = b.y;
			haloarr.push(halo);
			a.kill();
			b.kill();
			game.kill++;
		})
	}
	this.create();
}
