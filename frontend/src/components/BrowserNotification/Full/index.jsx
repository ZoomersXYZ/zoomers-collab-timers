import React, { useEffect, useReducer, useState, useId } from "react";
import PropTypes from "prop-types";

import Push from "push.js";
import { Collapse } from 'react-collapse';

import Toggle from './../toggled';
import Noise from './../noise'
import './../styles.scss';

import { isObject } from './../../../ancillary/helpers/general';

const eachBlob = {
  onOff: false, 
  sound: false, 
  vol: 1, 
  noise: null 
};

const initialBlob = { 
  timer: {
    ...eachBlob, 
    noise: "[3] waterdrop"
  },
  start: {
    ...eachBlob, 
    noise: "[2][b] military-new-message"
  },
  end: {
    ...eachBlob,
    noise: "[2][b] military-new-message"
  },
  paused: {
    ...eachBlob,
    noise: "[3][b] gun-silencer"
  },
  resumed: {
    ...eachBlob,
    noise: "[3][b] gun-silencer"
  },
  repeat: {
    ...eachBlob,
    noise: "[1] the-purge-siren"
  }, 
  continuing: {
    ...eachBlob,
    noise: "[3] waterdrop"
  }, 
  other: {
    ...eachBlob,
    noise: "[3] waterdrop"
  }, 
  extra: {
    ...eachBlob,
    noise: "[3] waterdrop"
  }, 
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

  if (storage.hasOwnProperty(label) && storage[label].hasOwnProperty(type)) {
    for (let key in initialBlob) {
      if (!storage[label][type].hasOwnProperty(key)) {
        storage[label][type][key] = initialBlob[key]
        if (!flag) {
          flag = true;
        };
      };
    };
  };

  if ( flag ) {
    localStorage.setItem( group, JSON.stringify( storage ) );
  };

  const data = storage[ label ][ type ];
 
  return { storage, data, label, type };
};

function reducer( state, action ) {  
  const { label, type, storage } = state;  
  let newType = { ...storage[ label ][ type ] };

  if (action.kind == 'check') {
    console.log('check', newType);
    newType = checkOffData(action.name, storage, label, type);
    console.log('hi');
  } else if (action.kind == 'noise') {
    console.log('noise', newType);
    newType = checkNoise(action.name, action.noise, storage, label, type);
  };

  console.log('act', action);
  console.log('wat', newType);

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

const checkOffData = ( name, storage, label, type ) => {
  const newType = { ...storage[ label ][ type ] };
  let newVal = null;

  if ( name.includes( ' ' ) ) {
    const arr = name.split( ' ' );
    const first = arr[ 0 ];
    const second = arr[ 1 ];

    newVal = !storage[ label ][ type ][ first ][ second ];
    newType[ first ][ second ] = newVal;
  } else {
    newVal = !storage[ label ][ type ][ name ];
    newType[ action ] = newVal;
  };
  
  return newType
};

const checkNoise = ( name, noise, storage, label, type ) => {
  const newType = { ...storage[ label ][ type ] };

  if ( name.includes( ' ' ) ) {
    const arr = action.split( ' ' );
    const first = arr[ 0 ];
    const second = arr[ 1 ];

    newType[ first ][ second ] = noise;
  } else {
    newType[ name ] = noise;
  };
  
  return newType
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
    requireInteraction 
  } = props;

  const tagId = useId();
  const [ prevRun, setPrevRun ] = useState( 0 );
  // const audioRef = useRef();
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

  const handleCheckbox = (e) => {
    const action = {name: e.target.name, kind: 'check'};
    dispatch(action);
  };

  const handleOnChangeNoise = (e) => {
    const action = {name: e.target.name, kind: 'noise', noise: e.target.value};
    dispatch(action);
  };

  useEffect( () => { 
    if ( !event ) return;
    if ( (checked.timer.onOff && checked[ event ].onOff) && run - 1 === prevRun ) {
      // For passing if statement next time
      setPrevRun( prev => prev + 1 );

      // Run browser notification
      show();

      // if ( checked.timer.sound || checked[ event ].sound ) {
      //   audioRef.current.play();
      // };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ run ] );

  const runBool = ( ( ( run === prevRun ) || ( ( run - 1 ) === prevRun ) ) ) && run > 0;

  const show = () => {
    Push.create( title, 
      {
        body, 
        icon, 
        tagId, 
        timeout, 
        requireInteraction 
      } 
    )
  };

  // eslint-disable-next-line no-unused-vars
  const close = ( tagId ) => {
    Push.close( tagId );
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

        <label className="switch onoff">
          <input
            type="checkbox" 
            name="timer onOff"
            onChange={ handleCheckbox }
            checked={ checked.timer.onOff }
            className="toggle"
          />
          On/Off <span className="slider"></span>
        </label>

        <div className="notifications-container title">
          <div className="width-7">Type</div>
          <div className="width-3">On/Off</div>
          <div className="width-3">Sound</div>
          <div className="width-5">Vol</div>
          <div className="width-5">Audio</div>
        </div>

        <Toggle 
          onChange={ handleCheckbox } 
          onChangeNoise={ handleOnChangeNoise }
          checked={ checked.start || false } 
          label="Timer Start" 
          name="start" 
          root={ checked.timer } 
          runBool={ runBool } 
          type={ type } 
        />

        <Noise
          timer={ checked.timer } 
          noise={ checked.start.noise }
          { ...{ 
            runBool, 
            type, 
            run, 
            event, 
          } } 
        />

        <Toggle 
          onChange={ handleCheckbox } 
          checked={ checked.end || false } 
          label="Timer End" 
          name="end" 
          root={ checked.timer } 
          runBool={ runBool } 
          type={ type } 
        />

        <Toggle 
          onChange={ handleCheckbox } 
          checked={ checked.paused || false } 
          label="Paused/Resumed" 
          name="paused" 
          root={ checked.timer } 
          runBool={ runBool } 
          type={ type } 
        />

        <Toggle 
          onChange={ handleCheckbox } 
          checked={ checked.repeat || false } 
          label="Repeating Start/End" 
          name="repeat" 
          root={ checked.timer } 
          runBool={ runBool }
          type={ type } 
        />

        { runBool &&
        <div className={ `audio ${ type }` }>
          <audio id="sound" preload="auto" ref={ audioRef }>
            <source src="/sounds/[4] ting.mp3" type="audio/mpeg" />
            <source src="/sounds/[4] ting.ogg" type="audio/ogg" />
          </audio>
        </div>
        }

        <Toggle 
          onChange={ handleCheckbox } 
          checked={ checked.continuing || false } 
          label="Repeating Cont" 
          name="continuing" 
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

        <Toggle 
          onChange={ handleCheckbox } 
          checked={ checked.other || false } 
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
  timeout: null, 
  requireInteraction: null, 
  // vol: 1 
};

export default BrowserNotification;
