import React from "react";
import "./SectionHeader.css";

const SectionHeader = ({
  children
}) => (
  <h4 className="section-header">
    {children}
  </h4>
);

export default SectionHeader;
