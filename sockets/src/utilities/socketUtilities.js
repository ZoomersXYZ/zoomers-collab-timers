////
// Websocket utilities
////

const objValues = ( arrayOfObjects ) => arrayOfObjects.map( arrival => ( { username: arrival.username, email: arrival.email } ) );

const filterForUsernameEmail = ( arr ) =>
  arr.map( arrival => { 
    const { username, email } = arrival;
    return { username, email };
  } );

const commonReturn = ( handle, users, numUsers ) => ( {
  // username: socket.username, 
  username: handle, 
  users: filterForUsernameEmail( users ), 
  count: users.length, 
  numUsers: numUsers 
} );

const fullCommonReturn = ( event, socket, nsUsers, numUsers, differentiate = false ) => {
  if ( differentiate ) {
    broadcastCommonReturn( `${ event } -- Broadcast`, socket, nsUsers, numUsers );
    limitedCommonReturn( `${ event } -- Client`, socket, nsUsers, numUsers );
    return true;
  };

  broadcastCommonReturn( event, socket, nsUsers, numUsers );
  limitedCommonReturn( event, socket, nsUsers, numUsers );
  return true;
};

const broadcastCommonReturn = ( event, socket, nsUsers, numUsers, broadcast = true ) => 
  ( broadcast ) ? 
    socket.emit( event, commonReturn( socket.username, nsUsers, numUsers ) ) :
    socket.broadcast.emit( event, commonReturn( socket.username, nsUsers, numUsers ) );

const limitedCommonReturn = ( event, socket, nsUsers, numUsers ) => broadcastCommonReturn( event, socket, nsUsers, numUsers, false );

exports.fullCommonReturn = fullCommonReturn;
exports.broadcastCommonReturn = broadcastCommonReturn;
exports.limitedCommonReturn = limitedCommonReturn;
