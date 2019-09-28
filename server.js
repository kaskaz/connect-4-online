const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//const p2p = require('socket.io-p2p-server').Server;
//io.use(p2p);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

var users = [];

io.on('connection', function(socket) {
    console.log('client connected is ' + socket.id);
    
    socket.emit('welcome-client', 'Hello ' + socket.id);

    users.push(socket);

    socket.emit('send-users-list',users.map(user => user.id));

    socket.on('disconnect', function() {
        users.pop(socket);
        socket.broadcast.emit('send-users-list',users.map(user => user.id));
    });

});



server.listen(3000);