import React from "react";
import "./Thermometer.css";

const Thermometer = ({
  temperature,
  upperLimit=100

}) => {
  //note color scale is inverted for sentiment
  var color = 'red';

  if (temperature > 50) {
    color = 'yellow';
  }

  if (temperature > 70) {
    color = 'green';
  }

  return(
    <div id="therm-holder">
      <div id="therm" style={{width: String(Number(temperature/upperLimit * 100) + '%'), marginLeft: String(Number(100 - (temperature/upperLimit * 100))/2 + '%'), backgroundColor: color}}>
        <p style={{color: 'black', textAlign: 'center', width: '100%', fontFamily: 'Roboto-Light'}}>{'Sentiment: ' + Number(temperature) + '%'}</p>
      </div>
    </div>
)};

export default Thermometer;
