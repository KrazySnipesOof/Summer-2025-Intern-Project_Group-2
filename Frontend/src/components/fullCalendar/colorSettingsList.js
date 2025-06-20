import React, { useState, useEffect, useRef } from "react";
const ColorSettinglist = ({ isVisible, onHide }) => {

  const colorSettingRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorSettingRef.current && !colorSettingRef.current.contains(event.target)) {
        onHide();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className="color-setting-list" ref={colorSettingRef}>
      <h1>Appointments Status Colors</h1>
      <div className="csl-list">
        <ul>
       
          <li className="show">
            <span className="coloroption"></span> <h3>Show</h3>
          </li>
          <li className="Noshow">
            <span className="coloroption"></span> <h3>No-Show</h3>
          </li>
          
          <li className="complete">
            <span className="coloroption"></span>
            <h3>Cancel</h3>
          </li>
      
        </ul>
      </div>
    </div>
  );
};
export default ColorSettinglist;
