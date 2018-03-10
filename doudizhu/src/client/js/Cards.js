import game from './Game';
let _cards = [],
    _width,
    _height;
class Cards {
    get(index) {
        return _cards[index];
    }
    findCardIndex(card) {
        for(let i = 0; i < _cards.length; ++i) {
            if(card == _cards[i]) {
                return i;
            }
        }
        return -1;
    }
    * [Symbol.iterator]() {
        for(let card of _cards) {
            yield card;
        }
    }
    getWidth() {
        if(!_width) {
            let sp = game.add.sprite(0, 0, '3_of_club'),
                width = sp.width;
            sp.destroy();
            _width = width;
        }
        return _width;
    }
    getHeight() {
        if(!_height) {
            let sp = game.add.sprite(0, 0, '3_of_club'),
                height = sp.height;
            sp.destroy();
            _height = height;
        }
        return _height;
    }
    sortFunc(a, b) {
        if(a.data.index > b.data.index) {
            return 1;
        } else {
            return -1;
        }
    }
    load() {
        _cards = [
            game.add.sprite(0, 0, '3_of_diamond'),
            game.add.sprite(0, 0, '3_of_club'),
            game.add.sprite(0, 0, '3_of_heart'),
            game.add.sprite(0, 0, '3_of_spade'),
            game.add.sprite(0, 0, '4_of_diamond'),
            game.add.sprite(0, 0, '4_of_club'),
            game.add.sprite(0, 0, '4_of_heart'),
            game.add.sprite(0, 0, '4_of_spade'),
            game.add.sprite(0, 0, '5_of_diamond'),
            game.add.sprite(0, 0, '5_of_club'),
            game.add.sprite(0, 0, '5_of_heart'),
            game.add.sprite(0, 0, '5_of_spade'),
            game.add.sprite(0, 0, '6_of_diamond'),
            game.add.sprite(0, 0, '6_of_club'),
            game.add.sprite(0, 0, '6_of_heart'),
            game.add.sprite(0, 0, '6_of_spade'),
            game.add.sprite(0, 0, '7_of_diamond'),
            game.add.sprite(0, 0, '7_of_club'),
            game.add.sprite(0, 0, '7_of_heart'),
            game.add.sprite(0, 0, '7_of_spade'),
            game.add.sprite(0, 0, '8_of_diamond'),
            game.add.sprite(0, 0, '8_of_club'),
            game.add.sprite(0, 0, '8_of_heart'),
            game.add.sprite(0, 0, '8_of_spade'),
            game.add.sprite(0, 0, '9_of_diamond'),
            game.add.sprite(0, 0, '9_of_club'),
            game.add.sprite(0, 0, '9_of_heart'),
            game.add.sprite(0, 0, '9_of_spade'),
            game.add.sprite(0, 0, '10_of_diamond'),
            game.add.sprite(0, 0, '10_of_club'),
            game.add.sprite(0, 0, '10_of_heart'),
            game.add.sprite(0, 0, '10_of_spade'),
            game.add.sprite(0, 0, 'J_of_diamond'),
            game.add.sprite(0, 0, 'J_of_club'),
            game.add.sprite(0, 0, 'J_of_heart'),
            game.add.sprite(0, 0, 'J_of_spade'),
            game.add.sprite(0, 0, 'Q_of_diamond'),
            game.add.sprite(0, 0, 'Q_of_club'),
            game.add.sprite(0, 0, 'Q_of_heart'),
            game.add.sprite(0, 0, 'Q_of_spade'),
            game.add.sprite(0, 0, 'K_of_diamond'),
            game.add.sprite(0, 0, 'K_of_club'),
            game.add.sprite(0, 0, 'K_of_heart'),
            game.add.sprite(0, 0, 'K_of_spade'),
            game.add.sprite(0, 0, 'ace_of_diamond'),
            game.add.sprite(0, 0, 'ace_of_club'),
            game.add.sprite(0, 0, 'ace_of_heart'),
            game.add.sprite(0, 0, 'ace_of_spade'),
            game.add.sprite(0, 0, '2_of_diamond'),
            game.add.sprite(0, 0, '2_of_club'),
            game.add.sprite(0, 0, '2_of_heart'),
            game.add.sprite(0, 0, '2_of_spade'),
            game.add.sprite(0, 0, 'black_joker'),
            game.add.sprite(0, 0, 'red_joker'),
        ];
        let i = 0;
        for(let card of _cards) {
            card.data = {
                index: i++,
            };
            card.kill();
        }
    }
}

export default new Cards();