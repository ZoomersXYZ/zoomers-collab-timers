import React, { useEffect, useReducer, useRef, useState } from "react";
import PropTypes from "prop-types";

import Push from "push.js";
import { nanoid } from "nanoid";
import { Collapse } from 'react-collapse';

import 'styles.scss';

function init( { group, label, type } ) { 
  let flag = false;
  const blobby = localStorage.getItem( group ) || JSON.stringify( 
    { 
      [ label ]: { 
        [ type ]: { 
          checked: false, 
          sound: { 
            start: false, 
            end: false, 
            other: false, 
          }, 
          testy: 'lol' 
        }
      }
    }
  );

  if ( !localStorage.getItem( group ) ) { flag = true; };
  
  const storage = JSON.parse( blobby );

  if ( !storage.hasOwnProperty( label )  ) {
    storage[ label ] = {
      [ type ]: {
        checked: false, 
        sound: { 
          start: false, 
          end: false, 
          other: false, 
        }, 
        testy: 'lol' 
      }
    };
    flag = true;
  };

  if ( storage.hasOwnProperty( label ) && !storage[ label ].hasOwnProperty( type ) ) {
    storage[ label ][ type ] = {
        checked: false, 
        sound: { 
          start: false, 
          end: false, 
          other: false, 
        }, 
        testy: 'lol' 
      };
    flag = true;
  };

  if ( flag ) {
    localStorage.setItem( group, JSON.stringify( storage ) );
  };

  const data = storage[ label ][ type ];

  return { storage, data, label, type };
};

function reducer( state, action ) {
  const labelObj = state.storage[ state.label ];
  switch ( action ) {
    case 'all': 
      labelObj[ state.type ].checked = !labelObj[ state.type ].checked;
      break;
    case 'sound_start': 
      labelObj[ state.type ].sound.start = !labelObj[ state.type ].checked.sound.start;
      break;
    case 'sound_end': 
      labelObj[ state.type ].sound.end = !labelObj[ state.type ].checked.sound.end;
      break;
    case 'sound_misc': 
      labelObj[ state.type ].sound.misc = !labelObj[ state.type ].checked.sound.misc;
      break;
    default:
      break;
  };
  return { 
    ...state, 
    storage: { 
      ...state.storage, 
      [ state.label ]: labelObj 
    }, 
    data: { 
      ...labelObj[ state.type ] 
    }
  };
};

const BrowserNotification = ( props ) => {
  const { group, label, type, run, title, body, icon, tag, timeout, requireInteraction, sound } = props;
  // { vol } = props;
  const [ prevRun, setPrevRun ] = useState( 0 );
  const audioRef = useRef();

  const [ state,  dispatch ] = useReducer( reducer, { group, label, type }, init );
  const [ checked, setChecked ] = useState( state.data.checked );
  
  useEffect( () => { 
    const localSet = () => {
      localStorage.setItem( group, JSON.stringify( state.storage ) );
    };
    localSet();
  }, [ group, state.storage ] );

  const handleCheckbox = ( e ) => {
    const meta = e.target.meta;
    dispatch( meta );
    setChecked( prev => !prev[ meta ] );
  };

  useEffect( () => {
    if ( checked && run - 1 === prevRun ) {
      // Ready for if statement next time
      // State change for audio
      setPrevRun( prevState => prevState + 1 );
      // Run browser notification
      show();
      if ( sound ) {
        audioRef.current.play();
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
  };

  // eslint-disable-next-line no-unused-vars
  const supported = () => {
    if ( "Notification" in window ) return true;
    return false;
  };

  const [ open, setOpen ] = useState( false );
  const handleCollapse = () => setOpen( prevState => !prevState );

  return (
    <>
    <div className="log-collapse">

      <Collapse isOpened={ open }>
      <div className="notifications-list">

        <div className="notification-toggle">
          <label className="notification-switch">
            <input type="checkbox" onChange={ handleCheckbox } meta="all" checked={ checked.all } />
          </label>
          Notifications on/off
        </div>

        <div className="notification-toggle">
          <label className="notification-switch">
            <input type="checkbox" onChange={ handleCheckbox } meta="sound_start" checked={ checked.sound_start } />
          </label>
          Sound when the timer begins
        </div>

        <div className="notification-toggle">
          <label className="notification-switch">
            <input type="checkbox" onChange={ handleCheckbox } meta="sound_end" checked={ checked.sound_end } />
          </label>
          Sound when the timer ends
        </div>

        <div className="notification-toggle">
          <label className="notification-switch">
            <input type="checkbox" onChange={ handleCheckbox } meta="sound_misc" checked={ checked.sound_misc } />
          </label>
          Any other notification sounds
        </div>

        { ( ( ( run === prevRun ) || ( ( run - 1 ) === prevRun ) ) ) && run > 0 &&
        <div className={ `audio ${ type }` }>
          <audio id="sound" preload="auto" ref={ audioRef }>
            <source src="/notification-sound.mp3" type="audio/mpeg" />
            <source src="/notification-sound.ogg" type="audio/ogg" />
          </audio>
        </div>
        }

      </div>
      </Collapse>

      <button className="smaller-button" onClick={ handleCollapse }>
        { !open ? 'Open Notification Settings' : 'Collapse Settings' } 
        <i className={ `icon-pad-left fas fa-bell${ checked.all ? '-slash' : '' }` }></i>
      </button>
    </div>
    </>
  );
};

BrowserNotification.propTypes = {
  run: PropTypes.number.isRequired, 

  group: PropTypes.string, 
  label: PropTypes.string, 
  type: PropTypes.string, 

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

  group: 'default group', 
  label: 'default timer', 
  type: 'room', 

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
