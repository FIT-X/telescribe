import React, {Component} from 'react';

import { MainPlate } from "../library";

export class History extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            
        }

        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    render() {
        return (
            <MainPlate title="History" subTitle="View calls made over the last 24 hours">

                
                
            </MainPlate>
        )
    }
}