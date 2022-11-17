import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RoomOverlay = ( { 
  className, 
  view, 
} ) => { 
  // const {
  //     curry, reap, session, push, events 
  // } = useRoomHooks();
  const [ showTimer, setShowTimer ] = useState( false );

  return (
    <div className={ className }>
      { view &&
      <button className="sauce-button">
        <i>Saving</i>
        <i className={ `icon-pad-left far fa-compress-arrows-alt` }></i>
      </button>
      }
    </div>
  ); 
};

RoomOverlay.propTypes = {
  className: PropTypes.string, 
  view: PropTypes.bool 
};

RoomOverlay.defaultProps = {  
  className: 'timer__overlay', 
  view: false 
};

export default RoomOverlay;
