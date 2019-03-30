import React from "react";
import "./Buttons.css";

const SubmitButton = ({
  children,
  onClick
}) => (
  <input type="button" className="btn classic" value={children} onClick={onClick} />
);

export default SubmitButton;