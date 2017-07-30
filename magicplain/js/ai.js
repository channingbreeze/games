// map: 2d array, return path
function AStar(map_array, sx, sy, tx, ty, faraway = false){
	var dirs = [
		{'x': -1, 'y': 0},
		{'x': 1, 'y': 0},
		{'x': 0, 'y': -1},
		{'x': 0, 'y': 1},
	];
	var width = map_array[0].length;
	var height = map_array.length;

	var nodedir = new Array(height);
	for(var ni = 0; ni < height; ni ++){
		nodedir[ni] = new Array(width);
	}


	var openset = [];
	var closedset = [];
	var first = {'x':sx, 'y':sy, 'g':0};
	var global_min_node = first;
	var global_min_cost = Infinity;
	closedset.push(first);

	// untile last node reach (tx, ty)
	while(faraway? closedset.length < width*height : closedset[closedset.length-1].x != tx ||
		closedset[closedset.length -1].y != ty){
		var last = closedset[closedset.length - 1];
		// check around
		for(var d in dirs){
			var x = last.x+dirs[d].x;
			var y = last.y+dirs[d].y;
			// check boarder
			if(x < 0 || x >= width || y < 0 || y >= height)
				continue;

			var valid = true;
			// find in open set
			for(var i in openset){
				if(openset[i].x == x && openset[i].y == y){
					valid = false;
					break;
				}
			}
			if(!valid)
				continue;
			// find in closed set
			for(var i in closedset){
				if(closedset[i].x == x && closedset[i].y == y){
					valid = false;
					break;
				}
			}	
			if(!valid)
				continue;
			// valid
			nodedir[y][x] = d;
			openset.push({'x':x,'y':y, 'g': last.g + 1});
		}

		// find lowest cost in open set
		var min_cost = Infinity;
		var minid = 0;
		for(var i in openset){
			var x = openset[i].x;
			var y = openset[i].y;
			// computer cost function: f(x) = g(x) + h(x) + obs(x)
			var h = 0;
			if(faraway)
				h = -Math.abs(tx - x) - Math.abs(ty - y);
			else
				h = Math.abs(tx - x) + Math.abs(ty - y);
			var cost = openset[i].g + h*2 + map_array[y][x];
			if(cost <= min_cost){
				min_cost = cost;
				minid = i;
			}
		}
		if(!isFinite(min_cost))
			break;
		var min_node = openset[minid];
		// remove the lowest cost node from open set
		openset.splice(minid, 1);
		// add to closed set
		closedset.push(min_node);

		if(min_cost < global_min_cost){
			global_min_cost = min_cost;
			global_min_node = min_node;
		}
	}

	// trace back
	var path = [];
	var nx, ny;
	if(faraway){
		nx = global_min_node.x;
		ny = global_min_node.y;
	}else{
		nx = closedset[closedset.length - 1].x;
		ny = closedset[closedset.length - 1].y;
	}
	while(nx != sx || ny != sy){
		path.push({'x':nx,'y':ny});
		var thedir = nodedir[ny][nx];
		nx -= dirs[thedir].x;
		ny -= dirs[thedir].y;
    }
    path.push({'x':sx,'y':sy});
	return path.reverse();
}

function pathCost(map_array, path){
	var block_cost = 0;
	for(var b in path){
		var x = path[b].x;
		var y = path[b].y;
		block_cost += map_array[y][x];
	}
	return block_cost + path.length;
}