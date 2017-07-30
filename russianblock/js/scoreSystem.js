highscores = [];
leaderNames = [];
newHighscoreIndex = -1;
hsLen = 5;

function getLeaderboard(){
	highscores = [];
	leaderNames = []
	for(i = 0; i < hsLen; i++){
		highscores.push(parseInt(localStorage.getItem("leaderboard_" + i)));
		leaderNames.push(localStorage.getItem("leaderNames_" + i));
	}
}

function submitScore(s){
	newHighscoreIndex = testScore(s);
	if( newHighscoreIndex > -1){
		highscores.push(0);
		hsLen++;
		foo = highscores[newHighscoreIndex];
		highscores[newHighscoreIndex] = s;
		fooN = leaderNames[newHighscoreIndex];
		leaderNames[newHighscoreIndex] = "";

		for(i = newHighscoreIndex+1; i < hsLen; i++){
			bar = highscores[i];
			barN = leaderNames[i];
			highscores[i] = foo;
			leaderNames[i] = fooN;
			foo = bar;
			fooN = barN;
		}
		highscores.pop();
		hsLen--;
		return 0;
	}
	return 1;
}

function testScore(s){
	getLeaderboard();
	for(i = 0; i < hsLen; i++){
		console.log("cur score: " + s + " // highscore["+i+"]: " + highscores[i]);
		if (s > highscores[i]){
			return i;
		}
	}
	return -1;
}

function updateLeaderboard(){
	for(i = 0; i < hsLen; i ++){
		localStorage.setItem("leaderboard_" + i, highscores[i]);
		localStorage.setItem("leaderNames_" + i, leaderNames[i]);
	}
	console.log("Leaderboard updated");
}

function getLeaderboardName(index){
	return localStorage.getItem("leaderNames_" + index);
}

function getLeaderboardScore(index){
	return localStorage.getItem("leaderboard_" + index);
}

function updatePlayerName(playerName){
	leaderNames[newHighscoreIndex] = playerName;
	console.log("new highscore at position " + newHighscoreIndex + " : " + playerName);
}