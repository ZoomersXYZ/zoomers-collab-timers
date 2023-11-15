const l = require( '../config/winston' );
const { isEmpty } = require( '../utilities/general' );

const SharedAndUtil = function ( 
  socket, 
  
  nspace, 
  nspName, 
  getGroupLog, 

  core, 
  seshie 
  // handle 
) {
  const module = {};

  module.simpMe = { 
    room: '', 
    confirmIdPong: 0, 
    addedUser: null, 
    userModuleCount: 0, 
    reason: false, 
    confirmIdCount: 0, 
    initialized: false, 
    sRoom: '', 
    sUser: '' 
  };

  ////
  // Utilities
  //

  // @param String
  // @param Object
  // @globals nspace
  // @global_import isEmpty
  module.emitRoom = function( msg, data = null, callback = true ) {
    // l.bbc.debug( msg, data );
    let room = null;
    // both room and data
    if ( !isEmpty( data ) && typeof data === 'object' && data.hasOwnProperty( 'room' ) ) {
      room = data.room;
      delete data.room;
    };
    // Fine if room is null too
    if ( !isEmpty( data ) && typeof data === 'object' ) {
      // nspaceEmit( msg, { room, ...data } );
      // l.bbc.debug( `22 nspName: ${ nspName }, room: ${ room }, msg: ${ msg }` );
      socket.to( `${ nspName }-${ room }` ).emit( msg, { room, ...data } );
      if (callback) {
        socket.emit(msg, {room, ...data});
      };
    // just room, no data
    } else if( isEmpty( data ) && !isEmpty( room ) ) {
      // l.bbc.debug( `33 nspName: ${ nspName }, room: ${ room }, msg: ${ msg }` );
      socket.to( `${ nspName }-${ room }` ).emit( msg, room );
      if (callback) {
        socket.emit( msg, room );
      };
    // no room or data. plain.
    } else if ( isEmpty( room ) && !isEmpty(data) ) {
      // l.bbc.debug( `44 nspName: ${ nspName }, room: ${ room }, msg: ${ msg }` );
      socket.to(nspName).emit(msg, data);
      if (callback) {
        socket.emit(msg, data);
      };
    } else if ( isEmpty( room ) && isEmpty( data) ) {
      // l.bbc.debug( `55 nspName: ${ nspName }, room: ${ room }, msg: ${ msg }` );
      socket.to(nspName).emit(msg);
      if (callback) {
        socket.emit(msg);
      };
    };
  };

  // @globals nspace
  module.groupEmit = ( event, msg = null ) => {
    socket.to(`group-${nspName}`).emit(event, msg);
    socket.emit( event, msg );
    // socket.broadcast.emit( event, msg );
  };

  // @internal simpMe
  // @anotherFile getGroupLog()
  // @anotherFile socket.id
  module.pongId = async () => {
    ++module.simpMe.confirmIdPong;
    try {
      const res = await getGroupLog();
      // MASS COMMENTING OF LOGS 2023-10-09
      // l.bbc.info( 'pongId() getGroupLog success', res );
      // undefined
    } catch ( err ) {
      l.bbc.error( `${ socket.id }: pongId() getGroupLog fail`, err );
    };
    // MASS COMMENTING OF LOGS 2023-10-09
    // l.parm.debug( `${ socket.id }: pongId()`, 'fin' );
  };

  ////
  // Shared
  ////
  // @param String
  // @globals gCore (gCore.users)
  // @anotherFile handle
  // @anotherFile socket.id
  // @internal groupEmit()
  module.commonUserFunc = ( event ) => {
    const users = core.users[nspName];
    const hashie = ( { 
      // username: handle, 
      username: seshie.username, 
      users, 
      count: users.length 
    } );
    // module.groupEmit( event, hashie );
    // MASS COMMENTING OF LOGS 2023-10-09
    // l.bbc.debug( `${ socket.id }: fin commonUserFunc(). emit`, event );
    return hashie;
  };

  return module;
};

module.exports = SharedAndUtil;
