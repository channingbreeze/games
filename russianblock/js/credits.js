var creditsState = {

	create: function(){
		drawPatternBG("#ffffff", "#999999");
		game.add.nineSlice(5, 5, "sliced_panel", "sliced_panel", 205,470);
		game.add.nineSlice(216, 5, "sliced_panel", "sliced_panel", 205,470);
		game.add.nineSlice(427, 5, "sliced_panel", "sliced_panel", 205,470);
		logo = game.add.sprite(15, 10, 'logo', );
		decoIN = "\n*";
		decoOUT = "*\n";
		panel1Text = decoIN+getText("Credits", 0)+decoOUT+"Caio Marchi\n"+decoIN+getText("Credits", 1)+decoOUT+"Sublime Text 3\nSourceTree\nGimp 2\nAudacity\n"+decoIN+getText("Credits", 2)+decoOUT+"BitBucket\nPhaser.js\nPhaser Nine Slice";
		panel1 = game.add.text(0, 0, panel1Text, getStyle("credits"));
	    panel1.setTextBounds(9, 130, 201, 336);

	    panel2Text = decoIN+getText("Credits", 3)+decoOUT+"1. Phaser Universe - Phaser\n2. PROERD - Nestablo Ramos\n3. Kremlin's Surveillance - Bruno Moraes\n4. Pokemon Ghosts - Virgilio Silveira\n5. Master Sword - Virgilio Silveira\n6. Ratinho in Space - Caio Marchi\n"+decoIN+getText("Credits", 11)+decoOUT+"Aleksandr Beljakov\n"+decoIN+getText("Credits", 12)+decoOUT+"Shim Take\n"+decoIN+getText("Credits", 5)+decoOUT+"1. Exo - Natanael Gama\n2. MartelSans - Dan Reynolds + Mathieu Reguer";
		panel2 = game.add.text(0, 0, "", getStyle("credits"));
		panel2.setTextBounds(220, -10, 205, 481);
		panel2.text = panel2Text;

	    panel3Text = decoIN+getText("Credits", 6)+decoOUT+"Richard Davey ("+getText("Credits", 7)+")\nKaty's Code (How to Code a T-spin)\nTetris Wikia\nHTML 5 Game Devs (Forum)\n"+decoIN+getText("Credits", 8)+decoOUT+"1.Boa Noite Vizinhanca - Fabio Lima\n2. Tetris Acapella Theme A - Smooth McGroove\n\n"+getText("Credits", 9)+"\n\n"+getText("Credits", 10);
		panel3 = game.add.text(0, 0, "", getStyle("credits"));
	    panel3.setTextBounds(431, -10, 205, 481);
		if(curLang == "RU"){
			panel3.fontSize = "12px";
		}
	    panel3.text = panel3Text;




		var buttonStyle = getStyle("button_regular");
		btnBack = game.add.button(532, (game.world.height / 2) + 195, 'medium_button', goBack, this, 1, 2, 0);
		btnBack.anchor.setTo(0.5, 0.5);
		lblBack = game.add.text(532, (game.world.height / 2) + 198, getText("Standard", 2), buttonStyle);
		lblBack.anchor.setTo(0.5, 0.5);
	}
};
