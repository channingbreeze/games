;(function () {
    var game = new Phaser.Game(640, 480, Phaser.AUTO, "screen");
  
    var RandomDungeon = {
        create: function() { 
            game.physics.startSystem(Phaser.Physics.ARCADE);
            
            this.cursors = this.game.input.keyboard.createCursorKeys();
            
            this.walls = game.add.group();
            this.walls.enableBody = true;
            
            this.floors = game.add.group();
            
            this.room_max_size = 10;
            this.room_min_size = 5;
            this.max_rooms = 7;
            
            this.lastRoomCenter = {x: 0, y: 0};
            this.num_rooms = 0;
            this.num_tiles = 0;
            
            this.player = {};
            
            this.makeMap();
            
            this.player = game.add.sprite(this.player.x, this.player.y, "player");
            this.player.anchor.setTo(0.5);
            game.physics.arcade.enable(this.player);
            this.player.body.setSize(13, 13);
        },
        
        getRandom: function(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        
        Room: function(x, y, w, h) {
            this.x1 = x;
            this.y1 = y;
            this.x2 = x + w;
            this.y2 = y + h;
            
            var center_x = (this.x1 + this.x2) / 2;
            var center_y = (this.y1 + this.y2) / 2;
            this.center_coords = {x: center_x, y: center_y};
        },
        
        createFloor: function(x, y) {
            fl = this.floors.create(x, y, "floor");
            game.physics.arcade.enable(fl);
            game.physics.arcade.overlap(fl, this.walls, function(floor, wall) {
                wall.destroy();
            });
        },
        
        createRoom: function(x1, x2, y1, y2) {
            for (var x = x1; x<x2; x+=16) {
                for (var y = y1; y<y2; y+=16) {
                    this.createFloor(x, y);
                }
            }
        },
        
        createHTunnel: function(x1, x2, y) {
            var min = Math.min(x1, x2);
            var max = Math.max(x1, x2);
            for (var x = min; x<max+8; x+=8) {
                this.createFloor(x, y);
            }
        },
        
        createVTunnel: function(y1, y2, x) {
            var min = Math.min(y1, y2);
            var max = Math.max(y1, y2);
            for (var y = min; y<max+8; y+=8) {
                this.createFloor(x, y);
            }
        },
        
        makeMap: function() {
            for (var y=0; y<game.world.height; y+= 16) {
                for (var x=0; x<game.world.width; x+=16) {
                    var wall = this.walls.create(x, y, "wall");
                    wall.body.immovable = true;
                }
            }
            
            for (var r=0; r<this.max_rooms; r++) {
                var w = this.getRandom(this.room_min_size, this.room_max_size) * 16;
                var h = this.getRandom(this.room_min_size, this.room_max_size) * 16;
                
                x = this.getRandom(1, ((game.world.width) / 16) - (w/16 + 1)) * 16;
                y = this.getRandom(1, ((game.world.height) / 16) - (w/16 + 1)) * 16;
                                
                this.createRoom(x, x+w, y, y+h);
                
                if (this.num_rooms == 0) {                
                    this.player.x = x + (w/2);
                    this.player.y = y + (h/2);
                } else {
                    var new_x = this.math.snapToFloor(x + (w/2), 16);
                    var new_y = this.math.snapToFloor(y + (h/2), 16);
                    
                    var prev_x = this.math.snapToFloor(this.lastRoomCoords.x, 16);
                    var prev_y = this.math.snapToFloor(this.lastRoomCoords.y, 16);
                    
                    this.createHTunnel(prev_x, new_x, prev_y, prev_y);
                    this.createVTunnel(prev_y, new_y, new_x);
                }
                
                this.lastRoomCoords = { x: x + (w/2), y: y + (h/2) };
                this.num_rooms++;
            }
        },
        
        update: function() {                        
            game.physics.arcade.collide(this.player, this.walls);
            
            if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -175;
            } else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = 175;
            } else {
                this.player.body.velocity.x = 0;
            }
            
            if (this.cursors.up.isDown) {
                this.player.body.velocity.y = -175;
            } else if (this.cursors.down.isDown) {
                this.player.body.velocity.y = 175;
            } else {
                this.player.body.velocity.y = 0;
            }
        }
    };
    
    var LoadState = {
        preload: function() {
            var loadingLabel = game.add.text(80, 150, "Loading...", {font: "30px Arial", fill: "#fff"});

            game.load.image("player", "./assets/player.png");
            game.load.image("wall", "./assets/wall.png");
            game.load.image("floor", "./assets/floor.png");
        },

        create: function() {
            game.state.start("Game");
        }
    };
    
    game.state.add("Load", LoadState);
    game.state.add("Game", RandomDungeon);
    
    game.state.start("Load");
})();