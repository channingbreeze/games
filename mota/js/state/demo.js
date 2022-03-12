/*
 * This file is automatically loaded from state/load.js
 * to change default state - change state/load.js at line: 34
 */
"use strict";
var that;
window.NewGame.state.demo = {
	init: function(){
		
		this.monsterInfo={				//怪物信息
			kulou:{hp:100,gj:10,fy:5,jy:5,jb:5},
			bigbianfu:{hp:80,gj:8,fy:3,jy:3,jb:3},
			bianfu:{hp:50,gj:3,fy:1,jy:1,jb:1},
			kulouduizhang:{hp:150,gj:8,fy:7,jy:7,jb:7},
			bigslime:{hp:330,gj:10,fy:2,jy:10,jb:7},
			wushi:{hp:250,gj:15,fy:5,jy:12,jb:10},
			shitouren:{hp:500,gj:15,fy:10,jy:20,jb:15},
			xixuegui:{hp:2000,gj:100,fy:50,jy:100,jb:100}
		};
		this.propInfo={					//道具信息
			ykey:{hp:0,gj:0,fy:0,jy:0,jb:0,ykey:1,bkey:0,rkey:0},						//16
			bkey:{hp:0,gj:0,fy:0,jy:0,jb:0,ykey:0,bkey:1,rkey:0},						//17
			rkey:{hp:0,gj:0,fy:0,jy:0,jb:0,ykey:0,bkey:0,rkey:1},						//18
			rpotion:{hp:25,gj:0,fy:0,jy:0,jb:0,ykey:0,bkey:0,rkey:0},					//4
			bpotion:{hp:50,gj:0,fy:0,jy:0,jb:0,ykey:0,bkey:0,rkey:0},					//5
			rgem:{hp:0,gj:1,fy:0,jy:0,jb:0,ykey:0,bkey:0,rkey:0},						//0
			bgem:{hp:0,gj:0,fy:1,jy:0,jb:0,ykey:0,bkey:0,rkey:0},						//1
			tiejian:{hp:0,gj:10,fy:0,jy:0,jb:0,ykey:0,bkey:0,rkey:0},						//0
			tiedun:{hp:0,gj:0,fy:10,jy:0,jb:0,ykey:0,bkey:0,rkey:0},						//1
			allup:{hp:1000,gj:100,fy:100,jy:0,jb:0,ykey:0,bkey:0,rkey:0},						//1
			allkey:{hp:0,gj:0,fy:0,jy:0,jb:0,ykey:1,bkey:1,rkey:1}						//1
		};
		console.log(this.propInfo);
		console.log(this.monsterInfo);
	},
	create: function() {
		window.level=1;
        this.tiles1 = mt.create("tiles"+window.level);
        this.tiles2 = mt.create("tiles2");
        this.tiles3 = mt.create("tiles3");
        this.tiles4 = mt.create("tiles4");
		this.door = mt.create('door');
		window.prop=this.prop = mt.create('prop');
		this.up_floor = mt.create('up_floor');
		this.down_floor = mt.create('down_floor');
		window.up=false;
		window.down=false;
		window.monster=this.monster = mt.create('monster');
        //this.tiles1.debug = true;
        this.tiles1.map.setCollision(1);
		//this.tiles2.debug = true;
        this.tiles2.map.setCollision(1);
		//this.tiles3.debug = true;
        this.tiles3.map.setCollision(1);
		//this.tiles4.debug = true;
        this.tiles4.map.setCollision(1);
		
        this.player = mt.create("player");
		//添加精灵动画
		this.player.animations.add('down',[0,1,2,3],10,true);
		this.player.animations.add('left',[4,5,6,7],10,true);
		this.player.animations.add('right',[8,9,10,11],10,true);
		this.player.animations.add('up',[12,13,14,15],10,true);
		this.player.mstr='';							//怪物相遇初始化 相遇则标记怪物名称
		this.player.pstr='';
		this.player.info={								//玩家信息
			hp:1000,								
			gj:10,									
			fy:5,									
			jy:0,
			jb:0,
			ykey:0,
			bkey:0,
			rkey:0
 		};

		this.info = mt.create('info');
		
        this.cursors = this.game.input.keyboard.createCursorKeys();
		this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		
		that = this;
		
    },


    update: function() {//{}[]
		
        this.game.physics.arcade.collide(this.player, this.tiles1);									//碰撞检测
        this.game.physics.arcade.collide(this.player, this.tiles2);
        this.game.physics.arcade.collide(this.player, this.tiles3);
        this.game.physics.arcade.collide(this.player, this.tiles4);
		
		
        this.game.physics.arcade.collide(this.player, this.npc);
		//////////////////////////////////
		if(this.up_floor){
			this.game.physics.arcade.collide(this.player, this.up_floor,function(player,up_floor){
				window.level++;
				window.up=true;
			});
		}
		if(window.up){
			//添加到tiles组里面 获取即 tiles.getChildAt(level)
			//怪物等组添加进组
			if(window.level==2){
				this.tiles1.x=416;
				this.tiles2.x=0;
				this.monster.x=-416;
				this.prop.x=-416;
				this.door.x=-416;
				this.up_floor.x=190;
				this.up_floor.y=64;
				this.down_floor.x=0;
				this.down_floor.y=0;
				this.player.x=32;
				this.player.y=0;
			}
			if(window.level==3){
				this.tiles1.x=832;
				this.tiles2.x=416;
				this.tiles3.x=0;
				this.monster.x=-832;
				this.prop.x=-832;
				this.door.x=-832;
				this.up_floor.x=190;
				this.up_floor.y=160;
				this.down_floor.x=384;
				this.down_floor.y=384;
				this.player.x=384;
				this.player.y=352;
			}
			if(window.level==4){
				this.tiles1.x=1248;
				this.tiles2.x=832;
				this.tiles3.x=416;
				this.tiles4.x=0;
				this.monster.x=-1248;
				this.prop.x=-1248;
				this.door.x=-1248;
				this.up_floor.x=-190;
				this.up_floor.y=-160;
				this.down_floor.x=1440-1248;
				this.down_floor.y=384;
				this.player.x=1440-1248;
				this.player.y=384-32;
				this.player.frame = 0;
			}
			window.up=false;
		}
		///////////////////////////////
		if(this.down_floor){
			this.game.physics.arcade.collide(this.player, this.down_floor,function(player,down_floor){
				if(window.level>1)window.level--,window.down=true;
			});
		}
		if(window.down){
			//添加到tiles组里面 获取即 tiles.getChildAt(level)
			
			if(window.level==1){
				this.tiles1.x=0;
				this.tiles2.x=416;
				this.monster.x=0;
				this.prop.x=0;
				this.door.x=0;
				this.up_floor.x=190;
				this.up_floor.y=160;
				this.down_floor.x=-32;
				this.down_floor.y=-32;
				this.player.x=158;
				this.player.y=160;
			}
			if(window.level==2){
				this.tiles1.x=416;
				this.tiles2.x=0;
				this.tiles3.x=832;
				this.monster.x=-416;
				this.prop.x=-416;
				this.door.x=-416;
				this.up_floor.x=190;
				this.up_floor.y=64;
				this.down_floor.x=0;
				this.down_floor.y=0;
				this.player.x=158;
				this.player.y=64;
			}
			if(window.level==3){
				this.tiles1.x=832;
				this.tiles2.x=416;
				this.tiles3.x=0;
				this.tiles4.x=1248;
				this.monster.x=-832;
				this.prop.x=-832;
				this.door.x=-832;
				this.up_floor.x=190;
				this.up_floor.y=160;
				this.down_floor.x=384;
				this.down_floor.y=384;
				this.player.x=222;
				this.player.y=160;
			}
			window.down=false;
		}
		///////////////////////////////
		if(this.monster){
			this.game.physics.arcade.collide(this.player, this.monster.self,function(player,monster){
				console.log(monster.frame);
				if(monster.frame===0)player.mstr="kulou";
				if(monster.frame===4)player.mstr="kulouduizhang";
				if(monster.frame===56)player.mstr="wushi";												//与怪物相遇
				if(monster.frame==16)player.mstr="bianfu";												//与怪物相遇
				if(monster.frame==20)player.mstr="bigbianfu";
				if(monster.frame==40)player.mstr="bigslime";
				if(monster.frame==72)player.mstr="shitouren";
				if(monster.frame==28)player.mstr="xixuegui";
				if(that.player.mstr!==''){															//玩家生命值减掉怪物伤害值																//与怪物相遇触发战斗
					var hert=0;																				//伤害值初始化
					var times = Math.floor(that.monsterInfo[that.player.mstr].hp/(that.player.info.gj-that.monsterInfo[that.player.mstr].fy));//怪物进攻次数
					if(that.monsterInfo[that.player.mstr].gj>that.player.info.fy){						//怪物攻击力大于玩家防御力
						hert = times * (that.monsterInfo[that.player.mstr].gj-that.player.info.fy);
					}else{
						hert=0;
					}
					that.player.info.hp-=hert;
					if(that.player.info.hp>0){
						monster.kill();
						if(that.player.mstr=='xixuegui'){
							that.door.children.forEach(function(v,i){
								if(v.frame==6){
									v.kill();
								}
							});
						}
						that.player.info.jy+=that.monsterInfo[that.player.mstr].jy;
						that.player.info.jb+=that.monsterInfo[that.player.mstr].jb;
					}else{
						that.player.info.hp += hert;
						that.player.mstr='';//与怪物相遇初始化
					}
					console.log(that.player.mster);
																						
				}
			});
		}
		//////////////////////////////
		if(this.prop){
			this.game.physics.arcade.overlap(this.player, this.prop.self,function(player,prop){
				//console.log(prop.frame);
				if(prop.frame==16)player.pstr="ykey";
				if(prop.frame==17)player.pstr="bkey";
				if(prop.frame==18)player.pstr="rkey";
				if(prop.frame==4)player.pstr="rpotion";
				if(prop.frame==5)player.pstr="bpotion";
				if(prop.frame===0)player.pstr="rgem";
				if(prop.frame==1)player.pstr="bgem";
				if(prop.frame==48)player.pstr="tiejian";
				if(prop.frame==56)player.pstr="tiedun";
				if(prop.frame==8)player.pstr="allup";
				if(prop.frame==22)player.pstr="allkey";
				prop.kill();
			});
			if(this.player.pstr!==''){
				this.player.info.hp+=this.propInfo[this.player.pstr].hp;
				this.player.info.gj+=this.propInfo[this.player.pstr].gj;
				this.player.info.fy+=this.propInfo[this.player.pstr].fy;
				this.player.info.jy+=this.propInfo[this.player.pstr].jy;
				this.player.info.jb+=this.propInfo[this.player.pstr].jb;
				this.player.info.ykey+=this.propInfo[this.player.pstr].ykey;
				this.player.info.bkey+=this.propInfo[this.player.pstr].bkey;
				this.player.info.rkey+=this.propInfo[this.player.pstr].rkey;
				this.player.pstr='';		
				console.log(this.player.info);
			}
		}
		//////////////////////////////
		if(this.door){
			this.game.physics.arcade.collide(this.player, this.door,function(player,door){
				if(door.frame==3)if(player.info.ykey>0)player.info.ykey--,door.kill();
				if(door.frame==4)if(player.info.bkey>0)player.info.bkey--,door.kill();
				if(door.frame==5)if(player.info.rkey>0)player.info.rkey--,door.kill();
				console.log(door.frame);
			});
		}
		////////////////////////////////

 		if(this.player.info.hp>0){
			this.info.mt.children.hp.text='hp:'+this.player.info.hp;
			this.info.mt.children.gj.text='gj:'+this.player.info.gj;
			this.info.mt.children.fy.text='fy:'+this.player.info.fy;
			this.info.mt.children.jy.text='jy:'+this.player.info.jy;
			this.info.mt.children.jb.text='jb:'+this.player.info.jb;
			this.info.mt.children.ykey.text='ykey:'+this.player.info.ykey;
			this.info.mt.children.bkey.text='bkey:'+this.player.info.bkey;
			this.info.mt.children.rkey.text='rkey:'+this.player.info.rkey;
 		}
		
		//玩家移动
        if (this.cursors.up.isDown || this.wKey.isDown)
            this.player.body.velocity.y = -200,
            //this.player.body.velocity.x = 0,
			this.player.animations.play('up');
        else if (this.cursors.down.isDown || this.sKey.isDown)
            //this.player.body.velocity.x = 0,
            this.player.body.velocity.y = 200,
			this.player.animations.play('down');
        else if (this.cursors.right.isDown || this.dKey.isDown)
            this.player.body.velocity.x = 200,
            //this.player.body.velocity.y = 0,
			this.player.animations.play('right');
        else if (this.cursors.left.isDown || this.aKey.isDown)
            this.player.body.velocity.x = -200,
            //this.player.body.velocity.y = 0,
			this.player.animations.play('left');
        else this.player.body.velocity.x = 0,
			this.player.body.velocity.y = 0,
			this.player.animations.stop();
    }
};


































// 			战斗次数：怪物生命÷（勇士攻击－怪物防御)[注：舍小数点取整数]
// 			损失计算：战斗次数×（怪物攻击－勇士防御）

//  606\128
//190\160