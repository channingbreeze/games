"use strict";
window.Timberpig = {
	
	// reference to the Phaser.Game instance
	game: null,
	
	// main function
	main: function(){
		this.game = new Phaser.Game(mt.data.map.viewportWidth, mt.data.map.viewportHeight, Phaser.AUTO, document.body, window.Timberpig.state.boot);
	},
	
	// here we will store all states
	state: {}
};

window.addEventListener('DOMContentLoaded', function(){
	window.Timberpig.main();
}, false);
