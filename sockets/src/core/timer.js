const l = require( './../config/winston' );

const Timer = function ( 
  v, 
  
  sassy, 
  // thisTimer, 
  emitRoom, 
  emitUser, 
  logItWrapper, 

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
  // @anotherFile emitUser()
  // @anotherFile async logItWrapper()
  // @internal updateTimer()
  // @internal goneByTimer()
  module.startTimer = async ( inRoom, aUser, timeInMin, repeatFlag = false ) => {
    const curr = sassy[ inRoom ];
    // console.log( 'start timer', thisTimer );
    // Why are two conditions here
    // if ( curr.flags.started && !curr.flags.triaged ) {
    if ( curr.flags.started ) {
      emitUser( 'timer already begun', { user: aUser, room: inRoom } );
      return false;
    };

    v.MIN_IN_HR ??= 60;
    curr.duration = timeInMin * v.MIN_IN_HR;
    // Make up for the 1 second async await delay for wrappingUpRepeating
    if ( repeatFlag == 'repeating continued' ) {
      curr.duration = curr.duration - 1;
    };
    curr.secondsLeft = curr.duration;
    // @TODO refact: can this be done:
    // curr.secondsLeft = curr.duration = timeInMin * v.MIN_IN_HR;

    curr.pause.flag = false;
    curr.flags.started = new Date().getTime();
    curr.flags.done = false;
    // curr.flags.triaged = false;

    updateTimer( inRoom, aUser );
    // goneByTimer( inRoom );
    
    curr.manager = { 
      username: aUser.nick, 
      email: aUser.email 
    };
    
    if (!repeatFlag) {
      emitRoom( 'timer started', { room: inRoom, duration: timeInMin } );
      await logItWrapper( inRoom, aUser, 'started' );
    } else if (repeatFlag == 'repeating continued') {
      emitRoom( 'repeating continued', { room: inRoom, duration: timeInMin } );
      await logItWrapper( inRoom, aUser, 'repeating continued' );
    } else if (repeatFlag == 'repeating started') {
      emitRoom( 'repeating started', { room: inRoom, duration: timeInMin } );
      await logItWrapper( inRoom, aUser, 'repeating started' );
    };
  };

  // @param inRoom: String
  // @globals sassy
  // @anotherFile emitRoom()
  // @anotherFile async logItWrapper()
  // @internal clearUpdateTimer()
  // @internal goneByTimer()
  module.pauseTimer = async ( inRoom, aUser ) => {
    // const curr = 
    const curr = sassy[ inRoom ];

    const endTime = new Date().getTime();
    if ( endTime - curr.flags.started <= 1000 ) {
      emitRoom( 'timer changed too recently' );
    };

    const pauseListLen = curr.pause.list.length
    if ( pauseListLen > 0 ) {
      if ( endTime - curr.pause.list[ pauseListLen - 1 ].started <= 1000 ) {
        emitRoom( 'timer paused too recently' );
      };
    };

    if ( curr.pause.flag ) {
      emitRoom( 'timer ALREADY paused' );
      return;
    };
    emitRoom( 'pausanabi' );
    curr.pause.flag = true;
    curr.pause.started = new Date().getTime();

    // clearUpdateTimer( inRoom );
    // clearInterval( updateTimerInterval );
    clearInterval(curr.intervals.updateTimer)
    curr.intervals.updateTimer = null;
    // goneByTimer( inRoom );

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
    
    const ended = new Date().getTime();
    if ( ended - curr.pause.started <= 500 ) {
      emitRoom( 'can\'t resume. timer paused too recently' );
    };

    if ( !pause.flag ) {
      emitRoom( 'timer ALREADY resumed', { room: inRoom } );
      return;
    };

    // const ended = new Date().getTime();
    curr.pause.list.push( {
      started: curr.pause.started, 
      ended: ended, 
      duration: ended - curr.pause.started 
    } );
    curr.pause.flag = false;
    curr.pause.started = null;

    updateTimer( inRoom, aUser );
    // clearInterval( curr.intervals.onGoing );
    
    emitRoom( 'timer resumed', { room: inRoom } );
    await logItWrapper( inRoom, aUser, 'resumed' );
  };

  // @param inRoom: String
  // @globals sassy
  // @internal-ish setInterval()

  // this was never used. it is dupe name
  // goneByTimer = ( inRoom ) => {
  //   console.log('1st');
  //   const curr = sassy[ inRoom ];
  //   curr.intervals.goneBy = setInterval( () => {
  //     ++curr.goneBy;
  //     console.log('3rd');
  //   }, 1000 );
  // };

  updatingTimer = ( inRoom, current, duration, started, pause, flags, goneBy, repeat, session ) => {
    const hashish = { 
      current, 
      duration, 
      started, 
      pause, 
      flags, 
      goneBy, 
      repeat, 
      session 
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
  // goneByTimer = ( inRoom ) => {
  //   const curr = sassy[ inRoom ];
  //   const {
  //     duration, 
  //     started, 
  //     pause, 
  //     flags, 
  //     goneBy, 
  //     secondsLeft, 
  //     intervals, 
  //     repeat, 
  //     session 
  //   } = curr;

  //   curr.intervals.onGoing = setInterval( () => {    
  //     if ( 
  //       pause.flag && durationBool( duration ) && currentBool( secondsLeft ) 
  //     ) {
  //       const hashish = updatingTimer( 
  //         inRoom, 
  //         secondsLeft, 
  //         duration, 
  //         started, 
  //         pause, 
  //         flags, 
  //         goneBy, 
  //         repeat, 
  //         session 
  //       );
  //     } else {
  //       clearInterval( curr.intervals.onGoing );
  //       // clearInterval( intervals.goneBy );
  //     };
  //   }, 2000 );
  // };

  // @param inRoom: String
  // @internal wrappingUp()
  module.stopTimer = ( inRoom, aUser ) => {

    wrappingUp( 
      inRoom, 
      aUser, 
      'timer stopped', 
      'force stopped' 
    );
  };
  // @param inRoom: String
  // @internal wrappingUp()
  finishedTimer = ( inRoom, aUser ) => wrappingUp( 
    inRoom, 
    aUser, 
    'timer finished', 
    'finished' 
    );
  // @param inRoom: String
  // @internal wrappingUp()
  module.resetTimer = ( inRoom, aUser ) => wrappingUp( 
    inRoom, 
    aUser, 
    'timer reset', 
    'reset' 
    );

  // @params inRoom: String
  // @global sassy
  // @internal-ish clearInterval()
  // clearUpdateTimer = ( inRoom ) => { 
  //   const curr = sassy[ inRoom ];
  //   // clearInterval( curr.intervals.updateTimerInterval );
  //   clearInterval( updateTimerInterval );
  // };

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
      flags, 
      goneBy, 
      repeat, 
      session 
    } = curr;
    let { secondsLeft } = curr;

    if (curr.intervals.updateTimer != null) {
      console.log('whoops got here updateTimerInterval isnt null');
      l.parm.debug( 'updateTimerInterval isnt null' );
      return;
    };

    // @TODO why not using intervals and secondsLeft direct. because of pointers?
    curr.intervals.updateTimer = setInterval( () => {
    // updateTimerInterval = setInterval( () => {
      --secondsLeft;
      curr.secondsLeft = secondsLeft;

      if ( 
        // if not paused, has duration greater than 0, and has secondsLeft greater than 0
        !pause.flag && durationBool( duration ) && currentBool( secondsLeft ) 
      ) {
        const hashish = updatingTimer( 
          inRoom, 
          secondsLeft, 
          duration, 
          started, 
          pause, 
          flags, 
          goneBy, 
          repeat, 
          session, 
          // callback
        );
      } else if ( 
        // check if no time left in secondsLeft and if either it's not paused or duration is more than 0/non-falsey
        noTimeLeftBool( secondsLeft ) && ( commonTimerVarsExistBool( !pause.flag, duration ) ) 
      ) {
        finishedTimer( inRoom, aUser );
        // what else is left? would this spot ever be touched?
      } else {
        l.parm.debug( 'WHOA got to the else in updateTimer. clearInterval( updateTimerInterval )' );
        // clearInterval( updateTimerInterval );
        clearInterval(curr.intervals.updateTimer)
        curr.intervals.updateTimer = null;
      };
    }, 1000 );
  };


  // * @param inRoom: String
  //
  // * @globals sassy
  // * @anotherFile emitRoom()
  // * @anotherFile async logItWrapper()
  module.skipSession = async ( inRoom, aUser, repeatFlag = false ) => {
    const curr = sassy[ inRoom ];
    let { flags, session, pause } = curr;

    if ( flags.started ) {
      emitUser( 'timer already begun', { user: aUser, room: inRoom } );
      return false;
    };    

    if ( pause.flag ) {
      emitRoom( 'timer still running. Stop it first.', inRoom );
      return;
    };

    // console.log('skipSession initial', session)
    session = session === 'work' ? 'brake' : 'work';
    curr.session = session;
    emitRoom( 'session skipped', { room: inRoom, session } );
    // console.log('skipSession final', curr.session, sassy[inRoom].session, session)

    sameHashieArr = [
      inRoom, 
      aUser, 
      'session skipped' 
    ];
    sameStr = `skipped to ${ session } mode`;
    if ( repeatFlag ) { 
      await logItWrapper( 
        ...sameHashieArr, 
        'repeat timer auto ' + sameStr, 
        session, 
        true  
      );
    } else if ( !repeatFlag ) {
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
    const { secondsLeft } = curr;
    
    if ( !secondsLeft ) {
      emitRoom( `${ msg } already done`, { room: inRoom } );
      return false;
    };    
    const { repeat, session, intervals } = curr;
    // clearUpdateTimer( inRoom );
    // clearInterval( updateTimerInterval );
    clearInterval(curr.intervals.updateTimer)
    curr.intervals.updateTimer = null;
    // clearInterval( curr.intervals.onGoing );
    // clearInterval( intervals.goneBy );

    emitRoom( msg, { room: inRoom, 'reapOn': repeat.on } );
    // if (repeat.on == false) {
    //   emitRoom( msg, { room: inRoom } );
    // } else {
    //   emitRoom('unpause button');
    // };

    await logItWrapper( inRoom, aUser, msg, activity );

    // Resettting value if not part of a repeat timer
    if ( repeat.on == false ) {
      curr.manager = { 
        username: null, 
        email: null 
      };

      curr.flags = {
        started: null, 
        ended: null, 
        triaged: false 
      }, 

      curr.pause = { 
        flag: false, 
        started: null, 
        goneBy: 0, 
        list: [] 
      }

      curr.duration = 0, 
      curr.secondsLeft = 0, 
      curr.goneBy = 0 
    } else {
      // Resettting values if repeat is on
      curr.flags = {
        started: null, 
        ended: null, 
        triaged: false 
      }, 

      curr.pause = { 
        flag: false, 
        started: null, 
        goneBy: 0, 
        list: [] 
      }

      curr.duration = 0, 
      curr.secondsLeft = 0, 
      curr.goneBy = 0 
      // curr.secondsLeft = 0;
      // curr.pause.flag = false;
    };

    wrappingUpRepeating( 
      inRoom, 
      aUser, 
      repeat, 
      session, 
      module.skipSession, 
      module.startTimer 
    );
  };

  return module;
};

module.exports = Timer;