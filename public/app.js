
const PANEL_TITLE_ENTER = 'Enter the game';
const PANEL_TITLE_ONLINE = 'Players online';
const PANEL_ID_ENTER = 'side-panel-enter';
const PANEL_ID_ONLINE = 'side-panel-online';

//var P2P = require('socket.io')(server);
//import { Server as io } from 'socket.io-client';

// var p2p = new P2P(socket);

import {SOCKET_API} from './socketapi.js';
import {STATUS} from './status.js';
import Connect4 from './connect4.js';
import Board from './board.js';

function join() {
    if (isPlayerNameFilled()) {
        changePanelTitle(PANEL_TITLE_ONLINE);
        hide(PANEL_ID_ENTER);
        show(PANEL_ID_ONLINE);
        connect();
    }
}

function exit() {
    changePanelTitle(PANEL_TITLE_ENTER);
    hide(PANEL_ID_ONLINE);
    show(PANEL_ID_ENTER);
    disconnect();
}

function isPlayerNameFilled() {
    return document.getElementById('playername').value.length > 0;
}

function getPlayerName() {
    return document.getElementById('playername').value;
}

function changePanelTitle(title) {
    document.getElementById('panel-title')
        .innerText = title;
}

function hide(elementId) {
    document.getElementById(elementId)
        .style.display = 'none';
}

function show(elementId) {
    document.getElementById(elementId)
        .style.display = 'initial';
}

/**
 * Server interaction
 */

var socket;
var game;

function connect() {
    socket = io();

    socket.on(SOCKET_API.WELCOME_CLIENT, function(data) {
        console.log(data);
        
        socket.emit(SOCKET_API.USER_REGISTRATION, getPlayerName());
        game = new Connect4(socket.id);
    });
    
    socket.on(SOCKET_API.SEND_USERS_LIST, function(data) {
        var ul = document.getElementById('users');
        if(ul != undefined){
            while(ul.firstChild) 
                ul.removeChild(ul.firstChild);

            if(data) {
                data.sort((u1, u2) => {return u2.score - u1.score;});
                data.forEach(user => { addUserToList(ul, user) });
            }
        }
    });

    socket.on(SOCKET_API.CHALLENGE_ACCEPTED, function() {
        game.setPlaying();
    });

}

function disconnect() {
    if(socket) {
        socket.disconnect();
        game.printId();
    }
}

function addUserToList(root, user) {
    var li = document.createElement('li');
    li.className = 'collection-item';
    var div = document.createElement('div');
    div.innerText = user.name;

    var scoreWrapper = document.createElement('div');
    scoreWrapper.className = 'secondary-content';

    var icup = document.createElement('img');
    icup.src = 'cup.png';
    icup.alt = 'cup';
    icup.className = 'cup-icon';

    var score = document.createElement('span');
    score.className = 'score';
    score.innerText = user.score;

    scoreWrapper.append(icup);
    scoreWrapper.append(score);

    div.append(scoreWrapper);

    if(user.id != game.getPlayerId()) {
        createStatusButton(div, user);   
    } else {
        li.classList.add('blue-grey');
        li.classList.add('lighten-4');
    }
    
    li.append(div);
    root.append(li);
}

function createStatusButton(elem, user) {
    var button = document.createElement('a');
    button.className = 'secondary-content waves-effect waves-light btn-small btn-status';
    
    if (user.status == STATUS.PLAYING) {
        button.innerText = 'playing';
        button.classList.add('disabled');
    } else if(game.isAvailable()) {
        if (user.challenges && user.challenges.find(id => id == game.getPlayerId())) {
            button.innerText = 'cancel';
            button.classList.add('red');
            button.addEventListener('click', (event) => {
                cancelChallenge(user);
            });
        } else if (user.challenged && user.challenged.find(id => id == game.getPlayerId())) {
            button.innerText = 'accept';
            button.classList.add('green');
            button.addEventListener('click', (event) => {
                acceptChallenge(user);
            });
        } else {
            button.innerText = 'challenge';
            button.addEventListener('click', (event) => {
                challengePlayer(user);
            });
        }
    } else return;
    
    elem.append(button); 
}

function challengePlayer(user) {
    socket.emit(SOCKET_API.CHALLENGE_PLAYER, user.id);
}

function cancelChallenge(user) {
    socket.emit(SOCKET_API.CANCEL_CHALLENGE, user.id);
}

function acceptChallenge(user) {
    socket.emit(SOCKET_API.ACCEPT_CHALLENGE, user.id);
    game.setPlaying();
}

new Board(document.getElementById('board'))
    .initBoard();

exit();

document.getElementById(PANEL_ID_ENTER)
    .getElementsByTagName('button')[0]
    .onclick = join;
   
document.getElementById(PANEL_ID_ONLINE)
    .getElementsByTagName('button')[0]
    .onclick = exit;