import React from "react";
import "./MainPlate.css";

const MainPlate = ({
  title,
  subTitle,
  //maxWidth="",
  style={},
  children
}) => {
  //if (maxWidth !== "") {style = {maxWidth: maxWidth}}
  return(
  <div className="section">
    <div className="container" style={style}>
      <div className="container-header">
        <h1 className="container-title">{title}</h1>
        <span className="container-subtitle">{subTitle}</span>
      </div>
      <div className="container-body">
        {children}
      </div>
    </div>
  </div>
)};

export default MainPlate;
