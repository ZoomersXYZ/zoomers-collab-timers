const l = require( './../config/winston' );
const { isEmpty, isObject } = require( './../utilities/general' );
const InitNsp = require( './InitNsp' )();

////
// Initializing Variables
////

let nspace = null;
let nspName = null;
// shortening
const v = process.env;

let core = null;
let seshie = null;
let sassy = null;
let gCore = null;

l.struct.info( '-- -- Pre-SOCKET -- --' );
const group = socket => {
  ////
  // Initialization
  ////

  nspace ??= socket.nsp;
  nspName ??= nspace.name.substring( 7 );

  l.struct.info( '- beg g()', nspName ); 

  const oneBool = isObject( core ) 
    && core.hasOwnProperty( 'groups' ) 
    && !core.groups.find( han => han === nspName );

  function firstRun() {
    if ( nspName && ( isEmpty( core ) || oneBool  ) ) {
      l.struct.info( 'firstRun' );

      // Assigning
      
      socket.client.server.glue ||= {
        core: null, 
        groups: {} 
      };
      socket.client.server.glue.groups[ nspName ] ||= {
        timers: {}, 
        sesh: null, 
        core: InitNsp.gCore() 
      };

      if ( isEmpty( socket.client.server.glue.core ) ) { 
        socket.client.server.glue.core ||= InitNsp.core();
      };      

      if ( isEmpty( socket.client.server.glue.groups[ nspName ].sesh ) ) {
        socket.client.server.glue.groups[ nspName ].sesh ||= InitNsp.seshie( nspName );
      };

      // Shortening
      // glue ||= socket.client.server.glue;
      core ||= socket.client.server.glue.core;
      sassy ||= socket.client.server.glue.groups[ nspName ].timers;
      seshie ||= socket.client.server.glue.groups[ nspName ].sesh;
      gCore ||= socket.client.server.glue.groups[ nspName ].core;

      core.groups.push( nspName );
    };
  };
  firstRun();
  const sockId = socket.id;

  ////
  // Initial, Prep Functionality 
  ////
  const { 
    getGroupLog, 
    logItWrapper 
  } = require( './DbFunc' )( 
    sockId, 
    seshie, 
    nspName 
  );

  const {
    simpMe, 
    timeFormatted, 

    emitRoom, 
    groupEmit, 

    pongId, 

    commonUserFunc 
  } = require( './SharedAndUtil' )( 
    sockId, 

    nspace, 
    getGroupLog, 

    gCore, 
    seshie.username 
  );


  ////
  // Core Functionality
  ////

  const {
    addUser, 
    listUsers, 
    // disconnectWrapper 
  } = require( './user' )( 
    sockId, 

    seshie, 
    core, 
    gCore, 
    nspName, 

    groupEmit, 
    logItWrapper, 
    commonUserFunc, 
    simpMe 
  );

  const { 
    roomEntered, 
    disconnect 
    // disconnecting 
  } = require( './socketCoreAndUtils' )(
    sockId, 

    socket, 
    sassy, 
    core, 
    gCore, 
    nspName, 

    emitRoom, 
    InitNsp.sassy, 
    logItWrapper, 
    timeFormatted, 
    commonUserFunc, 
    simpMe
  );

  const { 
    wrappingUpRepeating 
  } = require( './repeat' )( 
    null, 

    sassy, 
    emitRoom, 
    logItWrapper, 
    
    null, 
    null 
  );

  const { 
    timerDeleted, 
    timerCreated, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    stopTimer, 
    resetTimer, 
    skipSession 
  } = require( './timer' )( 
    v, 
    
    sassy, 
    emitRoom, 
    logItWrapper, 
    timeFormatted,
    
    wrappingUpRepeating
  );

  const { 
    repeatingStart, 
    repeatingDone, 
    repeatingStop 
  } = require( './repeat' )( 
    sockId, 
    v, 

    sassy, 
    emitRoom, 
    logItWrapper, 

    startTimer, 
    stopTimer 
  );


  ////
  // Listening
  ////

  // 5 active
  // @globals socket.on
  function listeningSockets() {
    // util 4th
    socket.on( 'confirm initial pong', pongId );
    // user 1st
    socket.on( 'add user', addUser );
    // user 2nd
    socket.on( 'list users', listUsers ); 
    // socketCoreAndUtils 5th
    socket.on( 'disconnect', disconnect ); 
 
    // timer 1st
    socket.on( 'timer removed', timerDeleted ); 
  };

  // 11 active
  // @globals socket.on
  function respondingSockets() {
    // socketCoreAndUtils 2nd
    socket.on( 'room entered', roomEntered );
    // timer 2nd
    socket.on( 'timer created', timerCreated ); 
    // timer 3rd
    socket.on( 'start timer', startTimer );
    // timer 8th
    socket.on( 'stop timer', stopTimer ); 
    // timer 9th or 10th
    socket.on( 'reset timer', resetTimer ); 
    // socket.on( 'timer done', finishedTimer );
    // timer 4th
    socket.on( 'pause', pauseTimer ); 
    // timer 5th
    socket.on( 'unpause', resumeTimer );
    // timer 12th
    socket.on( 'skip session', skipSession );

    // repeatingTimer 1st
    socket.on( 'turn on repeating timers', repeatingStart );
    // repeatingTimer 3rd
    socket.on( 'finished repeating timers', repeatingDone );
    // repeatingTimer 4th
    socket.on( 'stop repeating timers', repeatingStop );
  };

  listeningSockets();
  respondingSockets();
  
  l.struct.info( '- fin g()', nspName );
};
l.struct.info( '-- -- Post-SOCKET -- --' );

module.exports = group;
