import Phaser from '../importPhaser';
import settingBtnSVG from '../../resources/imgs/btns/setting_btn.svg';
import playBtnSVG from '../../resources/imgs/btns/play_btn.svg';
import hintBtnSVG from '../../resources/imgs/btns/hint_btn.svg';
import discardBtnSVG from '../../resources/imgs/btns/discard_btn.svg';
import startGameBtnSVG from '../../resources/imgs/btns/start_game_btn.svg';
import onePointBtnSVG from '../../resources/imgs/btns/one_point_btn.svg';
import twoPointBtnSVG from '../../resources/imgs/btns/two_point_btn.svg';
import threePointBtnSVG from '../../resources/imgs/btns/three_point_btn.svg';
import portrait1 from '../../resources/imgs/portraits/portrait1.jpg';
import portrait2 from '../../resources/imgs/portraits/portrait2.jpg';
import dizhu from '../../resources/imgs/portraits/dizhu.jpg';
import C_3_C from '../../resources/imgs/cards/3_of_club.svg';
import C_3_D from '../../resources/imgs/cards/3_of_diamond.svg';
import C_3_S from '../../resources/imgs/cards/3_of_spade.svg';
import C_3_H from '../../resources/imgs/cards/3_of_heart.svg';
import C_4_C from '../../resources/imgs/cards/4_of_club.svg';
import C_4_D from '../../resources/imgs/cards/4_of_diamond.svg';
import C_4_S from '../../resources/imgs/cards/4_of_spade.svg';
import C_4_H from '../../resources/imgs/cards/4_of_heart.svg';
import C_5_C from '../../resources/imgs/cards/5_of_club.svg';
import C_5_D from '../../resources/imgs/cards/5_of_diamond.svg';
import C_5_S from '../../resources/imgs/cards/5_of_spade.svg';
import C_5_H from '../../resources/imgs/cards/5_of_heart.svg';
import C_6_C from '../../resources/imgs/cards/6_of_club.svg';
import C_6_D from '../../resources/imgs/cards/6_of_diamond.svg';
import C_6_S from '../../resources/imgs/cards/6_of_spade.svg';
import C_6_H from '../../resources/imgs/cards/6_of_heart.svg';
import C_7_C from '../../resources/imgs/cards/7_of_club.svg';
import C_7_D from '../../resources/imgs/cards/7_of_diamond.svg';
import C_7_S from '../../resources/imgs/cards/7_of_spade.svg';
import C_7_H from '../../resources/imgs/cards/7_of_heart.svg';
import C_8_C from '../../resources/imgs/cards/8_of_club.svg';
import C_8_D from '../../resources/imgs/cards/8_of_diamond.svg';
import C_8_S from '../../resources/imgs/cards/8_of_spade.svg';
import C_8_H from '../../resources/imgs/cards/8_of_heart.svg';
import C_9_C from '../../resources/imgs/cards/9_of_club.svg';
import C_9_D from '../../resources/imgs/cards/9_of_diamond.svg';
import C_9_S from '../../resources/imgs/cards/9_of_spade.svg';
import C_9_H from '../../resources/imgs/cards/9_of_heart.svg';
import C_10_C from '../../resources/imgs/cards/10_of_club.svg';
import C_10_D from '../../resources/imgs/cards/10_of_diamond.svg';
import C_10_S from '../../resources/imgs/cards/10_of_spade.svg';
import C_10_H from '../../resources/imgs/cards/10_of_heart.svg';
import C_J_C from '../../resources/imgs/cards/J_of_club.svg';
import C_J_D from '../../resources/imgs/cards/J_of_diamond.svg';
import C_J_S from '../../resources/imgs/cards/J_of_spade.svg';
import C_J_H from '../../resources/imgs/cards/J_of_heart.svg';
import C_Q_C from '../../resources/imgs/cards/Q_of_club.svg';
import C_Q_D from '../../resources/imgs/cards/Q_of_diamond.svg';
import C_Q_S from '../../resources/imgs/cards/Q_of_spade.svg';
import C_Q_H from '../../resources/imgs/cards/Q_of_heart.svg';
import C_K_C from '../../resources/imgs/cards/K_of_club.svg';
import C_K_D from '../../resources/imgs/cards/K_of_diamond.svg';
import C_K_S from '../../resources/imgs/cards/K_of_spade.svg';
import C_K_H from '../../resources/imgs/cards/K_of_heart.svg';
import C_A_C from '../../resources/imgs/cards/ace_of_club.svg';
import C_A_D from '../../resources/imgs/cards/ace_of_diamond.svg';
import C_A_S from '../../resources/imgs/cards/ace_of_spade.svg';
import C_A_H from '../../resources/imgs/cards/ace_of_heart.svg';
import C_2_C from '../../resources/imgs/cards/2_of_club.svg';
import C_2_D from '../../resources/imgs/cards/2_of_diamond.svg';
import C_2_S from '../../resources/imgs/cards/2_of_spade.svg';
import C_2_H from '../../resources/imgs/cards/2_of_heart.svg';
import C_RED_JOKER from '../../resources/imgs/cards/red_joker.svg';
import C_BLACK_JOKER from '../../resources/imgs/cards/black_joker.svg';
import C_BACK from '../../resources/imgs/cards/back.svg';
import game from '../Game';
import {gameWidth, gameHeight, gameObj} from '../Game';
import Sounds from '../Sounds';
import t_bg from '../../resources/imgs/background/t_bg.jpg';

export default {
    preload() {
        game.stage.disableVisibilityChange = true;
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.loadCards();
        game.load.spritesheet('startGameBtn', startGameBtnSVG, 129, 55, 2);
        game.load.spritesheet('settingBtn', settingBtnSVG, 129, 55, 2);
        game.load.spritesheet('playBtn', playBtnSVG, 129, 55, 2);
        game.load.spritesheet('hintBtn', hintBtnSVG, 129, 55, 2);
        game.load.spritesheet('discardBtn', discardBtnSVG, 129, 55, 2);
        game.load.spritesheet('onePointBtn', onePointBtnSVG, 129, 55, 2);
        game.load.spritesheet('twoPointBtn', twoPointBtnSVG, 129, 55, 2);
        game.load.spritesheet('threePointBtn', threePointBtnSVG, 129, 55, 2);
        game.load.image('portrait1', portrait1);
        game.load.image('portrait2', portrait2);
        game.load.image('dizhuPic', dizhu);
        game.load.image('t_bg', t_bg);

        Sounds.preLoad(game);

        let percentage = game.add.text(game.width / 2, game.height / 2, '0%', { fill: '#ffffff' });
        percentage.anchor.set(0.5);
        game.load.onFileComplete.add(process => percentage.text = process + '%');
        if(game.scale.isLandscape) {
            game.scale.correct = true;
            game.scale.setGameSize(gameWidth, gameHeight);
        } else {
            game.scale.correct = false;
            game.scale.setGameSize(gameHeight, gameWidth);
        }
    },
    create() {
        game.scale.onOrientationChange.add(function() {
            if (game.scale.isLandscape) {
                game.scale.correct = true;
                game.scale.setGameSize(gameWidth, gameHeight);
            } else {
                game.scale.correct = false;
                game.scale.setGameSize(gameHeight, gameWidth);
            }
            game.world.setBounds(0, 0, gameWidth, gameHeight);
        }, this);

        gameObj.addPlayer();
        Sounds.load(game).then(() => game.state.start('prepare'));
    },
    loadCards() {
        game.load.image('3_of_club', C_3_C);
        game.load.image('3_of_diamond', C_3_D);
        game.load.image('3_of_spade', C_3_S);
        game.load.image('3_of_heart', C_3_H);
        game.load.image('4_of_club', C_4_C);
        game.load.image('4_of_diamond', C_4_D);
        game.load.image('4_of_spade', C_4_S);
        game.load.image('4_of_heart', C_4_H);
        game.load.image('5_of_club', C_5_C);
        game.load.image('5_of_diamond', C_5_D);
        game.load.image('5_of_spade', C_5_S);
        game.load.image('5_of_heart', C_5_H);
        game.load.image('6_of_club', C_6_C);
        game.load.image('6_of_diamond', C_6_D);
        game.load.image('6_of_spade', C_6_S);
        game.load.image('6_of_heart', C_6_H);
        game.load.image('7_of_club', C_7_C);
        game.load.image('7_of_diamond', C_7_D);
        game.load.image('7_of_spade', C_7_S);
        game.load.image('7_of_heart', C_7_H);
        game.load.image('8_of_club', C_8_C);
        game.load.image('8_of_diamond', C_8_D);
        game.load.image('8_of_spade', C_8_S);
        game.load.image('8_of_heart', C_8_H);
        game.load.image('9_of_club', C_9_C);
        game.load.image('9_of_diamond', C_9_D);
        game.load.image('9_of_spade', C_9_S);
        game.load.image('9_of_heart', C_9_H);
        game.load.image('10_of_club', C_10_C);
        game.load.image('10_of_diamond', C_10_D);
        game.load.image('10_of_spade', C_10_S);
        game.load.image('10_of_heart', C_10_H);
        game.load.image('J_of_club', C_J_C);
        game.load.image('J_of_diamond', C_J_D);
        game.load.image('J_of_spade', C_J_S);
        game.load.image('J_of_heart', C_J_H);
        game.load.image('Q_of_club', C_Q_C);
        game.load.image('Q_of_diamond', C_Q_D);
        game.load.image('Q_of_spade', C_Q_S);
        game.load.image('Q_of_heart', C_Q_H);
        game.load.image('K_of_club', C_K_C);
        game.load.image('K_of_diamond', C_K_D);
        game.load.image('K_of_spade', C_K_S);
        game.load.image('K_of_heart', C_K_H);
        game.load.image('ace_of_club', C_A_C);
        game.load.image('ace_of_diamond', C_A_D);
        game.load.image('ace_of_spade', C_A_S);
        game.load.image('ace_of_heart', C_A_H);
        game.load.image('2_of_club', C_2_C);
        game.load.image('2_of_diamond', C_2_D);
        game.load.image('2_of_spade', C_2_S);
        game.load.image('2_of_heart', C_2_H);
        game.load.image('red_joker', C_RED_JOKER);
        game.load.image('black_joker', C_BLACK_JOKER);
        game.load.image('back_card', C_BACK);
    },
};