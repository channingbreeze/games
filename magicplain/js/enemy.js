function Enemy(data, panel, mapx, mapy, type){
	Character.call(this, data, panel, mapx, mapy, type);
	
	this.escape_mapx = null;
	this.escape_mapy = null;

	this.action_state = 'idle';
}

inheritPrototype(Enemy, Character);

Enemy.prototype.update = function(){
	Character.prototype.update.call(this);
	if(this.action_state == 'idle'){
		this.takeAction();
	}
}

Enemy.prototype.onReachGoal = function(){
    Character.prototype.onReachGoal.call(this);
	this.takeAction();
}

Enemy.prototype.takeAction = function(){
	
	// estimate behaviors
	var behaviors = this.behaviorEstimate();

	// find minimum cost behavior
	var min_b = 'idle';
	for(var b in behaviors){
		if(behaviors[b].cost < behaviors[min_b].cost){
			min_b = b;
		}
	}
	var player = this.panel.player;
	//console.log(min_b);
	this.action_state = min_b;
	// take action
	switch(min_b){
	case 'idle':
		this.standStill();
		break;
	case 'chase':
		this.walkTo(player.mapx, player.mapy);
		break;
	case 'escape':
		this.escape(behaviors.escape.bombs);
		break;
	case 'getprop':
		var prop = behaviors['getprop'].prop;
		this.walkTo(prop.x, prop.y);
		break;
	case 'putbomb':
		this.putBomb();
		this.action_state = 'idle';
		break;
	}
}

Enemy.prototype.behaviorEstimate = function(){
	// precompute data
	var props = this.panel.getProps();
	var map_array = this.panel.toArray();
	var player = this.panel.player;

	// idle
	var idle_behavior = {'cost':Infinity};
	// escape
	var near_bombs = this.panel.getNearBombs(this.mapx, this.mapy);
	var escape_cost = 0;
	for(var b in near_bombs){
		escape_cost += near_bombs[b].attack;
	}
	var escape_behavior = {
		'cost': 1000 + 10 / escape_cost,
		'bombs': near_bombs
	};

	// get prop
	var min_prop = null;
	var min_prop_cost = Infinity;
	for(var p in props){
		var prop = props[p];
		var path = AStar(map_array, this.mapx, this.mapy, prop.x, prop.y);	
		var cost = pathCost(map_array,path);
		if(cost < min_prop_cost){
			min_prop_cost = cost;
			min_prop = prop;
		}
	}
	var getprop_behavior = {'cost': 1000 + min_prop_cost, 'prop': min_prop};
	// chase
	var chase_path = AStar(map_array, this.mapx, this.mapy, player.mapx, player.mapy);
	var chase_cost = 1000 + pathCost(map_array, chase_path);
	var chase_behavior = {'cost':chase_cost};
	// put bomb
	var putbomb_cost = 
	(this.isNearChest() || this.isNearPlayer()) 
	&& !this.panel.hasBomb(this.mapx, this.mapy) ? 
		-100:Infinity;
	var putbomb_behavior = {'cost':putbomb_cost};

	var behaviors = {'idle':idle_behavior, 
		'chase':chase_behavior, 
		'escape':escape_behavior, 
		'getprop':getprop_behavior, 
		'putbomb':putbomb_behavior};
	return behaviors;
}

// give a target, make next step
Enemy.prototype.walkTo = function(targetx, targety){
    var map_arr = this.panel.walkableArray();
    // follow player
    var sx = this.mapx;
	var sy = this.mapy;
	//map_arr[sy][sx]  = 0;
	var path = AStar(map_arr, sx, sy, targetx, targety);
	if(path.length <= 1){
		this.standStill();
		this.action_state = 'idle';
		return false;
	}
    var dx = path[1].x - path[0].x;
	var dy = path[1].y - path[0].y;
	var r = false;
    if(dx>0) r = this.walk('right');
    else if(dx<0) r = this.walk('left');
    else if(dy>0) r = this.walk('down');
    else if(dy<0) r = this.walk('up');
	else{
		console.log('logic error');
	}
	if(!r){	
		// the tile blocked the way?
		var block_health = this.panel.getBlockHealth(path[1].x, path[1].y);
		if(block_health && isFinite(block_health))
			this.putBomb();
		this.standStill();
		this.action_state = 'idle';	
		
	}else{
		//this.action_state = 'walking';
	}
	return r;
}

Enemy.prototype.isNearPlayer = function(){
	var player =  this.panel.player;
	var dx = player.mapx - this.mapx;
	var dy = player.mapy - this.mapy;
	return dx*dx + dy*dy <= 1;
}

Enemy.prototype.isNearChest = function(){
	var dx = [-1,0,1,0];
	var dy = [0,-1,0,1];
	for(var i = 0; i < 4; i++){
		var x = this.mapx + dx[i];
		var y = this.mapy + dy[i];
		var type = this.panel.getBlockType(x, y);
		if(type == 'chest')
			return true;
	}
	return false;
}

Enemy.prototype.escape = function(bombs){
		
	var sx = this.mapx;
	var sy = this.mapy;

	//get nearest bomb
	var bomb = bombs[0];
	for(var i in bombs){
		if(Math.abs(bombs[i].mapx - sx)+Math.abs(bombs[i].mapy - sy)
			< Math.abs(bomb.mapx - sx)+Math.abs(bomb.mapy - sy))
			bomb = bombs[i];
	}
	var tx = bomb.mapx;
	var ty = bomb.mapy;

	var map_arr = this.panel.walkableArray();
	this.escape_bomb = bomb;
	var path = AStar(map_arr, sx, sy, tx, ty, true);
	if(path.length <= 1){
		this.standStill();
		this.action_state = 'idle';
		return false;
	}

    var dx = path[1].x - path[0].x;
	var dy = path[1].y - path[0].y;
	var r = false;
    if(dx>0) r = this.walk('right');
    else if(dx<0) r = this.walk('left');
    else if(dy>0) r = this.walk('down');
    else if(dy<0) r = this.walk('up');
	else{
		console.log('logic error');
	}
	if(!r){	
		// the tile blocked the way?
		var block_health = this.panel.getBlockHealth(path[1].x, path[1].y);
		if(block_health && isFinite(block_health))
			this.putBomb();
		this.standStill();
		this.action_state = 'idle';	
		
	}else{
		//this.action_state = 'walking';
	}
	return r;

}
