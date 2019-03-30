import React from "react";
import "./Buttons.css";

const CancelButton = ({
  children,
  onClick
}) => (
  <input type="button" className="btn danger" value={children} onClick={onClick} />
);

export default CancelButton;