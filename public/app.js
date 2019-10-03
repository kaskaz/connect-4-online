
const PANEL_TITLE_ENTER = 'Enter the game';
const PANEL_TITLE_ONLINE = 'Players online';
const PANEL_ID_ENTER = 'side-panel-enter';
const PANEL_ID_ONLINE = 'side-panel-online';

//var P2P = require('socket.io')(server);
//import { Server as io } from 'socket.io-client';

// var p2p = new P2P(socket);

import {SOCKET_API} from './socketapi.js';

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

function connect() {
    socket = io();

    socket.on(SOCKET_API.WELCOME_CLIENT, function(data) {
        console.log(data);
    });
    
    socket.on(SOCKET_API.SEND_USERS_LIST, function(data) {
        var ul = document.getElementById('users');
        if(ul != undefined){
            while(ul.firstChild) 
                ul.removeChild(ul.firstChild);
            if(data) {
                data.forEach(user => { addUserToList(ul, user) });
            }
        }
    });

}

function disconnect() {
    if(socket) {
        socket.disconnect();
    }
}

function addUserToList(root, user) {
    var li = document.createElement('li');
    li.className = 'collection-item';
    var div = document.createElement('div');
    div.innerText = user.name;
    var a = document.createElement('a');
    a.href = '#!';
    a.className = 'secondary-content';
    var i = document.createElement('i');
    i.className = 'material-icons';
    i.innerText = 'send';
    
    li.append(div);
    div.append(a);
    a.append(i);
    root.append(li);
}

exit();

document.getElementById(PANEL_ID_ENTER)
    .getElementsByTagName('button')[0]
    .onclick = join;
   
document.getElementById(PANEL_ID_ONLINE)
    .getElementsByTagName('button')[0]
    .onclick = exit;