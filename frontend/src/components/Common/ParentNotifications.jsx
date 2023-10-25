import React, { useEffect, useReducer, useRef, useState, useId } from "react";
import PropTypes from "prop-types";

const ParentNotifications = ( props ) => {
  const { 
    onChange, 
    onOffBool, 
    soundBool, 
  } = props;

  return (
    <>
    <div className="width-8 label-outer-container">
      <div className="left-container label-container">
        <label className="texty">On/Off</label>
        <label className="switching onOff">
          <input
            type="checkbox" 
            name="timer onOff"
            onChange={ onChange }
            checked={ onOffBool }
            className="toggle"
          />
          <span className="slider"></span>
        </label>        
      </div>

      <div className="right-container label-container">
        <span className="texty">Sound</span>
        <label className="switching onOff sound">
          <input
            type="checkbox" 
            name="timer sound"
            onChange={ onChange }
            checked={ soundBool }
            className="toggle"
            // disabled={ !onOff }
          />
          <span className="slider"></span>          
        </label>        
      </div>
    </div>
    </>
  );
};

ParentNotifications.propTypes = {
  gName: PropTypes.string 
};

export default ParentNotifications;
