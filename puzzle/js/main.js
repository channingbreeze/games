
var time = 15;

var jinduWord;
var jindu;
var sort = randomArr()
var temPosition={};
var pintuGroup
var allowDragStart = true;
var allowDragStop = false;

// 随机数组
function randomArr(){
    var initArr = [0,1,2,3,4,5,6,7,8];
    var temArr = []
    while (initArr.length>0){
        temArr.push(initArr.splice(Math.floor(Math.random()*initArr.length),1)[0]);
    }
    return temArr;
}

/***********************/

var game = new Phaser.Game(600, 650, Phaser.CANVAS, 'container');

game.States = {};

game.States.main = function() {
    this.preload = function() {
        game.load.spritesheet('pintu', 'assets/img/pintu.png',184,184);
        game.load.image('jindu', 'assets/img/jindu.png');
        game.load.image('jinduBg', 'assets/img/jinduBg.png');
        if (typeof(GAME) !== "undefined") {
            this.load.baseURL = GAME + "/";
        }
        if (!game.device.desktop) {
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.forcePortrait = true;
            this.scale.refresh();
        }
    };
    this.create = function() {
        // 生成背景色
        game.stage.backgroundColor = '#492152';

        // 生成进度条
        var jinduBg = game.add.sprite(42,24,'jinduBg')
        jindu = game.add.sprite(10,6,'jindu')
        jinduBg.addChild(jindu)
        jindu.width = 360;
        game.add.tween(jindu).to( { width: 0 }, time*1000, Phaser.Easing.Linear.None, true);
        this.leftTime = time
        var style = { font: "bold 22px Microsoft Yahei", fill: "#FFF" };
        jinduWord = game.add.text(400, 1, "还剩 "+ this.leftTime +" 秒", style);
        jinduBg.addChild(jinduWord);
        game.time.events.repeat(Phaser.Timer.SECOND , time, this.refreshTime, this)

        // 生成拼图组
        pintuGroup = game.add.group();

        // 生成拼图块
        var item;
        for(var i in sort){
            item = pintuGroup.create(25 + 184*(Math.floor(i%3)), 70 + 184*(Math.floor(i/3)), 'pintu', sort[i]);

            // 精灵正确的顺序
            item.sort = sort[i];

            // 精灵当前的顺序
            item.nowSort = +i;

            // Enable input detection, then it's possible be dragged.
            item.inputEnabled = true;

            // Make this item draggable.
            item.input.enableDrag();

            // Then we make it snap to 184x184 grids.
            item.input.enableSnap(184, 184, false, true,25,70);

            item.input.bringToTop = true;

            // Add a handler to remove it using different options when dropped.
            item.events.onDragStart.add(this.dragStart, this);

            // Add a handler to remove it using different options when dropped.
            item.events.onDragStop.add(this.dragStop, this);
        }

        
    };
    this.refreshTime = function(){
        this.leftTime--;
        jinduWord.text = "还剩 "+ this.leftTime +" 秒";
        if(this.leftTime === 0) {
            window.alert("时间到!");
            game.paused = true;
        }
    }
    this.dragStart = function(sprite, event){
        if(allowDragStart){
            allowDragStart = false;
            allowDragStop = true;
            // 正在移动的精灵的原位置
            temPosition.x = sprite.position.x;
            temPosition.y = sprite.position.y;
        }else{
            sprite.input.disableDrag();
        }
    }
    this.dragStop = function(sprite, event){
        var t = this;
        if(allowDragStop){
            allowDragStop = false;

            if(temPosition.x === sprite.position.x && temPosition.y === sprite.position.y){
                allowDragStart = true;
                allowDragStop = false;
                pintuGroup.setAll('input.draggable',true)
                // 位置不动不做处理
            }else{
                // 精灵移动到边界外返回原位置
                var temX = (sprite.position.x-25)/184;
                var temY = (sprite.position.y-70)/184;
                if(temX<0 || temX>2 || temY<0 || temY>2){
                    var temTween = game.add.tween(sprite).to( { x: temPosition.x, y: temPosition.y }, 300, Phaser.Easing.Quartic.Out, true);
                    temTween.onComplete.add(function(){
                        allowDragStart = true;
                        allowDragStop = false;
                        pintuGroup.setAll('input.draggable',true)
                    })
                    return;
                }
                // 精灵移动到的位置排序
                var newSort = (sprite.position.x-25)/184 + (sprite.position.y-70)/184*3;

                // 循环group，使原拼图与新拼图替换位置
                var ifMoveEnd = true
                pintuGroup.forEach(function(item){
                    if(item.nowSort === newSort && ifMoveEnd === true){
                        ifMoveEnd = false;
                        item.bringToTop()
                        var tween = game.add.tween(item).to( { x: temPosition.x, y: temPosition.y }, 300, Phaser.Easing.Quartic.Out, true);
                        tween.onComplete.add(function(){
                            item.nowSort = sprite.nowSort
                            sprite.nowSort = newSort;
                            ifMoveEnd = true;
                            allowDragStart = true;
                            allowDragStop = false;
                            pintuGroup.setAll('input.draggable',true)
                            if(t.checkSort()){
                                window.alert("成功！");
                                game.paused = true;
                            }
                        },this)
                    }
                })
            }
        }
    }
    this.checkSort = function(){
        var ifFinash = true;
        pintuGroup.forEach(function(item){
            if(item.sort !== item.nowSort){
                ifFinash = false;
            }
        })
        return ifFinash;
    }
};

game.state.add('main', game.States.main);

game.state.start('main');
