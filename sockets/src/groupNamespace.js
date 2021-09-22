const db = require( './config/firebase' );
const isEqual = require( 'lodash.isequal' );

const l = require( './config/winston' );
const { isEmpty } = require( './utilities/general' );

////
// Initializing
////

numUsers = 0;
users = [];
nsUsers = [];

confirmIdPong = false;

seshieParent = {};
seshie = {};
sassy = {};

////
// Socket
////

// l.struct.info( '-- -- Pre-SOCKET -- --' );
const group = socket => {
  newNamespace = socket.nsp;
  nspName = newNamespace.name.substring( 7 );

  ////
  // Utility functions
  ////


  ref = db.collection( 'groups' ).doc( nspName ).collection( 'log' );
  const groupEmit = ( event, msg = null ) => newNamespace.emit( event, msg );

  const pullLogFromDb = async () => {
    let data = [];
    db.collection( 'groups' ).doc( nspName ).collection( 'log' ).orderBy( 'timestamp', 'desc' ).limit( 10 ).get().then( snap => {
      snap.forEach( doc => data.push( doc.data() ) );
    }, reason => {
      l.gen.error( '#error pullLogFromDb() async -> db.collection post then -- -> rejection' + reason );
    } );
    return data;
  };

  const pushLogToDb = ( aLog ) => 
    ref.doc().set( { ...aLog } );

    const satisfyDuplicateIsh = ( arrival, hashieTimestamp, restOfHashie ) => {
      const { timestamp: arrivalTimestamp, ...restOfArrival } = arrival;
      if ( isEqual( restOfArrival, restOfHashie ) ) {
        // 15 sec is the default
        if ( ( hashieTimestamp - arrivalTimestamp ) < 15001 ) {
          return true;
          // if joining/leaving room, give 65 sec gap.
        } else if ( ( hashieTimestamp - arrivalTimestamp ) < 65001 ) {
          switch( restOfHashie.activity ) {
            case 'joined room':
            case 'left room':
              return true;
            default:
          };
        };
      };
      return false;
    };

    const duplicateIsh = ( reversedCached, hashie ) => reversedCached.find( arrival => {
      const { timestamp: hashieTimestamp, ...restOfHashie } = hashie;
      return satisfyDuplicateIsh( arrival, hashieTimestamp, restOfHashie );
    } );

  const logIt = ( inRoom, activity ) => {
    if ( isEmpty( inRoom ) ) {
      inRoom = null;
    };
    if ( isEmpty( seshie.username ) || isEmpty( seshie.email )  ) {
      return;
    };
    
    const hashie = {
      group: nspName, 
      username: seshie.username, 
      email: seshie.email, 
      timer: inRoom, 
      activity, 
      timestamp: new Date().getTime() 
    };

    const reversedCached = seshie.loggy.reverse();
    // don't log
    if ( duplicateIsh( reversedCached, hashie ) ) return;;

    seshie.loggy.push( hashie );

    ref.doc().set( { ...hashie } );
  };
  
  const pongId = () => {
    confirmIdPong = true;
    getGroupLog();
  };

  ////
  // Initialization
  ////

  seshieParent = socket.client.server.sesh = socket.client.server.sesh || {};
  seshie = socket.client.server.sesh[ nspName ] = socket.client.server.sesh[ nspName ] || {};

  sassy = socket.client.server.sass = socket.client.server.sass || {};

  seshie.group = seshie.group || newNamespace.name.substring( 7 );

  ////
  // Shiz
  ////

  const getGroupLog = async () => {
    try {
      seshie.loggy = seshie.loggy || await pullLogFromDb();
    } catch( err ) {
      l.gen.error( '#error getLog() async -> catch -- -> await rejection, ' + `--- ${ err } ---` );
      seshie.loggy = [];
    };

    const cutFullLog = seshie.loggy.filter( arrival => arrival.group === nspName ).slice( 0, 10 );
    const reversedCut = cutFullLog.reverse();
    
    const sendingOut = [ 
      ...new Set( 
        [ ...reversedCut, ...seshie.loggy ] 
      ) 
    ];

    socket.emit( 'activity log', sendingOut );
  };

  let addedUser = false;
  const addUser = ( handle, emailAcct ) => {
    if ( addedUser ) return;
    seshie.username = handle;
    seshie.email = emailAcct;
    users.push( { 
      id: socket.id, 
      username: seshie.username, 
      email: seshie.email, 
      group: nspName 
    } );
    ++numUsers;
    addedUser = true;

    // Not sure if this is still needed. Just an extra possible precaution
    const confirmId = setInterval( () => {
      groupEmit( 'confirm initial ping', socket.id );
      if ( confirmIdPong ) {
        listUsers();
        clearInterval( confirmId );
      };
    }, 1000 );

    logIt( null, `joined room` );
  };

  const commonUserFunctionality = ( event ) => {
    nsUsers = users.filter( single => single.group === nspName );
    const hashie = ( { 
      username: seshie.username, 
      users, 
      nsUsers, 
      allCount: users.length, 
      count: nsUsers.length, 
      group: nspName // DD - this doesnt even make sense. since you have users and nsUsers
    } );
    groupEmit( event, hashie );
    return hashie;
  };

  const listUsers = () => {
    const event = 'list users';
    const hashie = commonUserFunctionality( event );
    groupEmit( event, hashie );
  };

  const disconnect = () => {
    if ( addedUser ) {
      --numUsers;
      users = users.filter( hash => hash.id != socket.id );
      const event = 'user left';
      commonUserFunctionality( event );
    };
  };

  const disconnecting = () => {
    logIt( null, `left room` );
  };

  // Misc

  const timerDeleted = ( inRoom ) => {
    logIt( inRoom, 'removed & deleted' );
    delete sassy[ inRoom ];
  };

  // Listening

  socket.on( 'confirm initial pong', pongId );
  socket.on( 'add user', addUser );
  socket.on( 'list users', listUsers );
  socket.on( 'disconnect', disconnect );
  socket.on( 'disconnecting', disconnecting );

  socket.on( 'timer removed', timerDeleted );


  ////
  // Room/Timers utility/initial code
  ////

  const emitRoom = ( msg, data = null ) => {
    let room = null;
    // both room and data
    if ( !isEmpty( data ) && typeof data === 'object' && data.hasOwnProperty( 'room' ) ) {
      room = data.room;
      delete data.room;
    };
    // Fine if room is null too
    if ( !isEmpty( data ) && typeof data === 'object' ) {
      newNamespace.emit( msg, { room, ...data } );
    // just room, no data
    } else if( isEmpty( data ) ) {
      newNamespace.emit( msg, room );
    // no room or data. plain.
    } else if ( isEmpty( room ) ) {
      newNamespace.emit( msg );
    };
  };
  
  // Run at start
  const onRoomConnect = ( preciousHashie ) => {
    const { duration, pausedAt, roomie, secondsLeft, session, time, timerFlag } = preciousHashie;
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
        pausedAt: pausedAt  
      };
      emitRoom( 'timer updated', { room: roomie, ...hashish } );
    };
  };

  ////
  // Actual code for time[r]
  ////

  // Utility
  // currentFormatted
  const timeFormatted = ( remaining, divideBy = 1 ) => {
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

  // Misc
  const timerCreated = ( inRoom ) => {
    logIt( inRoom, 'created & added' );
  };

  ////
  // Timer
  ////

  const startTimer = ( inRoom, timeInMinutes ) => {
    sassy[ inRoom ].duration = timeInMinutes * 60;
    sassy[ inRoom ].secondsLeft = sassy[ inRoom ].duration;
    sassy[ inRoom ].timerFlag = true;
    sassy[ inRoom ].time = new Date().getTime();

    updateTimer( inRoom );
    goneByTimer( inRoom );

    emitRoom( 'timer started', { room: inRoom } );
    logIt( inRoom, 'started' );
  };

  const pauseTimer = ( inRoom ) => {
    if ( !sassy[ inRoom ].timerFlag ) {
      emitRoom( 'timer ALREADY paused' );
      return;
    };
    
    sassy[ inRoom ].timerFlag = false;
    sassy[ inRoom ].pausedAt = new Date().getTime();

    clearUpdateTimer( inRoom );
    ongoingTimer( inRoom );

    emitRoom( 'timer paused', { room: inRoom } );
    logIt( inRoom, 'paused' );
  };

  const resumeTimer = ( inRoom ) => {
    if ( sassy[ inRoom ].timerFlag ) {
      emitRoom( 'timer ALREADY resumed', { room: inRoom } );
      return;
    };
    
    sassy[ inRoom ].timerFlag = true;
    sassy[ inRoom ].pausedAt = null;

    updateTimer( inRoom );
    clearInterval( sassy[ inRoom ].ongoingInterval );
    
    emitRoom( 'timer resumed', { room: inRoom } );
    logIt( inRoom, 'resumed' );
  };
  
  const skipSession = ( inRoom ) => {
    const { roomie, timerFlag } = sassy[ inRoom ];
    let { session } = sassy[ inRoom ];
    
    if ( timerFlag ) {
      l.bbc.error( 'skipSession(): if wat' );
      emitRoom( 'timer still running. Stop it first.', roomie );
      return;
    };

    session = session === 'work' ? 'break' : 'work';
    emitRoom( 'session skipped', { room: roomie, session } );
    logIt( inRoom, `skipped to ${ session } mode` );
    sassy[ inRoom ].session = session;

    // deleteCollection( db, nspName );
  };

  const wrappingUp = ( inRoom, msg, activity ) => {
    clearUpdateTimer( inRoom );
    clearInterval( sassy[ inRoom ].ongoingInterval );
    clearInterval( sassy[ inRoom ].goneByInterval );

    sassy[ inRoom ].secondsLeft = 0;
    sassy[ inRoom ].timerFlag = false;

    emitRoom( msg, { room: inRoom } );
    logIt( inRoom, activity );
  };

  const stopTimer = ( inRoom ) => wrappingUp( inRoom, 'timer stopped', 'force stopped' );
  const finishedTimer = ( inRoom ) => wrappingUp( inRoom, 'timer finished', 'finished' );

  const clearUpdateTimer = ( inRoom ) => { clearInterval( sassy[ inRoom ].updateTimerInterval ); }

  const updateTimer = ( inRoom ) => {
    sassy[ inRoom ].updateTimerInterval = setInterval( () => {
      --sassy[ inRoom ].secondsLeft;
      const durationBool = !isNaN( sassy[ inRoom ].duration ) && sassy[ inRoom ].duration > -1;
      const currentBool = !isNaN( sassy[ inRoom ].secondsLeft ) && sassy[ inRoom ].secondsLeft > -1;
      if ( sassy[ inRoom ].timerFlag && durationBool && currentBool ) {
        const hashish = { 
          current: sassy[ inRoom ].secondsLeft, 
          currentFormatted: timeFormatted( sassy[ inRoom ].secondsLeft ), 
          totalDuration: sassy[ inRoom ].duration, 
          started: sassy[ inRoom ].time, 
          paused: !sassy[ inRoom ].timerFlag, 
          pausedAt: sassy[ inRoom ].pausedAt, 
          ongoingTime: sassy[ inRoom ].secondsGoneBy 
        };
        emitRoom( 'timer updated', { room: inRoom, ...hashish } );
      } else if ( !isNaN( sassy[ inRoom ].secondsLeft ) && sassy[ inRoom ].secondsLeft < 1 && ( sassy[ inRoom ].timerFlag || sassy[ inRoom ].duration ) ) {
        finishedTimer( inRoom );
      } else {
        clearInterval( sassy[ inRoom ].updateTimerInterval );
      };
    }, 1000 );
  };

  const goneByTimer = ( inRoom ) => {
    sassy[ inRoom ].goneByInterval = setInterval( () => {
      ++sassy[ inRoom ].secondsGoneBy;
    }, 1000 );
  };

  const ongoingTimer = ( inRoom ) => {
    sassy[ inRoom ].ongoingInterval = setInterval( () => {
      const durationBool = !isNaN( sassy[ inRoom ].duration ) && sassy[ inRoom ].duration > -1;
      const currentBool = !isNaN( sassy[ inRoom ].secondsLeft ) && sassy[ inRoom ].secondsLeft > -1;
      if ( !sassy[ inRoom ].timerFlag && durationBool && currentBool ) {
        const hashish = { 
          current: sassy[ inRoom ].secondsLeft, 
          currentFormatted: timeFormatted( sassy[ inRoom ].secondsLeft ), 
          totalDuration: sassy[ inRoom ].duration, 
          started: sassy[ inRoom ].time, 
          paused: !sassy[ inRoom ].timerFlag, 
          pausedAt: sassy[ inRoom ].pausedAt, 
          ongoingTime: sassy[ inRoom ].secondsGoneBy 
        };
        emitRoom( 'timer updated', { room: inRoom, ...hashish } );
      } else {
        clearInterval( sassy[ inRoom ].ongoingInterval );
        clearInterval( sassy[ inRoom ].goneByInterval );
      };
    }, 2000 );
  };
  
  ////
  // Added
  ////

  const roomEntered = ( roomie ) => {
    const hashieWashie = {
      timerFlag: false, 
      session: 'work', 

      timer: null, 
      pausedAt: null, 

      duration: 0, 
      secondsLeft: 0, 
      secondsGoneBy: 1, 

      updateTimerInterval: null, 
      ongoingInterval: null, 
      goneByInterval: null, 
      roomie, 
      group: nspName // DD 
    };
    if ( isEmpty( sassy[ roomie ] ) ) sassy[ roomie ] = hashieWashie;
    onRoomConnect( sassy[ roomie ] );
    socket.join( sassy[ roomie ].roomie );
  };

  socket.on( 'room entered', roomEntered );

  socket.on( 'timer created', timerCreated );
  socket.on( 'start timer', startTimer );
  socket.on( 'stop timer', stopTimer );
  socket.on( 'pause', pauseTimer );
  socket.on( 'unpause', resumeTimer );
  socket.on( 'skip session', skipSession );
  
  // if ( !isEmpty( sassy ) ) { l.struct.info( '- end -' ); };
};
l.struct.info( '-- -- Post-SOCKET -- --' );

module.exports = group;
