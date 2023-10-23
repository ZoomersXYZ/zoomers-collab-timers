import React from "react";
import PropTypes from "prop-types";

const NotifyToggle = ( { parent, checked, name, label, className, onChange, root, runBool, type, run, event, timer } ) => {
  if ( !root ) {
    root = {
      onOff: true, 
      sound: true, 
      vol: true 
    };
  };
  const audioRef = useRef();

  useEffect( () => { 
    if ( !event ) return;
    if ( (timer.onOff && checked[ event ].onOff) && run - 1 === prevRun ) {

      // if ( checked.sound || checked[ event ].sound ) {
      if ( checked.sound ) {
        audioRef.current.play();
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ run ] );

  return(
  <div className="notifications-container">
    <div name={ name } className="type width-7">
      { label } 
    </div>

    <div className="width-3">
      <input type="checkbox" name={ `${ name } onOff` } onChange={ onChange } checked={ checked.onOff } disabled={ !root.onOff } className="toggle" />
    </div>
    <div className="width-2">
      <input type="checkbox" name={ `${ name } sound` } onChange={ onChange } checked={ checked.sound } disabled={ !root.sound } className="toggle" />
    </div >
    <div className="width-4">
      <input type="checkbox" name={ `${ name } vol` } onChange={ onChange } checked={ false } disabled={ true } className="toggle" />
    </div>
    <div className="width-5">
      <input type="checkbox" name={ `${ name } audio` } onChange={ onChange } checked={ false } disabled={ !root.sound } 
       />
      <select name={ `${ name } audio` } id="audio" onChange={ onChange }>
        <option value="none" selected disabled hidden>{ `the current one` }</option>
        <option value="[3][b] metal-gear-solid">metal-gear-solid</option>
        <option value="[1] the-purge-siren">The Purge</option>
        <option value="[2][b] CardiB-OWW_alert-others">Cardi B</option>
        <option value="[2][b] military-new-message">Military Msg</option>
        <option value="[3] waterdrop">Waterdrop</option>
        <option value="[3] xbox-one">Xbox One</option>
        <option value="[3][b] gun-silencer">Gun Silencer</option>
        <option value="[3][b] metal-gear-solid">Metal Gear Solid</option>
        <option value="[4] coin-drop">Coin Drop</option>
        <option value="[4] ting">Ting</option>
      </select>
    </div>

    { runBool &&
    <div className={ `audio ${ type }` }>
      <audio id="sound" preload="auto" ref={ audioRef }>
        <source src="/sounds/[4] ting.mp3" type="audio/mpeg" />
        <source src="/sounds/[4] ting.ogg" type="audio/ogg" />
      </audio>
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
