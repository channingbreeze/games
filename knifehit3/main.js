//ver 1.2
var game;
var gameOptions={

	// 设置旋转速度，即每一帧转动的角度
	rotationSpeed: 3, 
	// 刀飞出去的速度, 即一秒中内移动像素
	throwSpeed: 150,
	//v1.1新增 两把刀之前的最小角度(约束角度)
	minAngle: 15,

    //v1.2新增 最大转动的变化量，即每一帧上限
    rotationVariation: 2,
    //v1.2新增 下一秒的变化速度
    changeTime: 2000,
    //v1.2新增 最大旋转速度
    maxRotationSpeed: 6
}

// 窗口第一次加载...
window.onload = function(){
	// 游戏的参数设置
	var gameConfig={
		type: Phaser.CANVAS,
		width: 750,
		height: 1334,
		backgroundColor: 0x444444,
		scene: [playGame]
	};
	game = new Phaser.Game(gameConfig);
	window.focus();//获得窗口焦点
	resize();//调整窗口
	window.addEventListener("resize",resize,false);
}
class playGame extends Phaser.Scene{

	constructor(){
		super("playGame");
	}
	// 预加载
	preload(){

		// 加载各种资源
		this.load.image("target","assets/target.png");
		this.load.image("knife","assets/knife.png");

	}
	// 游戏开始运行
	create(){
		 //v1.2 在游戏一开始设置转动的速度与一致，即默认值
        this.currentRotationSpeed = gameOptions.rotationSpeed;
        this.newRotationSpeed = gameOptions.rotationSpeed;

		// 在游戏开始时设置可以扔刀
		this.canThrow = true;

		// 将旋转的刀组成一个组
		this.knifeGroup=this.add.group();


		// 加载刀和圆木
		this.knife = this.add.sprite(game.config.width/2, game.config.height/5*4,"knife");
		this.target = this.add.sprite(game.config.width/2,400,"target");

 		// 将圆木放在第一层,即最上层
		this.target.depth = 1;

		// 点击后飞出刀
		this.input.on("pointerdown", this.throwKnife, this);

        //v1.2 创建循环的时间事件
        var timedEvent = this.time.addEvent({
            delay: gameOptions.changeTime,
            callback: this.changeSpeed,
            callbackScope: this,
            loop: true
        });
	}

	//v1.2 圆木的旋转速度
    changeSpeed(){

        //v1.2 产生一个随机旋转方向，即+1或-1
        var sign = Phaser.Math.Between(0, 1) == 0 ? -1 : 1;

        //v1.2 产生一个随机数据范围在[-游戏设置变量，游戏设置变量]
        var variation = Phaser.Math.FloatBetween(-gameOptions.rotationVariation, gameOptions.rotationVariation);

        //v1.2 产生一个新的旋转的速度
        this.newRotationSpeed = (this.currentRotationSpeed + variation) * sign;

        //v1.2 设置一个新的限制速度
        this.newRotationSpeed = Phaser.Math.Clamp(this.newRotationSpeed, -gameOptions.maxRotationSpeed, gameOptions.maxRotationSpeed);
    }

	// 飞出刀动作
	throwKnife(){

		// 检查是否要飞出
		if(this.canThrow){
			
			this.canThrow = false;

			// 飞刀的补间动画
			this.tweens.add({
				// 刀
				targets:[this.knife],
				// 到达的位置
				y: this.target.y+this.target.width/2,

				 // 补间速度
				duration: gameOptions.throwSpeed,

				// 回传范围
				callbackScope: this,

				 // 执行后的回调函数
				onComplete: function(tween){

					//v1.1 新增 合法飞出参数
					var legalHit = true;
					//v1.1 新增 已经在圆木上刀成员
					var children = this.knifeGroup.getChildren();
					//v1.1 对于在圆木上的每一把刀设置约束角度
                    for (var i=0; i<children.length; i++){
 
                        //v1.1 判断当前飞刀与圆木上的刀是否在约束范围之内
                        if(Math.abs(Phaser.Math.Angle.ShortestBetween(this.target.angle, children[i].impactAngle)) < gameOptions.minAngle){
 
                            //v1.1 确定标记参数
                            legalHit = false;
 
                            //v1.1 一旦在约束范围内就停止
                            break;
                        }
                    }
                    // 原来合法飞出
                    if(legalHit){

						// 玩家现可以再次扔刀
						this.canThrow= true;

						// 将飞出的刀插在圆木上
						var knife = this.add.sprite(this.knife.x, this.knife.y, "knife");
						//v1.1 飞刀的约束角度等于目标的角度
                        knife.impactAngle = this.target.angle;
                        // 将飞刀绑定在飞刀组中
						this.knifeGroup.add(knife);

						// 确定相对位置
						this.knife.y = game.config.height/5*4;
					}
					else
					{
						//v1.1 增加飞刀掉落动画
                        this.tweens.add({
 
                            //v1.1 目标
                            targets: [this.knife],
 
                            y: game.config.height + this.knife.height,
 
                            //v1.1 旋转角度
                            rotation: 5,

                            //v1.1 补间速度 
                            duration: gameOptions.throwSpeed * 4,
 
                            //v1.1 回传范围
                            callbackScope: this,
 
                            //v1.1 结束后的回调函数
                            onComplete: function(tween){
 
                                //v1.1 重新开始游戏
                                this.scene.start("playGame")
                            }
                        });
					}
				}

			});
		}

	}

	// 游戏每一帧执行 v1.2 增加两个参数
	//update(){
	update(time, delta){


		//v1.2 修改 使目标转动起来
		//this.target.angle += gameOptions.rotationSpeed;
		this.target.angle += this.currentRotationSpeed;

		// 获取旋转的刀成员
		var children = this.knifeGroup.getChildren();

		// 对于刀的每个成员
		for (var i=0; i<children.length; i++){

			//v1.2 修改 刀旋转的速度设置与当前速度一致
			//children[i].angle += gameOptions.rotationSpeed;
			children[i].angle += this.currentRotationSpeed;

			 // 将角度转化为弧度
			var radians = Phaser.Math.DegToRad(children[i].angle + 90);

			// 再用弧度转化为相应刀的坐标
			children[i].x = this.target.x + (this.target.width/2)*Math.cos(radians);
            children[i].y = this.target.y + (this.target.width/2)*Math.sin(radians);
		}
		//v1.2 调整旋转角度用线性插值表示
        this.currentRotationSpeed = Phaser.Math.Linear(this.currentRotationSpeed, this.newRotationSpeed, delta / 1000);

	}
}


// 按比例调整窗口
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
} 