import React, { useEffect, useRef } from "react";
// import PropTypes from "prop-types";

const NoiseToggle = ( { runBool, type, run, prevRun, event, timer, checked } ) => {
  // console.log(checked);
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
    if ( (timer.onOff && checked.onOff) && run - 1 === prevRun ) {

      // if ( checked.sound || checked[ event ].sound ) {
      if ( checked.sound ) {
        console.log(checked.noise);
        audioRef.current.play();
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ run ] );

  return(
  <>
    { runBool && 
    <div className={ `audio ${ type }` }>
      <audio id="soundy" preload="auto" ref={ audioRef }>
        <source src={`/sounds/${checked.noise}.mp3`} type="audio/mpeg" />
        <source src={`/sounds/${checked.noise}.ogg`} type="audio/ogg" />
      </audio>
    </div>
    }
  </>
)
};

NoiseToggle.propTypes = {
  // parent: PropTypes.string, 
  // name: PropTypes.string, 
  // label: PropTypes.string.isRequired, 
  // checked: PropTypes.object.isRequired, 
  // className: PropTypes.string, 
  // onChange: PropTypes.func.isRequired, 
};

NoiseToggle.defaultProps = {};

export default NoiseToggle;
