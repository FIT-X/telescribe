const server_port = process.env.PORT || 9600;

const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

const buildPath = path.resolve(__dirname, '../build');
app.use(express.static(buildPath));

const server = require('http').createServer(app);
const io = require('socket.io')(server);

var clients = [];

app.post('/text', function(req, res) {
    console.log(req.body.text);
    for (var i in clients) {
        clients[i].emit('update', req.body.text);
    }
    res.status(200).send('ok');
});

io.on('connection', client => {
    console.log('Client connected');
    clients.push(client);

    client.on('disconnect', () => { console.log('Client disconnected') });
    
});

server.listen(server_port);