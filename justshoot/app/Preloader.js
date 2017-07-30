MyGame.Preloader = function(game){



};

MyGame.Preloader.prototype = {

    preload: function() {

        this.loadBar = this.add.group();

        this.loadBar.create(0,0,'loadingBar_0');
        this.preloadBar = this.loadBar.create(2,2,'loadingBar_1');
        this.load.setPreloadSprite(this.preloadBar);

        this.loadBar.x = game.world.width/2 - 150;
        this.loadBar.y = game.world.height/2;


        if($.fn.cookie('user')){

            user = JSON.parse($.fn.cookie('user'));

            game.load.image('my_headImg',user.head_img);
        }



        game.load.script('webfont', 'https://cdn.bootcss.com/webfont/1.6.28/webfontloader.js');
        //music
        /*game.load.audio('mainmenu_bgm', '../assets/music/mainmenu_bgm.mp3',true);*/
        game.load.audio('biu', '../assets/music/biu.mp3?123123',true);


        for(var i=1;i<6;i++)
        {
            game.load.audio('kill_'+i+'', '../assets/music/kill_'+i+'.mp3?111',true);
        }



        game.load.image('rule_btn','../assets/rule_btn.jpg?123')
        game.load.image('rule','../assets/rule.png?1231234')
        game.load.image('MainMenu_bg', '../assets/MainMenu_bg.jpg?123123');
        game.load.image('MainMenu_logo', '../assets/MainMenu_logo.png');
        game.load.image('MainMenu_pep', '../assets/MainMenu_pep.png');
        game.load.image('MainMenu_startBtn', '../assets/MainMenu_startBtn.png');



        game.load.image('Home_bg', '../assets/Home_bg.jpg');
        game.load.image('ranking_btn','../assets/ranking_btn.png');
        game.load.image('buff_btn','../assets/buff_btn.png');
        game.load.image('Home_startBtn_bg','../assets/Home_startBtn_bg.png');
        game.load.image('Home_pep','../assets/Home_pep.png');
        game.load.image('Home_startBtn', '../assets/Home_startBtn.png');
        game.load.image('Home_kuang', '../assets/Home_kuang.png?123');
        game.load.image('add', '../assets/add.jpg');

        game.load.image('Kard_bg', '../assets/Kard_bg.jpg');
        game.load.image('Kard_big', '../assets/kard_big.png');
        game.load.image('close_btn', '../assets/close_btn.png');
        for(var i=0;i<7;i++)
        {
            game.load.image('k_'+i+'', '../assets/k_'+i+'.png?2');
        }
        game.load.image('ss', '../assets/ss.png');
        game.load.image('select_ok','../assets/select_ok.png');
        game.load.image('sel_0','../assets/sel_0.png');
        game.load.image('sel_1','../assets/sel_1.png');
        game.load.image('confirm','../assets/confirm.png');
        game.load.image('cancel','../assets/cancel.png');


        game.load.image('bg', '../assets/game_bg.jpg');
        game.load.image('bullet', '../assets/jian_skin2.png?123');
        game.load.image('player','../assets/player.png');
        game.load.atlas('monster_101', '../assets/monster_json/monster_101.png', '../assets/monster_json/monster_101.json');
        game.load.atlas('monster_201', '../assets/monster_json/monster_201.png', '../assets/monster_json/monster_201.json');
        game.load.atlas('monster_301', '../assets/monster_json/monster_301.png', '../assets/monster_json/monster_301.json');

        game.load.image('buff_kuang', '../assets/buff_kuang.png');
        for(var i=0;i<7;i++)
        {
            game.load.image('b_'+i+'', '../assets/b_'+i+'.png');
        }
        game.load.image('buff_arc', '../assets/buff_arc.png');

        for(var i=0;i<3;i++)
        {
            game.load.image('skill_'+i+'', '../assets/skill_'+i+'.png');
        }
        game.load.image('tip','../assets/tip.png');
        game.load.image('score_box','../assets/score_box.png');
        game.load.image('life_box','../assets/life_box.png');
        game.load.image('clear_btn','../assets/clear.png?123123111');



        game.load.image('result_bg','../assets/Result_bg.jpg?1')
        game.load.image('replay_btn','../assets/replay_btn.png')
        game.load.image('myrank_btn','../assets/myrank_btn.png')
        game.load.image('xuanyao_btn','../assets/xuanyao_btn.png')



        game.load.image('rank_bg','../assets/Rank_bg.jpg')
        game.load.image('back_btn','../assets/back_btn.png')
        game.load.image('rank_warp_1','../assets/rank_warp_1.png')
        game.load.image('rank_warp_2','../assets/rank_warp_2.png')
        for(var i=0;i<5;i++)
        {
            game.load.image('r_'+i+'', '../assets/r_'+i+'.png');
        }
        game.load.image('tx_warp_1','../assets/tx_warp_1.png');
        game.load.image('jiangbei','../assets/jiangbei.png')
        game.load.image('quan','../assets/quan.png?1')


        game.load.json('player_data', '../cfg/player_data.json?3');
        game.load.json('monster_data', '../cfg/monster_data.json?3');
        game.load.json('level_data', '../cfg/level_data.json?3');
        game.load.json('buff_data', '../cfg/buff_data.json?3');
        game.load.json('prop_data', '../cfg/prop_data.json?3');


        this.load.image('compass', '../assets/compass_rose.png');
        this.load.image('touch_segment', '../assets/touch_segment.png');
        this.load.image('touch', '../assets/touch.png');


        game.load.image('zhi','../assets/zhi.png?123')


    },
    create: function() {

        game.state.start('MainMenu');


    }
};