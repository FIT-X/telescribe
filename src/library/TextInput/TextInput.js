import React from "react";
import "./TextInput.css";

const TextInput = ({
  type = "text",
  maxWidth = "",
  label = "",
  name,
  placeholder,
  helpText = "",
  value,
  autocomplete = "",
  onChange
}) => {
  var style = {borderColor: '#dddddd'};
  if (helpText !== "") {style = {borderColor: 'red'}};

  var autocompleteName = null;
  if (autocomplete !== "") {autocompleteName = autocomplete};

  if (maxWidth !== "") {style.maxWidth = maxWidth};

  var labelHtml = null;
  if (label !== "") {labelHtml = (<label htmlFor={name} className="form-input-label">{label}</label>)}

  return(
  <div className="row col-sm-12">
    <div className="form-input-holder">
      {labelHtml}
      <input
        type={type}
        className="form-input"
        name={name}
        value={value}
        placeholder={placeholder}
        style={style}
        autoComplete={autocompleteName}
        onChange={onChange}
      />
      <p className="form-input-help-text">{helpText}</p>
    </div>
  </div>
)};

export default TextInput;
/*

const TextInput = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  helpText
}) => (
  <div className="simple-form-group">
    {label && <label className="simple-text-label">{label}</label>}
    <input
      type={type}
      className="simple-text-input"
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
      placeholder={placeholder}
    />
    {helpText && <small className="simple-form-text">{helpText}</small>}
  </div>
);

*/