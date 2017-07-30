const { exec } = require('child_process');
var fs=require("fs");  

var jsfiles = [
"js/load.js",
"js/menu.js",
"js/level.js",
"js/play.js",
"js/character.js",
"js/player.js",
"js/ai.js",
"js/enemy.js",
"js/bomb.js",
"js/panel.js"
];

var s = "";
for(var i in jsfiles){
	s += fs.readFileSync(jsfiles[i],"utf-8") + '\n';  
}
fs.writeFile("game.js", s, function(err) {
    if(err) {
        return console.log(err);
    }
 
    console.log("game.js was saved!");
});
