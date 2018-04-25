window.onload = function(){
  var game = new Phaser.Game(360, 600, Phaser.CANVAS, '');
  game.state.add("menu",menuState,true);
  game.state.add("main",mainState);
};

var menuState = function(game){
  this.init = function(){
    if(!this.game.device.desktop){
      this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    }
    this.game.scoreBest = this.game.scoreBest || 0;
    this.game.playerStyle = this.game.playerStyle || 0;
    this.playerArr = [];
  };
  this.preload = function(){
    this.load.image("back", "./assets/back.png");
    this.load.spritesheet("plate", "./assets/plates.png",64,40);
    this.load.spritesheet("player", "./assets/players.png",36,64);
    this.load.spritesheet("button", "./assets/buttons.png",80,40);
  };
  this.create = function(){
    var back = this.game.add.sprite(0,0,"back");
    back.scale.set(this.game.width/160,this.game.height/280);

    var box = this.game.add.sprite(this.game.width/2, this.game.height/2, "button", 3);
    box.anchor.set(0.5);
    box.scale.set(this.game.width/80,4);
    this.game.add.tween(box).from({alpha:0},300,"Linear",true);

    var btn = this.game.add.sprite(this.game.width/2, this.game.height/2, "button", 0);
    btn.anchor.set(0.5);
    this.game.add.tween(btn).from({alpha:0},300,"Linear",true).onComplete.add(function(obj){
      obj.inputEnabled = true;
      obj.events.onInputDown.add(function(){
        this.game.state.start("main");
      },this);
    },this);

    this.playerArr = [
      this.game.add.sprite(this.game.width/2, 120, "player", 0),
      this.game.add.sprite(this.game.width/2, 120, "player", 1),
      this.game.add.sprite(this.game.width/2, 120, "player", 2)
    ];
    this.playerArr[0].anchor.set(0.5);
    this.playerArr[0].alpha=0;
    this.playerArr[1].anchor.set(0.5);
    this.playerArr[1].alpha=0;
    this.playerArr[2].anchor.set(0.5);
    this.playerArr[2].alpha=0;
    this.playerArr[this.game.playerStyle].alpha=1;

    var btn1 = this.game.add.sprite(this.game.width/2-100, 120, "button", 4);
    btn1.anchor.set(0.5);
    btn1.inputEnabled = true;
    btn1.events.onInputDown.add(function(){
      this._setPlayer(-1);
    },this);
    var btn2 = this.game.add.sprite(this.game.width/2+100, 120, "button", 5);
    btn2.anchor.set(0.5);
    btn2.inputEnabled = true;
    btn2.events.onInputDown.add(function(){
      this._setPlayer(1);
    },this);
  };
  this._setPlayer = function(go){

    this.playerArr[this.game.playerStyle].alpha = 1;
    this.playerArr[this.game.playerStyle].x = this.game.width/2;
    this.game.add.tween(this.playerArr[this.game.playerStyle]).to({alpha:0,x:this.game.width/2+go*50},200,"Linear",true);

    this.game.playerStyle = (((this.game.playerStyle + go) % 3) + 3) % 3;

    this.playerArr[this.game.playerStyle].alpha = 1;
    this.playerArr[this.game.playerStyle].x = this.game.width/2;
    this.game.add.tween(this.playerArr[this.game.playerStyle]).from({alpha:0,x:this.game.width/2-go*50},200,"Linear",true);
  };
};

var mainState = function(game){
  var group, player, effect, scoreText;
  var midX, midY;

  var moving; // 用于记录tween动画状态
  var twWait;
  var twDone;

  var holding;  // 用于记录鼠标按下状态
  var holdTime; // 用于记录鼠标按下时间

  this.pArr = [17,15,12,10,15,13,8]; // 各种类型平台宽度，与平台spritesheet各帧对应
  this.init = function(){
    midX = this.game.width/2;
    midY = this.game.height/2;

    moving = true;
    twWait = 0;
    twDone = 0;

    holding = false;
    holdTime = 0;

    this.lastX = 40;// 最后一次的距离、方向、平台类型
    this.lastY = 20;
    this.lastD = 1;
    this.lastP = 0;

    this.score = 0;
    this.bonus = 0;
    this.playerStyle = this.game.playerStyle; // 角色样式，对应帧号
  };
  this.create = function(){
    var back = this.game.add.sprite(0,0,"back");
    back.scale.set(this.game.width/160,this.game.height/280);

    group = this.game.add.group();
    this.plate1 = group.create(midX-this.lastX, midY+this.lastY, "plate", 0);
    this.plate1.anchor.set(0.5,0.4);
    // 连环tween
    this.game.add.tween(this.plate1).from({y:this.plate1.y-50,alpha:0},200,"Linear",true).onComplete.add(function(){
      this.plate2 = group.create(midX+this.lastX, midY-this.lastY, "plate", 0);
      this.plate2.anchor.set(0.5,0.4);
      this.plate2.sendToBack();
      this.game.add.tween(this.plate2).from({y:this.plate2.y-50,alpha:0},200,"Linear",true).onComplete.add(function(){
        effect = group.create(0, 0, "plate", 7); 
        effect.anchor.set(0.5,0.4);
        effect.visible = false; 

        player = group.create(midX-this.lastX, midY+this.lastY); // 外壳
        // 身体
        player.b = player.addChild(this.game.add.sprite(0, 0, "player", this.playerStyle));
        player.b.anchor.set(0.5,0.875);
        player.b.animations.add("delay",[this.playerStyle],10,false);
        // 加分提示文本
        player.txt = player.addChild(this.game.add.text(0, -30, "", {fontSize:"16px", fill:"#fff"}));
        player.txt.anchor.set(0.5);

        this.game.add.tween(player).from({y:player.y-50,alpha:0},200,"Linear",true).onComplete.add(function(){
          moving = false;
        },this);
      },this);
    },this);

    scoreText = this.game.add.text(midX, 80, "0", {fontSize:"48px", fill:"#999"});  
    scoreText.anchor.set(0.5);

    this.game.input.onDown.add(function(){if(!moving && !holding){holding=true;holdTime=this.game.time.now;}},this);
    this.game.input.onUp.add(this._jump,this);
  };
  this.update = function(){
    if(twWait>0 && twDone==twWait){
      twWait = 0;
      twDone = 0;
      moving = false;
    }
    if(holding){ // 储力效果，简单的缩短
      var power = Math.floor((this.game.time.now - holdTime) / 8); // 计算力度
      player.scale.y = 1 - (power>200 ? 0.3 : 0.3 * power / 200);
    }
  };
  this._jump = function(){
    if(!moving && holding){
      moving = true;
      holding = false;
      player.scale.y = 1;
      var power = Math.floor((this.game.time.now - holdTime) / 8) & 0x1FE; // 计算力度（和0x1FE进行与运算，限制数值最大为510，且保持偶数）
      var jumpX = midX-this.lastX+this.lastD*power;
      var jumpY = midY+this.lastY-power/2;
      // *** 跳跃效果 ***
      var jumpTime = 300; // 跳跃动作时长
      // 外壳直线位移至目的地
      this.game.add.tween(player).to({x:jumpX, y:jumpY},jumpTime,"Linear",true).onComplete.add(function(obj){
        if(this._checkScore()){  // 检测得分，要么创建新平台，要么掉落gameover
          obj.b.animations.play("delay",10).onComplete.addOnce(this._newPlate,this); // 这里用帧动画实现停顿效果（帧速10代表停顿十分之一秒）
        }else{
          obj.b.animations.play("delay",10).onComplete.addOnce(this._fall,this);
        }
      },this);
      // 身体只做跳跃动作即可
      player.b.y = -40; 
      player.b.angle = -this.lastD * 150;
      this.game.add.tween(player.b).to({angle:-this.lastD*90, x:this.lastD*20, y:-80}, jumpTime/2, Phaser.Easing.Quadratic.Out, true).onComplete.add(function(obj,tw,time){
        this.game.add.tween(obj).to({angle:0,x:0,y:0},time/2,Phaser.Easing.Quadratic.In,true);
      },this,0,jumpTime);
      // ******
    }
  };
  this._checkScore = function(){
    // 检测是否跳中目标，比较player和plate2的位置，返回true或false，同时播放得分提示和光效
    if(Math.abs(player.x-this.plate2.x)<=this.pArr[this.lastP]){   // 跳中位置...
      var addScore = 1;
      if(Math.abs(player.x-this.plate2.x)<=3){ // 3像素以内，以2分递增，播放光效
        this.bonus += 2; 
        addScore = this.bonus;
        effect.reset(this.plate2.x,this.plate2.y);
        effect.scale.set(0.5);
        effect.visible = true;
        effect.alpha=1;
        this.game.add.tween(effect.scale).to({x:3,y:3},800,Phaser.Easing.Cubic.Out,true);
        this.game.add.tween(effect).to({alpha:0},800,Phaser.Easing.Cubic.Out,true).onComplete.add(function(obj){obj.visible = false;},this);
      }else{
        this.bonus = 0;
      }
      this.score += addScore;
      scoreText.text = this.score;
      // 加分效果
      player.txt.reset(0,-30);
      player.txt.text = addScore; 
      player.txt.alpha = 1; 
      this.game.add.tween(player.txt).to({y:player.txt.y-50,alpha:0},800,"Linear",true).onComplete.add(function(txt){txt.kill();},this);
      return true;
    }else{
      return false;
    }
  };
  this._fall = function(){
    var ww = 12; // player身体的半宽，用于检测是否碰到边
    player.sendToBack();
    if(player.y>this.plate2.y){this.plate2.sendToBack();}

    if(Math.abs(player.x-this.plate2.x)-this.pArr[this.lastP] < ww){  // 碰到部分,倾斜
      player.angle = (player.y<this.plate2.y && this.lastD>0) || (player.y>this.plate2.y && this.lastD<0) ? 30 : -30;  // 左倾斜或是右倾斜
    }
    this.game.add.tween(player).to({y:player.y+100,alpha:0},500,"Linear",true).onComplete.add(function(){
      this._overMenu();
    },this);
  };
  this._newPlate = function(sprite,anim){
    var newRange = this.game.rnd.integerInRange(10, 50); // 随机生成一个距离
    var newD = this.game.rnd.sign();   // 随机方向（-1:左，1:右）
    var newX = newD * newRange*2;    // 计算新平台的相对于上一个平台的X位置
    var newY = newRange;           // 计算新平台的相对于上一个平台的Y位置
    this.lastP = this.game.rnd.between(0,6); // 随机平台类型（对应平台的spritesheet中随机一个帧）
    this.plate2 = group.getFirstDead(true, midX+this.lastX+newX*2, midY-this.lastY-newY*2, "plate", this.lastP);
    this.plate2.anchor.set(0.5,0.4);
    this.plate2.sendToBack();
    this.game.add.tween(this.plate2).from({alpha:0},200,"Linear",true);
    group.forEachAlive(this._tween,this,newX,newY); // 整体往后移
    this.lastX=newX;
    this.lastY=newY;
    this.lastD=newD;
  };
  this._tween = function(plate,newX,newY){
    twWait ++;
    this.game.add.tween(plate).to({x:plate.x-this.lastX-newX,y:plate.y+this.lastY+newY},300,"Linear",true).onComplete.add(function(plate){
      twDone++;
      if(!plate.inWorld && plate!=player){plate.kill();}
    },this);
  };
  this._overMenu = function(){
    var box = this.game.add.sprite(midX, midY, "button", 3);
    box.anchor.set(0.5);
    box.scale.set(this.game.width/80,4);

    var btn = this.game.add.sprite(midX+50, midY, "button", 1);
    btn.anchor.set(0.5);
    btn.inputEnabled = true;
    btn.events.onInputDown.add(function(){
      this.game.state.start("main");
    },this);

    var btn = this.game.add.sprite(midX-50, midY, "button", 2);
    btn.anchor.set(0.5);
    btn.inputEnabled = true;
    btn.events.onInputDown.add(function(){
      this.game.state.start("menu");
    },this);

    this.game.scoreBest = this.score>this.game.scoreBest?this.score:this.game.scoreBest;
    this.game.add.text(midX, midY+50, "Best : " + this.game.scoreBest, {fontSize:"16px", fill:"#fff"}).anchor.set(0.5);
  };
};
