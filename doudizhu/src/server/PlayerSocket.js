class PlayerSocket {
    constructor(socketio) {
        this.socketio = socketio;
    }
    on(callback) {
        this.socketio.on('message', (data, fn) => {
            let r = callback(data);
            if(fn && fn instanceof Function) {
                if(r instanceof Promise) {
                    r.then(value => fn(value));
                } else {
                    fn(r);
                }
            }
        });
    }
    un() {
        this.socketio.disconnect(true);
    }
    emit(data, callback) {
        if(callback && callback instanceof Function) {
            this.socketio.send(data, callback);
        } else {
            this.socketio.send(data);
        }
    }
    isConnected() {
        return Object.keys(this.socketio.rooms).length > 0;
    }
}

module.exports = PlayerSocket;