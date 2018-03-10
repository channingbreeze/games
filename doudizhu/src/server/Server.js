const io = require('socket.io');
let playerQueue = require('./PlayerQueue');
let Player = require('./Player');
let PlayerSocket = require('./PlayerSocket');
let Room = require('./Room');
let playerMgr = require('./PlayerMgr');
let Log = require('../util/Log');

const PORT = 9310;
const AI_SERVER_URL = 'http://localhost:10003';

class Server {
    constructor() {
        playerQueue.whenQueueIsFilled(this.putPlayersInRoom.bind(this));
        playerQueue.aiServerUrl = AI_SERVER_URL;
    }
    waitNewPlayer() {
        this._playServer = io(PORT).of('/play');
        this._playServer.use((socket, next) => {
            let id = socket.handshake.query.id;
            if(this._isValidId(id)) {
                return next();
            }
            return next(new Error('invaild player id'));
        }); 
        this._playServer.on('connect', socket => {
            let playerId = socket.handshake.query.id;
            let player = new Player(playerId, new PlayerSocket(socket), AI_SERVER_URL);
            playerMgr.add(player);      
        });
    }
    putPlayersInRoom(p1, p2, p3) {
        let room = new Room(p1, p2, p3);
        room.startGame();
    }
    _isValidId(id) {
        //TODO: 
        return playerMgr.isValidId(id);
    }
}

let s = new Server();
s.waitNewPlayer();
Log.setLevel(Log.LEVEL.LOG);
