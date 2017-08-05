"use strict";
window.sjm.state.menu = {
	preload: function(){
		
	},
	
	create: function(){
		// you can create menu group in map editor and load it like this:
		// mt.create("menu");
		//背景
		mt.create('bg');
		//游戏开始按钮
		this.startBtn=mt.create('btnStart');
		this.startBtn.inputEnabled=true;
		this.startBtn.events.onInputDown.add(this.play,this);
	},
	
	update: function(){
		
	},
	play:function(){
		this.game.state.start('play');
	}
};