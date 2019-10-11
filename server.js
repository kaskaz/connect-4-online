const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src/shared')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

import SocketApi from "./src/controllers/socketcontroller";

new SocketApi(server)
    .init();

server.listen(process.env.PORT || 3000);