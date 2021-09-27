import React from "react";
import PropTypes from "prop-types";

import BrowserNotification from './../BrowserNotification';

const CommonBrowserNotification = ( { run, title, body, icon, tag, timeout, requireInteraction } ) => (
  <BrowserNotification 
    run={ run } 
    title={ title } 
    body={ body } 
    icon={ icon } 
    tag={ tag } 
    timeout={ timeout } 
    requireInteraction={ requireInteraction } 
  />
);

CommonBrowserNotification.propTypes = {
  run: PropTypes.number.isRequired, 

  title: PropTypes.string.isRequired, 
  body: PropTypes.string, 
  icon: PropTypes.string, 
  timeout: PropTypes.number, 
  tag: PropTypes.string, 
  requireInteraction: PropTypes.string 
};

CommonBrowserNotification.defaultProps = { 
  run: 0, 

  title: "Z Collab Timer Notification", 
  body: null, 
  icon: '/logo-1.png', 
  timeout: 4000, 
  requireInteraction: null 
};

export default CommonBrowserNotification;