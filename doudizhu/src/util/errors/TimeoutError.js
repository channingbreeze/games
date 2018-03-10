class TimeoutError {
    constructor(msg) {
        this.msg = msg;
    }


    get message() {
        return this.msg;
    }
}

module.exports = TimeoutError;