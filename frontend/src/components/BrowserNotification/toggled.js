import React from "react";
import PropTypes from "prop-types";

const NotifyToggle = ( { parent, checked, name, label, className, onChange, root } ) => {
  if ( !root ) {
    root = {
      onOff: true, 
      sound: true, 
      vol: true 
    };
  };
  return(
  <div className="notifications-container">
    <div name={ name } className="type width-7">
      { label } 
    </div>

    <div className="width-3">
    <input type="checkbox" name={ `${ name } onOff` } onChange={ onChange } checked={ checked.onOff } disabled={ !root.onOff } className="toggle" />
    </div>
    <div className="width-3">
    <input type="checkbox" name={ `${ name } sound` } onChange={ onChange } checked={ checked.sound } disabled={ !root.sound } className="toggle" />
    </div >
    <div className="width-5">
    <input type="checkbox" name={ `${ name } vol` } onChange={ onChange } checked={ false } disabled={ true } className="toggle" />
    </div>
  </div>
)
};

NotifyToggle.propTypes = {
  parent: PropTypes.string, 
  name: PropTypes.string, 
  label: PropTypes.string.isRequired, 
  checked: PropTypes.object.isRequired, 
  className: PropTypes.string, 
  onChange: PropTypes.func.isRequired, 
};

NotifyToggle.defaultProps = {};

export default NotifyToggle;
