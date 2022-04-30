import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { Collapse } from 'react-collapse';
import { formatRelative, sub } from 'date-fns';
import { collection, onSnapshot, limit, query, where, orderBy } from "firebase/firestore";

import db from './../../config/firebase';

import Activity from './../Activity';
import './styles.scss';

import { GroupContext, RoomContext } from '../Contexts';

const SubActivityLog = ( activityLog, collapse, toSlice, keyInfo ) => {
  const thisLog = collapse ? activityLog.slice( 0, toSlice ) : activityLog.slice( toSlice );
  return( 
    <>
    { thisLog.map( ( { username, email, manager, group, timer, activity, desc, meta, repeatAuto, formattedTime }, index ) => 
      <Activity
        key={ `${ keyInfo }-${ index }` } 
        name={ username } 
        { ...{ 
          email, 
          manager, 

          group, 
          timer, 
          activity, 
          desc, 
          meta, 
          repeatAuto, 
          formattedTime 
        } } 
      />
    ) }
    </>
  )
};

const ActivityLog = ( { userEnabled } ) => {
  const { gName } = useContext( GroupContext );
  const __room = useContext( RoomContext );
  const timer = __room ? __room.name : null;

  // timer prop - but it is only around when 
  const [ localLog, setLog ] = useState( [] );
  const [ toSlice, setSlice ] = useState( -8 );

  useEffect( () => {
    // Core
    const d = new Date();
    const aYearAgo = sub( d, {
      days: 365 
    } ).getTime();

    const rootRef = collection( db, 'groups', gName, 'log' );
    let ref;
    if ( timer ) {

      ref = query( 
        rootRef, 
        where( 'timer', '==', timer ), 
        where( 'timestamp', '>', aYearAgo ), 
        orderBy( 'timestamp', 'desc' ), 
        limit( 15 ) 
      );
      setSlice( -5 );

    } else {

      ref = query( 
        rootRef, 
        where( 'timestamp', '>', aYearAgo ), 
        orderBy( 'timestamp', 'desc' ), 
        limit( 40 ) 
      );
      setSlice( -8 );

    };

    const stream = onSnapshot( 
      ref, 
      doc => {
        const arr = [];
        const current = new Date();
        doc.forEach( solo => { 
          const data = solo.data();
          data.formattedTime = formatRelative( data.timestamp, current );
          arr.push( data );
        } );
        arr.reverse();
        setLog( arr );
      }, 
      err => {
        console.log( err );
      } 
    );
    return () => stream();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const [ open, setOpen ] = useState( false );
  const handleCollapse = () => setOpen( prevState => !prevState );
  return (
    <>
    { userEnabled && 
    <div id="parent-activity-log" className={ `${ timer ? 'timer' : 'main-overall' }` }>
      <div id="activity-log-header">
        <h3>
          Activity Log
        </h3>
        <div className="log-collapse">
          <button className="casual-button" onClick={ handleCollapse }>
            { !open ? 'Expand' : 'Collapse' } 
            <i className={ `icon-pad-left far fa-${ !open ? 'expand' : 'compress' }-arrows-alt` }></i>
          </button>
        </div>
      </div>
      <div id="activity-log">
        <Collapse isOpened={ open }>
          <SubActivityLog 
            activityLog={ localLog } 
            keyInfo='full-log' 
            collapse={ open } 
            toSlice={ toSlice } 
          />
        </Collapse>

        <SubActivityLog 
          activityLog={ localLog } 
          keyInfo='log-clip' 
          collapse={ false } 
          toSlice={ toSlice } 
        />
      </div>
      
      <div className="barrier" />
    </div>
    }
    </>
  );
};

ActivityLog.propTypes = {
  userEnabled: PropTypes.bool 
};

ActivityLog.defaultProps = { 
  userEnabled: false 
};

export default ActivityLog;
