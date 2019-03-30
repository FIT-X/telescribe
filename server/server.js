require('dotenv').config();
const server_port = process.env.PORT || 9600;

const fs = require('fs');
const path = require('path');
const cors = require('cors')

const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

const buildPath = path.resolve(__dirname, '../build');
app.use(express.static(buildPath));

const savePath = path.resolve(__dirname, '../server/saved');
app.use(express.static(savePath));

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const moment = require('moment');

var clients = [];

var currentCall = [];

//if client connects and there is a session active send the text

app.post('/initial', function(req, res) {

});

app.post('/text', function(req, res) {

    /*
    {
        "original_text": "go dog go",
        "sentiment": "0.8",
        "original_language": "english",
        "translated_text": "go dog go",
        "source": "customer",
        "reply_delay": "xx"
    }
    */

    console.log(req.body);

    var text = req.body.original_text;
    var sentiment = req.body.sentiment;
    var language = req.body.original_language;
    var source = req.body.source;
    var time = '[' + moment().format('MMMM Do YYYY, h:mm:ss a') + ']';

    var textObject = {
        text: text,
        time: time
    }

    currentCall.push(textObject);

    for (var i in clients) {
        clients[i].emit('update', {
            text: text,
            sentiment: sentiment,
            language: language,
            source: source
        });
    }

    res.status(200).send('ok');
});

app.get('/historylist', function(req, res) {

    fs.readdir(savePath, (err, files) => {
        if (err) {
            console.log(err);
            res.status(404).send(err);
        } else {
            for (var i in files) {
                files[i] = files[i].replace(/\.txt/g, '')
            }
            res.status(200).json(files);
        }
    });

});

app.get('/call/:file', function(req, res) {
    var file = savePath + '/' + req.params.file + '.txt';
    
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
            res.status(404).send(err);
        } else {
            res.status(200).json(JSON.parse(data));
        }
    });

});

io.on('connection', client => {
    console.log('Client connected');
    clients.push(client);

    client.on('save', (data) => {

        //How to stop saving the same conversation twice?

        var date = moment().format('MMMM Do YYYY h:mm:ss a').replace(/\s/g, '-');
        var fileName = savePath + '/' + date + '.txt';

        console.log('Saving data:')
        console.log(data)

        fs.writeFile(fileName, JSON.stringify(data), function(err) {
            if (err) {
                console.log(err);
                client.emit('error', err);
            } else {
                console.log('Saved successfully: ' + date);
                client.emit('success', date);
            }
        });
    });

    client.on('disconnect', () => {
        //remove client from clients array
        console.log('Client disconnected')
    });
    
});

server.listen(server_port);