// the game itself
var game;

// this object contains all customizable game options
// changing them will affect gameplay
var gameOptions = {
	gameWidth: 800,    // game width, in pixels 
	gameHeight: 1300,   // game height, in pixels
	tileSize: 100,     // tile size, in pixels 
	fieldSize: 8, // field size, field should be a square to allow a smooth gameplay
     colors: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00] // tile colors
}

// some constants (actually they are variables, but that's it) where to store special item frames
var _HERO = 1;
var _KEY = 2;
var _LOCKEDDOOR = 3;
var _UNLOCKEDDOOR = 4;

// function to be execute once the page loads
window.onload = function() {
	
     // creation of a new Phaser Game
	game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
     
     // adding "TheGame" state
     game.state.add("TheGame", TheGame);
     
     // launching "TheGame" state
     game.state.start("TheGame");
}

/* ****************** TheGame state ****************** */ 

var TheGame = function(){};

TheGame.prototype = {

     // function to be executed when the game preloads
     preload: function(){
     
          // setting background color to dark grey
          game.stage.backgroundColor = 0x222222;
          
          // load the only graphic asset used for the tiles, a white tile which will be tinted on the fly
          game.load.spritesheet("tiles", "assets/sprites/tiles.png", gameOptions.tileSize, gameOptions.tileSize); 
          
          // this is the button which will rotate the field
          game.load.image("rotate", "assets/sprites/rotate.png"); 
     },
     
     // function to be executed as soon as the game has completely loaded
  	create: function(){
     
          // scaling the game to cover the entire screen, while keeping its ratio
          game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
          
          // horizontally centering the game
		game.scale.pageAlignHorizontally = true;
          
          // vertically centering the game
		game.scale.pageAlignVertically = true;
          
          // this function will create the level
  		this.createLevel();
  	},      
     
	createLevel: function(){
     
          // canPick tells if we can pick a tile, we start with "true" has at the moment a tile can be picked
          this.canPick = true;   
          
          // tiles are saved in an array called tilesArray
          this.tilesArray = [];
          
          // this group will contain all tiles
		this.tileGroup = game.add.group();
          
          // an array to store all possible spots where to place special items
          var specialItemCandidates = []; 
          
          // two loops to create a grid made by "gameOptions.fieldSize" x "gameOptions.fieldSize" columns
  		for(var i = 0; i < gameOptions.fieldSize; i++){
               this.tilesArray[i] = [];
			for(var j = 0; j < gameOptions.fieldSize; j++){
                    
                    // this function adds a tile at row "i" and column "j"
				this.addTile(i, j);
                    
                    // adding the spot to special items array
                    specialItemCandidates.push(new Phaser.Point(j, i));
			}
		}
          
          // choosing a random location for the hero
          heroLocation = Phaser.ArrayUtils.removeRandomItem(specialItemCandidates);
          
          // adjusting tile frame
          this.tilesArray[heroLocation.y][heroLocation.x].tileSprite.frame = _HERO;
          
          // adjusting tile value. We can define special tile values by adding 10 to the frame
          this.tilesArray[heroLocation.y][heroLocation.x].value = 10 + _HERO;
          
          // we also have to remove tint color by applying a white tint
          this.tilesArray[heroLocation.y][heroLocation.x].tileSprite.tint = 0xffffff;
          
          // same thing with the key, we just don't want it to be too close to the hero
          do{
               var keyLocation = Phaser.ArrayUtils.removeRandomItem(specialItemCandidates);
          } while (this.isAdjacent(heroLocation, keyLocation));
          this.tilesArray[keyLocation.y][keyLocation.x].tileSprite.frame = _KEY;
          this.tilesArray[keyLocation.y][keyLocation.x].value = 10 + _KEY;
          this.tilesArray[keyLocation.y][keyLocation.x].tileSprite.tint = 0xffffff;
          
          // same thing with the locked door
          do{
               var lockedDoorLocation = Phaser.ArrayUtils.removeRandomItem(specialItemCandidates);
          } while (this.isAdjacent(heroLocation, lockedDoorLocation));
          this.tilesArray[lockedDoorLocation.y][lockedDoorLocation.x].tileSprite.frame = _LOCKEDDOOR;
          this.tilesArray[lockedDoorLocation.y][lockedDoorLocation.x].value = 10 + _LOCKEDDOOR;
          this.tilesArray[lockedDoorLocation.y][lockedDoorLocation.x].tileSprite.tint = 0xffffff;
          
          // we are centering the group, both horizontally and vertically, in the canvas
          var fieldWidth = gameOptions.tileSize * gameOptions.fieldSize;
          
          // placing the group in the middle of the canvas
          this.tileGroup.x = (game.width - fieldWidth) / 2;
          this.tileGroup.y = (game.height -  fieldWidth) / 2;
          
          // setting group pivot point in its center
          this.tileGroup.pivot.set(fieldWidth / 2, fieldWidth / 2);
          
          // adjusting group position to make it remain in the same position assigned before
          this.tileGroup.position.set(this.tileGroup.x + this.tileGroup.pivot.x, this.tileGroup.y + this.tileGroup.pivot.y); 
          
          // we will draw a mask to hide blocks falling from above. Mask needs to have the same size and position as the group
          this.tileMask = game.add.graphics(this.tileGroup.x - this.tileGroup.pivot.x, this.tileGroup.y - this.tileGroup.pivot.y);
          this.tileMask.beginFill(0xffffff);
          this.tileMask.drawRect(0, 0, fieldWidth, fieldWidth);
          this.tileGroup.mask = this.tileMask;
          this.tileMask.visible = false;
          
          // button to rotate the game field to the left
          this.rotateLeft = game.add.button(game.width / 4, this.tileGroup.y + fieldWidth / 2 + gameOptions.tileSize * 0.5, "rotate", function(){
               this.rotateField(-90);
          }, this);
          this.rotateLeft.anchor.set(0.5, 0)
          
          // button to rotate the game field to the right
          this.rotateRight = game.add.button(game.width / 4 * 3, this.tileGroup.y + fieldWidth / 2 + gameOptions.tileSize * 0.5, "rotate", function(){
               this.rotateField(90);
          }, this);
          this.rotateRight.anchor.set(0.5, 0);
          this.rotateRight.scale.x *= -1;
          
          // tilePool is the array which will contain removed tiles to be recycled
          this.tilePool = [];
          
          // waiting for user input
          game.input.onDown.add(this.pickTile, this);
	},
     
     // function to add a tile at "row" row and "col" column
	addTile: function(row, col){
          
          // determining x and y tile position according to tile size 
		var tileXPos = col * gameOptions.tileSize + gameOptions.tileSize / 2;
		var tileYPos = row * gameOptions.tileSize + gameOptions.tileSize / 2;
		
          // tile is added as an image
          var theTile = game.add.sprite(tileXPos, tileYPos, "tiles");
		
          // setting tile registration point to its center
          theTile.anchor.set(0.5);
          
          // adjusting tile width and height according to tile size
          theTile.width = gameOptions.tileSize;
          theTile.height = gameOptions.tileSize;
          
          // time to assign the tile a random value, which is also a random color
          var tileValue = game.rnd.integerInRange(0, gameOptions.colors.length - 1);
          
          // tinting the tile
          theTile.tint = gameOptions.colors[tileValue];
          
          // adding the image to "tilesArray" array, creating an object
          this.tilesArray[row][col] = {
               tileSprite: theTile, // tile image
               isEmpty: false, // is it an empty tile? not at the moment
               coordinate: new Phaser.Point(col, row), // storing tile coordinate, useful during flood fill
               value: tileValue // the value (color) of the tile
          };
          
          // also adding it to "tileGroup" group
	     this.tileGroup.add(theTile);	
	},
     
     // this function is executed at each user input (click or touch)
     pickTile: function(e){          
     
          // can the player pick a tile?
          if(this.canPick){
          
               // determining x and y position of the input inside tileGroup
               var posX = e.x - this.tileGroup.x + gameOptions.tileSize * gameOptions.fieldSize / 2;
               var posY = e.y - this.tileGroup.y + gameOptions.tileSize * gameOptions.fieldSize / 2;
               
               // transforming coordinates into actual rows and columns
               var pickedRow = Math.floor(posY / gameOptions.tileSize);
               var pickedCol = Math.floor(posX / gameOptions.tileSize);
               
               // checking if row and column are inside the actual game field
               if(pickedRow >= 0 && pickedCol >= 0 && pickedRow < gameOptions.fieldSize && pickedCol < gameOptions.fieldSize){
               
                    // this is the tile we picked
                    var pickedTile = this.tilesArray[pickedRow][pickedCol];
                    
                    // the most secure way to have a clean and empty array
                    this.filled = [];
                    this.filled.length = 0;
                    
                    // performing a flood fill on the selected tile
                    // this will populate "filled" array
                    this.floodFill(pickedTile.coordinate, pickedTile.value);
                    
                    // do we have more than one tile in the array?
                    if(this.filled.length > 1){
                    
                         // ok, this is a valid move and player won't be able to pick another tile until all animations have been played
                         this.canPick = false;
                         
                         // function to destroy selected tiles
                         this.destroyTiles();
                    }    
               }             
          }
     },
     
     // this function will destroy all tiles we can find in "filled" array
     destroyTiles: function(){      
     
          // looping through the array removing all elements one by one
          do{
               
               // removing first element of the array
               var element = this.filled.shift();
          
               // fading tile out with a tween
               var tween = game.add.tween(this.tilesArray[element.y][element.x].tileSprite).to({
                    alpha: 0
               }, 300, Phaser.Easing.Linear.None, true);
               
               // placing the sprite in the array of sprites to be recycled
               this.tilePool.push(this.tilesArray[element.y][element.x].tileSprite);
               
               // once the tween has been completed...
               tween.onComplete.add(function(e){ 
               
                    // resetting the frame
                    e.frame = 0
                    
                    // we don't know how many tiles we have already removed, so counting the tweens
                    // currently in use is a good way, at the moment
                    // if this was the last tween (we only have one tween running, this one) 
                    if(tween.manager.getAll().length == 1){
                    
                         // call fillVerticalHoles function to make tiles fall down
                         this.fillVerticalHoles();     
                    }                                
               }, this);
               
               // now the tile is empty
               this.tilesArray[element.y][element.x].isEmpty = true;
               
          // we'll repeat this loop until there is something into "filled" array     
          }  while(this.filled.length > 0)
     },
     
     // this function will make tiles fall down
     fillVerticalHoles: function(){
     
          // filled is a variable which tells us if we filled a hole
          var filled = false;
          
          // looping through the entire gamefield
          for(var i = gameOptions.fieldSize - 2; i >= 0; i--){
               for(var j = 0; j < gameOptions.fieldSize; j++){
               
                    // if we have a tile...
                    if(!this.tilesArray[i][j].isEmpty){
                    
                         // let's count how many holes we can find below this tile
                         var holesBelow = this.countSpacesBelow(i, j);
                         
                         // if holesBelow is greater than zero...
                         if(holesBelow){
                         
                              // we filled a hole, or at least we are about to do it
                              filled = true;
                              
                              // function to move down a tile at column "j" from "i" to "i + holesBelow" row
                              this.moveDownTile(i, j, i + holesBelow, false);                                                                   
                         }
                    }
                    
                         
               }
          }
          
          // if we looped trough all tiles but did not fill anything...
          if(!filled){
          
               // player move completed
               this.endMove();      
          }
          
          // now it's time to reuse tiles saved in the pool (tilePool array),
          // let's start with a loop through each column
          for(i = 0; i < gameOptions.fieldSize; i++){
          
               // counting how many empty spaces we have in each column
               var topHoles = this.countSpacesBelow(-1, i);
               
               // then for each empty space...
               for(j = topHoles - 1; j >= 0; j--){
               
                    // get the tile to be reused from the pool
                    var reusedTile = this.tilePool.shift();
                    
                    // y position is above the field, to make tile "fall down"
                    reusedTile.y =  (j - topHoles) * gameOptions.tileSize + gameOptions.tileSize / 2;
                    
                    // x position is just the column
                    reusedTile.x = i * gameOptions.tileSize + gameOptions.tileSize / 2;
                    
                    // setting alpha back to 1
                    reusedTile.alpha = 1;
                    
                    // setting a new tile value
                    var tileValue = game.rnd.integerInRange(0, gameOptions.colors.length - 1);
                    
                    // tinting the tile with the new color
                    reusedTile.tint = gameOptions.colors[tileValue];    
                    
                    // setting the item with the new values
                    this.tilesArray[j][i] = {
                         tileSprite: reusedTile,
                         isEmpty: false,
                         coordinate: new Phaser.Point(i, j),
                         value: tileValue
                    }  
                    
                    // and finally make the tile fall down
                    this.moveDownTile(0, i, j, true);                    
               }
          }
     },
     
     // function to count how many empty tiles we have under a given tile
     countSpacesBelow: function(row, col){
          var result = 0;
          for(var i = row + 1; i < gameOptions.fieldSize; i++){
               if(this.tilesArray[i][col].isEmpty){
                    result ++;
               }     
          }
          return result;
     },
     
     // function to move down a tile
     moveDownTile: function(fromRow, fromCol, toRow, justMove){
     
          // a tile can be just moved (when it's a "new" tile falling from above) or 
          // must be moved updating the game field (when it's an "old" tile falling down from its previous position)
          // "justMove" flag handles this operation
          if(!justMove){
          
               // saving the tile itself and its value in temporary variables
               var tileToMove = this.tilesArray[fromRow][fromCol].tileSprite;
               var tileValue = this.tilesArray[fromRow][fromCol].value;
          
               // adjusting tilesArray items actually creating the tile in the new position...
               this.tilesArray[toRow][fromCol] = {
                    tileSprite: tileToMove,
                    isEmpty: false,
                    coordinate: new Phaser.Point(fromCol, toRow),
                    value: tileValue
               }  
               
               // the old place now is set to null
               this.tilesArray[fromRow][fromCol].isEmpty = true;        
          }
          
          // distance to travel, in pixels, by the tile
          var distanceToTravel = (toRow * gameOptions.tileSize + gameOptions.tileSize / 2) - this.tilesArray[toRow][fromCol].tileSprite.y
          
          // a tween manages the movement
          var tween = game.add.tween(this.tilesArray[toRow][fromCol].tileSprite).to({
               y: toRow * gameOptions.tileSize + gameOptions.tileSize / 2         
          }, distanceToTravel / 2, Phaser.Easing.Linear.None, true);
          
          // same thing as before to see how many tweens remain alive, and if this is the last
          // active tween, player move is completed
          tween.onComplete.add(function(){
               if(tween.manager.getAll().length == 1){
                    this.endMove();  
               }
          }, this);          
     },
     
     // function which counts tiles in a column
     tilesInColumn: function(col){
          var result = 0;
          for(var i = 0; i < gameOptions.fieldSize; i++){
               if(!this.tilesArray[i][col].isEmpty){ 
                    result ++;
               }
          }
          return result;
     },
     
     // function to rotate a field by "a" degrees
     rotateField: function(a){
     
          // can the player move?
          if(this.canPick){
          
               // set canPick to false so the player can't pick up tiles while the field is rotating
               this.canPick = false;
               
               // removing tileGroup mask to show all tiles while rotating
               this.tileGroup.mask = null;
               
               // using a tween to rotate tileGroup by "a" degrees
               var rotateTween = game.add.tween(this.tileGroup).to({
                    angle: a
               }, 500, Phaser.Easing.Bounce.Out, true);
               
               // when the rotation has been completed...
               rotateTween.onComplete.add(function(){    
               
                    // rotate the array by -a degrees  
                    this.tilesArray = Phaser.ArrayUtils.rotateMatrix(this.tilesArray, -a);
                    
                    // this loop will reposition all tiles and set their "coordinate" property
                    for(var i = 0; i < gameOptions.fieldSize; i++){
                         for(var j = 0; j < gameOptions.fieldSize; j++){
                              this.tilesArray[i][j].tileSprite.angle = 0;
                              this.tilesArray[i][j].tileSprite.x = j * gameOptions.tileSize + gameOptions.tileSize / 2;
                              this.tilesArray[i][j].tileSprite.y = i * gameOptions.tileSize + gameOptions.tileSize / 2;
                              this.tilesArray[i][j].coordinate = new Phaser.Point(j, i);
                         }
                    }
                    
                    // resettig group angle
                    this.tileGroup.angle = 0;
                    
                    // player move is completed
                    this.endMove();  
                    
                    // masking the group again
                    this.tileGroup.mask = this.tileMask;                
               }, this);
          }
     },
     
     // now it's time to see what happens after the player moves
     endMove: function(){
     
          // let's prepare filled array again
          this.filled = [];
     
          // we scan all board to see what we have on the table.
          // in this prototype we only have the hero, a key and a door and it would have been easier to
          // store special item positions in some temporary variables, but we could have more stuff, hence the decision
          // to scan the whole field
          for(var i = 0; i < gameOptions.fieldSize; i++){
			for(var j = 0; j < gameOptions.fieldSize; j++){
                    
                    // now the only interesting case is we found the player
                    if(this.tilesArray[i][j].value == 10 + _HERO){
                         
                         // if the player is not on the bottom of the game field...
                         if(i != gameOptions.fieldSize - 1){
                              
                              // let's see what we have below our hero
                              var tileBelowHero = this.tilesArray[i + 1][j].value;
                              
                              switch(tileBelowHero){
                                   
                                   // the key
                                   case 10 + _KEY: 
                                   
                                        // grab the key
                                        this.filled.push(new Phaser.Point(j, i + 1));
                                        
                                        // let's find the locked door
                                        var door = this.findItem(_LOCKEDDOOR);
                                        
                                        // unlock the door
                                        door.tileSprite.frame = _UNLOCKEDDOOR;
                                        door.value = 10 + _UNLOCKEDDOOR; 
                                        break;
                                        
                                   // the unlocked door
                                   case 10 + _UNLOCKEDDOOR:
                                        
                                        // you passed the level
                                        this.filled.push(new Phaser.Point(j, i));                                       
                              }                            
                         }
                    }
               }
          }
          
          // if we removed some more tiles (like the key)...
          if(this.filled.length > 0){
          
               // destroy the tiles
               this.destroyTiles();
          }
          else{
          
               // otherwise the player can play again
               this.canPick = true;
          }
     },
     
     // given an item to find, returns the proper array item
     findItem: function(item){
          for(var i = 0; i < gameOptions.fieldSize; i++){
			for(var j = 0; j < gameOptions.fieldSize; j++){
                    if(this.tilesArray[i][j].value == 10 + item){
                         return this.tilesArray[i][j];
                    }     
               }
          }    
     }, 
     
     // functiont to check if two tiles are adjacent, diagonal included
     isAdjacent: function(p1, p2){
          return (Math.abs(p1.x - p2.x) < 2) && (Math.abs(p1.y - p2.y) < 2)
     },
     
     // flood fill function, for more information
     // http://www.emanueleferonato.com/2008/06/06/flash-flood-fill-implementation/
     floodFill: function(p, n){
          if(p.x < 0 || p.y < 0 || p.x >= gameOptions.fieldSize || p.y >= gameOptions.fieldSize){
               return;
          }
          if(!this.tilesArray[p.y][p.x].isEmpty && this.tilesArray[p.y][p.x].value == n && !this.pointInArray(p)){
               this.filled.push(p);
               this.floodFill(new Phaser.Point(p.x + 1, p.y), n);
               this.floodFill(new Phaser.Point(p.x - 1, p.y), n); 
               this.floodFill(new Phaser.Point(p.x, p.y + 1), n);
               this.floodFill(new Phaser.Point(p.x, p.y - 1), n);       
          }
     },
     
     // there isn't a built-in javascript method to see if an array contains a point, so here it is.
     pointInArray: function(p){
          for(var i = 0; i < this.filled.length; i++){
               if(this.filled[i].x == p.x && this.filled[i].y == p.y){
                    return true;
               }
          }
          return false;
     }
}