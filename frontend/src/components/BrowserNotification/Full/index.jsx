import React, { useContext, useEffect, useId, useReducer, useState } from "react";
import PropTypes from "prop-types";

import Push from "push.js";
import { Collapse } from 'react-collapse';

import { isObject } from './../../../ancillary/helpers/general';
import { GroupContext } from './../../Contexts';
import ParentNotifications from "./../../Common/ParentNotifications";
import Toggle from './../toggled';
import Noise from './../noise'
import './../styles.scss';

const eachBlob = {
  onOff: false, 
  sound: false, 
  vol: 1, 
  noise: null 
};

const initialBlob = { 
  timer: {
    ...eachBlob, 
    noise: "6", 
    onOff: true, 
    sound: true 
  },
  start: {
    ...eachBlob, 
    noise: "3"
  },
  end: {
    ...eachBlob,
    noise: "3"
  },
  paused: {
    ...eachBlob,
    noise: "8"
  },
  resumed: {
    ...eachBlob,
    noise: "8"
  },
  repeat: {
    ...eachBlob,
    noise: "1"
  }, 
  continuing: {
    ...eachBlob,
    noise: "6"
  }, 
  other: {
    ...eachBlob,
    noise: "11"
  }, 
  extra: {
    ...eachBlob,
    noise: "11"
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

  if ( action.kind == 'check' || action.kind == 'noise' ) {
    let newType = { ...storage[ label ][ type ] };

    if (action.kind == 'check') {
      newType = checkOffData(action.name, storage, label, type);
    } else if (action.kind == 'noise') {
      newType = checkNoise(action.name, action.noise, storage, label, type);
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

  if ( action.kind == 'all' ) {
    let newStorage = null
    if ( action.name == 'all' ) {
      newStorage = checkAllKeys( action.name, storage, label, type, action.checkAll )
    } else if ( action.name == 'sound' ) {
      newStorage = checkAllKeys( action.name, storage, label, type, action.checkAll )
    };

    return { 
      ...state, 
      storage: {
        ...newStorage 
      }
    };
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
    const arr = name.split( ' ' );
    const first = arr[ 0 ];
    const second = arr[ 1 ];

    newType[ first ][ second ] = noise;
  } else {
    newType[ name ] = noise;
  };
  
  return newType
};

const checkAllKeys = ( kind, storage, label, type, checkAll ) => {
  const newStorage = { ...storage };
  if ( kind == 'all' ) {
    for ( const [ key, value ] of Object.entries( storage[ label ][ type ] ) ) {
      if ( key != 'timer' && isObject( newStorage[ label ][ type ][ key ] ) && newStorage[ label ][ type ][ key ].hasOwnProperty( 'onOff' ) ) {
        newStorage[ label ][ type ][ key ].onOff = !checkAll;
      };
    };
  } else if ( kind == 'sound' ) {
    for ( const [ key, value ] of Object.entries( storage[ label ][ type ] ) ) {
      if ( key != 'timer' && isObject( newStorage[ label ][ type ][ key ] ) && newStorage[ label ][ type ][ key ].hasOwnProperty( 'onOff' ) ) {
        newStorage[ label ][ type ][ key ].sound = !checkAll;
      };
    };
  };
  return newStorage;
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

  // console.log( 'run', run, type, group, label );

  const tagId = useId();
  const [ prevRun, setPrevRun ] = useState( 0 );
  const [ state,  dispatch ] = useReducer( reducer, { group, label, type }, init );  
  const [ checked, setChecked ] = useState( state.data );

  const [ checkAll, setCheckAll ] = useState( false );
  const [ checkAllSound, setCheckAllSound ] = useState( false );

  const { groupOnOff, groupSound } = useContext( GroupContext );
  
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

  const handleOnCheckAll = (e) => {
    let action = null
    if ( e.target.name == 'all' ) {
      setCheckAll( prev => !prev );
      action = { name: e.target.name, kind: 'all', checkAll };
    } else if ( e.target.name == 'sound' ) {
      setCheckAllSound( prev => !prev );
      action = { name: e.target.name, kind: 'all', checkAll: checkAllSound };
    };
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
      //   console.log('play')
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

        <ParentNotifications
          onChange={ handleCheckbox } 
          onOffBool={ checked.timer.onOff } 
          soundBool={ checked.timer.sound } 
          parent={ false } 
          onCheckAll={ handleOnCheckAll } 
          checkAll={ checkAll } 
          checkAllSound={ checkAllSound } 
        />

        <div className="notifications-container title">
          <div className="width-6">Type</div>
          <div className="width-2">On/Off</div>
          <div className="width-2">Sound</div>
          <div className="width-3">Vol</div>
          <div className="width-5">Audio</div>
        </div>

        { 
        [ [ checked.start, "Timer Start", "start" ], [ checked.end, "Timer End", "end" ], [ checked.paused, "Pause/Resume", "paused" ], [ checked.repeat, "Repeat Go/End", "repeat" ], [ checked.continuing, "Repeat Cont", "continuing" ], [ checked.other, "Other", "other" ] ].map( ( trioEach, index ) =>
          <Toggle 
            key={ `Toggle-${ index }` } 
            onChange={ handleCheckbox } 
            onChangeNoise={ handleOnChangeNoise } 
            checked={ trioEach[ 0 ] || false } 
            label={ trioEach[ 1 ] } 
            name={ trioEach[ 2 ] } 
            root={ checked.timer } 
            groupOnOff={ groupOnOff } 
            groupSound={ groupSound } 
          />
          )
        }
        <Noise
          timer={ checked.timer } 
          checked={ checked[ event ] }
          { ...{ 
            runBool, 
            prevRun, 
            type, 
            run, 
            event, 
          } } 
        />
      </div>
      </Collapse>

      <button className="smaller-button" onClick={ handleCollapse }>
        { !open ? 'Open Notification Settings' : 'Collapse Settings' } 
        <i className={ `icon-pad-left fas fa-bell${ !checked.timer.onOff ? '-slash' : '' }` }></i>
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
