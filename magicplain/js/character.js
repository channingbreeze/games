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