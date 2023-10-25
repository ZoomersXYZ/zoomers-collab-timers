import React, { useEffect, useReducer, useRef, useState, useId } from "react";
import PropTypes from "prop-types";
import { Collapse } from 'react-collapse';

import ParentNotifications from '../Common/ParentNotifications';
import { isObject } from '../../ancillary/helpers/general';

const overall = {
  onOff: true, 
  sound: true, 
  vol: 2, 
  noise: "3--waterdrop"
};

const GroupNotifications = ( props ) => {
  const { 
    gName, 
  } = props;

  const [ state, setState ] = useState( null );
  const [ onOff, setOnOff ] = useState( false );
  const [ sound, setSound ] = useState( false );
  const [ localName, setLocalName ] = useState( `${ gName }-group` );

  const [ open, setOpen ] = useState( true );
  const handleCollapse = () => setOpen( prevState => !prevState );

  // have something like notifications is where onOff and sound is.
  const init =() => {
    setLocalName( `${ gName }-group` );
    let flag = false;
    let blobby = localStorage.getItem( localName ) || JSON.stringify( { notifications: {...overall } } );
    const storage = JSON.parse( blobby );
    if ( isObject( storage ) ) {
      if ( !storage.hasOwnProperty( 'notifications' ) ) {
        storage.notifications = overall;
        flag = true;
      };
    };

    if ( !localStorage.getItem( localName ) ) { flag = true; };

    if ( flag ) {
      localStorage.setItem( localName, JSON.stringify( storage ) );
    };

    return storage;
  };
  
  useEffect( () => {
    const gettingState = init();
    setState( gettingState );
  }, [] );
  
  useEffect( () => { 
    if ( state != null ) {
      setOnOff(state.notifications.onOff);
      setSound(state.notifications.sound);
    };
  }, [ state ] );

  useEffect( () => { 
    const localSet = () => {
      localStorage.setItem( localName, JSON.stringify( { ...state, notifications: { ...state.notifications, onOff, sound } } ) );
    };
    if ( state != null ) {
      localSet();
    };
  }, [ onOff, sound ] );

  const handleCheckbox = (e) => {
    const name = e.target.name;

    if ( name.includes( ' ' ) ) {
      const arr = name.split( ' ' );
      const first = arr[ 0 ];
      const second = arr[ 1 ];
      if ( second == 'onOff' ) {
        setOnOff( prev => !prev );
      } else if ( second == 'sound' ) {
        setSound( prev => !prev );
      };
    };
  };

  return (
    <>
    <div className="log-collapse">
      <h3 className="h-outer-container">All Notifications Control</h3>
      <Collapse isOpened={ open }>
        <ParentNotifications
          onChange={ handleCheckbox } 
          onOffBool={ onOff } 
          soundBool={ sound } 
        />
      </Collapse>
    </div>

    <button className="smaller-button" onClick={ handleCollapse }>
      { !open ? 'Open Notification Settings' : 'Collapse Settings' } 
      <i className={ `icon-pad-left fas fa-bell${ !onOff ? '-slash' : '' }` }></i>
    </button>
    <hr className="notifications" />
    </>
  );
};

GroupNotifications.propTypes = {
  gName: PropTypes.string 
};

export default GroupNotifications;
