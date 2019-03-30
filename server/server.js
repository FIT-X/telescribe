require('dotenv').config();
const server_port = process.env.PORT || 9600;

const fs = require('fs');
const path = require('path');
const cors = require('cors')

var request = require("request");
var morgan = require('morgan')

const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

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

app.post('/initial', function (req, res) {
    console.log(req.headers["content-type"]);
    console.log(req.body);

    var responseBody = {
        sentiment: '',
        solution: ''
    }

    var errorCode = req.body.errorCode;
    var query = req.body.query;
    var language = '';
    var luisOptions = {
        method: 'GET',
        url: 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d276c35b-be6f-466a-a4c5-cee2c2d76aa3',
        qs:
        {
            verbose: 'true',
            timezoneOffset: '-360',
            'subscription-key': process.env.LUIS_SUB_KEY,
            q: query
        },
        headers:
        {
            'cache-control': 'no-cache'
        }
    };

    var languageOptions = {
        method: 'POST',
        url: 'https://eastus.api.cognitive.microsoft.com/text/analytics/v2.0/languages',
        headers:
        {
            'Postman-Token': '8fe9bfad-8753-4e50-8cc9-de834dd1de2b',
            'cache-control': 'no-cache',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.OCP_APIM_SUBSCRIPTION_KEY
        },
        body: { documents: [{ id: '1', text: req.body.query }] },
        json: true
    };

    var translateOptions = {
        method: 'POST',
        url: 'https://api.cognitive.microsofttranslator.com/translate',
        qs: { 'api-version': '3.0', to: 'en' },
        headers:
        {
            'Postman-Token': '69263000-2792-4f75-97f4-1dfb2cc8ead0',
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.OCP_APIM_SUBSCRIPTION_KEY
        },
        body: [{ Text: query }],
        json: true
    };

    request(languageOptions, function (error, response, body) {
        if (error) {
            throw new Error(error);
        }

        if (response.body.documents[0].detectedLanguages[0].iso6391Name != "en") {
            console.log(response.body.documents[0].detectedLanguages[0].iso6391Name);

             // translate req.body.query
            request(translateOptions, function (error, response, body) {
                if (error) {
                    throw new Error(error);
                }
                console.log(body);
                try {
                    body = JSON.parse(body)
                }
                catch (e) {
                    console.log(e);
                    console.log("Failed to parse")
                }
                query = body[0].translations[0].text;

            })

            

        }
        request(luisOptions, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
            try {
                body = JSON.parse(body)
            }
            catch (e) {
                console.log(e);
                console.log("Failed to parse")
            }
            responseBody.sentiment = body.sentimentAnalysis.label;

            if (errorCode.includes('REG99')) {
                responseBody.solution = 'Enable Wi-Fi calling to use a Wi-Fi connection to make calls.';
            }
            else if (errorCode.includes('Message failed')) {
                responseBody.solution = 'Restart your device.';
            }
            else if (errorCode.includes('tethering APN')) {
                responseBody.solution = "From any Home screen, tap the Menu key. \nTap Settings. \nTap the Connections tab. \nTap More networks. \nTap Mobile networks. \nTap Access Point Names.\n If available, tap the T-Mobile US APN (the bullet point fills with green). If not available, tap the Menu key, and then tap New APN.\n Note: To reset your APN settings, tap the Menu key and then tap Reset to default.\n Verify and update the following settings for the Data APN:\n Name: T-Mobile US LTE\n APN: fast.t-mobile.com\n Proxy: <Not set>\n Port: <Not set>\n Username: <Not set>\n Password: <Not set>\n Server: <Not set>\n MMSC: http://mms.msg.eng.t-mobile.com/mms/wapenc\n MMS proxy: <Not set>\n MMS port: <Not set>\n MMS protocol: WAP 2.0\n MCC: 310\n MNC: 260\n Authentication type: <Not set>\n APN type: <Not set> OR Internet+MMS\n APN protocol: IPv4/IPv6\n APN roaming protocol: IPv4\n Enable/disable APN: <greyed out unless there are multiple APN's>\n Bearer: Unspecified\n Tap the Menu key.\n Tap Save.\n Tap the desired APN profile you want to use. The bullet point fills with green next to the APN profile.";
            }
            
            console.log(responseBody);
            res.send(responseBody);
        });
    })
});

app.post('/text', function (req, res) {

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

app.get('/historylist', function (req, res) {

    fs.readdir(savePath, (err, files) => {
        if (err) {
            console.log(err);
            res.status(404).send(err);
        } else {
            var finalFiles = [];
            for (var i in files) {
                if (files[i].charAt(0) !== '.') {
                    finalFiles.push(files[i].replace(/\.txt/g, ''));
                }
            }
            res.status(200).json(finalFiles);
        }
    });

});

app.get('/call/:file', function (req, res) {
    var file = savePath + '/' + req.params.file + '.txt';

    fs.readFile(file, 'utf8', function (err, data) {
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

        var date = moment().format('MMMM Do YYYY h-mm-ss a').replace(/\s/g, '-');
        var fileName = savePath + '/' + date + '.txt';

        console.log('Saving data:')
        console.log(data)

        fs.writeFile(fileName, JSON.stringify(data), function (err) {
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

// app.get('*', function (req, res) {
//     res.sendFile('index.html')
// });
app.use('*', express.static(buildPath));

server.listen(server_port, ()=> {
    console.log('server ready');
});