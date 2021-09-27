import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Collapse } from 'react-collapse';

import Activity from './../Activity';
import './styles.scss';

const ActivityLog = ( { log, timer, userEnabled, group } ) => {
  const [ localLog, setLog ] = useState( [] );
  const [ toSlice, setSlice ] = useState( -8 );
  useEffect( () => {
    if ( timer ) {
      // console.log( 'timer log', log );
      const slicedLog = log.filter( primer => primer.timer === timer );
      setLog( slicedLog.slice( -10 ) );
      setSlice( -5 );
    } else {
      setLog( log.slice( -20 ) );
    };
  }, [ log, timer ] );

  const [ open, setOpen ] = useState( false );
  const handleCollapse = () => setOpen( prevState => !prevState );
  return (
    <>
    { userEnabled && 
    <div id="parent-activity-log" className={ `${ timer ? 'timer' : null }` }>
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
          { localLog.slice( 0, toSlice ).map( ( arrival, index ) => 
            <Activity
              key={ `full-log-${ index }` } 
              name={ arrival.username } 
              email={ arrival.email } 
              group={ group && arrival.group } 
              timer={ arrival.timer } 
              activity={ arrival.activity } 
              formattedTime={ arrival.formattedTime } 
            />
          ) }
        </Collapse>

        { localLog.slice( toSlice ).map( ( arrival, index ) => 
          <Activity
            key={ `log-clip-${ index }` } 
            name={ arrival.username } 
            email={ arrival.email } 
            group={ group && arrival.group } 
            timer={ arrival.timer } 
            activity={ arrival.activity } 
            formattedTime={ arrival.formattedTime } 
          />
        ) }
      </div>
    </div>
    }
    </>
  );
};

ActivityLog.propTypes = {
  log: PropTypes.array.isRequired, 
  timer: PropTypes.string, 
  userEnabled: PropTypes.bool, 
  group: PropTypes.string 
};

ActivityLog.defaultProps = { 
  log: [], 
  timer: null, 
  userEnabled: false, 
  group: null 
};

export default ActivityLog;
