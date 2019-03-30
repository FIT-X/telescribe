import React from "react";
import "./Header.css";

import headerLogo from "./header-logo.png";

const Header = () => {
  return (
    <div className="nav-header">
      <div className="nav-header-logo">
        <a href="/">
          <img className="logo-image" src={headerLogo} alt="" />
        </a>
      </div>
      
      <div className="nav-header-links">
        <ul>
          <li><button onClick={() => window.location.href = '/history'}>Call History</button></li>
        </ul>
      </div>
    </div>
  )
};

export default Header;
