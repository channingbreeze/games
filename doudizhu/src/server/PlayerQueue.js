const config = require('./config');

class PlayerQueue {
    constructor() {
        this._players = new Set();
        this.timer = undefined;
    }


    whenQueueIsFilled(callback) {
        this.filledCallback = callback;
    }


    add(player) {
        this._players.add(player);
        if(this._players.size === 3) {
            this.filledCallback(...this._players);
            this._players.clear();
            //clearTimeout(this.timer);
        }
        this._showAbsenceNum();
    }


    _showAbsenceNum() {
        if(this.absenceNum >= 1 && this.absenceNum <= 2) {
            for(let p of this._players) {
                p.showAbsenceNum(this.absenceNum);
            }
        }
    }


    _filledWithAI() {
        if(this._players.size >= 3 || this._players.size === 0) {
            return;
        }
        let aiNum = 3 - this._players.size;
        for(let i = 0; i < aiNum; ++i) {
            this.add(this._createAI());
        }
    }


    _createAI() {
        return new [...this._players][0].constructor('0', null, this._aiServerUrl);
    }


    remove(player) {
        this._players.delete(player);
        this._showAbsenceNum();
    }


    set aiServerUrl(url) {
        this._aiServerUrl = url;
    }


    get absenceNum() {
        return 3 - this._players.size;
    }
}

module.exports = new PlayerQueue();