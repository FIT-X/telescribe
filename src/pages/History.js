import React, {Component} from 'react';
import axios from 'axios';

import { MainPlate } from "../library";

export class History extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            location: props.location.pathname.replace(/\/history\//g, ''),
            serverAddress: String(window.location.protocol + '//' + window.location.host).replace(/3000/g, '9600'),
            historyList: null,
            call: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.getHistoryList = this.getHistoryList.bind(this);
        this.getCall = this.getCall.bind(this);
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
        var location = this.state.location;

        if (location === '/history' || location === '/history/') {
            this.getHistoryList();
        } else {
            this.getCall();
        }
    }

    getHistoryList() {
        axios.get(this.state.serverAddress + '/historylist')
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    getCall() {
        axios.get(this.state.serverAddress + '/call/' + this.state.location)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }


    render() {
        var location = this.state.location;
        var history = this.state.history;
        var call = this.state.call;

        if (location === '/history' || location === '/history/') {
            if (history !== null) {
        
                return (
                    <MainPlate title="History" subTitle="View saved calls">

                        {history.map(function(data, idx) {
                            return <p key={idx} style={{fontFamily: 'Roboto-Light'}}>{data}</p>;
                        })}
                    
                    </MainPlate>
                )
            } else {
                return (
                    <MainPlate title="History" subTitle="Loading saved calls"></MainPlate>
                )
            }
        } else {
            return (
                <MainPlate title="History" subTitle={"Viewing call: " + location}>

                
                
                </MainPlate>
            )
        }
        
    }
}