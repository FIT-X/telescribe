const server_port = 9600;

const fs = require('fs');

const express = require('express');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

const downloadPath = './server/temp';
app.use(express.static(downloadPath));

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', client => {
    console.log('Client connected');
    io.emit('update', 'new data');

    client.on('disconnect', () => { console.log('Client disconnected') });

    client.on('event', data => {
        console.log(data);

        io.emit('update', data);




        
    });
    
});

server.listen(server_port);