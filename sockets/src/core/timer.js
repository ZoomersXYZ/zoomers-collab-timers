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
    if ( curr.timerFlag ) {
      emitRoom( 'timer already begun', { room: inRoom } );
      return false;
    };

    v.MIN_IN_HR ??= 60;
    curr.duration = timeInMin * v.MIN_IN_HR;
    curr.secondsLeft = curr.duration;
    // @TODO refact: can this be done:
    curr.secondsLeft = curr.duration = timeInMin * v.MIN_IN_HR;
    curr.timerFlag = true;
    curr.pauseFlag = true;
    curr.endFlag = false;
    curr.time = new Date().getTime();

    updateTimer( inRoom );
    goneByTimer( inRoom );

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
    const { pauseFlag } = curr;

    if ( !pauseFlag ) {
      emitRoom( 'timer ALREADY paused' );
      return;
    };
    
    curr.pauseFlag = false;
    curr.pausedAt = new Date().getTime();

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
    const { pauseFlag } = curr;
    
    if ( pauseFlag ) {
      emitRoom( 'timer ALREADY resumed', { room: inRoom } );
      return;
    };
    
    curr.pauseFlag = true;
    curr.pausedAt = null;

    updateTimer( inRoom );
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

  // @param inRoom: String
  // @globals sassy
  // @anotherFile emitRoom()
  // @anotherFile timeFormatted()
  // @internal updateTimer()
  // @internal-ish setInterval()
  // @internal-ish clearInterval()
  ongoingTimer = ( inRoom ) => {
    const curr = sassy[ inRoom ];
    const {
      duration,       
      pauseFlag, 
      time, 
      pausedAt, 
      secondsGoneBy, 
      secondsLeft 
    } = curr;

    curr.ongoingInterval = setInterval( () => {
      const durationBool = !isNaN( duration ) && duration > -1;
      const currentBool = !isNaN( secondsLeft ) && secondsLeft > -1;
      if ( !pauseFlag && durationBool && currentBool ) {
        const hashish = { 
          current: secondsLeft, 
          currentFormatted: timeFormatted( secondsLeft ), 

          totalDuration: duration, 
          started: time, 

          paused: !pauseFlag, 
          pausedAt: pausedAt, 

          ongoingTime: secondsGoneBy 
        };
        emitRoom( 'timer updated', { room: inRoom, ...hashish } );
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
  // @anotherFile timeFormatted()
  // @internal finishedTimer()
  // @internal-ish clearInterval()
  updateTimer = ( inRoom ) => {
    const curr = sassy[ inRoom ];
    const {
      duration,       
      pauseFlag, 
      time, 
      pausedAt, 
      secondsGoneBy 
    } = curr;
    let { secondsLeft } = curr;

    curr.updateTimerInterval = setInterval( () => {
      --secondsLeft;
      curr.secondsLeft = secondsLeft;

      const durationBool = !isNaN( duration ) && duration > -1;
      const currentBool = !isNaN( secondsLeft ) && secondsLeft > -1;

        const noTimeLeftBool = !isNaN( secondsLeft ) && secondsLeft < 1;
        const commonTimerVarsExistBool = pauseFlag || duration;

      if ( pauseFlag && durationBool && currentBool ) {
        const hashish = { 
          current: secondsLeft, 
          currentFormatted: timeFormatted( secondsLeft ), 

          totalDuration: duration, 
          started: time, 

          paused: !pauseFlag, 
          pausedAt: pausedAt, 

          ongoingTime: secondsGoneBy 
        };

        emitRoom( 'timer updated', { room: inRoom, ...hashish } );

      } else if ( noTimeLeftBool && ( commonTimerVarsExistBool ) ) {
        finishedTimer( inRoom );

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
  module.skipSession = async ( inRoom, aUser ) => {
    const curr = sassy[ inRoom ];
    console.log( '2', curr );
    let { session } = curr;
    
    if ( curr.pauseFlag ) {
      emitRoom( 'timer still running. Stop it first.', inRoom );
      return;
    };

    session = session === 'work' ? 'brake' : 'work';
    curr.session = session;
    emitRoom( 'session skipped', { room: inRoom, session } );
    await logItWrapper( inRoom, aUser, `skipped to ${ session } mode` );
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

    curr.secondsLeft = 0;
    curr.timerFlag = false;
    curr.pauseFlag = false;

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
  };

  return module;
};

module.exports = Timer;