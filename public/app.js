
const PANEL_TITLE_ENTER = 'Enter the game';
const PANEL_TITLE_ONLINE = 'Players online';
const PANEL_ID_ENTER = 'side-panel-enter';
const PANEL_ID_ONLINE = 'side-panel-online';

//var P2P = require('socket.io')(server);
//import { Server as io } from 'socket.io-client';

// var p2p = new P2P(socket);



function join() {
    changePanelTitle(PANEL_TITLE_ONLINE);
    hide(PANEL_ID_ENTER);
    show(PANEL_ID_ONLINE);
    connect();
}

function exit() {
    changePanelTitle(PANEL_TITLE_ENTER);
    hide(PANEL_ID_ONLINE);
    show(PANEL_ID_ENTER);
    disconnect();
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

    socket.on('welcome-client', function(data) {
        console.log(data);
    });
    
    socket.on('send-users-list', function(data) {
        var usersList = document.getElementById('users');
        if(usersList != undefined) usersList.remove(users.childNodes);
        data.forEach(user => {
            var el = document.createElement('p');
            el.innerText = user;
            usersList.appendChild(el);
        });
    });

}

function disconnect() {
    socket.disconnect();
}

exit();