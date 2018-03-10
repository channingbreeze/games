import Phaser from '../importPhaser';
import game from '../Game';
import {setGameWidth, setGameHeight, gameObj} from '../Game';
import cards from '../Cards';

let _startGameBtn, _settingBtn, _title, _absenceNumText;
const _TEXT_STYLE = {font: '90px sans-serif', fill: 'black'};
const _ABSENCENUM_TEXT_STYLE = {font: '30px sans-serif', fill: 'black'};

export default {
    create() {
        game.stage.backgroundColor = '#4394e8';
        let cardHeight = cards.getHeight(),
            worldHeight = cardHeight * 4,
            worldWidth = worldHeight * (4 / 3);
        setGameWidth(worldWidth);
        setGameHeight(worldHeight);
        if(game.scale.isLandscape) {
            game.scale.correct = true;
            game.scale.setGameSize(worldWidth, worldHeight);
        } else {
            game.scale.correct = false;
            game.scale.setGameSize(worldHeight, worldWidth);
        }
        game.world.setBounds(0, 0, worldWidth, worldHeight);

        let bg = game.add.image(0, 0, 't_bg');
        bg.width = worldWidth;
        bg.height = worldHeight;

        if(gameObj.isConnected) {
            this.addBtns();
        }

        _title = game.add.text(game.world.centerX, game.world.bounds.height * 2 / 5, '尖峰斗地主', _TEXT_STYLE);
        _title.anchor.set(0.5);
        _absenceNumText = game.add.text(game.world.centerX, game.world.bounds.height * 3 / 5, '尖峰斗地主', _ABSENCENUM_TEXT_STYLE);
        _absenceNumText.anchor.set(0.5);
        _absenceNumText.kill();
        let panel = game.add.graphics(0 , 0);
        panel.lineStyle(3, 0x20bf43);
        panel.beginFill(0xcecece, 0.8);
        panel.drawRoundedRect(0, 0, _title.width * 1.2 , _title.height * 1.2, 20);
        panel.alignIn(_title, Phaser.CENTER);
        panel.endFill();
        _title.bringToTop();
        _title.stroke = '#20bf43';
        _title.strokeThickness = 1;
    },
    addBtns() {
        if(this._isActiveState()) {
            _startGameBtn = game.add.button(0, 0, 'startGameBtn', this.startGame, this, 0, 0, 1);
            _settingBtn = game.add.button(0, 0, 'settingBtn', this.setting, this, 0, 0, 1);
            _startGameBtn.centerX = game.world.bounds.width * 0.4;
            _startGameBtn.centerY = game.world.bounds.height * 0.7;
            _settingBtn.centerX = game.world.bounds.width * 0.6;
            _settingBtn.centerY = game.world.bounds.height * 0.7;
        }
    },
    startGame() {
        gameObj.startGame().then(() => {
            _startGameBtn.kill();
            _settingBtn.kill();
        });
    },
    setting() {
       
    },
    beginGame() {
        if(this._isActiveState()) {
            game.state.start('main');
        }
    },
    showAbsenceNum(num) {
        _absenceNumText.revive();
        _absenceNumText.setText('再等待' + num + '名玩家，游戏开始');
    },
    // playerComeIn(name) {
    //     if (this._isActiveState()) {
    //         if (name == '1') {
    //             _p1 = game.add.image(game.world.bounds.width - 160, 30, 'portrait1');
    //             _text1 = game.add.text(game.world.bounds.width - 95, 165, '没准备好', _TEXT_STYLE),
    //             _p1.width = _p1.height = 130;
    //             _text1.anchor.set(0.5, 0);
    //         } else if (name == '2') {
    //             _p2 = game.add.image(30, 30, 'portrait2');
    //             _p2.width = _p2.height = 130;
    //             _text2 = game.add.text(95, 165, '没准备好', _TEXT_STYLE),
    //             _text2.anchor.set(0.5, 0);
    //         }
    //     }
    // },
    // playerIsReady(name) {
    //     if (this._isActiveState()) {
    //         if(name == '1') {
    //             _text1.setText('准备好了');
    //         } else if(name == '2') {
    //             _text2.setText('准备好了');
    //         }
    //     }
    // },
    _isActiveState() {
        return game.state.getCurrentState() === this;
    },
};