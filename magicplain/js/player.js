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