import io from 'socket.io-client';

class MSocket {
    constructor(id, url) {
        this._id = id;
        this._socketio = io(url, {
            reconnectionAttempts: 3,
            query: {
                id,
            },
        });
    }
    send(data, callback) {
        if(callback && callback instanceof Function) {
            this._socketio.send(data, callback);
        } else {
            this._socketio.send(data);
        }
    }
    onmessage(callback) {
        this._socketio.on('message', (data, fn) => {
            let r = callback(data);
            if(fn && fn instanceof Function) {
                if(r instanceof Promise) {
                    r.then(value => {
                        fn(value);
                    });
                } else {
                    fn(r);
                }
            }
        });
    }
    un() {
        this._socketio.disconnect(true);
    }
}

export default MSocket;