import React, {Component} from 'react';
import io from 'socket.io-client';
import moment from 'moment';

import { MainPlate, SubmitButton, CancelButton, Thermometer, SectionHeader } from "../library";

export class Main extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            socketAddress: process.env.REACT_APP_WS_HOST || 'http://localhost:9600',
            socket: null,
            call: [],
            sentiment: 0,
            language: '',
            source: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.connectSocket = this.connectSocket.bind(this);
        this.saveConversation = this.saveConversation.bind(this);
    }


    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    componentDidMount() {
        this.connectSocket()
    }

    connectSocket() {
        const socket = io(this.state.socketAddress);

        socket.on('connect', () => {

            socket.on('update', data => {

                var text = data.text;
                var time = '[' + moment().format('MMMM Do YYYY, h:mm:ss a') + ']';

                var textObject = {
                    text: text,
                    time: time
                }

                console.log(textObject)

                const newData = this.state.call
                newData.push(textObject)

                this.setState({call: newData, sentiment: data.sentiment * 100, language: data.language, source: data.source}, function(){this.forceUpdate()});
            });

            socket.on('success', data => {
                alert('Conversation saved successfully!');
                window.location.href = '/history/' + data;
            });

            socket.on('error', data => {
                alert('Error: Conversation could not be saved');
                console.log('Error data:');
                console.log(data);
            });

            this.setState({socket: socket});

        });
    }

    saveConversation() {
        var socket = this.state.socket;

        socket.emit('save', {
            language: this.state.language,
            source: this.state.source,
            sentiment: this.state.sentiment,
            call: this.state.call
        });

    }


    render() {
        var call = this.state.call;
        var sentiment = this.state.sentiment;
        var language = this.state.language;
        var source = this.state.source;

        var sentimentHtml = null;
        if (sentiment > 0) {
            sentimentHtml = (<Thermometer temperature={sentiment} />);
        }

        var languageHtml = null;
        if (language !== '') {
            languageHtml = (<p style={{textAlign: 'center', color: 'black', fontFamily: 'Roboto-Light'}}>Conversation Language: {language}</p>)
        }

        var sourceHtml = null;
        if (source !== '') {
            sourceHtml = (<p style={{textAlign: 'center', color: 'black', fontFamily: 'Roboto-Light'}}>Conversation Source: {source}</p>)
        }

        var buttonsHtml = null;
        var detailsHtml = null;
        var transcriptionHtml = null;
        if (call.length !== 0) {
            buttonsHtml = (
                <center>
                    <CancelButton onClick={() => window.location.href = '/'}>Discard Conversation</CancelButton>
                    <SubmitButton onClick={this.saveConversation}>Save Conversation</SubmitButton>
                </center>
            )
            detailsHtml = (<SectionHeader>Details</SectionHeader>);
            transcriptionHtml = (<SectionHeader>Transcription</SectionHeader>);
        }

        return (
            <MainPlate title="Current Transcription" subTitle="View current call transcription">

                {detailsHtml}

                {languageHtml}
                {sourceHtml}
                {sentimentHtml}

                {transcriptionHtml}

                {call.map(function(data, idx) {
                    return <p key={idx} style={{fontFamily: 'Roboto-Light'}}>{data.time + ' ' + data.text}</p>;
                })}

                {buttonsHtml}
                
            </MainPlate>
        )
    }
}