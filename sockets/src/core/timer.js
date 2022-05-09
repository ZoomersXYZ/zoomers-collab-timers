const l = require( './../config/winston' );

const Timer = function ( 
  v, 
  
  sassy, 
  emitRoom, 
  logItWrapper, 
  timeFormatted,

  wrappingUpRepeating
) {
  const module = {};

  // @param inRoom: String
  // @anotherFile async logItWrapper()
  // @globals sassy
  module.timerDeleted = async ( inRoom, aUser ) => {
    await logItWrapper( inRoom, aUser, 'removed & deleted' );
    delete sassy[ inRoom ];
  };

  // @param inRoom: String
  // @anotherFile async logItWrapper()
  module.timerCreated = async ( inRoom, aUser ) => {
    await logItWrapper( inRoom, aUser, 'created & added' );
  };

  ////
  // Timer
  ////

  // @param inRoom: String
  // @param timeInMin: Number
  // @globals v
  // @anotherFile emitRoom()
  // @anotherFile async logItWrapper()
  // @internal updateTimer()
  // @internal goneByTimer()
  module.startTimer = async ( inRoom, aUser, timeInMin ) => {
    const curr = sassy[ inRoom ];
    if ( curr.flags.start && !curr.flags.triaged ) {
      emitRoom( 'timer already begun', { room: inRoom } );
      return false;
    };

    v.MIN_IN_HR ??= 60;
    curr.duration = timeInMin * v.MIN_IN_HR;
    curr.secondsLeft = curr.duration;
    // @TODO refact: can this be done:
    curr.secondsLeft = curr.duration = timeInMin * v.MIN_IN_HR;

    curr.pause.flag = true;
    curr.flags.started = new Date().getTime();
    curr.flags.done = false;
    curr.flags.triaged = false;

    updateTimer( inRoom, aUser );
    goneByTimer( inRoom );
    
    curr.manager = { 
      username: aUser.nick, 
      email: aUser.email 
    };

    emitRoom( 'timer started', { room: inRoom } );
    await logItWrapper( inRoom, aUser, 'started' );
  };

  // @param inRoom: String
  // @globals sassy
  // @anotherFile emitRoom()
  // @anotherFile async logItWrapper()
  // @internal clearUpdateTimer()
  // @internal ongoingTimer()
  module.pauseTimer = async ( inRoom, aUser ) => {
    const curr = sassy[ inRoom ];
    const { pause } = curr;

    if ( !pause.flag ) {
      emitRoom( 'timer ALREADY paused' );
      return;
    };
    
    curr.pause.flag = false;
    curr.pause.started = new Date().getTime();

    clearUpdateTimer( inRoom );
    ongoingTimer( inRoom );

    emitRoom( 'timer paused', { room: inRoom } );
    await logItWrapper( inRoom, aUser, 'paused' );
  };

  // @param inRoom: String
  // @globals sassy
  // @anotherFile emitRoom()
  // @anotherFile async logItWrapper()
  // @internal updateTimer()
  // @internal-ish clearInterval()
  module.resumeTimer = async ( inRoom, aUser ) => {
    const curr = sassy[ inRoom ];
    const { pause } = curr;
    
    if ( pause.flag ) {
      emitRoom( 'timer ALREADY resumed', { room: inRoom } );
      return;
    };

    const ended = new Date().getTime();
    curr.pause.list.push( {
      started: curr.pause.started, 
      ended: ended, 
      duration: ended - curr.pause.start 
    } );
    curr.pause.flag = true;
    curr.pause.started = null;

    updateTimer( inRoom, aUser );
    clearInterval( curr.ongoingInterval );
    
    emitRoom( 'timer resumed', { room: inRoom } );
    await logItWrapper( inRoom, aUser, 'resumed' );
  };

  // @param inRoom: String
  // @globals sassy
  // @internal-ish setInterval()
  goneByTimer = ( inRoom ) => {
    const curr = sassy[ inRoom ];
    curr.goneByInterval = setInterval( () => {
      ++curr.secondsGoneBy;
    }, 1000 );
  };

  // @anotherFile timeFormatted()
  updatingTimer = ( inRoom, current, duration, started, paused, pause, secondsGoneBy ) => {
    const hashish = { 
      current, 
      currentFormatted: timeFormatted( current ), 
      duration, 
      started, 
      paused, 
      pause, 
      ongoingTime: secondsGoneBy 
    };
    emitRoom( 'timer updated', { room: inRoom, ...hashish } );
    return hashish;
  };

  durationBool = ( duration ) => !isNaN( duration ) && duration > -1;
  currentBool = ( secondsLeft ) => !isNaN( secondsLeft ) && secondsLeft > -1;
  noTimeLeftBool = ( secondsLeft ) => !isNaN( secondsLeft ) && secondsLeft < 1;
  commonTimerVarsExistBool = ( pauseFlag, duration ) => pauseFlag || duration;

  // @param inRoom: String
  // @globals sassy
  // @anotherFile emitRoom()
  // @internal updateTimer()
  // @internal-ish setInterval()
  // @internal-ish clearInterval()
  ongoingTimer = ( inRoom ) => {
    const curr = sassy[ inRoom ];
    const {
      duration, 
      started, 
      pause, 
      secondsGoneBy, 
      secondsLeft 
    } = curr;

    curr.ongoingInterval = setInterval( () => {      
      if ( 
        !pause.flag && durationBool( duration ) && currentBool( secondsLeft ) 
      ) {
        const hashish = updatingTimer( 
          inRoom, 
          secondsLeft, 
          duration, 
          started, 
          !pause.flag, 
          pause, 
          secondsGoneBy 
        );
      } else {
        clearInterval( curr.ongoingInterval );
        clearInterval( curr.goneByInterval );
      };
    }, 2000 );
  };

  // @param inRoom: String
  // @internal wrappingUp()
  module.stopTimer = ( inRoom, aUser ) => wrappingUp( inRoom, aUser, 'timer stopped', 'force stopped' );
  // @param inRoom: String
  // @internal wrappingUp()
  finishedTimer = ( inRoom, aUser ) => wrappingUp( inRoom, aUser, 'timer finished', 'finished' );
  // @param inRoom: String
  // @internal wrappingUp()
  module.resetTimer = ( inRoom, aUser ) => wrappingUp( inRoom, aUser, 'timer reset', 'reset' );

  // @params inRoom: String
  // @global sassy
  // @internal-ish clearInterval()
  clearUpdateTimer = ( inRoom ) => { 
    const curr = sassy[ inRoom ];
    clearInterval( curr.updateTimerInterval );
  };

  // @param inRoom: String
  // @globals sassy
  // @anotherFile emitRoom()
  // @internal finishedTimer()
  // @internal-ish clearInterval()
  updateTimer = ( inRoom, aUser ) => {
    const curr = sassy[ inRoom ];
    const {
      duration,       
      started, 
      pause, 
      secondsGoneBy 
    } = curr;
    let { secondsLeft } = curr;

    curr.updateTimerInterval = setInterval( () => {
      --secondsLeft;
      curr.secondsLeft = secondsLeft;

      if ( 
        pause.flag && durationBool( duration ) && currentBool( secondsLeft ) 
      ) {
        const hashish = updatingTimer( 
          inRoom, 
          secondsLeft, 
          duration, 
          started, 
          !pause.flag, 
          pause, 
          secondsGoneBy           
        );
      } else if ( 
        noTimeLeftBool( secondsLeft ) && ( commonTimerVarsExistBool( pause.flag, duration ) ) 
      ) {
        finishedTimer( inRoom, aUser );
      } else {
        clearInterval( curr.updateTimerInterval );
      };
    }, 1000 );
  };


  // * @param inRoom: String
  //
  // * @globals sassy
  // * @anotherFile emitRoom()
  // * @anotherFile async logItWrapper()
  //
  // @internal-ish clearInterval()
  module.skipSession = async ( inRoom, aUser, repeat = false ) => {
    const curr = sassy[ inRoom ];
    let { session } = curr;
    
    if ( curr.pause.flag ) {
      emitRoom( 'timer still running. Stop it first.', inRoom );
      return;
    };

    session = session === 'work' ? 'brake' : 'work';
    curr.session = session;
    emitRoom( 'session skipped', { room: inRoom, session } );

    sameHashieArr = [
      inRoom, 
      aUser, 
      'session skipped', 
    ];
    sameStr = `skipped to ${ session } mode`;
    if ( repeat ) { 
      await logItWrapper( 
        ...sameHashieArr, 
        'repeat timer auto ' + sameStr, 
        session, 
        true  
      );
    } else if ( !repeat ) {
      await logItWrapper( 
        ...sameHashieArr, 
        sameStr, 
        session
      );
    };
  };

  // @param inRoom: String
  // @param msg: String
  // @param activity: String
  //
  // @globals sassy
  // @anotherFile emitRoom()
  // @anotherFile async logItWrapper()
  // @anotherFile wrappingUpRepeating()
  //
  // @internal clearUpdateTimer()
  // @internal-ish clearInterval()
  wrappingUp = async ( inRoom, aUser, msg, activity ) => {
    const curr = sassy[ inRoom ];
    if ( !curr.secondsLeft ) {
      emitRoom( `${ msg } already done`, { room: inRoom } );
      return false;
    };
    const { repeat, session } = curr;
    clearUpdateTimer( inRoom );
    clearInterval( curr.ongoingInterval );
    clearInterval( curr.goneByInterval );

    emitRoom( msg, { room: inRoom } );
    wrappingUpRepeating( 
      inRoom, 
      aUser, 
      repeat, 
      session, 
      module.skipSession, 
      module.startTimer 
    );

    await logItWrapper( inRoom, aUser, msg, activity );

    // Resettting value if not part of a repeat timer
    if ( repeat.on == false ) {
      curr.manager = { 
        username: null, 
        email: null 
      };
    };
    // Resettting values
    curr.secondsLeft = 0;
    curr.pause.flag = false;
  };

  return module;
};

module.exports = Timer;