function goBack(){
	dest = breadCrumbs.pop();
	if(dest == undefined){
		dest = 'menu';
	}
	game.state.start(dest);
}

function show(stateName){
	breadCrumbs.push(game.state.current);
	game.state.start(stateName);
}

function resetNav(){
	breadCrumbs = [];
}