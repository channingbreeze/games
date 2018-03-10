let postal = require('postal/lib/postal.lodash');

class EventMgr {
    constructor() {
        this.channel = postal.channel('anonymous');
    }
    on(eventName, callback) {
        this.channel.subscribe(eventName, callback);
    }
    once(eventName, callback) {
        let subscription = this.channel.subscribe(eventName, (...args) => {
            subscription.unsubscribe();
            callback(...args);
        });
    }
    fire(eventName, params) {
        this.channel.publish(eventName, params);
    }
}

module.exports = new EventMgr();