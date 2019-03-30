import React from "react";
import "./Checkbox.css";

const Checkbox = ({
  name,
  helpText='',
  children,
  checked=false,
  onChange
}) => {
  var style = {outline: '0 solid #dddddd'};
  var helpTextHTML = null;
  if (helpText !== "") {
    style = {outline: '1px solid red'}
    helpTextHTML = (<p className="checkbox-help-text">{helpText}</p>)
  };
  return (
    <div className="checkbox-holder">
      <input 
        className="checkbox-box"
        type="checkbox"
        name={name}
        value={checked}
        checked={checked}
        style={style}
        onChange={onChange}
      /> 
      <p className="checkbox-label"> {children} </p>
      {helpTextHTML}
    </div>
)};

export default Checkbox;
