import sole_1 from '../resources/sounds/1.mp3';
import sole_2 from '../resources/sounds/2.mp3';
import sole_3 from '../resources/sounds/3.mp3';
import sole_4 from '../resources/sounds/4.mp3';
import sole_5 from '../resources/sounds/5.mp3';
import sole_6 from '../resources/sounds/6.mp3';
import sole_7 from '../resources/sounds/7.mp3';
import sole_8 from '../resources/sounds/8.mp3';
import sole_9 from '../resources/sounds/9.mp3';
import sole_10 from '../resources/sounds/10.mp3';
import sole_11 from '../resources/sounds/J.mp3';
import sole_12 from '../resources/sounds/Q.mp3';
import sole_13 from '../resources/sounds/K.mp3';
import sole_14 from '../resources/sounds/small_joker.mp3';
import sole_15 from '../resources/sounds/big_joker.mp3';
import pair_1 from '../resources/sounds/pair_1.mp3';
import pair_2 from '../resources/sounds/pair_2.mp3';
import pair_3 from '../resources/sounds/pair_3.mp3';
import pair_4 from '../resources/sounds/pair_4.mp3';
import pair_5 from '../resources/sounds/pair_5.mp3';
import pair_6 from '../resources/sounds/pair_6.mp3';
import pair_7 from '../resources/sounds/pair_7.mp3';
import pair_8 from '../resources/sounds/pair_8.mp3';
import pair_9 from '../resources/sounds/pair_9.mp3';
import pair_10 from '../resources/sounds/pair_10.mp3';
import pair_11 from '../resources/sounds/pair_J.mp3';
import pair_12 from '../resources/sounds/pair_Q.mp3';
import pair_13 from '../resources/sounds/pair_K.mp3';
import tuple_1 from '../resources/sounds/tuple_1.mp3';
import tuple_2 from '../resources/sounds/tuple_2.mp3';
import tuple_3 from '../resources/sounds/tuple_3.mp3';
import tuple_4 from '../resources/sounds/tuple_4.mp3';
import tuple_5 from '../resources/sounds/tuple_5.mp3';
import tuple_6 from '../resources/sounds/tuple_6.mp3';
import tuple_7 from '../resources/sounds/tuple_7.mp3';
import tuple_8 from '../resources/sounds/tuple_8.mp3';
import tuple_9 from '../resources/sounds/tuple_9.mp3';
import tuple_10 from '../resources/sounds/tuple_10.mp3';
import tuple_11 from '../resources/sounds/tuple_J.mp3';
import tuple_12 from '../resources/sounds/tuple_Q.mp3';
import tuple_13 from '../resources/sounds/tuple_K.mp3';
import bomb from '../resources/sounds/bomb.mp3';
import chain from '../resources/sounds/chain.mp3';
import pair_chain from '../resources/sounds/pair_chain.mp3';
import four_with_pair from '../resources/sounds/four_with_pairs.mp3';
import four_with_two from '../resources/sounds/four_with_two.mp3';
import nuke from '../resources/sounds/nuke.mp3';
import plane from '../resources/sounds/plane.mp3';
import plane_with_wing from '../resources/sounds/plane_with_wing.mp3';
import tuple_with_sole from '../resources/sounds/tuple_with_sole.mp3';
import tuple_with_pair from '../resources/sounds/tuple_with_pair.mp3';
import one_point from '../resources/sounds/one_point.mp3';
import two_point from '../resources/sounds/two_point.mp3';
import discard from '../resources/sounds/discard.mp3';
import three_point from '../resources/sounds/three_point.mp3';
import alarm from '../resources/sounds/alarm.mp3';
import bg from '../resources/sounds/bg.mp3';
import win from '../resources/sounds/win.mp3';
import lose from '../resources/sounds/lose.mp3';
const names = [
    'sole_1','sole_2','sole_3','sole_4','sole_5','sole_6','sole_7','sole_8','sole_9','sole_10','sole_11','sole_12','sole_13',
    'sole_14','sole_15',
    'pair_1','pair_2','pair_3','pair_4','pair_5','pair_6','pair_7','pair_8','pair_9','pair_10','pair_11','pair_12','pair_13',
    'tuple_1','tuple_2','tuple_3','tuple_4','tuple_5','tuple_6','tuple_7','tuple_8','tuple_9','tuple_10','tuple_11','tuple_12','tuple_13',
    'bomb','nuke',
    'chain','pair_chain',
    'four_with_two','four_with_pair',
    'plane','plane_with_wing',
    'tuple_with_sole','tuple_with_pair',
    'discard',
    'alarm',
    'one_point','two_point','three_point',
    'bg','win','lose',
];
let sounds = {};

class Sounds {
    static preLoad(game) {
        [
            sole_1,sole_2,sole_3,sole_4,sole_5,sole_6,sole_7,sole_8,sole_9,sole_10,sole_11,sole_12,sole_13,sole_14,sole_15,
            pair_1,pair_2,pair_3,pair_4,pair_5,pair_6,pair_7,pair_8,pair_9,pair_10,pair_11,pair_12,pair_13,
            tuple_1,tuple_2,tuple_3,tuple_4,tuple_5,tuple_6,tuple_7,tuple_8,tuple_9,tuple_10,tuple_11,tuple_12,tuple_13,
            bomb,nuke,
            chain,pair_chain,
            four_with_two,four_with_pair,
            plane,plane_with_wing,
            tuple_with_sole,tuple_with_pair,
            discard,
            alarm,
            one_point,two_point,three_point,
            bg,win,lose,
        ].forEach((soundUrl,index) => game.load.audio(names[index], soundUrl));
    }
    static async load(game) {
        names.forEach(name => {
            sounds[name] = game.add.audio(name);
        });
        await new Promise(resolve => {
            game.sound.setDecodedCallback(Object.values(sounds), () => resolve());
        });
    }
    static playBG() {
        sounds['bg'].play('', 0, 1, true);
    }
    static stopBG() {
        sounds['bg'].stop();
    }
    static playCallPoint(point) {
        switch (point) {
        case 1:
            sounds['one_point'].play();
            break;
        case 2:
            sounds['two_point'].play();
            break;
        case 3:
            sounds['three_point'].play();
            break;
        default:
            break;
        }
    }    
    static playCards(cardIndexs, deckIndex) {
        switch (deckIndex) {
        case 1:
            this._playSole(cardIndexs[0]);
            break;
        case 2:
            this._playPair(cardIndexs[0]);
            break;
        case 3:
            this._playTuple(cardIndexs[0]);
            break;
        case 4:
            sounds['chain'].play();
            break;
        case 5:
            sounds['plane'].play();
            break;
        case 6:
            sounds['pair_chain'].play();
            break;
        case 7:
            sounds['tuple_with_sole'].play();
            break;
        case 8:
            sounds['tuple_with_pair'].play();
            break;
        case 9:
        case 10:
            sounds['plane_with_wing'].play();
            break;
        case 11:
            sounds['bomb'].play();
            break;
        case 12:
            sounds['nuke'].play();
            break;
        case 13:
            sounds['four_with_two'].play();
            break;
        case 14:
            sounds['four_with_pairs'].play();
            break;
        default:
            break;
        }
    }
    static _playSole(cardIndex) {
        let category = this._calcCategory(cardIndex);
        sounds['sole_' + category].play();
    }
    static _playPair(cardIndex) {
        let category = this._calcCategory(cardIndex);
        sounds['pair_' + category].play();
    }
    static _playTuple(cardIndex) {
        let category = this._calcCategory(cardIndex);
        sounds['tuple_' + category].play();
    }
    static _calcCategory(cardIndex) {
        if(cardIndex !== 52 && cardIndex !== 53) {
            let category = (Math.floor(cardIndex / 4) + 3) % 13;
            return category === 0 ? 13 : category;
        } else if(cardIndex === 52) {
            return 14;
        } else {
            return 15;
        }
    }
    static playDiscard() {
        sounds['discard'].play();
    }
    static playAlarm() {
        sounds['alarm'].play();
    }
    static playWin() {
        sounds['win'].play();
    }
    static playLose() {
        sounds['lose'].play();
    }
}

export default Sounds;