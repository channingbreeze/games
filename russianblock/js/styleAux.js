function getStyle(key){
	if(curLang == "RU" || curLang == "JP"){
		key = "alt_"+key;
	}
	return game.cache.getJSON('styles')[key];
}
