import React, { useEffect, useReducer, useRef, useState } from "react";
import PropTypes from "prop-types";

import Push from "push.js";
import { nanoid } from "nanoid";
import { Collapse } from 'react-collapse';

import Toggle from './../toggled';
import './../styles.scss';

const initialBlob = { 
  timer: {
    onOff: false, 
    sound: false, 
    vol: 1 
  },
  start: {
    onOff: false, 
    sound: false, 
    vol: 1 
  },
  end: {
    onOff: false, 
    sound: false, 
    vol: 1 
  },
  other: {
    onOff: false, 
    sound: false, 
    vol: 1 
  }, 
  testy: 'lol' 
};

function init( { group, label, type } ) { 
  let flag = false;
  const blobby = localStorage.getItem( group ) || JSON.stringify( 
    { 
      [ label ]: { 
        [ type ]: { ...initialBlob } 
      }
    }
  );

  if ( !localStorage.getItem( group ) ) { flag = true; };
  
  const storage = JSON.parse( blobby );

  if ( !storage.hasOwnProperty( label )  ) {
    storage[ label ] = {
      [ type ]: { ...initialBlob } 
    };
    flag = true;
  };

  if ( storage.hasOwnProperty( label ) && !storage[ label ].hasOwnProperty( type ) ) {
    storage[ label ][ type ] = { ...initialBlob };
    flag = true;
  };

  if ( flag ) {
    localStorage.setItem( group, JSON.stringify( storage ) );
  };

  const data = storage[ label ][ type ];

  return { storage, data, label, type };
};

function reducer( state, action ) {
  const { label, type, storage } = state;

  const newType = { ...storage[ label ][ type ] };
  let newVal = null;
  if ( action.includes( ' ' ) ) {
    const arr = action.split( ' ' );
    const first = arr[ 0 ];
    const second = arr[ 1 ];

    newVal = !state.storage[ label ][ type ][ first ][ second ];
    newType[ first ][ second ] = newVal;
  } else {
    newVal = !state.storage[ label ][ type ][ action ];
    newType[ action ] = newVal;
  };

  const newStorage = {
    [ label ]: {
      ...storage[ label ], 
      [ type ]: {
        ...storage[ label ][ type ], 
        ...newType
      }
    }
  };

  return { 
    ...state, 
    storage: {
      ...storage,
      ...newStorage 
    }, 
    data: { 
      ...newType 
    }
  };
};

const BrowserNotification = ( props ) => {
  const { 
    run, 

    type, 
    group, 
    label, 

    title, 
    body, 

    event, 

    icon, 

    timeout, 
    requireInteraction, 
    tag 
  } = props;

  const [ prevRun, setPrevRun ] = useState( 0 );
  const audioRef = useRef();
  const [ state,  dispatch ] = useReducer( reducer, { group, label, type }, init );  
  const [ checked, setChecked ] = useState( state.data );
  
  useEffect( () => { 
    const localSet = () => {
      localStorage.setItem( group, JSON.stringify( state.storage ) );
    };
    localSet();
  }, [ group, state.storage ] );

  useEffect( () => { 
    setChecked( state.data )
  }, [ state.data ] );

  const handleCheckbox = ( e ) => {
    const name = e.target.name;
    dispatch( name );
  };

  useEffect( () => { 
    console.log( 'push useEffect run' );
    if ( !event ) return;
    console.log( 'push, there is an event' );
    if ( checked.timer.onOff && checked[ event ].onOff && run - 1 === prevRun ) {
      console.log( 'push, run passes' );
      // For passing if statement next time
      setPrevRun( prev => prev + 1 );

      // Run browser notification
      show();

      if ( checked.timer.sound && checked[ event ].sound ) {
        audioRef.current.play();
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ run ] );

  const runBool = ( ( ( run === prevRun ) || ( ( run - 1 ) === prevRun ) ) ) && run > 0;

  const show = () => {
    Push.create( title, 
      {
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

        <div className="notifications-container title">
          <div className="width-7">Type</div>
          <div className="width-3">On/Off</div>
          <div className="width-3">Sound</div>
          <div className="width-5">Vol</div>
        </div>

        <Toggle 
          onChange={ handleCheckbox } 
          checked={ checked.timer } 
          label="All" 
          name="timer" 
        />

        <Toggle 
          onChange={ handleCheckbox } 
          checked={ checked.start } 
          label="Timer Start" 
          name="start" 
          root={ checked.timer } 
        />

        <Toggle 
          onChange={ handleCheckbox } 
          checked={ checked.end } 
          label="Timer End" 
          name="end" 
          root={ checked.timer } 
        />

        <Toggle 
          onChange={ handleCheckbox } 
          checked={ checked.other } 
          label="Other" 
          name="other" 
          root={ checked.timer } 
        />

        { runBool &&
        <div className={ `audio ${ type }` }>
          <audio id="sound" preload="auto" ref={ audioRef }>
            <source src="/sounds/[4] ting.mp3" type="audio/mpeg" />
            <source src="/sounds/[4] ting.ogg" type="audio/ogg" />
          </audio>
        </div>
        }

      </div>
      </Collapse>

      <button className="smaller-button" onClick={ handleCollapse }>
        { !open ? 'Open Notification Settings' : 'Collapse Settings' } 
        <i className={ `icon-pad-left fas fa-bell${ checked.timer ? '-slash' : '' }` }></i>
      </button>
    </div>
    </>
  );
};

BrowserNotification.propTypes = {
  type: PropTypes.string, 

  group: PropTypes.string, 
  label: PropTypes.string, 
  run: PropTypes.number.isRequired, 
  // sound: PropTypes.bool, 
  title: PropTypes.string.isRequired, 
  body: PropTypes.string, 
  // start, end, other
  event: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.bool 
  ] ), 
  icon: PropTypes.string, 
  timeout: PropTypes.number, 
  tag: PropTypes.string, 
  requireInteraction: PropTypes.string, 
  // vol: PropTypes.number 
};

BrowserNotification.defaultProps = { 
  type: 'room', 
  
  group: 'default group', 
  label: 'default timer', 
  run: 0, 
  // sound: false, 
  title: "Yoo", 
  body: null, 
  event: false, 

  icon: null, 
  tag: nanoid(), 
  timeout: null, 
  requireInteraction: null, 
  // vol: 1 
};

export default BrowserNotification;
