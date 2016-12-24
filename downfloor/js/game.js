window.onload = function() {

	var game = new Phaser.Game(320,480,Phaser.CANVAS,"",{preload:onPreload, create:onCreate, update:onUpdate});				
     
     // the hero!!
	var hero;
	// an array which will contain all game items. Used just to be sure items will be placed
	// not so close to each others
     var gameItems=[];
     // game text displaying floor,level, lives and so on
     var gameText = "";
     // group which will contain all level assets
     var levelGroup;
     
     // starting level
     var level=1;
     // starting experience
     var exp=0;
     // starting lives
     var lives=3;
     // starting floor
     var floor=1;
     // starting gold
     var gold=0;
     
     function onPreload() {
     	// preloading images
		game.load.image("skull","assets/skull.png");
		game.load.image("coin","assets/coin.png");
		game.load.image("hero","assets/hero.png");
	}
	
	// going fullscreen
	function goFullScreen(){
          game.scale.pageAlignHorizontally = true;
     	game.scale.pageAlignVertically = true;
     	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
     }
	
	function onCreate() {
		goFullScreen();
		// dark grey background color
		game.stage.backgroundColor = '#2d2d2d';	
		// starting P2 physics system
		game.physics.startSystem(Phaser.Physics.P2JS);
		// setting a soft gravity...
		game.physics.p2.gravity.y = 200;
		// ... but a high restitution
		game.physics.p2.restitution = 0.9;
		// level creation
		createLevel();
		// listener for input down, to call addHero when triggered
		game.input.onDown.add(addHero, this);
		// setting physics world boundaries, only left and right (the first two "true")
		game.physics.p2.setBoundsToWorld(true, true, false, false, false);
		// adding the HUD text
		gameText = game.add.text(0,0, "",{font:"normal 12px arial",fill: "#ffffff"})
		// updating the text
		updateText();
	}
	
	function createLevel(){
		// level creation is very easy, first we add a group
		levelGroup = game.add.group();
		// the array of items starts as an empty array
		gameItems = [];
		// placing 18 items per level
		for(var i=0;i<18;i++){
			// skulls will be placed more and more often
			if(Math.random()<0.6+(level/1000)){
				gameItems[i] = game.add.sprite(0,0,"skull");
				gameItems[i].name = "skull";
			}
			// adding coins
			else{
				gameItems[i] = game.add.sprite(0,0,"coin");
				gameItems[i].name = "coin";	
			}
			// adding the last created item to levelgroup
			levelGroup.add(gameItems[i]);
			// setting its registration point in the middle
			gameItems[i].anchor.setTo(0.5,0.5);
			// keep moving the item until id does not ovelap with other items
			do{
				gameItems[i].x = Math.random()*300+10;
				gameItems[i].y = Math.random()*360+100;
			} while(itemsOverlap());
			// enabling item to react to physics
			game.physics.p2.enable(gameItems[i]);
			// setting it as a 24 pixels radius circle
			gameItems[i].body.setCircle(24);
			// setting items as static
			gameItems[i].body.static=true;
		}
	}
	
	function addHero(){
		// once the hero is added, remove the listener
		game.input.onDown.remove(addHero, this);
		// placing hero sprite x = horizontal coordinate of your input, y = outside the stage at the top
		hero = game.add.sprite(game.input.worldX,-50,"hero");
		// adding the hero to the group
		levelGroup.add(hero);
		// enabling the hero to react to physics
		game.physics.p2.enable(hero);
		// listener for hero contacts, heroHit to be called when triggered
		hero.body.onBeginContact.add(heroHit, this);
	}
	
	function heroHit(body){
		// if the hero hits an ACTUAL body (not a world boundary)
		if(body){
			switch(body.sprite.name){
				// if it's a coin, remove the body, update the score
				case "coin":
					gold+=(level*floor);
					body.sprite.kill();
					break;
				// if it's a skull, remove the body, update experience...
				case "skull":
					// ... but ONLY if the hero is above the skull
					if(hero.y<body.y){
						body.sprite.kill();
						exp+=1;
						if(exp>level*level/2){
							level++;
							lives++;
							exp=0;
						}
					}
					else{
						// otherwise decrease the lives and show a bit of "blood"
						lives--;
						game.stage.backgroundColor = "#ff0000";	
					}
					break;
			}
		}
		else{
			// if the hero do not hit an ACTUAL body (that is it hit a world boundary)
			// decrease the lives and show a bit of "blood"
			lives--;
			game.stage.backgroundColor = "#ff0000";	
		}
		if(lives==0){
			// no lives = game over
			hero.kill();
		}
		// updating HUD text
		updateText();
	}
	
	function updateText(){
		// just writing a string
		gameText.setText("Floor: "+floor+" - Lives: "+lives+" - Level: "+level+" - Exp: "+exp+" - Gold: "+gold);
	}
	
	function onUpdate() {
		// set background color to dark grey. Should be optimized
		game.stage.backgroundColor = "#2d2d2d";	
		// if the hero is in game...
		if(hero){
			// and its y position is more than 500 (outside the bottom of the screen)
			if(hero.y>500){
				// preparing for next level
				hero.y=0;
				levelGroup.destroy(true);
				game.input.onDown.add(addHero, this);
				floor++;
				lives++;
				updateText();
				createLevel();
			}
		}
	}
	
	// just a function to see if the latest item overlaps with previous ones
	function itemsOverlap(){
		for(var i=0;i<gameItems.length-1;i++){
			var distance = manhattanDistance(gameItems[i],gameItems[gameItems.length-1]);
			if(distance<50){
				return true;
			}
		}
		return false;
	}
	
	// manhattan distance.
	function manhattanDistance(from,to){
		return Math.abs(from.x-to.x)+Math.abs(from.y-to.y)
	}
};

