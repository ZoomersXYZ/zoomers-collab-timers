import React, { useEffect, useReducer, useRef, useState, useId } from "react";
import PropTypes from "prop-types";

const ParentNotifications = ( props ) => {
  const { 
    onChange, 
    onOffBool, 
    soundBool, 
    parent 
  } = props;
  const bool = ( parent ) ? 'parent-notification' : 'room-notification'

  return (
    <>
    <div className={ `width-8 ${ bool } label-outer-container` }>
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
          />
          <span className="slider"></span>          
        </label>
      </div>

      { !parent && 
      <>
      <div className="right-container label-container">
        <span className="texty">Check All</span>
        <label className="switching all">
          <input
            type="checkbox" 
            name="all"
            onChange={ props.onCheckAll }
            checked={ props.checkAll }
            className="toggle"
          />
          <span className="slider"></span>          
        </label>
      </div>

      <div className="last-right-container label-container">
        <span className="texty">Check All Sound</span>
        <label className="switching allsound">
          <input
            type="checkbox" 
            name="sound"
            onChange={ props.onCheckAll }
            checked={ props.checkAllSound }
            className="toggle"
          />
          <span className="slider"></span>          
        </label>
      </div>
      </>
      }
    </div>
    </>
  );
};

ParentNotifications.propTypes = {
  gName: PropTypes.string 
};

export default ParentNotifications;
