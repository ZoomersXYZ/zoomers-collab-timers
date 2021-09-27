import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Push from "push.js";
import { nanoid } from "nanoid";

const BrowserNotification = ( props ) => {
  const { run, title, body, icon, tag, timeout, requireInteraction } = props;
  const [ prevRun, setPrevRun ] = useState( 0 );

  useEffect( () => {
    if ( run - 1 === prevRun ) {
      // Ready for if statement next time
      // State change for audio
      setPrevRun( prevState => prevState + 1 );
      // Run browser notification
      show();
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
    <div>
      { ( run === prevRun || run - 1 === prevRun ) && run > 0 &&
      <audio id="sound" preload="auto" autoPlay={ true }>
        <source src="/notification-sound.mp3" type="audio/mpeg" />
        <source src="/notification-sound.ogg" type="audio/ogg" />
      </audio>
      }
    </div>
  );
};

BrowserNotification.propTypes = {
  run: PropTypes.number.isRequired, 

  title: PropTypes.string.isRequired, 
  body: PropTypes.string, 
  icon: PropTypes.string, 
  timeout: PropTypes.number, 
  tag: PropTypes.string, 
  requireInteraction: PropTypes.string 
};

BrowserNotification.defaultProps = { 
  run: 0, 

  title: "Yoo", 
  body: null, 
  icon: null, 
  tag: nanoid(), 
  timeout: null, 
  requireInteraction: null 
};

export default BrowserNotification;
