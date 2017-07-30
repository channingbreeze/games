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