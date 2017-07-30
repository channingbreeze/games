/**
 * Created by 365 on 2017-07-15.
 */

function sortBy(attr,rev){
    if(rev ==  undefined){
        rev = 1;
    }else{
        rev = (rev) ? 1 : -1;
    }

    return function(a,b){
        a = a[attr];
        b = b[attr];
        if(a < b){
            return rev * -1;
        }
        if(a > b){
            return rev * 1;
        }
        return 0;
    }
}

function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}


function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}




function playerAudio(obj){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        document.addEventListener("WeixinJSBridgeReady", function () {
            obj.play();
        }, false);

        document.addEventListener('YixinJSBridgeReady', function() {
            obj.play();
        }, false);
    } else {
        obj.play();
    }
}


function addBtn(obj,key,x,y,callback){

    obj = game.add.button(x,y,key,null,this)
    obj.anchor.set(0.5);

    obj.onInputDown.add(function(){

        game.add.tween(obj.scale).to({
            x:.99,y:.99
        }, 100, Phaser.Easing.Linear.None, true, 0);

    }, this);

    obj.onInputUp.add(function(){

        game.add.tween(obj.scale).to({
            x:1,y:1
        }, 100, Phaser.Easing.Linear.None, true, 0).onComplete.add(callback)


    }, this);
}

//game.kards.children[0].children[0].children[0].loadTexture('sel_1')


var kards = {
    init : function(fuc){
        game.kards = game.add.group();

        for(var i=0;i<4;i++)
        {
            game.kard = game.add.button(200+250*i,35,'k_'+i+'',fuc,this);
            game.ss = game.add.image(0,game.kard.height+85,'ss');
            game.ss.anchor.set(0,1);

            game.sel = game.add.image(game.ss.centerX,-40,'sel_0');
            game.sel.scale.x = game.sel.scale.y = 1.8;
            game.sel.anchor.set(0.5);
            game.ss.addChild(game.sel)
            game.kard.addChild(game.ss)

            game.kard.id = game.kard.key.split("_")[1];
            game.kard.scale.x = game.kard.scale.y = 0.53
            game.kards.add(game.kard)
        }

        for(var j=0;j<3;j++)
        {
            game.kard = game.add.button(200+250*j,395,'k_'+(j+4)+'',fuc,this);
            game.ss = game.add.image(0,game.kard.height+85,'ss');
            game.ss.anchor.set(0,1);

            game.sel = game.add.image(game.ss.centerX,-40,'sel_0');
            game.sel.scale.x = game.sel.scale.y = 1.8;
            game.sel.anchor.set(0.5);
            game.ss.addChild(game.sel)

            game.kard.addChild(game.ss)
            game.kard.id = game.kard.key.split("_")[1];
            game.kard.scale.x = game.kard.scale.y = 0.53
            game.kards.add(game.kard)
        }

    },
    showSelect : function(selectKard){

        game.kards.forEach(function(i){
            i.children[0].children[0].loadTexture('sel_0')
        })

        selectKard.forEach(function(i){

            game.kards.children[i].children[0].children[0].loadTexture('sel_1')

        })
    }
}


var bigKard = {
    init : function(arr){



        game.kardBig = game.add.image(0,0,'Kard_big');
        game.closeKardBig = game.add.button(game.world.width - 20,20,'close_btn',function(){
            bigKard.hide()
        },this);
        game.kard = game.add.image(150,100);
        game.skillText = game.add.text(881, 405, null, { font: "30px Arial", fill: "#bae4f5" ,align: "center"});
        game.skillText.anchor.set(0.5,0.5);
        game.closeKardBig.anchor.set(1,0);


        game.notSelectText = game.add.text(681, 505, '您最多选择3张卡牌，\n可以取消之前的选择更换卡牌！', { font: "30px Arial", fill: "#bae4f5" ,align: "left"});
        game.notSelectText.visible = false;



        game.confirm = game.add.button(750,520,'confirm',function(item){


            if(item.select)
            {
                removeByValue(selectKard,item.id)

            }
            else {

                selectKard.push(item.id)
                item.select = true;


            }


            bigKard.hide()

            kards.showSelect(selectKard);
        },this);


        game.kardBig.addChild(game.closeKardBig)
        game.kardBig.addChild(game.kard)
        game.kardBig.addChild(game.skillText)
        game.kardBig.addChild(game.confirm)
        game.kardBig.addChild(game.notSelectText)
        game.kardBig.visible = false;


    },
    show : function(kardId,skill){




        game.skillText.setText(skill)
        game.kard.loadTexture('k_'+kardId, 0, false);
        game.kardBig.visible = true;
        game.selectOK.inputEnabled = false;


        game.confirm.id = kardId;

        if(selectKard.length>=3)
        {
            game.confirm.visible = false;
            game.notSelectText.visible = true

        }
        else
        {
            game.confirm.visible = true;
        }



        if(contains(selectKard,kardId))
        {
            game.confirm.select = true;
            game.confirm.loadTexture('cancel');
            game.notSelectText.visible = false
            game.confirm.visible = true;

        }
        else
        {
            game.confirm.select = false;
            game.confirm.loadTexture('confirm');
        }

        game.kards.setAll('inputEnabled', false);





    },
    hide : function(){
        game.kardBig.visible = false;
        game.selectOK.inputEnabled = true;
        game.kards.setAll('inputEnabled', true);
    }
}


function defaultBuff(buffId,i){

    this.x = 70;
    this.y = 300 + 70*i

    game.buffArc = game.add.image(this.x + 90,this.y,'buff_arc');
    game.buffArc.fixedToCamera = true;
    game.buffArc.anchor.set(0.5);

    game.buffName = game.add.text(-50, -20, '燕澜七缙为您：', { font: "18px Arial", fill: "#f60" ,align: "left"});
    game.buffArc.addChild(game.buffName)

    game.buffText = game.add.text(-50, 5, game.buffDataJson[buffId].text, { font: "18px Arial", fill: "#ffffff" ,align: "left"});
    game.buffArc.addChild(game.buffText)


    game.buffKuang = game.add.image(this.x,this.y,'buff_kuang');
    game.buffKuang.anchor.set(0.5);
    game.buffKuang.fixedToCamera = true;
    game.add.tween(game.buffKuang).to({
        angle:360
    }, 1500, Phaser.Easing.Linear.None, true, 0,-1,false);




    game.bico = game.add.image(this.x,this.y,'b_'+buffId+'');
    game.bico.fixedToCamera = true;
    game.bico.anchor.set(0.5);


    switch(buffId)
    {
        case 0: //增加道具出现几率

            game.monsterDataJson.forEach(function(i){
                i.Drop += game.buffDataJson[buffId].eff
            })

            break;
        case 1: //人物移动速度
            game.playerDataJson.move_speed += game.buffDataJson[buffId].eff;
            break;
        case 2: //人物攻击速度
            game.playerDataJson.attack_speed += game.buffDataJson[buffId].eff;
            break;
        case 3: //降低怪物血量

            game.monsterDataJson.forEach(function(i){
                i.HP -= game.buffDataJson[buffId].eff;
            })

            break;
        case 4: //降低怪物移动速度

            game.monsterDataJson.forEach(function(i){
                i.SPEED -= game.buffDataJson[buffId].eff;
            })


            break;
        case 5: //增加角色攻击力
            game.playerDataJson.power += game.buffDataJson[buffId].eff;

            break;
        case 6: //增加分数加成

            game.monsterDataJson.forEach(function(i){
                i.SCORE += 1
            })

            break;


    }
}

var tip = {
    init : function(){
        game.tip = game.add.sprite(game.world.width + 500,150,'tip');
        game.tip.fixedToCamera = true;

        game.propText = game.add.text(game.tip.width/2, game.tip.height/2+3, '123123123', { font: "18px Arial", fill: "#ffffff" ,align: "center"});
        game.propText.anchor.set(0.5)

        game.tip.addChild(game.propText)

    },
    show : function(text){

        game.propText.setText(text);

        game.add.tween(game.tip.cameraOffset).to({
            x:350
        }, 500, Phaser.Easing.Cubic.Out, true, 0).onComplete.add(function(){
            game.add.tween(game.tip.cameraOffset).to({
                x:game.world.width + 500
            }, 500, Phaser.Easing.Cubic.In, true, 2500)
        })


    }
}


function getData(url,data,callback){


    $.ajax({
        url:url,
        type:'POST',
        data: data,
        dataType: 'json',
        success:callback
    })


}



module.exports = {
    sortBy : sortBy,
    playerAudio : playerAudio,
    addBtn : addBtn,
    bigKard : bigKard,
    kards : kards,
    defaultBuff : defaultBuff,
    tip : tip,
    getData : getData
}