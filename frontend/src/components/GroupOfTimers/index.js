// Core React
import React from 'react';
import PropTypes from 'prop-types';

import { SocketContext, RoomContext } from '../Contexts';
import Room from './../Room/Room';

// Main component
const GroupOfTimers = ( { 
  check, 
  socket, 
  rooms, 
  userEnabled 
} ) => (
  <SocketContext.Provider value={ socket }>
    { check && 
      <div id="all-timers">
      { rooms.map( ( aRoom, index ) => 
          <RoomContext.Provider 
            key={ `aRoom-Provider-${ index }` } 
            value={ { ...aRoom, emitRoom: ( msg ) => socket.emit( msg, aRoom.name ) } }
          >
            <Room 
              key={ `aRoom-${ aRoom.name }` } 
              { ...{ userEnabled } } 
            />
          </RoomContext.Provider>
        )
      }
      </div>
    }
  </SocketContext.Provider>
);

GroupOfTimers.propTypes = {
  check: PropTypes.bool.isRequired, 
  socket: PropTypes.object.isRequired, 
  rooms: PropTypes.array, 
  userEnabled: PropTypes.bool 
};

GroupOfTimers.defaultProps = { 
  check: false, 
  rooms: [], 
  userEnabled: false 
};

export default GroupOfTimers;
