import React from "react";
import PropTypes from "prop-types";

import BrowserNotification from './../BrowserNotification';

const CommonBrowserNotification = ( { run, title, body, icon, tag, timeout, requireInteraction, sound, vol } ) => (
  <BrowserNotification 
    run={ run } 
    title={ title } 
    body={ body } 
    icon={ icon } 
    tag={ tag } 
    timeout={ timeout } 
    requireInteraction={ requireInteraction } 
    sound={ sound } 
    vol={ vol } 
  />
);

CommonBrowserNotification.propTypes = {
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

CommonBrowserNotification.defaultProps = { 
  run: 0, 

  title: "Z Collab Timer", 
  body: null, 
  icon: '/logo-1.png', 
  timeout: 4000, 
  requireInteraction: null, 
  sound: false, 
  vol: 1 
};

export default CommonBrowserNotification;