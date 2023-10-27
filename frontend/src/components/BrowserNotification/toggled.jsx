import React from "react";
import PropTypes from "prop-types";

const NotifyToggle = ( { checked, name, label, onChange, onChangeNoise, root, groupOnOff, groupSound } ) => {
  if ( !root ) {
    root = {
      onOff: true, 
      sound: true, 
      vol: true 
    };
  };
  return(
  <div className="notifications-container">
    <div name={ name } className="type width-6">
      { label } 
    </div>

    <div className="width-2">
      <input type="checkbox" name={ `${ name } onOff` } onChange={ onChange } checked={ checked.onOff } disabled={ !groupOnOff || !root.onOff || !root.onOff } className="toggle" />
    </div>
    <div className="width-2">
      {/* <input type="checkbox" name={ `${ name } sound` } onChange={ onChange } checked={ checked.sound } disabled={ !root.onOff || !root.sound } className="toggle" /> */}
      <input type="checkbox" name={ `${ name } sound` } onChange={ onChange } checked={ checked.sound } disabled={ !groupSound || !root.sound  } className="toggle" />
    </div >
    <div className="width-3">
      <input type="checkbox" name={ `${ name } vol` } onChange={ onChange } checked={ false } disabled={ true } className="toggle" />
    </div>
    <div className="width-5">
      <select name={ `${ name } noise` } id="audio" onChange={ onChangeNoise } value={ checked.noise }>
        <option value="1">The Purge</option>
        <option value="8">Gun Silencer</option>
        <option value="3">Military Msg</option>
        <option value="9">Metal Gear Solid</option>
        <option value="7">Xbox One</option>
        <option value="5">Cardi B</option>
        <option value="10">Cartoon Noise</option>
        <option value="11">Coin Drop</option>
        <option value="2">Rooster</option>
        <option value="4">Ting</option>
        <option value="6">Waterdrop</option>
      </select>
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
