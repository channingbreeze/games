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