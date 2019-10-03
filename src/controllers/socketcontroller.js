
const SocketIO = require('socket.io');


//const p2p = require('socket.io-p2p-server').Server;
//io.use(p2p);

import UserService from "../services/userservice";

import {SOCKET_API as API} from "../shared/socketapi";

class SocketApiImpl {

    constructor() {
        this.userService = new UserService();
    }

    welcomeClient(socket) {
        socket.emit(API.WELCOME_CLIENT, 'Hello ' + socket.id);
    }

    sendClientsList(socket) {
        //socket.emit(API.SEND_USERS_LIST, new UserService().);
    }
}

export default class SocketApi {

    constructor(server) {
        this.io = SocketIO(server);

        console.log('SocketIO started');
    }

    sendClientsList(socket) {
        socket.emit(API.SEND_USERS_LIST, socket.id);
    }

    init() {
        this.io.on('connection', function(socket) {
            console.log('client connected is ' + socket.id);
            
            var api = new SocketApiImpl();
            api.welcomeClient(socket);
            api.sendClientsList(socket);
        
            socket.emit('send-users-list', );
        
            socket.on('disconnect', function() {
                console.log('client disconnected: ' + socket.id);
                //socket.broadcast.emit('send-users-list',users.map(user => user.id));
            });
        
        });
    }

}

