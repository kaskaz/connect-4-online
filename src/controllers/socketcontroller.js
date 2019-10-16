
const SocketIO = require('socket.io');


//const p2p = require('socket.io-p2p-server').Server;
//io.use(p2p);

import UserService from "../services/userservice";
import User from "../domain/user";

import {SOCKET_API as API} from "../shared/socketapi";

class SocketApiImpl {

    constructor(socket, userService) {
        this.socket = socket;
        this.userService = userService;
    }

    welcomeClient() {
        this.socket.emit(API.WELCOME_CLIENT, 'Hello ' + this.socket.id);
    }

    userRegistration() {
        let _socket = this.socket;
        let _userService = this.userService;
        this.socket.on(API.USER_REGISTRATION, (name) => {
            console.log('client registration for ' + name + ' (' + _socket.id + ')');
            _userService.createOrUpdate(new User(name, _socket));
            this.sendUserList();
        });
    }

    challenge() {
        let _socket = this.socket;
        let _userService = this.userService;

        this.socket.on(API.CHALLENGE_PLAYER, (userId) => {
            console.log('player ' + _socket.id + ' challenged player ' + userId);
            var challengedUser = _userService.read(userId);
            var thiUser = _userService.read(_socket.id);
            
            challengedUser.addChallenge(_socket.id);
            thiUser.addChallenged(userId);

            this.sendUserList();
        });
    }

    cancel() {
        let _socket = this.socket;
        let _userService = this.userService;

        this.socket.on(API.CANCEL_CHALLENGE, (userId) => {
            console.log('player ' + _socket.id + ' canceled challenge to player ' + userId);
            var challengedUser = _userService.read(userId);
            var thiUser = _userService.read(_socket.id);

            challengedUser.removeChallenge(_socket.id);
            thiUser.removeChallenged(userId);

            this.sendUserList();
        });
    }

    sendUserList() {
        var users = this.userService.readAllUsers();
        var userData = [];
        for(let user of users.values()) {
            userData.push({
                id: user.id,
                name: user.name,
                challenges: user.challenges,
                challenged: user.challenged
            });
        }

        this.socket.emit(API.SEND_USERS_LIST, userData); 
        this.socket.broadcast.emit(API.SEND_USERS_LIST, userData);
    }
}

export default class SocketApi {

    constructor(server) {
        this.io = SocketIO(server);
        this.userService = new UserService();
        console.log('SocketIO started');
    }

    init() {
        let _userService = this.userService;

        this.io.on(API.CONNECTION, function(socket) {
            console.log('client connected is ' + socket.id);
            
            var api = new SocketApiImpl(socket, _userService);
            api.welcomeClient();
            api.userRegistration();
            api.challenge();
            api.cancel();
        
            socket.on('disconnect', function() {
                console.log('client disconnected: ' + socket.id);
                _userService.delete(socket.id);  
                api.sendUserList();
            });
        
        });
    }

}

