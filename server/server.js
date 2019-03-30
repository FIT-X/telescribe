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

const moment = require('moment');

var clients = [];

var currentCall = [];

app.post('/text', function(req, res) {

    console.log(req.body.text);

    var text = req.body.text;
    var time = '[' + moment().format('MMMM Do YYYY, h:mm:ss a') + ']';

    var textObject = {
        text: text,
        time: time
    }

    currentCall.push(textObject);

    for (var i in clients) {
        clients[i].emit('update', req.body.text);
    }

    res.status(200).send('ok');
});

io.on('connection', client => {
    console.log('Client connected');
    clients.push(client);

    client.on('disconnect', () => {
        //write currentCall to a text file
        var fileName = moment().format('MMMM Do YYYY, h:mm:ss a');
        
        currentCall = [];
        console.log('Client disconnected')
    });
    
});

server.listen(server_port);