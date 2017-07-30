function drawPatternBG(fgColor, bgColor){
	game.stage.backgroundColor = bgColor;
	pattern_bg = game.add.sprite(0, 0, 'pattern_bg');
	pattern_bg.tint = fgColor;
}
