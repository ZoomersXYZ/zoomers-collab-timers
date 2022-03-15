import React from "react";
import PropTypes from "prop-types";

const NotifyToggle = ( { parent, checked, name, label, className, onChange } ) => (
  <>
    <span name={ name } className="width-4">
      All Notifications
    </span>
    <input name={ `${ name } onOff` } onChange={ onChange } checked={ checked.all.onOff } className="width-4" />
    <input name={ `${ name } sound` } onChange={ onChange } checked={ checked.all.sound } className="width-4" />
    <input name={ `${ name } vol` } onChange={ onChange } checked={ checked.all.vol } className="width-4" />
  </>
);

NotifyToggle.propTypes = {
  parent: PropTypes.string, 
  name: PropTypes.string, 
  label: PropTypes.string.isRequired, 
  checked: PropTypes.bool.isRequired, 
  className: PropTypes.string, 
  onChange: PropTypes.func.isRequired, 
};

NotifyToggle.defaultProps = {};

export default NotifyToggle;
