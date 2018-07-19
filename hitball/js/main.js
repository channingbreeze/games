
var game = new Phaser.Game(320,480,Phaser.CANVAS,"",{preload:onPreload, create:onCreate, update:onUpdate});								

var ball; // the ball! Our hero
var arrow; // rotating arrow 
var rotateDirection = 1; // rotate direction: 1-clockwise, 2-counterclockwise
var power = 0; // power to fire the ball
var hudText; // text to display game info
var charging=false; // are we charging the power?
var degToRad=0.0174532925; // degrees-radians conversion
var score = 0; // the score
var coin; // the coin you have to collect
var deadlyArray = []; // an array which will be filled with enemies
var gameOver = false; // flag to know if the game is over
                  
// these settings can be modified to change gameplay
var friction = 0.99; // friction affects ball speed
var ballRadius = 10; // radius of all elements
var rotateSpeed = 3; // arrow rotation speed
var minPower = 50; // minimum power applied to ball
var maxPower = 200; // maximum power applied to ball
                  
// when the game preloads, graphic assets are loaded
function onPreload() {
  game.load.image("ball", "assets/ball.png");
  game.load.image("deadly", "assets/deadly.png");
  game.load.image("coin", "assets/coin.png");
  game.load.image("arrow", "assets/arrow.png");
}
      
// function to be executed when the game is created
function onCreate() {
  
  // center and scale the stage
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
              
  // add the ball and set its anchor point in the center
  ball = game.add.sprite(game.world.centerX,game.world.centerY,"ball");
  ball.anchor.x = 0.5;
  ball.anchor.y = 0.5;
  
  // ball starting speed
  ball.xSpeed = 0;
  ball.ySpeed = 0;
  
  // the rotating arrow
  arrow = game.add.sprite(game.world.centerX,game.world.centerY,"arrow");
  arrow.anchor.x = -1;
  arrow.anchor.y = 0.5;
  
  // place an enemy
  placeDeadly();
  
  // create and place a coin 
  coin = game.add.sprite(Math.random()*400+40,Math.random()*240+40,"coin");
  coin.anchor.x = 0.5;
  coin.anchor.y = 0.5;
  placeCoin();
  
  // create and place the text showing speed and score
  hudText = game.add.text(5,0,"",{ 
    font: "11px Arial",
    fill: "#ffffff", 
    align: "left" 
  });
  
  // update text content
  updateHud();
  
  // listener for input down
  game.input.onDown.add(charge, this);       
}
      
// place an enemy
function placeDeadly(){
  
  // first, create the enemy and set its anchor point in the center
  var deadly = game.add.sprite(0,0,"deadly");
  deadly.anchor.x = 0.5;
  deadly.anchor.y = 0.5;
  
  // add the newly created enemy in the enemy array
  deadlyArray.push(deadly);
  
  // assign it a random position until such position is legal
  do {
    var randomX=Math.random()*(game.width-2*ballRadius)+ballRadius;
    var randomY=Math.random()*(game.height-2*ballRadius)+ballRadius;
    deadlyArray[deadlyArray.length-1].x=randomX;
    deadlyArray[deadlyArray.length-1].y=randomY;
  } while (illegalDeadly());
}
      
// determine if an enemy position is illegal
function illegalDeadly(){
  
  // if the distance between the enemy and the ball is less than three times the radius, it's NOT legal
  if(getDistance(ball,deadlyArray[deadlyArray.length-1])<(ballRadius*3)*(ballRadius*3)){
    return true;
  }
  
  // if the distance between the enemy and any other enemy is less than two times the radius, it's NOT legal
  for(i=0;i<deadlyArray.length-1;i++){
    if(getDistance(deadlyArray[i],deadlyArray[deadlyArray.length-1])<(ballRadius*2)*(ballRadius*2)){
      return true
    }
  }
  
  // otherwise it's legal	
  return false;
}
      
// the function to place a coin is similar to the one which places the enemy, but this time we don't need
// to place it in an array because there's only one coin on the stage
function placeCoin(){

  // assign the coin a random position until such position is legal
  do{
    coin.x=Math.random()*(game.width-2*ballRadius)+ballRadius;
    coin.y=Math.random()*(game.height-2*ballRadius)+ballRadius;
  } while (illegalCoin());
}
      
// determine if a coin position is illegal
function illegalCoin(){

  // if the distance between the coin and any ball is less than 2.5 times the radius, it's NOT legal
  if(getDistance(ball,coin)<(ballRadius*2.5)*(ballRadius*2.5)){
    return true;
  }
  
  // if the distance between the coin and any enemy is less than three times the radius, it's NOT legal
  for(i=0;i<deadlyArray.length;i++){
    if(getDistance(deadlyArray[i],coin)<(ballRadius*3)*(ballRadius*3)){
      return true
    }
  }
  
  // otherwise it's legal
  return false;	
}

// function to be executed each time the game is updated
function onUpdate() {

  // the game is update only if it's not game over
  if(!gameOver){
    
    // when the player is charging the power, this is increased until it reaches the maximum allowed
    if(charging){
      power++;
      power = Math.min(power,maxPower)    
      // then game text is updated
      updateHud();		
    }
    
    // if the player is not charging, keep rotating the arrow
    else{
      arrow.angle+=rotateSpeed*rotateDirection;
    }
    
    // update ball position according to its speed
    ball.x+=ball.xSpeed;
    ball.y+=ball.ySpeed;
    
    // handle wall bounce
    wallBounce();
    
    // reduce ball speed using friction
    ball.xSpeed*=friction;
    ball.ySpeed*=friction;
    
    // update arrow position
    arrow.x=ball.x;
    arrow.y=ball.y;
    
    // if the player picked a coin, then update score and text, change coin position and add an enemy
    if(getDistance(ball,coin)<(ballRadius*2)*(ballRadius*2)){
      score += 1;
      placeDeadly();
      placeCoin();
      updateHud();	
    }
    
    // if the player hits an enemy, it's game over
    for(i=0;i<deadlyArray.length;i++){
      if(getDistance(ball,deadlyArray[i])<(ballRadius*2)*(ballRadius*2)){
        gameOver = true;
        window.alert("Game Over！分数：" + score + "分，去发ajax吧！");
      }	
    }
  }
}
          
// function to handle bounces. Just check for game boundary collision
function wallBounce(){
  if(ball.x<ballRadius){
    ball.x=ballRadius;
    ball.xSpeed*=-1
  }
  if(ball.y<ballRadius){
    ball.y=ballRadius;
    ball.ySpeed*=-1
  }
  if(ball.x>game.width-ballRadius){
    ball.x=game.width-ballRadius;
    ball.xSpeed*=-1
  }
  if(ball.y>game.height-ballRadius){
    ball.y=game.height-ballRadius;
    ball.ySpeed*=-1
  }    
}
          
// simple function to get the distance between two sprites
// does not use sqrt to save CPU
function getDistance(from,to){
  var xDist = from.x-to.x
  var yDist = from.y-to.y;
  return xDist*xDist+yDist*yDist;
}
          
// when the player is charging, set the power to min power allowed
// and wait the player to release the input to fire the ball
function charge(){
  power = minPower;
  game.input.onDown.remove(charge, this); 
  game.input.onUp.add(fire, this);  
  charging=true;
}
      
// FIRE!!
// update ball speed according to arrow direction
// invert arrow rotation
// reset power and update game text
// wait for the player to fire again
function fire(){
  game.input.onUp.remove(fire, this); 
  game.input.onDown.add(charge, this);
  ball.xSpeed += Math.cos(arrow.angle*degToRad)*power/20;
  ball.ySpeed += Math.sin(arrow.angle*degToRad)*power/20;
  power = 0;
  updateHud();
  charging=false; 
  rotateDirection*=-1;
}
      
// function to update game text
function updateHud(){
  hudText.text = "Power: "+power+" * Score: "+score	
}
