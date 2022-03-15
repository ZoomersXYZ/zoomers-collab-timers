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
  commonUserFunctionality, 
  simpMe 
) {
  const module = {};
  
  // Run at start
  // @param obj
  // @globals emitRoom()
  // @global @anotherFile timeFormatted()
  function onRoomConnect( preciousHashie ) {
    const { duration, pausedAt, roomie, secondsLeft, session, time, timerFlag, secondsGoneBy } = preciousHashie;
    emitRoom( 'session skipped', { room: roomie, session } );

    // // If time[r] is paused, push time once to show the time.
    const durationBool = !isNaN( duration ) && duration > -1;
    const currentBool = !isNaN( secondsLeft ) && secondsLeft > -1;
    if ( pausedAt && !timerFlag && currentBool && durationBool ) {
      const hashish = { 
        current: secondsLeft, 
        currentFormatted: timeFormatted( secondsLeft ), 

        totalDuration: duration, 
        started: time, 

        paused: !timerFlag, 
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
  // @global @anotherFile initNsp
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
      // core.users.findIndex( arrival => arrival.id === sockId ), 1 
    );
    parentObj.userCount = parentObj.users.length;
  };

  disconnectAnnoyance = function( reason ) {
    // l.karm.debug( 'disconnect() reason', reason );

    const TRANSPORT_CLOSE = 'transport close';
    const TRANSPORT_ERROR = 'transport error';
    const SERVER_DISCONNECT = 'server namespace disconnect';
    const CLIENT_DISCONNECT = 'client namespace disconnect';
    const SERVER_DOWN = 'server shutting down';
    const PING_TIMEOUT = 'piung timeout';

    if ( reason === TRANSPORT_ERROR ) {
      if ( simpMe.reason ) return false;
    } else if ( reason === TRANSPORT_CLOSE ) {
      simpMe.reason = true;
    } else if ( reason !== TRANSPORT_CLOSE && reason !== TRANSPORT_ERROR ) {
      simpMe.reason = false;
    };
    return true;
  };

  // @globals seshie
  // @globals core
  // @globals gCore
  // @globals sockId (socket.id)
  // @globals nspName
  // @global @anotherFile commonUserFunctionality
  module.disconnect = async function( reason ) {    
    if ( !disconnectAnnoyance( reason ) ) return;

    // l.karm.debug( 'disconnect()', 'pre' );
    // if ( seshie.addedUser ) {
    // if ( addedUser ) {
    if ( simpMe.addedUser ) {
      l.karm.debug( `${ sockId }: disconnect() if`, 'simpMe.addedUser' );
      // DD - is there a situation where the user is still 'online' but roomEntered() didnt happen [again]?
      // DD - that would not have the user disconnect then. If so. Doesn't seem like it though.
      --core.numUsers;
      core.users.splice( 
        core.users.findIndex( arrival => arrival.id === sockId ), 1 
        // core.users.findIndex( arrival => arrival.id === sockId ), 1 
      );
      core.userCount = core.users.length;
      // modifyUsers( core );

      --gCore.numUsers
      gCore.users.splice( 
        gCore.users.findIndex( arrival => arrival.id === sockId ), 1 
        // gCore.users.findIndex( arrival => arrival.id === sockId ), 1 
      );
      gCore.userCount = gCore.users.length;
      // modifyUsers( gCore );

      // PP - beta depending on scope of socket 
      // @TODO - the scope matters...users is more broad. shouldnt the users that are removed be the ones for the group?
      if ( gCore.users.length === 0 ) {
        core.groups.splice( 
          core.groups.findIndex( arrival => arrival === nspName ), 1 
        );
      };
      
      const event = 'user left';
      commonUserFunctionality( event );

      // Reset
      simpMe.addedUser = false;
      simpMe.userModuleCount = 0;
      l.bbc.debug( `${ sockId }: fin disconnect. emit`, event );

      await disconnecting();
    };
  };

  // @global @anotherFile async logItWrapper()
  // module.disconnecting = async function() {
  disconnecting = async function() {
    const event = 'left room';
    await logItWrapper( null, event );
    l.bbc.debug( `${ sockId }: fin disconnecting. logItWrapper()`, event );
  };

  return module;
};

module.exports = SocketCoreAndUtils;
