var Phaser = Phaser || {};
var CrazyBird = CrazyBird || {};

CrazyBird.MapManager = function(gameState, properties) {
  "use strict";
  Object.call(this);
  this.gameState = gameState;
};

CrazyBird.MapManager.prototype = Object.create(Object.prototype);
CrazyBird.MapManager.prototype.constructor = CrazyBird.MapManager;

CrazyBird.MapManager.prototype.loadLevel = function(map, layer) {
  
  this.gameState.map = game.add.tilemap(map);
  this.gameState.map.addTilesetImage('floor', 'tiles');
  this.gameState.layer = this.gameState.map.createLayer(layer);
  this.gameState.layer.resizeWorld();
  this.gameState.layer.resize(WIDTH, HEIGHT);
  this.gameState.layer.wrap = true;
  this.gameState.map.setCollisionBetween(1, 1);
  this.gameState.tileObjects = game.physics.p2.convertTilemap(this.gameState.map, this.gameState.layer);

  // collide world bounds，这里需要update一下
  game.physics.p2.updateBoundsCollisionGroup();

}

CrazyBird.MapManager.prototype.setMapProperty = function() {

  for(var i=0; i<this.gameState.tileObjects.length; i++) {
    var tileBody = this.gameState.tileObjects[i];
    tileBody.setCollisionGroup(this.gameState.collideGroups['tiles']);
    tileBody.collides([this.gameState.collideGroups['bird']]);
    this.tileMaterial = game.physics.p2.createMaterial('tileMaterial', tileBody);
    this.contactMaterial = game.physics.p2.createContactMaterial(this.gameState.bird.birdMaterial, this.tileMaterial);
    this.contactMaterial.restitution = 0.0;
    this.contactMaterial.friction = 0;
    this.contactMaterial.relaxation = 200;
  }

}

CrazyBird.MapManager.prototype.findObjectsByType = function(type, map, layer) {
  var result = new Array();
  map.objects[layer].forEach(function(element) {
    if(element.properties.type === type) {
      result.push(element);
    }
  });
  return result;
};

