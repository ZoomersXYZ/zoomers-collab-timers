const l = require( './../config/winston' );
const { isEmpty, isObject } = require( './../utilities/general' );
const InitNsp = require( './InitNsp' )();

////
// Initializing Variables
////

let nspace = null;
let nspName = null;
const room = { name: '' };
// shortening
const v = process.env;

let overall = null;
let core = null;
let seshie = null;
let sassy = null;
let gCore = null;

// let thisTimer = null;

l.struct.info( '-- -- Pre-SOCKET -- --' );
const group = socket => {
  ////
  // Initialization
  ////
  nspace = socket.nsp;
  nspName = nspace.name.substring( 7 );
  // console.log(socket.nsp.name.substring(7));
  // console.log(nspName);
  const sockId = socket.id;

  function firstRun() {
    const oneBool = isObject( core ) 
      && core.hasOwnProperty( 'groups' )
      && (core.groups[nspName] === undefined);

    if ( nspName && ( isEmpty( core ) || oneBool ) ) {
      // MASS COMMENTING OF LOGS 2023-10-09
      l.struct.info( 'firstRun', nspName, sockId );
      console.log('firstRun', nspName, sockId);

      // Assigning

      overall ||= {};
      overall[nspName] ||= {
        timers: {}, 
        sesh: null, 
        core: InitNsp.gCore(nspName)
      };

      if ( isEmpty( core ) ) {
        core ||= InitNsp.core();
      };

      if ( isEmpty( overall[ nspName ].sesh ) ) {
        overall[ nspName ].sesh ||= InitNsp.seshie( nspName );
      };

      // Shortening
      // glue ||= socket.client.server.glue;
      // core ||= socket.client.server.glue.core;
      sassy ||= overall[ nspName ].timers;
      seshie ||= overall[ nspName ].sesh;
      gCore ||= overall[ nspName ].core;
      // thisTimer = null;
    };
  };

  // function firstRun() {
  //   // const oneBool = isObject( core ) 
  //   //   && core.hasOwnProperty( 'groups' ) ;
  //     // && (!core.groups[nspName] === undefined);

  //   if ( nspName && ( isEmpty( core ) ) ) {

  //     // MASS COMMENTING OF LOGS 2023-10-09
  //     l.struct.info( 'firstRun', nspName, sockId );
  //     console.log('firstRun', nspName, sockId);

  //     // Assigning

  //     // overall ||= {};
  //     // overall[nspName] ||= {
  //     overall ||= {
  //       timers: {}, 
  //       sesh: null, 
  //       core: InitNsp.gCore(nspName)
  //     };

  //     if ( isEmpty( core ) ) {
  //       core ||= InitNsp.core();
  //     };

  //     if ( isEmpty( overall.sesh ) ) {
  //       overall.sesh ||= InitNsp.seshie( nspName );
  //     };

  //     // Shortening
  //     // glue ||= socket.client.server.glue;
  //     // core ||= socket.client.server.glue.core;
  //     sassy ||= overall.timers;
  //     seshie ||= overall.sesh;
  //     gCore ||= overall.core;
  //     // thisTimer = null;
  //   };
  // };
  firstRun();
  
  function onGroupEnter() {    
    simpMe.initialized = true;
    // core.groups.push( nspName );
    if (core.groups[nspName] === undefined) {
      core.groups[nspName] = true;
    };
    socket.emit('group went thru');
    console.log('onGroupEnter');
    // MASS COMMENTING OF LOGS 2023-10-09
    // l.struct.info( 'onGroupEnter', sockId );
  };

  ////
  // Initial, Prep Functionality 
  ////
  const { 
    getGroupLog, 
    logItWrapper 
  } = require( './DbFunc' )( 
    sockId, 
    sassy, 
    seshie, 
    nspName 
  );

  const {
    simpMe, 

    emitRoom, 
    groupEmit, 

    pongId, 

    commonUserFunc 
  } = require( './SharedAndUtil' )( 
    socket, 

    // nspace, 
    nspName, 
    getGroupLog, 
    
    core, 
    seshie 
  );


  ////
  // Core Functionality
  ////

  const {
    addUser, 
    listUsers 
  } = require( './user' )( 
    socket, 
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
    emitUser, 
    roomEntered, 
    runFirstRun, 
    disconnect, 
    askForSession, 
  } = require( './socketCoreAndUtils' )( 
    socket, 
    sassy, 
    // thisTimer, 
    seshie, 
    core, 
    gCore, 
    groupEmit, 
    nspName, 

    emitRoom, 
    logItWrapper, 
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
    socket, 
    nspName, 
    sassy, 
    // thisTimer, 
    emitRoom, 
    emitUser, 
    logItWrapper, 
    
    wrappingUpRepeating
  );

  const { 
    repeatingStart, 
    repeatingDone, 
    repeatingStop 
  } = require( './repeat' )( 
    // sockId, 
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
    if (process.env.NODE_ENV === 'development') {
      socket.onAnyOutgoing( ( eventName, args ) => {
        if (process.env.NODE_ENV !== 'development') { return; };
        // triggered when the event is sent
        const oneBool = isObject( core ) 
          && core.hasOwnProperty( 'groups' ) 
          && ( !!core.groups[ nspName ] );
        const twoBool = oneBool && core.users.hasOwnProperty(nspName) && core.users[nspName].hasOwnProperty(socket.id);
        // console.log(core.users);
        // triggered when the event is sent
        if (eventName == 'timer updated') {
          // if (args.hasOwnProperty('started')) {
          //   delete args.started;
          // };
          // if (args.hasOwnProperty('goneBy')) {
          //   delete args.goneBy;
          // };
          // if (args.hasOwnProperty('pause') && !args.pause.flag) {
          //   delete args.pause;
          // };
          // if (args.hasOwnProperty('repeat') && !args.repeat.on) {
          //   delete args.repeat;
          // };

          let tmp = null;
          if (args) {
            tmp = { secondsLeft: args.secondsLeft, duration: args.duration, flags: args.flags, room: args.room, session: args.session, pause: args.pause.flag ? args.pause : '', repeat: args.repeat.on ? args.repeat : '' }
          };
          // secondsLeft, duration, flags, room, session
          // pause if pause.flag
          // repeat if repeat.on
          if (args.secondsLeft == args.duration || (args.secondsLeft == args.duration - 2) || args.secondsLeft == 5) {
            console.log( 'outGoing:', socket.nsp.name.substring(7), eventName, args ? tmp : ', N/A', twoBool ? core.users[ nspName ][ socket.id ].username : `, i ${ socket.id }` );
            // console.log( 'outgoing', core.users[ nspName ] );
          };
        } else {
          console.log( 'outGoing:', socket.nsp.name.substring(7), eventName, args ? args : ', N/A', twoBool ? core.users[ nspName ][ socket.id ].username : `, j ${ socket.id }` );
        };
        // console.log( 'outgoing', socket.nsp.name.substring(7), eventName, core.users[ nspName ] );
      } );

      socket.onAny( ( eventName, args ) => {
        if (process.env.NODE_ENV !== 'development') { return; };
        // not triggered when the acknowledgement is received
        const oneBool = isObject( core ) 
          && core.hasOwnProperty( 'groups' ) 
          && ( !!core.groups[ nspName ] );
        const twoBool = oneBool && core.users.hasOwnProperty(nspName) && core.users[ nspName ].hasOwnProperty(socket.id)

        console.log( 'inComing:', socket.nsp.name.substring(7), eventName, args ? args : ', N/A', twoBool ? core.users[ nspName ][ socket.id ].username : `, k ${ socket.id }` );
        // console.log( 'incoming', socket.nsp.name.substring(7), eventName, core.users[ nspName ] );
      } );
    };

    // in-file
    socket.on( 'group entered', onGroupEnter );
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
    socket.on( 'run first run', runFirstRun );

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

    socket.on('ask for session', askForSession);
  };

  listeningSockets();
  respondingSockets();
};
l.struct.info( '-- -- Post-SOCKET -- --' );

module.exports = group;
