import React, { useEffect } from "react";
// import PropTypes from "prop-types";

import useSound from 'use-sound';

const NoiseToggle = ( { runBool, run, prevRun, event, timer, checked } ) => {
  const [ One ] = useSound( '/sounds/1.mp3' );
  const [ Two ] = useSound( '/sounds/2.mp3' );
  const [ Three ] = useSound( '/sounds/3.mp3' );
  const [ Four ] = useSound( '/sounds/4.mp3' );
  const [ Five ] = useSound( '/sounds/5.mp3' );
  const [ Six ] = useSound( '/sounds/6.mp3' );
  const [ Seven ] = useSound( '/sounds/7.mp3' );
  const [ Eight ] = useSound( '/sounds/8.mp3' );
  const [ Nine ] = useSound( '/sounds/9.mp3' );
  const [ Ten ] = useSound( '/sounds/10.mp3' );
  const [ Eleven ] = useSound( '/sounds/11.mp3' );
  
  const audioNums = { '1': One, '2': Two, '3': Three, '4': Four, '5': Five, '6': Six, '7': Seven, '8': Eight, '9': Nine, '10': Ten, '11': Eleven };
  
  useEffect( () => { 
    if ( !event ) return;
    if ( ( runBool && timer.onOff && checked.onOff ) && run - 1 === prevRun ) {
      if ( timer.sound && checked.sound ) {
        audioNums[ checked.noise ]()
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ run ] );
  return(
    <>
    </>
  )
};

NoiseToggle.propTypes = {
  // parent: PropTypes.string, 
  // name: PropTypes.string, 
  // label: PropTypes.string.isRequired, 
  // checked: PropTypes.object.isRequired, 
  // className: PropTypes.string, 
  // onChange: PropTypes.func.isRequired 
};

NoiseToggle.defaultProps = {};

export default NoiseToggle;
