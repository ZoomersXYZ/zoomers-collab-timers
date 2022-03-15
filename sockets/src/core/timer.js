const l = require( './../config/winston' );

const Timer = function ( 
  sockId, 
  v, 
  
  sassy, 
  emitRoom, 
  logItWrapper, 
  timeFormatted,

  wrappingUpRepeating
) {
  const module = {};

  // @param inRoom: String
  // @global @anotherFile async logItWrapper()
  // @globals sassy
  module.timerDeleted = async ( inRoom ) => {
    await logItWrapper( inRoom, 'removed & deleted' );
    delete sassy[ inRoom ];
  };

  // @param inRoom: String
  // @global @anotherFile async logItWrapper()
  module.timerCreated = async ( inRoom ) => {
    await logItWrapper( inRoom, 'created & added' );
  };

  ////
  // Timer
  ////

  // @param inRoom: String
  // @param timeInMin: Number
  // @globals v
  // @global @anotherFile emitRoom()
  // @global @anotherFile async logItWrapper()
  // @internal updateTimer()
  // @internal goneByTimer()
  module.startTimer = async ( inRoom, timeInMin ) => {
    const curr = sassy[ inRoom ];
    v.MIN_IN_HR ??= 60;
    curr.duration = timeInMin * v.MIN_IN_HR;
    curr.secondsLeft = curr.duration;
    // @TODO refact: can this be done:
    curr.secondsLeft = curr.duration = timeInMin * v.MIN_IN_HR;
    curr.timerFlag = true;
    curr.time = new Date().getTime();

    updateTimer( inRoom );
    goneByTimer( inRoom );

    emitRoom( 'timer started', { room: inRoom } );
    await logItWrapper( inRoom, 'started' );
  };

  // @param inRoom: String
  // @globals sassy
  // @global @anotherFile emitRoom()
  // @global @anotherFile async logItWrapper()
  // @internal clearUpdateTimer()
  // @internal ongoingTimer()
  module.pauseTimer = async ( inRoom ) => {
    const curr = sassy[ inRoom ];
    const { timerFlag } = curr;

    if ( !timerFlag ) {
      emitRoom( 'timer ALREADY paused' );
      return;
    };
    
    curr.timerFlag = false;
    curr.pausedAt = new Date().getTime();

    clearUpdateTimer( inRoom );
    ongoingTimer( inRoom );

    emitRoom( 'timer paused', { room: inRoom } );
    await logItWrapper( inRoom, 'paused' );
  };

  // @param inRoom: String
  // @globals sassy
  // @global @anotherFile emitRoom()
  // @global @anotherFile async logItWrapper()
  // @internal updateTimer()
  // @internal-ish clearInterval()
  module.resumeTimer = async ( inRoom ) => {
    const curr = sassy[ inRoom ];
    const { timerFlag } = curr;
    
    if ( timerFlag ) {
      emitRoom( 'timer ALREADY resumed', { room: inRoom } );
      return;
    };
    
    curr.timerFlag = true;
    curr.pausedAt = null;

    updateTimer( inRoom );
    clearInterval( curr.ongoingInterval );
    
    emitRoom( 'timer resumed', { room: inRoom } );
    await logItWrapper( inRoom, 'resumed' );
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
  // @global @anotherFile emitRoom()
  // @global @anotherFile timeFormatted()
  // @internal updateTimer()
  // @internal-ish setInterval()
  // @internal-ish clearInterval()
  ongoingTimer = ( inRoom ) => {
    const curr = sassy[ inRoom ];
    const {
      duration,       
      timerFlag, 
      time, 
      pausedAt, 
      secondsGoneBy, 
      secondsLeft 
    } = curr;

    curr.ongoingInterval = setInterval( () => {
      const durationBool = !isNaN( duration ) && duration > -1;
      const currentBool = !isNaN( secondsLeft ) && secondsLeft > -1;
      if ( !timerFlag && durationBool && currentBool ) {
        const hashish = { 
          current: secondsLeft, 
          currentFormatted: timeFormatted( secondsLeft ), 

          totalDuration: duration, 
          started: time, 

          paused: !timerFlag, 
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
  module.stopTimer = ( inRoom ) => wrappingUp( inRoom, 'timer stopped', 'force stopped' );
  // @param inRoom: String
  // @internal wrappingUp()
  finishedTimer = ( inRoom ) => wrappingUp( inRoom, 'timer finished', 'finished' );
  // @param inRoom: String
  // @internal wrappingUp()
  module.doneTimer = ( inRoom ) => wrappingUp( inRoom, 'timer done', 'done' );

  // @params inRoom: String
  // @global sassy
  // @internal-ish clearInterval()
  clearUpdateTimer = ( inRoom ) => { 
    const curr = sassy[ inRoom ];

    clearInterval( curr.updateTimerInterval );
  };

  // @param inRoom: String
  // @globals sassy
  // @global @anotherFile emitRoom()
  // @global @anotherFile timeFormatted()
  // @internal finishedTimer()
  // @internal-ish clearInterval()
  updateTimer = ( inRoom ) => {
    const curr = sassy[ inRoom ];
    const {
      duration,       
      timerFlag, 
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
        const commonTimerVarsExistBool = timerFlag || duration;

      if ( timerFlag && durationBool && currentBool ) {
        const hashish = { 
          current: secondsLeft, 
          currentFormatted: timeFormatted( secondsLeft ), 

          totalDuration: duration, 
          started: time, 

          paused: !timerFlag, 
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


  // @param inRoom: String
  // @globals sassy
  // @global @anotherFile emitRoom()
  // @global @anotherFile async logItWrapper()
  // @internal updateTimer()
  // @internal-ish clearInterval()
  module.skipSession = async ( inRoom ) => {
    const curr = sassy[ inRoom ];
    const { roomie, timerFlag } = curr;
    let { session } = curr;
    // @DONOW roomie is not needed. it's inRoom...
    
    if ( timerFlag ) {
      l.bbc.error( `${ sockId }: skipSession(): if wat` );
      emitRoom( 'timer still running. Stop it first.', roomie );
      return;
    };

    session = session === 'work' ? 'brake' : 'work';
    curr.session = session;
    emitRoom( 'session skipped', { room: roomie, session } );
    // @todo meh - shouldnt this just be room: inRoom. not needing to destructure roomie
    await logItWrapper( inRoom, `skipped to ${ session } mode` );
    // deleteCollection( db, nspName );
  };

  // @param inRoom: String
  // @param msg: String
  // @param activity: String
  // @globals sassy
  // @global @anotherFile emitRoom()
  // @global @anotherFile async logItWrapper()
  // @anotherFile wrappingUpRepeating()
  // @internal clearUpdateTimer()
  // @internal-ish clearInterval()
  wrappingUp = async ( inRoom, msg, activity ) => {
    const curr = sassy[ inRoom ];
    const { repeat, session } = curr;
    clearUpdateTimer( inRoom );
    clearInterval( curr.ongoingInterval );
    clearInterval( curr.goneByInterval );

    curr.secondsLeft = 0;
    curr.timerFlag = false;

    emitRoom( msg, { room: inRoom } );
    wrappingUpRepeating( 
      inRoom, 
      repeat, 
      session, 
      module.skipSession, 
      module.startTimer 
    );

    await logItWrapper( inRoom, activity );
  };

  return module;
};

module.exports = Timer;