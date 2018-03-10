import Strategy from '../AI/Strategy';

let _players = [],
    _cards = [],
    _isBegin = false,
    _isFinish = false,
    _strategy = new Strategy(null, 'Server'),
    _currentPlayerIndex,
    _dizhuPlayerIndex,
    _dizhuCards = [];
const CARDSIZE = 54;
class Game {
    addPlayer(player) {
        _players.push(player);
    }
    canBegin() {
        return _players.length == 3 && _players.every(p => p.isReady);
    }
    begin() {
        if(_isBegin === false) {
            this.sortPlayers();
            this.deal();
            _currentPlayerIndex = Math.floor(Math.random() * 3);
            _isBegin = true;
            _isFinish = false;
        }
    }
    sortPlayers() {
        _players.sort((a, b) => a.name - b.name);
    }
    deal() {
        if(_players.length != 3) {
            return;
        }
        for(let i = 0; i < CARDSIZE; ++i) {
            _cards.push(i);
        }
        this._shuffle();
        let [...clone] = _cards;
        _players[0].cards = clone.splice(0, 17);
        _players[1].cards = clone.splice(0, 17);
        _players[2].cards = clone.splice(0, 17);
        _dizhuCards = clone;
    }
    get diZhuCards() {
        return _dizhuCards;
    }
    _shuffle() {
        for (let i = _cards.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [_cards[i - 1], _cards[j]] = [_cards[j], _cards[i - 1]];
        }
    }
    broadcast(actionName, value) {
        _players.forEach(player => player.emit(actionName, value));
    }
    turnToNextPlayer() {
        _currentPlayerIndex = (_currentPlayerIndex + 1) % 3;
    }
    get currentPlayer() {
        return _players[_currentPlayerIndex];
    }
    get currentPlayerIndex() {
        return _currentPlayerIndex;
    }
    set currentPlayerIndex(index) {
        _currentPlayerIndex = index;
    }
    get players() {
        return _players;
    }
    get dizhuIndex() {
        return _dizhuPlayerIndex;
    }
    set dizhuIndex(index) {
        _dizhuPlayerIndex = index;
    }
    get isBegin() {
        return _isBegin;
    }
    get isFinish(){
        return _isFinish;
    }
    checkPlayCards(cards) {
        let curplayer = this.currentPlayer;
        return cards && cards.length && cards.every(card => curplayer.cards.includes(card));
    }
    checkCoverCards(prevCards, cards) {
        if(!this.checkPlayCards(cards)) return false;
        return _strategy.isLegal(cards) && _strategy.win(cards, prevCards);
    }
    finishGame() {
        let winners = [];
        if(_currentPlayerIndex == _dizhuPlayerIndex) {
            winners.push(this.currentPlayer.name);
        } else {
            for(let i = 0; i < _players.length; ++i) {
                if(i != _dizhuPlayerIndex) {
                    winners.push(_players[i].name);
                }
            }
        }
        this.broadcast('ServerSay_finishgame', {winners});
        _isFinish = true;
        _isBegin = false;
        _players.forEach(p => p.kill());
        _players = [];
        _cards = _dizhuCards = [];
        _currentPlayerIndex = _dizhuPlayerIndex = undefined;
    }
    /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
    async playRound() {
        let discardTimes = 0,
            curplayer = this.currentPlayer,
            cards;
        while(true) {
            ({cards} = await curplayer.playCards());
            if(this.checkPlayCards(cards)) {
                break;
            }
        }
        await curplayer.dropCards(cards);
        this.broadcast('ServerSay_droped', {cards, name: curplayer.name, iscover: false});
        if(curplayer.cards.length==0){
            this.finishGame();
            return;
        }
        this.turnToNextPlayer();

        while(true) {
            curplayer = this.currentPlayer;
            let {cards:tmpcards, isdiscard} = await curplayer.coverCards(cards);
            if(isdiscard) {
                discardTimes++;
                await curplayer.discard();
                this.broadcast('ServerSay_discarded', {name: curplayer.name});
                this.turnToNextPlayer();

                if(discardTimes >= 2){
                    break;
                }
            } else {
                if(this.checkCoverCards(cards, tmpcards)) {
                    discardTimes = 0;
                    cards = tmpcards;
                    await curplayer.dropCards(cards);
                    this.broadcast('ServerSay_droped', {cards, name: curplayer.name, iscover: true});
                    if(curplayer.cards.length==0){
                        this.finishGame();
                        return;
                    }
                    this.turnToNextPlayer();
                }
            }
        }
    }
}

export default new Game();