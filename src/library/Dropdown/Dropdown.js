import React from "react";
import "./Dropdown.css";

const Dropdown = ({
  name,
  label='',
  maxWidth,
  helpText='',
  onChange,
  children
}) => {
  var style = {borderColor: '#dddddd'};
  var helpTextHTML = null;
  if (helpText !== "") {
    style = {borderColor: 'red'}
    helpTextHTML = (<p className="dropdown-help-text">{helpText}</p>)
  };

  var labelHtml = null;
  if (label !== "") {labelHtml = (<label htmlFor={name} className="dropdown-label">{label}</label>)}

  return(
    <div className="dropdown-holder">
      {labelHtml}
      <select 
        className="dropdown"
        name={name}
        style={style}
        onChange={onChange}
      >
        {children}
      </select>
      {helpTextHTML}
    </div>
)};

export default Dropdown;
