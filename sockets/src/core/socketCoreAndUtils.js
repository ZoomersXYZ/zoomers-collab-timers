const l = require( './../config/winston' );
const { isEmpty } = require( './../utilities/general' );

const InitNsp = require( './InitNsp' )();

////
// Room/Timers utility/initial code
////

// @param addedUser -> seshie.addedUser
// @param initSassy -> initNsp.sassy
// @param socket: .id, .join
const SocketCoreAndUtils = function ( 
  socket, 
  sassy, 
  thisTimer, 
  seshie, 
  core, 
  gCore, 
  nspName, 

  emitRoom, 
  logItWrapper, 
  commonUserFunc, 
  simpMe 
) {
  const module = {};
  
  // Run at start
  // @param obj
  // @globals emitRoom()
  async function onRoomConnect( preciousHashie ) {
    // l.bbc.debug( `${ socket.id }: beg /inner/ onRoomConnect. emit`);
    // await delay( 2500 );
    const { duration, roomie, secondsLeft, session, started, pause, goneBy } = preciousHashie;
    // initialSession( roomie, session, pause.flag );

    emitRoom( 'session initial setty' );
    // // If time[r] is paused, push time once to show the time.
    const durationBool = !isNaN( duration ) && duration > -1;
    const currentBool = !isNaN( secondsLeft ) && secondsLeft > -1;
    // if ( pause.started && !pause.flag && currentBool && durationBool ) {
      const hashish = { 
        current: secondsLeft, 

        duration, 
        started, 

        paused: !pause.flag, 
        pause, 

        goneBy, 
        session 
      };
      const event = 'timer updated';
      emitRoom( event, { room: roomie, ...hashish } );
      l.bbc.debug( `${ socket.id }: fin /inner/ onRoomConnect. emit`, event );
    // };
  };

  // * @param inRoom: String
  //
  // * @anotherFile emitRoom()
//   function initialSession( room, session, pauseFlag ) {
//     if ( pauseFlag ) return;
//     emitRoom( 'session initial set', { room, session } );
//   };
 
  // @param String
  // @globals sassy
  // @globals sockJoin (socket.join)
  // @globals nspName
  // @anotherFile initNsp
  module.roomEntered = async function( initialRoom ) {
    const roomProp = sassy.hasOwnProperty( initialRoom );
    if ( 
      !roomProp || ( roomProp && isEmpty( sassy[ initialRoom ] ) ) 
    ) {
      sassy[ initialRoom ] = InitNsp.sassy( initialRoom, nspName );
      thisTimer = sassy[ initialRoom ];
      l.karm.debug( 'init', sassy[ initialRoom ] );
    };
    simpMe.sRoom = `${ nspName }-${ initialRoom }`;
    socket.join( simpMe.sRoom );
    simpMe.room = initialRoom;

    // await onRoomConnect( sassy[ initialRoom ]);
    l.bbc.debug( `${ socket.id }: fin roomEntered. socket join`, initialRoom );
  };

  modifyUsers = function( parentObj, socket ) {
    --parentObj.numUsers;
    parentObj.users.splice( 
      parentObj.users.findIndex( arrival => arrival.id === socket.id ), 1 
    );
    parentObj.userCount = parentObj.users.length;
    return parentObj;
  };

  disconnectAnnoyance = function( reason, loggy = null ) {
    loggy = loggy === null ? l : loggy;
    
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
  // @globals socket.id (socket.id)
  // @globals nspName
  // @anotherFile commonUserFunc
  module.disconnect = async function( reason ) {
    // l.karm.debug( 'disconnect core', core );
    l.karm.debug( 'init', simpMe.initialized );
    if ( simpMe.initialized == false ) return;
    if ( !disconnectAnnoyance( reason ) ) return;

    if ( simpMe.addedUser ) {
      l.karm.debug( `${ socket.id }: disconnect() if`, 'simpMe.addedUser' );

      // DD - chance user is still 'online' but roomEntered() didnt happen [again]?
      // DD - if so, the user wouldn't have disconnected. Doesn't seem like it

      // modifyUsers( core, socket );
      --core.numUsers;
      core.users.splice( 
        core.users.findIndex( arrival => arrival.id === socket.id ), 1 
      );
      core.userCount = core.users.length;

      // modifyUsers( gCore, socket );
      --gCore.numUsers
      gCore.users.splice( 
        gCore.users.findIndex( arrival => arrival.id === socket.id ), 1 
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
      l.bbc.debug( `${ socket.id }: fin disconnect. emit`, event );

      await disconnecting();
    };
  };

  // @anotherFile async logItWrapper()
  // module.disconnecting = async function() {
  disconnecting = async function() {
    const event = 'left room';
    const aUser = { nick: seshie.username, email: seshie.email };
    await logItWrapper( null, aUser, event );
    // @TODO why isn't seshie, et al being wiped? Will the seshie/socket.id disappear after this?
    l.bbc.debug( `${ socket.id }: fin disconnecting. logItWrapper()`, event );
  };

  return module;
};

module.exports = SocketCoreAndUtils;
