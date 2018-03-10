let Deck = require('./Deck');
let Nuke = require('./Nuke');
let Bomb = require('./Bomb');

class Sole extends Deck.Deck {
    constructor(cardIndex) {
        super();
        this.cardIndex = cardIndex;
        this.soles = [this];
    }
    compareTo(deck) {
        if(deck instanceof Nuke.Nuke || deck instanceof Bomb.Bomb) {
            return -1;
        }
        if(deck instanceof Sole === false) {
            throw new Error(`Sole can only compare with (Sole|Bomb|Nuke),but current is ${deck}`);
        } else {
            if(this.cardIndexs >= 52) {
                return this.cardIndex - deck.cardIndex;
            } else {
                return this._getCategoryIndex() - deck._getCategoryIndex();
            }
        }
    }
    toString() {
        return `[${this._getColor()}${this._getCategory()}]`;
    }
    static recognizeSelf(cardIndexs) {
        if(cardIndexs instanceof Array === false) {
            return false;
        }
        if(cardIndexs.length !== 1) {
            return false;
        }
        return true;
    }
    get rawString() {
        return `${this._getColor()}${this._getCategory()}`;
    }
    get cardIndexs() {
        return [this.cardIndex];
    }
    _getCategory() {
        if(this.cardIndex === 52) {
            return '♂';
        } else if (this.cardIndex === 53) {
            return '♀';
        }
        let ret = '',
            categoryIndex = this._getCategoryIndex();
        switch (categoryIndex) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                ret = (categoryIndex + 3).toString();
                break;
            case 8:
                ret = 'J';
                break;
            case 9:
                ret = 'Q';
                break;
            case 10:
                ret = 'K';
                break;
            case 11:
                ret = 'A';
                break;
            case 12:
                ret = '2';
                break;
            case 13:
                ret = '♂';
                break;
            case 14:
                ret = '♀';
                break;
            default:
                break;
        }
        return ret;
    }
    _getCategoryIndex() {
        if(this.cardIndex === 52) {
            return 13;
        } else if(this.cardIndex === 53) {
            return 14;
        }
        return Math.floor(this.cardIndex / 4);
    }
    _getColor() {
        if(this.cardIndex >= 52) {
            return '';
        }
        let ret = '';
        switch (this.cardIndex % 4) {
            case 0:
                ret = '♦';
                break;
            case 1:
                ret = '♣';
                break;
            case 2:
                ret = '♥';
                break;
            case 3:
                ret = '♠';
                break;
            default:
                break;
        }
        return ret;
    }
}

exports.Sole = Sole;