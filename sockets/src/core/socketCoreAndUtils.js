const l = require( './../config/winston' );
const { isEmpty } = require( './../utilities/general' );

////
// Room/Timers utility/initial code
////

// @param addedUser -> seshie.addedUser
// @param initSassy -> initNsp.sassy
// @param socket: .id, .join
const SocketCoreAndUtils = function ( 
  sockId, 
  
  socket, 
  sassy, 
  seshie, 
  core, 
  gCore, 
  nspName, 

  emitRoom, 
  initSassy, 
  logItWrapper, 
  timeFormatted, 
  commonUserFunc, 
  simpMe 
) {
  const module = {};
  
  // Run at start
  // @param obj
  // @globals emitRoom()
  // @anotherFile timeFormatted()
  function onRoomConnect( preciousHashie ) {
    const { duration, pausedAt, roomie, secondsLeft, session, time, pauseFlag, secondsGoneBy } = preciousHashie;
    emitRoom( 'session skipped', { room: roomie, session } );

    // // If time[r] is paused, push time once to show the time.
    const durationBool = !isNaN( duration ) && duration > -1;
    const currentBool = !isNaN( secondsLeft ) && secondsLeft > -1;
    if ( pausedAt && !pauseFlag && currentBool && durationBool ) {
      const hashish = { 
        current: secondsLeft, 
        currentFormatted: timeFormatted( secondsLeft ), 

        totalDuration: duration, 
        started: time, 

        paused: !pauseFlag, 
        pausedAt: pausedAt, 

        ongoingTime: secondsGoneBy 
      };
      const event = 'timer updated';
      emitRoom( event, { room: roomie, ...hashish } );
      l.bbc.debug( `${ sockId }: fin /inner/ onRoomConnect. emit`, event );
    };
  };
 
  // @param String
  // @globals sassy
  // @globals sockJoin (socket.join)
  // @globals nspName
  // @anotherFile initNsp
  module.roomEntered = function( initialRoom ) {
    if ( 
      ( !sassy.hasOwnProperty( initialRoom ) )
      || 
      ( sassy.hasOwnProperty( initialRoom ) && isEmpty( sassy[ initialRoom ] ) ) 
    ) {
      sassy[ initialRoom ] = initSassy( initialRoom, nspName );
    };
    const curr = sassy[ initialRoom ];
    const { roomie } = curr;

    onRoomConnect( curr );
    socket.join( roomie );
    l.bbc.debug( `${ sockId }: fin roomEntered. socket join`, roomie );
  };

  modifyUsers = function( parentObj, sockId ) {
    --parentObj.numUsers;
    parentObj.users.splice( 
      parentObj.users.findIndex( arrival => arrival.id === sockId ), 1 
    );
    parentObj.userCount = parentObj.users.length;
    return parentObj;
  };

  disconnectAnnoyance = function( reason ) {    
    const TRANSPORT_CLOSE = 'transport close';
    const TRANSPORT_ERROR = 'transport error';

    if ( reason === TRANSPORT_ERROR ) {
      l.karm.debug( 'disconnect():', reason );
      if ( simpMe.reason ) return false;
    } else if ( reason === TRANSPORT_CLOSE ) {
      l.karm.debug( 'disconnect():', reason );
      simpMe.reason = true;
    } else if ( reason !== TRANSPORT_CLOSE && reason !== TRANSPORT_ERROR ) {
      l.karm.debug( 'disconnect() reason', reason );
      simpMe.reason = false;
    };
    return true;
  };

  // @globals simpMe
  // @globals core
  // @globals gCore
  // @globals sockId (socket.id)
  // @globals nspName
  // @anotherFile commonUserFunc
  module.disconnect = async function( reason ) {    
    if ( !disconnectAnnoyance( reason ) ) return;

    if ( simpMe.addedUser ) {
      l.karm.debug( `${ sockId }: disconnect() if`, 'simpMe.addedUser' );

      // DD - chance user is still 'online' but roomEntered() didnt happen [again]?
      // DD - if so, the user wouldn't have disconnected. Doesn't seem like it

      // modifyUsers( core, sockId );
      --core.numUsers;
      core.users.splice( 
        core.users.findIndex( arrival => arrival.id === sockId ), 1 
      );
      core.userCount = core.users.length;

      // modifyUsers( gCore, socketId );
      --gCore.numUsers
      gCore.users.splice( 
        gCore.users.findIndex( arrival => arrival.id === sockId ), 1 
      );
      gCore.userCount = gCore.users.length;

      if ( gCore.users.length === 0 ) {
        core.groups.splice( 
          core.groups.findIndex( arrival => arrival === nspName ), 1 
        );
      };
      
      const event = 'user left';
      commonUserFunc( event );

      // Reset
      simpMe.addedUser = false;
      simpMe.userModuleCount = 0;
      l.bbc.debug( `${ sockId }: fin disconnect. emit`, event );

      await disconnecting();
    };
  };

  // @anotherFile async logItWrapper()
  // module.disconnecting = async function() {
  disconnecting = async function() {
    const event = 'left room';
    const aUser = { nick: seshie.username, email: seshie.email };
    await logItWrapper( null, aUser, event );
    // @TODO why isn't seshie, et al being wiped? Will the seshie/sockId disappear after this?
    l.bbc.debug( `${ sockId }: fin disconnecting. logItWrapper()`, event );
  };

  return module;
};

module.exports = SocketCoreAndUtils;
