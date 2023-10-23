import React from "react";
import PropTypes from "prop-types";

const NotifyToggle = ( { parent, checked, name, label, className, onChange, root, onChangeNoise } ) => {
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
    <div className="width-2">
      <input type="checkbox" name={ `${ name } sound` } onChange={ onChange } checked={ checked.sound } disabled={ !root.onOff || !root.sound } className="toggle" />
    </div >
    <div className="width-4">
      <input type="checkbox" name={ `${ name } vol` } onChange={ onChange } checked={ false } disabled={ true } className="toggle" />
    </div>
    <div className="width-5">
      {/* <input type="checkbox" name={ `${ name } audio` } onChange={ onChange } checked={ false } disabled={ !root.sound } /> */}
      <select name={ `${ name } noise` } id="audio" onChange={ onChangeNoise } value={ checked.noise }>
        {/* <option value="none" disabled hidden>{ `the current one` }</option> */}
        <option value="[1] the-purge-siren">The Purge</option>
        <option value="[3][b] gun-silencer">Gun Silencer</option>
        <option value="[2][b] military-new-message">Military Msg</option>
        <option value="[3][b] metal-gear-solid">Metal Gear Solid</option>
        <option value="[3] xbox-one">Xbox One</option>
        <option value="[2][b] CardiB-OWW_alert-others">Cardi B</option>
        <option value="[2][b] cartoon-noise">Cartoon Noise</option>
        <option value="[4] coin-drop">Coin Drop</option>
        <option value="[2] rooster-alert-others">Rooster</option>
        <option value="[4] ting">Ting</option>
        <option value="[3] waterdrop">Waterdrop</option>
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
