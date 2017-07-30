var loadState = {
    loading_label: null,
    preload: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);

        var cx = game.world.centerX;
        var cy = game.world.centerY;

        this.loading_label = game.add.text(cx, cy, 'loading ...', 
            {font: '64px Arial', fill: '#ffffff'});
        this.loading_label.anchor.setTo(0.5,0.5);
        this.loading_label.alpha = 0;
        var loading_tween = game.add.tween(this.loading_label).to({ alpha: 1 }, 1000, "Linear", true, 0, -1);
        loading_tween.yoyo(true, 1500);

        // load json
        game.load.json('data', 'assets/data.json');
        game.load.json('maps', 'assets/maps.json');

        // load atlas
        game.load.atlasJSONHash('image', 'assets/image.png', 'assets/image.json');
        game.load.image('tileset', 'assets/tileset.png');

        // load sound
        game.load.audiosprite('sound', 'assets/sound_effect.mp3', 'assets/sound_effect.json');
    },
    create: function(){
        // creat sound
        sound = game.add.audioSprite('sound');
        // fade out
        this.camera.fade('#000', 500);
        this.camera.onFadeComplete.addOnce(function() {
            theme_music = sound.play('theme_music');
            this.game.state.start('menu');
        }, this);      
    }
};

function object(o){
    function F(){};
    F.prototype = o;
    return new F();
}

function inheritPrototype(subType, superType){
    var prototype = object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

function selectFrom(lowerValue, upperValue) {
    var choices = upperValue - lowerValue + 1;
    return Math.floor(Math.random() * choices + lowerValue);
}

// button prefabs
function ButtonPrefab(x, y, name, callback, obj){
    var bt_data = {
        'resume':{'normal':'01','over':'05','pressed':'09'},
        'return':{'normal':'02','over':'06','pressed':'10'},
        'start':{'normal':'03','over':'07','pressed':'11'},
        'about':{'normal':'04','over':'08','pressed':'12'}
    };
    var dat = bt_data[name];
    this.button = game.add.button(x, y, 'image', callback, obj, 
            'buttons/button_' + dat.over, 'buttons/button_' + dat.normal, 'buttons/button_' + dat.pressed);
    this.button.anchor.setTo(0.5,0.5);
    /*this.button.onInputOver.add((e) => {
        console.log('over');
        var butenter_sound = game.add.audio('butenter');
        butenter_sound.play();
    });*/
    this.button.onInputDown.add((e) => {
        sound.play('butpressed');
    });
}

ButtonPrefab.prototype.setAnchor = function(x,y){
    this.button.anchor.setTo(x,y);
}

ButtonPrefab.prototype.enable = function(){
    this.button.inputEnabled = true;
}
ButtonPrefab.prototype.disable = function(){
    this.button.inputEnabled = false;
}

var menuState = {
    menus : null,
    start_button: null,
    about_button: null,
    about_panel:null,
    startCallback : function(){
        // fade out
        this.camera.fade('#000', 500);
        this.camera.onFadeComplete.addOnce(function() {
            this.game.state.start('level');
        }, this);        
    },
    aboutReturnCallback: function(){
        this.about_panel.visible = false;
        this.start_button.enable();
        this.about_button.enable();
    },
    aboutCallback : function(){
        this.start_button.disable();
        this.about_button.disable();

        this.about_panel = game.add.group();
        var cx = game.world.centerX;
        var cy = game.world.centerY;
        var aboutbg = game.add.sprite(cx, cy, 'image','window');
        aboutbg.anchor.setTo(0.5, 0.5);
        this.about_panel.add(aboutbg);
        var return_button = new ButtonPrefab(cx, cy + 128, 'return', menuState.aboutReturnCallback, this);
        this.about_panel.add(return_button.button);

        // text
        var content = "Author: lianera\n"+
                      "Link:   lianera.com\n" + 
                      "Powered by Phaser";
        var style = { font: "28px Consolas", fill: "#fff", stroke: '#555',strokeThickness:6};                        
        var text = game.add.text(cx, cy - 64, content, style);
        text.anchor.setTo(0.5,0.5);
        //text.setTextBounds(cx - 128,  cy - 128, 256, 256);
        this.about_panel.add(text);
    },
    
    create: function(){
        // fade in
        this.camera.flash('#000000', 500);
        
        var menu_sprite = game.add.sprite(0, 0, 'image', 'menu');
        //var enter_key = game.input.keyboard.addKey(Phaser.Keyboard.W);
        //enter_key.onDown.addOnce(this.start, this);
        
        this.menus = game.add.group();
        var cx = game.world.centerX;
        var cy = game.world.centerY;
        this.start_button = new ButtonPrefab(cx, cy, 'start', menuState.startCallback, this);
        this.menus.add(this.start_button.button);

        this.about_button = new ButtonPrefab(cx, cy + 96, 'about', menuState.aboutCallback, this);
        this.menus.add(this.about_button.button);
    },
};
var levelState = {
    level_background: null,
    levels : null,
    preload: function(){
    },
    levelCallback : function(i){
        var e = this.levels[i];

        theme_music.fadeOut(500);
        // fade out
        this.camera.fade('#000', 500);
        this.camera.onFadeComplete.addOnce(function() {
            this.game.state.start('play', true, false, e.map, i);
        }, this);        

    },
    returnCallback: function(){
        // fade out
        this.camera.fade('#000', 500);
        this.camera.onFadeComplete.addOnce(function() {
            this.game.state.start('menu');
        }, this);        
    },
    addButton:function(i, type){
            var e = this.levels[i];
            var b = null;
            if(type == 'passed')
                b = game.add.button(e.iconx, e.icony, 'image', () => this.levelCallback(i), this, 'system/system_06', 'system/system_05', 'system/system_07');
            else if(type == 'next')
                b = game.add.button(e.iconx, e.icony, 'image', () => this.levelCallback(i), this, 'system/system_02', 'system/system_01', 'system/system_03');
            else 
                b = game.add.sprite(e.iconx, e.icony, 'image', 'system/system_04');

            b.anchor.setTo(0.5, 0.5);

            var style = { font: "32px Arial", fill: "#ffffff", stroke: '#555555',strokeThickness:4, wordWrap: true, wordWrapWidth: 64};
            var t = game.add.text(e.iconx, e.icony, e.name, style);
            t.anchor.setTo(0.5, 0.45);
    },
    create: function(){
        this.camera.flash('#000000', 500);

        this.level_background = game.add.sprite(0, 0, 'image', 'level');
        var data = game.cache.getJSON('data');
        this.levels = data.levels;

        var is_next = new Array(this.levels.length);
        var is_passed = new Array(this.levels.length);

        var passed_count = 0;
        for(let i in  this.levels){
            var e = this.levels[i];
            var storage = localStorage.getItem('level'+i);
            if(storage == 'true'){
                this.addButton(i, 'passed');
                passed_count++;
                for(var j in e.next){
                    var n = e.next[j];
                    is_next[n] = true;
                }
                is_passed[i] = true;
            }
        }
        for(let i in  this.levels){
            if(is_passed[i])
                continue;
            if(is_next[i]){
                this.addButton(i, 'next');
            }else{
                this.addButton(i, 'unlocked');
            }
        }
        if(passed_count == 0)
            this.addButton(0, 'next');

        // add return button
        this.return_button = new ButtonPrefab(game.world.width - 16, game.world.height - 16, 'return', levelState.returnCallback, this);
        this.return_button.setAnchor(1,1);
    }
};


var playState = {
    panel: null,
    player: null,
    input: null,
    popup_menu: null,
    map: null,
    level: null,
    battle_music: null,
    init: function(map, level){
        this.map = map;
        this.level = level;
    },
    preload: function(){
        game.time.advancedTiming = true;
        // load map
        var maps = game.cache.getJSON('maps');  
        var map_obj = maps[this.map];          
        game.load.tilemap(this.map, null, map_obj, Phaser.Tilemap.TILED_JSON);
    },
    resumeCallback: function(){
        this.popup_menu.visible = false;
        game.paused = false;
        sound.play('butpressed');
    },
    returnToLevel: function(){
        if(this.battle_music)
            this.battle_music.fadeOut(500);
        // fade out
        this.camera.fade('#000', 500);
        this.camera.onFadeComplete.addOnce(function() {
            sound.play('theme_music');
            this.game.state.start('level');
        }, this);   
    },
    returnCallback: function(){
        this.popup_menu.visible = false;
        game.paused = false;
        sound.play('butpressed');
        
        this.returnToLevel();

    },
    onMenu: function(){
        game.paused = true;
        // popup menu
        this.popup_menu = game.add.group();
        var cx = game.world.centerX;
        var cy = game.world.centerY;
        var popbg = game.add.sprite(cx, cy, 'image', 'popup');
        popbg.anchor.setTo(0.5, 0.5);
        this.popup_menu.add(popbg);

        this.resume_button = new ButtonPrefab(cx, cy, 'resume', playState.resumeCallback, this);
        this.popup_menu.add(this.resume_button.button);
        this.return_button = new ButtonPrefab(cx, cy + 96, 'return', playState.returnCallback, this);
        this.popup_menu.add(this.return_button.button);
    },    
    create: function(){
        // fade in
        this.camera.flash('#000000', 500);

        this.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.esc.onDown.add(this.onMenu, this);

        panel = new Panel(this.map);
        panel.createCharacters();

        game.time.events.add(Phaser.Timer.SECOND * 2.5, function(){
                        // play music
            this.battle_music = sound.play('battle_music');
        }, this);     
 
    },
    showReadyGo : function(){
        // 'ready' 'go' text
        var cx = game.world.centerX;
        var cy = game.world.centerY;
        this.ready_label = game.add.text(cx, cy, 'READY', 
                {font: '64px Arial', fill: '#ffffff', stroke: '#a50',strokeThickness:10});
        this.ready_label.anchor.setTo(0.5, 0.5);
        this.ready_count = 0;
        this.timer = game.time.events.loop(250, function(){
            var t = ['READY', 'READY','READY', 'READY','GO'];
            if(this.ready_count < t.length){
                game.world.bringToTop(this.ready_label);
                this.ready_label.text = t[this.ready_count];
                //this.ready_label.scale.set(1,1);
                this.ready_label.alpha = 0;
                game.add.tween(this.ready_label).to( { alpha: 1 }, 200, Phaser.Easing.Quartic.InOut, true);
                //game.add.tween(this.ready_label.scale).to( { x: 1.1, y:1.1 }, 300, Phaser.Easing.Quartic.Out, true);
            }else{
                game.time.events.remove(this.timer);
                this.ready_label.visible = false;
                panel.status = 'playing';
            }
            if(this.ready_count == 0){
                sound.play('readygo');
            }
            this.ready_count++;
        }, this);

        panel.status = 'ready_waiting';
    },
    showResult : function(text){
        panel.player.standStill();
        for(var e in panel.enemies){
            panel.enemies[e].standStill();
        }
        this.battle_music.stop();

        var cx = game.world.centerX;
        var cy = game.world.centerY;       
        var menu_sprite = game.add.sprite(cx, cy, 'image', 'window');
        menu_sprite.scale.set(0.5,0.5);
        menu_sprite.anchor.setTo(0.5,0.5);
        if(text == '胜利'){
            var emitter = game.add.emitter(cx, cy, 100);
            emitter.setXSpeed(-300, 300);
            emitter.setYSpeed(-300, 300);
            var ani = Phaser.Animation.generateFrameNames('effects/effect_', 41, 48, '', 2);
            emitter.makeParticles('image', ani);
            emitter.gravity = 150;
            emitter.start(true, this.explosion_time, null, 100);            
        }        
        this.result_label = game.add.text(cx, cy, text, 
            {font: '72px Arial', fill: '#ffffff', stroke: '#850',strokeThickness:10});
        this.result_label.anchor.setTo(0.5, 0.5);
        this.result_label.scale.set(0.1,0.1);
        var tween = game.add.tween(this.result_label.scale).to( { x:1, y:1 }, 1500, Phaser.Easing.Quartic.InOut, true);
        //tween.yoyo(true, 500);
        panel.status = 'ending';

        game.time.events.add(Phaser.Timer.SECOND * 4, function(){
            this.returnToLevel();
        }, this);     
           
    },
    
    update: function(){
        panel.update();
        if(panel.status == 'ready'){
            this.showReadyGo();

            // manually victory/failed
            // panel.enemies = [];
            // panel.player.state = 'dead';
        }if(panel.status == 'victory'){
            localStorage.setItem('level'+this.level, 'true');
            this.showResult('胜利');
            // play sound
            sound.play('victory');
                
        }else if(panel.status == 'failed'){
            this.showResult('失败');
            // play sound
            sound.play('failed');                
        }
    },
    render: function() {
	    //game.debug.text('fps:'+game.time.fps, 2, 14, "#fff");
    }    
};
function Character(data, panel, mapx, mapy, type){
    this.panel = panel;
    this.type = type;
    this.health = data.health;
    this.attack = data.attack;
    this.speed = data.speed;
    this.mapx = mapx;
    this.mapy = mapy;
    this.stand_frame = 'characters/'+type+'_down_1';
    this.bomb_type = data.bomb_type;
    this.bomb_range = data.bomb_range;
    this.bomb_shape = data.bomb_shape;       

    this.goal_mapx = this.mapx;
    this.goal_mapy = this.mapy;

    // states: stand, walking_left, walking_right, walking_up, walking_down
    this.state = 'stand';

    // world position
    var coord = panel.mapToCoord(this.mapx, this.mapy);
    this.sprite = game.add.sprite(coord.x, coord.y, 'image',  this.stand_frame);

    var style = { font: "Arial", fill: "#ffffff", stroke: '#880000',strokeThickness:3};
    this.health_text = game.add.text(coord.x, coord.y, String(this.health), style);
    

    game.physics.enable(this.sprite,Phaser.Physics.ARCADE);
    
    // constants
    this.dirs = ['left', 'right', 'up', 'down'];
    
    // animations
    for(var d in this.dirs){
        var ani = new Array(3);
        for(var i = 0; i < 3; i++)
            ani[i] = 'characters/' + type + '_' + this.dirs[d] + '_' + i;
        this.sprite.animations.add('walking_' + this.dirs[d], ani, 10, true);
    }
    
    this.dir_action = {
        'left'  : {'dx':-1, 'dy': 0, 'vx':-1, 'vy': 0, 'ani': 'walking_left', 'state': 'walking_left'},
        'right' : {'dx': 1, 'dy': 0, 'vx': 1, 'vy': 0, 'ani': 'walking_right', 'state': 'walking_right'},
        'up'    : {'dx': 0, 'dy':-1, 'vx': 0, 'vy':-1, 'ani': 'walking_up', 'state': 'walking_up'},
        'down'  : {'dx': 0, 'dy': 1, 'vx': 0, 'vy': 1, 'ani': 'walking_down', 'state': 'walking_down'}
    };
    this.dir_frames = {'left': 0, 'right': 0, 'up': 0, 'down': 0};
    
}

Character.prototype.walk = function(direction){
    var action = this.dir_action[direction];

    var gx = this.mapx + action.dx;
    var gy = this.mapy + action.dy;  
    // check boarder & map
    if(gx < 0 || gx >= this.panel.width || gy < 0 || gy >= this.panel.height
        || !this.panel.walkable(gx, gy)){
        this.standStill();
        return false;
    }

    this.goal_mapx = gx;
    this.goal_mapy = gy;       
    
    // turn
    if(this.dir_action[direction].state != this.state){
        // reset coordination
        var coord = this.panel.mapToCoord(this.mapx, this.mapy);
        this.sprite.body.x = coord.x;
        this.sprite.body.y = coord.y;
        // set velocity
        this.sprite.body.velocity.x = this.speed*action.vx;
        this.sprite.body.velocity.y = this.speed*action.vy;
        this.sprite.animations.play(action.ani);
        this.state = action.state;     
    }// else continue
    
    return true;
}

Character.prototype.putBomb = function(){
    if(panel.canPutBomb(this.mapx, this.mapy)){
        var bomb = new Bomb(panel, this.mapx, this.mapy, this.attack, this.bomb_type, this.bomb_range, this.bomb_shape);
        panel.putBomb(bomb);
        return true;
    }
    return false;
}

Character.prototype.standStill = function(){
    if(this.state == 'dead')
        return;
    var coord = this.panel.mapToCoord(this.mapx, this.mapy);

    this.goal_mapx = this.mapx;
    this.goal_mapy = this.mapy;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.x = coord.x;
    this.sprite.body.y = coord.y;
    this.sprite.animations.stop();
    this.sprite.frame = this.stand_frame;            
    this.state = 'stand';
}

Character.prototype.update = function(){
    if(this.state == 'dead')
        return;
    // update map position
    var pos_map = this.panel.coordToMap(this.sprite.body.x, this.sprite.body.y);
    this.mapx = pos_map.mapx;
    this.mapy = pos_map.mapy;


    // goal reach check
    var goal_coord = this.panel.mapToCoord(this.goal_mapx, this.goal_mapy);
    var dx = goal_coord.x - this.sprite.body.x;
    var dy = goal_coord.y - this.sprite.body.y;
    
    if(this.state == 'walking_left' && dx >= 0
    || this.state == 'walking_right' && dx <= 0
    || this.state == 'walking_up' && dy >= 0
    || this.state == 'walking_down' && dy <= 0){
        this.onReachGoal();
    }    

    // update health text
    this.health_text.x = this.sprite.body.x;
    this.health_text.y = this.sprite.body.y;
    this.health_text.text = String(Math.ceil(this.health));
}

Character.prototype.onReachGoal = function(){
    this.mapx  = this.goal_mapx;
    this.mapy = this.goal_mapy;
    this.panel.checkProp(this);
}

Character.prototype.onAttack = function(atk_val){
    this.health -= atk_val;
    // death check
    if(this.health <= 0){
        this.health = 0;
        this.onDead();
    }
}

Character.prototype.onDead = function(){
    if(this.state == 'dead')
        return;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.animations.stop();
    this.sprite.frame = this.stand_frame;                   
    
    this.state = 'dead';

    this.sprite.destroy();
    this.health_text.destroy();
    // dead effects
    var coord = this.panel.mapToCoord(this.mapx, this.mapy);    
    var emitter = game.add.emitter(coord.x + 32, coord.y + 32);
    emitter.setXSpeed(-20, 20);
    emitter.setYSpeed(-20, 20);
    emitter.setAlpha(0.1, 0.3, 50);
    var ani = Phaser.Animation.generateFrameNames('effects/effect_', 17, 24, '', 2);
    emitter.makeParticles('image', ani);
    emitter.gravity = 0;
    emitter.start(true, 2000, null, 30);
    this.emitter = emitter;
    game.time.events.add(2000, this.destroyEmitter, this);    
}

Character.prototype.destroyEmitter = function(){
    this.emitter.destroy();
}
function Player(data, panel, mapx, mapy){
    Character.call(this, data, panel, mapx, mapy, 'player');

    var input = game.input.keyboard.createCursorKeys();
    input.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    this.input = input;

    this.bomb_cd = 0;

    this.last_dir = null;
    // key events
    input.left.onDown.add(function(){
        this.last_dir = 'left';
    }, this);
    this.key_record = {'left': Infinity, 'right': Infinity, 'up': Infinity, 'down': Infinity};
}

inheritPrototype(Player, Character);

Player.prototype.onReachGoal = function(){
    Character.prototype.onReachGoal.call(this);
    var d = this.getDirectionKey();
    if(!d || !this.walk(d))
        this.standStill();
}

Player.prototype.onAttack = function(atk_val){
    Character.prototype.onAttack.call(this, atk_val);
}

Player.prototype.onDead = function(){
    Character.prototype.onDead.call(this);
    // return to level state
    
}

Player.prototype.getDirectionKey = function(){
    var min = Infinity;
    var k = null;
    for(var d in this.dirs){
        var dir = this.dirs[d];
        if(this.key_record[dir] < min){
            min = this.key_record[dir];
            k = dir;
        }
    }
    
    return k;
}

Player.prototype.update = function(){
    // key record
    for(var d in this.dirs){
        var dir = this.dirs[d];
        if(this.input[dir].isDown){
            if(isFinite(this.key_record[dir]))
                this.key_record[dir]++;
            else
                this.key_record[dir] = 0;
        }else
            this.key_record[dir] = Infinity;
    }

    // walk check
    if(this.state == 'stand'){
        var d = this.getDirectionKey();
        if(d){
            this.walk(d);
        }
            
    }

    // put bomb check
    if(this.input.spacebar.isDown){
        if(this.bomb_cd > 0){
            this.bomb_cd-=game.time.elapsed;
        }else{
            if(this.putBomb()){
                sound.play('putbomb');
            }            
            this.bomb_cd = 200;
        }
    }else{
        this.bomb_cd = 0;
    }
    Character.prototype.update.call(this);
};
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

function Bomb(panel, mapx, mapy, base_attack, type, range, shape){
    this.mapx = mapx;
    this.mapy = mapy;
    this.panel = panel;
    this.type = type;
    this.range = range;
    this.shape = shape;
    this.countdown_time = 2000;
    this.explosion_time = 500;
    this.timer = 0;
    this.area = range == 'large_bomb'?
        (shape == 'square_bomb'?
        [[0,-2],[-1,-1],[0,-1],[1,-1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[-1,1],[0,1],[1,1],[0,2]]
        :[[0,-2],[0,-1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[0,1],[0,2]])
        :(shape == 'square_bomb'?
        [[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]]
        :[[0,0], [-1,0], [1,0], [0,-1], [0,1]]);
    this.state = 'countdown';
    this.atk_ratio = type == 'laser_bomb'? 3.1 : 1.1;
    this.attack = base_attack * this.atk_ratio;
    var coord = panel.mapToCoord(this.mapx, this.mapy);

    // bomb animation
    this.sprite = game.add.sprite(coord.x, coord.y, 'image');
    this.sprite.animations.add('countdown', 
        type == 'laser_bomb'?['items/item_03','items/item_04']:['items/item_01', 'items/item_02'], 10, true);
    this.sprite.animations.play('countdown');
    // explosion effect
    this.emitter = game.add.emitter(0, 0, 500);
    this.emitter.setXSpeed(-30, 30);
    this.emitter.setYSpeed(-30, 30);
    this.emitter.setAlpha(0, 0.3, 100);
    this.emitter.autoAlpha = true;
    var ani = this.type == 'laser_bomb'?
                Phaser.Animation.generateFrameNames('effects/effect_', 9, 16, '', 2)
                :Phaser.Animation.generateFrameNames('effects/effect_', 1, 8, '', 2)
    this.emitter.makeParticles('image', ani);
    this.emitter.gravity = 0;
      
    
}

Bomb.prototype = {
    constructor : Bomb,
    isInRange : function(x, y){
        for(i in this.area){
            var mapx = this.area[i][0] + this.mapx;
            var mapy = this.area[i][1] + this.mapy;
            if(mapx == x && mapy == y)
                return true;
        }
        return false;
    },
    explosion : function(){
        this.sprite.animations.stop();
        this.sprite.destroy();
        for(i in this.area){
            var mapx = this.area[i][0] + this.mapx;
            var mapy = this.area[i][1] + this.mapy;

            // explosion effects
            var coord = panel.mapToCoord(mapx, mapy);
            this.emitter.x = coord.x + 32;
            this.emitter.y = coord.y + 32;
            this.emitter.start(true, this.explosion_time, null, 10);
        }
        sound.play('explosion');
        
        this.state = 'explosion';
    },
    finish : function(){
        this.emitter.destroy();
        this.state = 'finish';
    },
    finished : function(){
        return this.state == 'finish';
    },
    update : function(){
        this.timer += game.time.elapsed;

        // switch states
        if(this.timer >= this.countdown_time + this.explosion_time){
            if(this.state != 'finish')
                this.finish();
        }
        else if(this.timer >= this.countdown_time){
            if(this.state == 'countdown')
                this.explosion();
        }
        if(this.state == 'explosion'){
            var atk = this.attack * game.time.elapsed / this.explosion_time;
            for(i in this.area){
                var mapx = this.area[i][0] + this.mapx;
                var mapy = this.area[i][1] + this.mapy;
                // attack
                this.panel.onAttack(mapx, mapy, atk);
            }
        }
    }
}
function Panel(map){
    this.map = game.add.tilemap(map);
    this.map.addTilesetImage('tileset', 'tileset');
    this.ground_layer = this.map.createLayer('ground');
    this.props_layer = this.map.createLayer('props');
    this.blocks_layer = this.map.createLayer('blocks');
    this.character_layer = this.map.createLayer('characters');
    this.width = this.map.width;
    this.height = this.map.height;
    this.bombs = [];

    this.player = null;
    this.enemies = [];
    this.status = 'ready';

    var emitter = game.add.emitter(0, 0);
    emitter.setXSpeed(-30, 30);
    emitter.setYSpeed(-30, 30);
    emitter.setAlpha(0.1, 0.5, 50);
    emitter.setScale(0.3, 0.4, 0.3, 0.4);
    emitter.autoAlpha = true;
    var ani = Phaser.Animation.generateFrameNames('effects/effect_', 33, 48, '', 2);
    emitter.makeParticles('image', ani);
    emitter.gravity = 0;
    this.emitter = emitter;

    this.createCharacters = function(){
        var data = game.cache.getJSON('data');
        for(var y = 0; y < this.map.height; y++){
            for(var x = 0; x < this.map.width; x++){
                var tile = this.map.getTile(x, y, this.character_layer);
                if(!tile)
                    continue;
                var type = tile.properties.type;
                if(type == 'player')
                    this.player = new Player(data.player, this, x, y);
                else
                    this.enemies.push(new Enemy(data[type], this, x, y, type));
                this.map.removeTile(x, y, this.character_layer);
            }
        }
        game.world.bringToTop(this.player.sprite);
    }

    this.walkable = function(mapx, mapy){
        return this.isSlotEmpty(mapx, mapy);
    };

    this.isInside = function(mapx, mapy){
        return mapx >= 0 && mapx < this.width && mapy >= 0 && mapy < this.height;
    }
    // coordination to map x y
    this.coordToMap = function(x, y){
        var mapx = Math.round(x/64);
        var mapy = Math.round(y/64);
        if(mapx >= this.map.width)
            mapx = this.map.width - 1;
        if(mapy >= this.map.height)
            mapy = this.map.height - 1;
        return {mapx, mapy};
    };
    this.mapToCoord = function(mapx, mapy){
        var x = mapx*64;
        var y = mapy*64;
        return {x, y};
    };

    this.isSlotEmpty = function(mapx, mapy){
        if(mapx < 0 || mapx >= this.map.width || mapy < 0 || mapy >= this.map.height)
            return false;
        var i = this.blocks_layer.index;
        var tile = this.map.getTile(mapx, mapy, this.blocks_layer);
        if(tile && tile.index >= 0)
            return false;
        for(i in this.bombs){
            if(this.bombs[i].mapx == mapx && this.bombs[i].mapy == mapy)
                return false;
        }
        if(this.hasBomb(mapx, mapy))
            return false;
        return true;
    }

    this.hasBomb = function(mapx, mapy){
        for(i in this.bombs){
            if(this.bombs[i].mapx == mapx && this.bombs[i].mapy == mapy)
                return true;
        }
        return false;
    }

    this.getNearBombs = function(mapx, mapy){
        var bomb_array = [];
        for(var i in this.bombs){
            var b = this.bombs[i];
            if(b.isInRange(mapx, mapy))
                bomb_array.push(b);
        }
        return bomb_array;
    }

    this.canPutBomb = function(mapx, mapy){
        return this.isSlotEmpty(mapx, mapy);
    };

    this.putBomb = function(bomb){
        this.bombs.push(bomb);
    };

    this.checkProp = function(character){
        var cx = character.mapx;
        var cy = character.mapy;
        var prop = this.map.getTile(cx, cy, this.props_layer);
        if(!prop || !prop.properties.type)
            return false;
        switch(prop.properties.type){
        case 'health_bottle':
            character.health += 50;
            break;
        case 'speed_bottle':
            character.speed += 50;
            break;
        case 'laser_bomb':
            character.bomb_type = 'laser_bomb';
            break;
        case 'large_bomb':
            character.bomb_range = 'large_bomb';
            break;
        case 'square_bomb':
            character.bomb_shape = 'square_bomb';
            break;  
        }
        this.map.removeTile(cx, cy, this.props_layer);
        // prop effects
        var coord = this.mapToCoord(cx, cy);     
        this.emitter.x = coord.x + 32;
        this.emitter.y = coord.y + 32;
        emitter.start(true, 1000, null, 50);
        // play sound
        sound.play('getprop');

    }

    this.getProps = function(){
        var props = [];
        for(var y = 0; y < this.map.height; y++){
            for(var x = 0; x < this.map.width; x++){
                var prop = this.map.getTile(x, y, this.props_layer);
                if(prop){
                    props.push({'x':x, 'y':y, 'type': prop.properties.type});
                }
            }
        }
        return props;
    }

    this.getBlockHealth = function(mapx, mapy){
        var block = this.map.getTile(mapx, mapy, this.blocks_layer);
        if(!block)
            return null;
        var health = Number(block.properties.health);
        return health;
    }

    this.getBlockType = function(mapx, mapy){
        var block = this.map.getTile(mapx, mapy, this.blocks_layer);
        if(!block)
            return null;
        var type = block.properties.type;
        return type;
    }

    this.onAttack = function(mapx, mapy, atk_val){
        // attack blocks
        var block = this.map.getTile(mapx, mapy, this.blocks_layer);
        if(block && 'health' in block.properties){
            block.properties.health = Number(block.properties.health) - atk_val;
            if(block.properties.health <= 0)
                this.destroyBlock(block);
        }
        // attack player
        if(this.player.mapx == mapx && this.player.mapy == mapy){
            this.player.onAttack(atk_val);
        }
        // Enemy attack
        for(var i in this.enemies){
            var e = this.enemies[i];
            if(e.mapx == mapx && e.mapy == mapy)
                e.onAttack(atk_val);
        }
    };
    this.destroyBlock = function(block){
        this.map.removeTile(block.x, block.y, this.blocks_layer);
        var coord = this.mapToCoord(block.x, block.y);    
        // destroy effects
        var emitter = game.add.emitter(coord.x + 32, coord.y + 32);
        emitter.setXSpeed(-30, 30);
        emitter.setYSpeed(-30, 30);
        emitter.setAlpha(0.1, 0.5, 50);
        emitter.autoAlpha = true;
        var ani = Phaser.Animation.generateFrameNames('effects/effect_', 25, 32, '', 2);
        emitter.makeParticles('image', ani);
        emitter.gravity = 0;
        emitter.start(true, 1000, null, 30);
    };

    this.toArray = function(){
        var arr = new Array(this.map.height);
        for(var y = 0; y < this.map.height; y++){
            arr[y] = new Array(this.map.width);
            for(var x = 0; x < this.map.width; x++){
                var block = this.map.getTile(x, y, this.blocks_layer);
                if(block){
                    if('health' in block.properties)
                        arr[y][x] = Number(block.properties.health);
                    else
                        arr[y][x] = Infinity;   // unbreakable
                }else{
                    arr[y][x] = 0;
                }
            }
        }
        return arr;
    }

    this.walkableArray = function(){
        var arr = this.toArray();
        for(var i in this.bombs){
            var b = this.bombs[i];
            for(var a in b.area){
                var x = b.mapx + b.area[a][0];
                var y = b.mapy + b.area[a][1];
                if(x < 0 || x >= this.width || y < 0 || y >= this.height)
                    continue;
                arr[y][x] += b.attack;
            }
            arr[b.mapy][b.mapx] += b.attack;
        }
        return arr;
    }

    this.update = function(){
        if(this.status != 'playing')
            return;

        var valid_bombs = [];
        for(i in this.bombs){
            var bomb = this.bombs[i];
            bomb.update();
            //clear finished bombs
            if(!bomb.finished()){
                valid_bombs.push(bomb);
            }
        }
        this.bombs = valid_bombs;

        // update characters
        if(this.player)
            this.player.update();
        // failure check
        if(this.player.state == 'dead'){
            this.status = 'failed';
            return;
        }
             
        // remove dead bodies
        var alive_enemies = [];
        for(var e in this.enemies){
            if(this.enemies[e].state != 'dead'){
                this.enemies[e].update();
                alive_enemies.push(this.enemies[e]);
            }
        }
        this.enemies = alive_enemies;
        // victory check
        if(this.enemies.length == 0){
            this.status = 'victory';
            return;
        }
    }
}
