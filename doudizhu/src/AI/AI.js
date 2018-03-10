import Player from '../client/js/Player';
import Strategy from './Strategy';

class AI extends Player {
    constructor(playIndex) {
        super(playIndex);
        this._strategy = null;
    }
    serverSay_beginGame() {

    }
    serverSay_playerComein() {

    }
    serverSay_playerIsReady() {
        
    }
    ServerSay_callPoints(value, suuid) {
        let point = this._randomInt(1, 3);
        this.sendRequest(undefined, point, suuid);
    }
    ServerSay_showPoints() {
    }
    ServerSay_sendDiZhuCards(value, suuid) {
        this.getCards().then(cs => {
            this._strategy  = new Strategy(cs, this.name);
            ['0', '1', '2'].filter(name => name != this.name).forEach(name => {
                this._strategy.otherReceive(name == value.diZhuIndex ? 20 : 17, name);
            });
            this.sendRequest(undefined, undefined, suuid);
        });
    }
    ServerSay_play(value, suuid) {
        let tmpcs = this._strategy.decideCall();
        Promise.resolve(tmpcs).then(cs => {
            this.sendRequest(undefined, {cards:cs}, suuid);
        });
    }
    ServerSay_drop(value, suuid) {
        this._strategy.play(value.cards);
        this.sendRequest(undefined, value, suuid);
    }
    ServerSay_droped(value) {
        if(value.name != this.name){
            this._strategy.otherPlay(value.cards, name);
        }
    }
    ServerSay_discarded() {

    }
    ServerSay_discard(value, suuid) {
        this.sendRequest(undefined, value, suuid);
    }
    ServerSay_cover(value, suuid) {
        let tmpcs = this._strategy.decideAnswer(value.cards);
        Promise.resolve(tmpcs).then(cs => {
            let isdiscard = !(cs && cs.length > 0);
            this.sendRequest(undefined, {isdiscard, cards:cs}, suuid);
        });
    }
    ServerSay_finishgame() {
        this._strategy = null;
        this.kill();
    }
    _randomInt(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }
}

export default AI;