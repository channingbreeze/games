var config={
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade'
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};
var bricks;
var paddle;
var ball;

var game = new Phaser.Game(config);
function preload()
{
    //利用地图集加载资源
	this.load.atlas('assets', 'assets/breakout.png', 'assets/breakout.json');
}

function create()
{
	// 设置四周的反弹，除了底下(地面) Enable world bounds, but disable the floor
	this.physics.world.setBoundsCollision(true, true, true, false);
	//  创建10*6格子  Create the bricks in a 10x6 grid
    bricks = this.physics.add.staticGroup({
            key: 'assets', frame: [ 'blue1', 'red1', 'green1', 'yellow1', 'silver1', 'purple1' ],
            frameQuantity: 10,
            gridAlign: { width: 10, height: 6, cellWidth: 64, cellHeight: 32, x: 112, y: 100 }
        });
    ball = this.physics.add.image(400, 500, 'assets', 'ball1').setCollideWorldBounds(true).setBounce(1);
    //设置onPaddle变量，表示小球是否在托盘上
    ball.setData('onPaddle', true);

    paddle = this.physics.add.image(400, 550, 'assets', 'paddle1').setImmovable();

        // 设置小球与砖头，小球与托盘的碰撞
        this.physics.add.collider(ball, bricks, hitBrick, null, this);
        this.physics.add.collider(ball, paddle, hitPaddle, null, this);

        //  鼠标移动
        this.input.on('pointermove', function (pointer){

        	// 保持托盘在整个游戏内 Keep the paddle within the game
            paddle.x = Phaser.Math.Clamp(pointer.x, 52, 748);

            //当小球在托盘上，托盘的移动带动小球的移动
            if (ball.getData('onPaddle'))
            {
                ball.x =paddle.x;
            }

        }, this);
        //  鼠标点击
        this.input.on('pointerup', function (pointer) {

            if (ball.getData('onPaddle'))//如果小球在托盘上
            {
                ball.setVelocity(-75, -300);//向左上角弹出
                ball.setData('onPaddle', false);
            }

        }, this);

}
function update()
{
    //当小球掉下去了，继续游戏 
	if (ball.y > 600)
        {
            resetBall();
        }

}
//小球与砖头的碰撞
function hitBrick(ball, brick)
{
	brick.disableBody(true, true);
    //当砖头没有了，进行新的一个级别
    if (bricks.countActive() === 0)
        {
            resetLevel();
        }

}
//得新开始
function resetBall()
{
        ball.setVelocity(0);
        ball.setPosition(this.paddle.x, 500);
        ball.setData('onPaddle', true);
}
//新的一个级别
function resetLevel()
{
        resetBall();
        bricks.children.each(function (brick) {
        brick.enableBody(false, 0, 0, true, true);
        });
}

//小球与托盘的碰撞
function hitPaddle(ball, paddle)
 {  
        //根据小球与托盘碰撞的位置，给反弹一个方向
        //定义一个距离
        var diff = 0;
        
        if (ball.x < paddle.x)
        {
            // 当小球在托盘的左边 Ball is on the left-hand side of the paddle
            diff = paddle.x - ball.x;
            ball.setVelocityX(-10 * diff);
        }
        else if (ball.x > paddle.x)
        {
            // 当小球在托盘的右边 Ball is on the right-hand side of the paddle
            diff = ball.x -paddle.x;
            ball.setVelocityX(10 * diff);
        }
        else
        {
            //  当小球在托盘的正中间 Ball is perfectly in the middle
            //  产生一个随机的x的方向速度 Add a little random X to stop it bouncing straight up!
            ball.setVelocityX(2 + Math.random() * 8);
        }
    }