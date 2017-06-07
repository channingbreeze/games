function msobj(){
	this.s;
	this.up;
	this.down;
	this.timer = 0;
	this.interval = 500+Math.random()*1500;
	var me = this;
	var ar = game.physics.arcade;
	this.frame = [
		"monster1.png",
		"monster2.png",
		"monster3.png",
		"monster4.png",
		"monster5.png",
	];
	this.height = h -360;
	this.create = function(){
		me.s = game.add.sprite(0,0,"s","monster1.png");
		me.s.x = 53;
		me.s.width = 68;
		me.s.y = h - 160;
		ar.enable(me.s);
		me.s.body.velocity.y=-150+Math.random()*-500;
		me.s.inputEnabled = true;
		me.s.input.useHandCursor = true;
		me.s.events.onInputDown.add(function(s){
			me.s.body.velocity.y = 800+Math.random()*1200;
			var tips = new tipsobj();
			tips.text.x = s.x;
			tips.text.y = s.y;
			tipsarr.push(tips);
			score++;
		});
	}
	this.update = function(){
		if(me.s.y<=this.height){
			me.s.y=this.height;
			me.s.body.velocity.y=700+Math.random()*1000;
		}else if(me.s.y>=(h-160)){
			me.s.y = (h-160);
			var index = ~~(Math.random()*this.frame.length);
			me.s.frameName = this.frame[index];
			this.timer+=delta;
			if(this.timer>this.interval){
				me.s.body.velocity.y=-150+Math.random()*-500;
				this.timer = 0;
			}

		}
	}
	this.create();
}
function pushMs(){
	for(var i=5;i--;){
		var ms = new msobj();
		msarr.push(ms);
	}
	msarr[0].s.x = 53;
	msarr[1].s.x =210;
	msarr[2].s.x = 365;
	msarr[3].s.x = 522;
	msarr[4].s.x = 678;
}