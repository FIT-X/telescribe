import React, {Component} from 'react';
import axios from 'axios';

import { MainPlate, Thermometer, SectionHeader, SubmitButton } from "../library";

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
            this.setState({historyList: response.data}, function(){this.forceUpdate()});
        })
        .catch(error => {
            console.log(error);
        });
    }

    getCall() {
        axios.get(this.state.serverAddress + '/call/' + this.state.location)
        .then(response => {
            console.log(response.data);
            this.setState({call: response.data}, function(){this.forceUpdate()});
        })
        .catch(error => {
            console.log(error);
        });
    }


    render() {
        var location = this.state.location;
        var history = this.state.historyList;
        var callData = this.state.call;

        if (location === '/history' || location === '/history/') {
            if (history !== null) {
        
                return (
                    <MainPlate title="History" subTitle="View saved calls">

                        {history.map(call => 
                            <div key={call} style={{width: '100%', textAlign: 'center', marginBottom: '7px'}}>
                                <a href={'/history/' + call} style={{fontFamily: 'Roboto-Light', width: '100%'}}> {call} </a>
                            </div>
                        )} 
                    
                    </MainPlate>
                )
            } else {
                return (
                    <MainPlate title="History" subTitle="Loading saved calls"></MainPlate>
                )
            }
        } else {
            if (callData !== null) {
                
                var call = this.state.call.call;
                var sentiment = this.state.call.sentiment;
                var language = this.state.call.language;
                var source = this.state.call.source;

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

                var detailsHtml = null;
                var transcriptionHtml = null;
                if (call.length !== 0) {
                    detailsHtml = (<SectionHeader>Details</SectionHeader>);
                    transcriptionHtml = (<SectionHeader>Transcription</SectionHeader>);
                }

                return (
                    <MainPlate title="History" subTitle={"Viewing call: " + location}>

                        {detailsHtml}

                        {languageHtml}
                        {sourceHtml}
                        {sentimentHtml}

                        {transcriptionHtml}

                        {call.map(function(data, idx) {
                            return <p key={idx} style={{fontFamily: 'Roboto-Light'}}>{data.time + ' ' + data.text}</p>;
                        })}

                        <center>
                            <SubmitButton onClick={() => window.location.href = '/history'}>Back to Calls</SubmitButton>
                        </center>
                        
                        
                    </MainPlate>
                )


            } else {
                return (
                    <MainPlate title="History" subTitle={"Loading call: " + location}></MainPlate>
                )
            }
        }
        
    }
}