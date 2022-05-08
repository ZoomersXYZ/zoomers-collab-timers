const l = require( '../config/winston' );
const { isEmpty } = require( '../utilities/general' );

const SharedAndUtil = function ( 
  sockId, 
  
  nspace, 
  getGroupLog, 

  gCore, 
  handle 
) {
  const module = {};

  module.simpMe = { 
    confirmIdPong: false, 
    addedUser: null, 
    userModuleCount: 0, 
    reason: false, 
    confirmIdCount: 0 
  };

  ////
  // Utilities
  //

  // self-contained
  // used as the value of currentFormatted key in diff objs
  // used by onRoomConnect()
  // @param number
  // @param number*
  module.timeFormatted = function( remaining, divideBy = 1 ) {
    const seconds = Math.floor( ( remaining / divideBy ) % 60 );
    const minutes = Math.floor( ( remaining / ( divideBy * 60 ) ) % 60 );
    const hours = Math.floor( ( remaining / ( divideBy * 60 * 60 ) ) % 24 );
    
    let formattedTime = '';

    formattedTime += hours > 0 && hours < 10 ? '0' + hours + ':' 
    : hours === 0 ? '' : hours + ':';

    formattedTime += minutes < 10 ? '0' + minutes + ':' 
    : minutes === 0 ? '00' : minutes + ':';

    formattedTime += seconds < 10 ? '0' + seconds 
    : seconds === 0 ? '00' : seconds;
    
    return formattedTime;
  };

  nspaceEmit = function( event, msg = null ) {
    if ( isEmpty( msg ) ) {
      nspace.emit( event );
    } else {
      nspace.emit( event, msg );
    };
    
    // if ( event !== 'timer updated' ) {
    //   l.bbc.debug( 'nspaceEmit 1st', event );
    // };

    // if ( !isEmpty( msg ) ) {
    //   if ( msg.hasOwnProperty( 'length' ) ) {
    //     l.bbc.debug( 'nspaceEmit 2nd', msg.length );
    //   } else if ( msg.hasOwnProperty( 'count' ) ) {
    //     l.bbc.debug( 'nspaceEmit 2nd', msg.count );
    //   };
    // };
  };

  // @param String
  // @param Object
  // @globals nspace
  // @global_import isEmpty
  module.emitRoom = function( msg, data = null ) {
    let room = null;
    // both room and data
    if ( !isEmpty( data ) && typeof data === 'object' && data.hasOwnProperty( 'room' ) ) {
      room = data.room;
      delete data.room;
    };
    // Fine if room is null too
    if ( !isEmpty( data ) && typeof data === 'object' ) {
      nspaceEmit( msg, { room, ...data } );
    // just room, no data
    } else if( isEmpty( data ) ) {
      nspaceEmit( msg, room );
    // no room or data. plain.
    } else if ( isEmpty( room ) ) {
      nspaceEmit( msg );
    };
  };

  // @globals nspace
  module.groupEmit = ( event, msg = null ) => nspaceEmit( event, msg );

  // @globals seshie
  // @anotherFile getGroupLog()
  module.pongId = async () => {
    module.simpMe.confirmIdPong = true;
    try {
      const res = await getGroupLog();
      l.bbc.info( 'pongId() getGroupLog success', res );
      // undefined
    } catch ( err ) {
      l.bbc.error( `${ sockId }: pongId() getGroupLog fail`, err );
    };
    l.karm.debug( `${ sockId }: pongId()`, 'fin' );
  };

  ////
  // Shared
  ////
  // @param String
  // @globals gCore (gCore.users)
  // @globals seshie (seshie.username)
  // @internal groupEmit()
  module.commonUserFunc = ( event ) => {
    const users = gCore.users;
    const hashie = ( { 
      username: handle, 
      users, 
      count: users.length 
    } );
    module.groupEmit( event, hashie );
    l.bbc.debug( `${ sockId }: fin commonUserFunc(). emit`, event );
    return hashie;
  };

  return module;
};

module.exports = SharedAndUtil;
