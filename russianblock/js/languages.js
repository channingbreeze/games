var curLang;

function initLang(){
	curLang = localStorage.getItem("curLang");
}

function getText(section, index){
	return game.cache.getJSON('langs').langs[curLang][section].texts[index];
}

function setLang(l){
	curLang = l;
}

function createLanguageFlags(){
	game.add.button(19, 373, 'flags', function(){updateLanguage("PT_BR")}, this, 0, 0, 0);
	game.add.button(56, 373, 'flags', function(){updateLanguage("EN")}, this, 1, 1, 1);
	game.add.button(93, 373, 'flags', function(){updateLanguage("ES")}, this, 2, 2, 2);
	game.add.button(130, 373, 'flags', function(){updateLanguage("GE")}, this, 3, 3, 3);
	game.add.button(19, 410, 'flags', function(){updateLanguage("RU")}, this, 4, 4, 4);
	game.add.button(56, 410, 'flags', function(){updateLanguage("JP")}, this, 5, 5, 5);
	game.add.button(93, 410, 'flags', function(){updateLanguage("IT")}, this, 6, 6, 6);
	game.add.button(130, 410, 'flags', function(){updateLanguage("FR")}, this, 7, 7, 7);
}

function updateLanguage(newLang){
	setLang(newLang);
	localStorage.setItem("curLang", curLang);
	game.state.start(game.state.current)
}
