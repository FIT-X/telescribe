import React, {Component} from 'react';
import io from 'socket.io-client';
import moment from 'moment';

import { MainPlate, SubmitButton } from "../library";

export class Main extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            socketAddress: 'http://localhost:9600',
            socket: null,
            call: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.connectSocket = this.connectSocket.bind(this);
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

                var text = data;
                var time = moment().format('MMMM Do YYYY, h:mm:ss a');

                var textObject = {
                    text: text,
                    time: time
                }

                console.log(textObject)

                const newData = this.state.call
                newData.push(textObject)
                console.log(newData)

                this.setState({call: newData}, function(){this.forceUpdate()});
            });

            this.setState({socket: socket});

        });
        

    }


    render() {
        var call = this.state.call;
        var callString = '';

        for (var i in call) {
            callString = callString + call[i] + '\n'
        }

        

        return (
            <MainPlate title="Current Transcription" subTitle="View current call transcription">

                {call.map(function(data, idx) {
                    return <p key={idx}>{data.time + ' ' + data.text}</p>;
                })}
                
            </MainPlate>
        )
    }
}