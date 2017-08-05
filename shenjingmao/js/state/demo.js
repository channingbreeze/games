/*
 * This file is automatically loaded from state/load.js
 * to change default state - change state/load.js at line: 34
 */
"use strict";
window.sjm.state.demo = {
	create: function(){
		// create all objects
		var all = mt.createAll();
		
		// prevent pause on focus lost
		this.game.stage.disableVisibilityChange = true;
		
		// start __main movie for all objects
		for(var i in all){
			if(all[i].mt.movies && all[i].mt.movies.__main){
				all[i].mt.movies.__main.start().loop();
			}
		}
	}
};