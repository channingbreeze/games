/**
 * Created by kobako on 2017/9/1.
 */
var game;
var map;
var cursor;
var player;
var currentCustomState;
var oper_cold_down_time = 20;
var current_cold_down_time = 20;

window.onload = function () {
    game = new Phaser.Game(500, 500, Phaser.AUTO, 'fuck');
    game.state.add('field', mainState);
    game.state.add('load', loadState);
    game.state.add('title', titleState);
    // game.state.start('field');
    game.state.start('load');

    //init dialogs
    // currentCustomState = mainState;
}
