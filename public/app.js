
const PANEL_TITLE_ENTER = 'Enter the game';
const PANEL_TITLE_ONLINE = 'Players online';
const PANEL_ID_ENTER = 'side-panel-enter';
const PANEL_ID_ONLINE = 'side-panel-online';

const MAXSIZE = 7;

//var P2P = require('socket.io')(server);
//import { Server as io } from 'socket.io-client';

// var p2p = new P2P(socket);

import {SOCKET_API} from './socketapi.js';
import {STATUS} from './status.js';
import Connect4 from './connect4.js';

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

const PLAYER_COLOR = 'lawngreen';
const OPONENT_COLOR = 'tomato';
const WINNER_COLOR = 'blue';
var boardMap = new Map();
var colContainerCount = new Map();

function initBoard() {
    var row = 0;
    while ((++row)<(MAXSIZE+1)) {
        var col = 0;
        while((++col)<(MAXSIZE+1)) {
            var cell = document.createElement('div');
            var cellId = row + "" + col;
            cell.id = cellId;
            cell.className = 'cell';
            cell.onclick = play;
            document.getElementById('board').append(cell);
            boardMap.set(cellId, new Cell(cellId));
        }
    }    
}

class Cell {

    constructor(id) {
        this.id = id;
        this.selected = false;
    }

    isSelected() {
        return this.selected;
    }

    isAvailable() {
        return this.selected == false;
    }

    select(owner) {
        this.selected = true;
        this.owner = owner;
    }

    isOwner(owner) {
        return this.owner == owner;
    }
    
}

Cell.prototype.OWNER_PLAYER = 1;
Cell.prototype.OWNER_OPONENT = 2;


function play(event) {
    var id = event.currentTarget.id;
    var col = parseInt(id.charAt(1));
    var count = 1;

    if(colContainerCount.get(col)) {
        count = colContainerCount.get(col);
        if (count == MAXSIZE) {
            advertiseForAnotherColumn();
            return;
        } else {
            colContainerCount.set(col, ++count);
        }
    } else {
        colContainerCount.set(col, count);
    }

    var cellId = (MAXSIZE+1-count) + "" + col;
    boardMap.get(cellId).select(Cell.OWNER_PLAYER);
    updateCell(cellId, PLAYER_COLOR);
    detectVictory(cellId);
}

function advertiseForAnotherColumn() {

}

function updateCell(id, color) {
    document.getElementById(id)
            .style.backgroundColor = color;
}

const DIRECTION_EAST        = 1;
const DIRECTION_WEST        = -1;
const DIRECTION_NORTH       = -10;
const DIRECTION_SOUTH       = 10;
const DIRECTION_NORTHEAST   = -9;
const DIRECTION_SOUTHWEST   = 9;
const DIRECTION_NORTHWEST   = -11;
const DIRECTION_SOUTHEAST   = 11;

function detectVictory(startPosition) {

    var cellsToUpdate = [startPosition];
    var intStartPosition = parseInt(startPosition);

    var east = countCellsRecursively(startPosition, 0, DIRECTION_EAST, Cell.OWNER_PLAYER);
    var west = countCellsRecursively(startPosition, 0, DIRECTION_WEST, Cell.OWNER_PLAYER);

    if (east+west >= 3) {
        fillCellsToUpdate(intStartPosition, east, DIRECTION_EAST, cellsToUpdate);
        fillCellsToUpdate(intStartPosition, west, DIRECTION_WEST, cellsToUpdate);
        cellsToUpdate.forEach(cell => updateCell(cell, WINNER_COLOR));
        return;
    }

    var north = countCellsRecursively(startPosition, 0, DIRECTION_NORTH, Cell.OWNER_PLAYER);
    var south = countCellsRecursively(startPosition, 0, DIRECTION_SOUTH, Cell.OWNER_PLAYER);

    if (north+south >= 3) {
        fillCellsToUpdate(intStartPosition, north, DIRECTION_NORTH, cellsToUpdate);
        fillCellsToUpdate(intStartPosition, south, DIRECTION_SOUTH, cellsToUpdate);
        cellsToUpdate.forEach(cell => updateCell(cell, WINNER_COLOR));
        return;
    }

    var northeast = countCellsRecursively(startPosition, 0, DIRECTION_NORTHEAST, Cell.OWNER_PLAYER);
    var southwest = countCellsRecursively(startPosition, 0, DIRECTION_SOUTHWEST, Cell.OWNER_PLAYER);
    
    if (northeast+southwest >= 3) {
        fillCellsToUpdate(intStartPosition, northeast, DIRECTION_NORTHEAST, cellsToUpdate);
        fillCellsToUpdate(intStartPosition, southwest, DIRECTION_SOUTHWEST, cellsToUpdate);
        cellsToUpdate.forEach(cell => updateCell(cell, WINNER_COLOR));
        return;
    }

    var northwest = countCellsRecursively(startPosition, 0, DIRECTION_NORTHWEST, Cell.OWNER_PLAYER);
    var southeast = countCellsRecursively(startPosition, 0, DIRECTION_SOUTHEAST, Cell.OWNER_PLAYER);

    if (northwest+southeast >= 3) {
        fillCellsToUpdate(intStartPosition, northwest, DIRECTION_NORTHWEST, cellsToUpdate);
        fillCellsToUpdate(intStartPosition, southeast, DIRECTION_SOUTHEAST, cellsToUpdate);
        cellsToUpdate.forEach(cell => updateCell(cell, WINNER_COLOR));
        return;
    }

}

function fillCellsToUpdate(defaultPosition, times, direction, cellArray) {
    while (times) {
        cellArray.push(defaultPosition+(Math.abs(direction*(times--))*Math.sign(direction)));
    }
}

function recursiveDetectVictory(position, count, direction, owner) {
    var newPosition = (parseInt(position)+direction).toString();
    var ret = false;
    if(boardMap.has(newPosition)) {
        var cell = boardMap.get(newPosition);
        if (cell.isSelected() && cell.isOwner(owner)) {
            ret = (++count == 4) ? 
                updateAndReturn(newPosition) : (recursiveDetectVictory(newPosition, count, direction, owner) ?
                    updateAndReturn(newPosition) : false);
        }
    }
    return ret;
}

function countCellsRecursively(position, count, direction, owner) {
    var newPosition = (parseInt(position)+direction).toString();
    if (boardMap.has(newPosition)) {
        var cell = boardMap.get(newPosition);
        if (cell.isSelected() && cell.isOwner(owner)) {
            return (++count == 3) ? 
                count : countCellsRecursively(newPosition, count, direction, owner);
        }
    }
    return count;
}

function updateAndReturn(position) {
    updateCell(position, WINNER_COLOR);
    return true;
}

initBoard();
exit();

document.getElementById(PANEL_ID_ENTER)
    .getElementsByTagName('button')[0]
    .onclick = join;
   
document.getElementById(PANEL_ID_ONLINE)
    .getElementsByTagName('button')[0]
    .onclick = exit;