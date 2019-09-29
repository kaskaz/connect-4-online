const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//const p2p = require('socket.io-p2p-server').Server;
//io.use(p2p);

//import User from "./src/user/user.js";
//import UserService from "./src/user/userservice.js";

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

//var userService = new UserService();

io.on('connection', function(socket) {
    console.log('client connected is ' + socket.id);
    
    socket.emit('welcome-client', 'Hello ' + socket.id);

    //socket.emit('send-users-list',users.map(user => user.id));

    socket.on('disconnect', function() {
        console.log('client disconnected: ' + socket.id);
        //socket.broadcast.emit('send-users-list',users.map(user => user.id));
    });

});

server.listen(3000);