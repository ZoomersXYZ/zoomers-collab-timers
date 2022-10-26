// Core React
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { 
  SocketContext, 
  RoomContext, 
  UserContext 
} from '../Contexts';
import Room from './../Room/Room';

// Main component
const GroupOfTimers = ( { 
  check, 
  socket, 
  rooms, 
  userEnabled 
} ) => {
  const aUser = useContext( UserContext );
  const roomValue = ( aRoom ) => { 
    return { 
      ...aRoom, 
      emitRoom: ( msg, ...restoros ) => socket.emit( msg, aRoom.name, ...restoros ), 
      emitAll: ( msg, ...restoros ) => socket.emit( msg, aRoom.name, aUser, ...restoros ) 
    };
  };
  return( 
  <SocketContext.Provider value={ socket }>
    { check && 
      <div id="all-timers">
      { rooms.map( ( aRoom, index ) => 
          <RoomContext.Provider 
            key={ `aRoom-Provider-${ index }` } 
            value={ roomValue( aRoom ) } 
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
) };

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
