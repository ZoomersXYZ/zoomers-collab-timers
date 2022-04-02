import React, { useContext } from "react";
import PropTypes from "prop-types";

import { isEmpty } from './../../ancillary/helpers/general';

import BrowserNotification from './../Full';

import { GroupContext, RoomContext } from '../Contexts';

const CommonBrowserNotification = ( { 
  core,   
  label, 
  type, 
  
  icon, 
  tag, 
  timeout, 
  requireInteraction, 
  // vol 
} ) => {
  const { gName } = useContext( GroupContext );
  const __aRoom = useContext( RoomContext );
  let finalLabel = label;
  if ( isEmpty( label ) ) {
    finalLabel = __aRoom ? __aRoom.name : 'Empty Label';
  };

   const { 
    event, 
    onOff, 
    title, 
    body, 
    // sound 
   } = core;
  return (
    <BrowserNotification 
      group={ gName } 
      label={ finalLabel } 
      run={ onOff } 
      { ...{ 
        type, 
        title, 
        body, 
        event, 
        icon, 
        tag, 
        timeout, 
        requireInteraction, 
        // sound, 
        // vol 
      } }
    />
  ) 
};

CommonBrowserNotification.propTypes = {
  core: PropTypes.object.isRequired, 

  label: PropTypes.string, 
  type: PropTypes.string, 

  icon: PropTypes.string, 
  timeout: PropTypes.number, 
  tag: PropTypes.string, 
  requireInteraction: PropTypes.string, 
  // vol: PropTypes.number 
};

CommonBrowserNotification.defaultProps = { 
  type: 'room', 

  icon: '/logo-1.png', 
  timeout: 4000, 
  requireInteraction: null, 
  // vol: 1 
};

export default CommonBrowserNotification;