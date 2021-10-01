import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import Push from "push.js";
import { nanoid } from "nanoid";

const BrowserNotification = ( props ) => {
  const { run, title, body, icon, tag, timeout, requireInteraction, sound, vol } = props;
  const [ prevRun, setPrevRun ] = useState( 0 );
  const audioRef = useRef();
  
  useEffect( () => {
    if ( run - 1 === prevRun ) {
      // Ready for if statement next time
      // State change for audio
      setPrevRun( prevState => prevState + 1 );
      // Run browser notification
      show();
      const theAud = audioRef.current;
      if ( sound ) {
        theAud.play();
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ run ] );

  const show = () => {
    Push.create( 
      title, {
        body, 
        icon, 
        tag, 
        timeout, 
        requireInteraction 
      } 
    )
  };

  // eslint-disable-next-line no-unused-vars
  const close = ( tag ) => {
    Push.close( tag );
  }

  // eslint-disable-next-line no-unused-vars
  const supported = () => {
    if ( "Notification" in window ) return true;
    return false;
  };

  return (
    <>
      { ( ( ( run === prevRun ) || ( ( run - 1 ) === prevRun ) ) ) && run > 0 &&
      <div>
        <audio id="sound" preload="auto" ref={ audioRef }>
          <source src="/notification-sound.mp3" type="audio/mpeg" />
          <source src="/notification-sound.ogg" type="audio/ogg" />
        </audio>
      </div>
      }
    </>
  );
};

BrowserNotification.propTypes = {
  run: PropTypes.number.isRequired, 

  title: PropTypes.string.isRequired, 
  body: PropTypes.string, 
  icon: PropTypes.string, 
  timeout: PropTypes.number, 
  tag: PropTypes.string, 
  requireInteraction: PropTypes.string, 
  sound: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.bool 
  ] ), 
  vol: PropTypes.number 
};

BrowserNotification.defaultProps = { 
  run: 0, 

  title: "Yoo", 
  body: null, 
  icon: null, 
  tag: nanoid(), 
  timeout: null, 
  requireInteraction: null, 
  sound: false, 
  vol: 1 
};

export default BrowserNotification;
