const LEVEL = {
    LOG: 0,
    WARN: 1,
    ERROR: 2,
};

let _level = 2;

class Log {
    static setLevel(level) {
        _level = level;
    }
    constructor(name) {
        this.name = name;
    }
    log(message) {
        this._log(Log.LEVEL.LOG, message);
    }
    warn(message) {
        this._log(Log.LEVEL.WARN, message);
    }
    error(message) {
        this._log(Log.LEVEL.ERROR, message);
    }
    _log(level, message) {
        if(level >= _level) {
            let log = this.name + ': ' + message;
            switch(level) {
            case 0:
                log = '[log]' + log;
                break;
            case 1:
                log = '[warn]' + log;
                break;
            case 2:
            default:
                log = '[error]' + log;
                break;
            }
            console.log(log);
        }
    }
}

Log.LEVEL = LEVEL;

module.exports = Log;