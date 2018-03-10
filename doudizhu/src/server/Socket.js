import postal from 'postal/lib/postal.lodash';

class Socket {
    constructor(name) {
        this._playerName = name;
        this._alreadyCallOn = false;
        this._subscription = null;
    }
    on(callback) {
        if(!this._alreadyCallOn) {
            this._subscription = postal.subscribe({
                channel: 'socketToServer',
                topic: this._playerName,
                callback,
            });
            this._alreadyCallOn = true;
        }
    }
    un() {
        this._subscription.unsubscribe();
        this._subscription = null; 
    }
    emit(data) {
        postal.publish({
            channel: 'socketToClient',
            topic: this._playerName,
            data,
        });
    }
}

export default Socket;