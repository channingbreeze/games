var bootState = {
	create: function(){
		//Physics initiation
		//game.physics.startSystem(Phaser.Physics.ARCADE);
		//localStorage.clear(); //ACTIVATE FOR ITCH.IO BUILDS
		document.getElementById("gameDiv").children[0].id = "gameCanvas";
		if(localStorage.firstRunDate == undefined){
			localStorage.clear();
		}

		if(localStorage.firstRun != "DONE"){
			console.log("fist run");
			firstRun();
		}
		//uses fonts and solves text messed BUG
		tmp = document.getElementById("loader");
		if(tmp != null){
			tmp.parentElement.removeChild(tmp);
		}
		game.state.start('load');
	}
};
