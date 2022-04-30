const l = require( './../config/winston' );

const RepeatingTimers = function ( 
  // sockId, 
  v, 
  // simpMe, 
  
  sassy, 
  emitRoom, 
  logItWrapper, 

  startTimer, 
  stopTimer 
) {
  const module = {};

  // @param inRoom: String
  // @param work: Number?
  // @param brake: Number?
  // @param length: Number
  // @globals sassy
  // @anotherFile emitRoom()
  // @anotherFile async logItWrapper()
  // @anotherFile startTimer()
  module.repeatingStart = async ( inRoom, aUser, work, brake, length ) => {
    const curr = sassy[ inRoom ];
    const { repeat } = curr;
    if ( repeat.on ) {
      emitRoom( 'repeat timers already begun', { room: inRoom } );
      return false;
    };

    const theTime = new Date().getTime();
    v.HR_REPEAT ??= 1;
    curr.repeat = { 
      on: true, 
      length, 
      // allow debugging w/ quicker times
      // For HR_REPEAT 5, 8, 10, 15. Value of 1H translates to: 2.4min, 50s, 36s, 16s
      startTime: theTime, 
      endTime: theTime + ( length * ( 60 / v.HR_REPEAT ) * ( 60 / v.HR_REPEAT ) * 1000 ), 
      work, 
      brake 
    };
    
    emitRoom( 'repeating timers on', { room: inRoom, ...curr.repeat } );
    await logItWrapper( inRoom, aUser, 'repeating timers on & started' );

    const { session } = curr;
    if ( session === 'brake' ) {
      emitRoom( 'session skipped', { room: inRoom, session: session } );
    };
    startTimer( inRoom, aUser, work );
  };

  // @param inRoom: String
  // @globals sassy
  resetRepeating = ( inRoom ) => {
    const curr = sassy[ inRoom ];
    curr.repeat = { 
      on: false, 
      length: 0,  
      endTime: 0, 
      work: 0, 
      brake: 0 
    };
  };

  // @param inRoom: String
  // @globals sassy
  // @anotherFile emitRoom()
  // @anotherFile async logItWrapper()
  // @internal resetRepeating()
  module.repeatingDone = async ( inRoom, aUser ) => {
    const { repeat } = sassy[ inRoom ];
    if ( repeat.off ) {
      emitRoom( 'repeating timer already off', { room: inRoom } );
      return false;
    };

    resetRepeating( inRoom );
    emitRoom( 'repeating timers done', { room: inRoom } );
    await logItWrapper( inRoom, aUser, `repeating timers done after ${ repeat.length } hours` );
  };

  // @param inRoom: String
  // @anotherFile emitRoom()
  // @anotherFile async logItWrapper()
  // @internal resetRepeating()
  // @anotherFile stopTimer()
  module.repeatingStop = async ( inRoom, aUser ) => {
    const { repeat } = sassy[ inRoom ];
    if ( repeat.off ) {
      emitRoom( 'repeating already off', { room: inRoom } );
      return false;
    };

    resetRepeating( inRoom );
    stopTimer( inRoom );
    emitRoom( 'repeating timers stopped', { room: inRoom } );
    await logItWrapper( inRoom, aUser, `repeating timers force stopped` );
  };

  // @param inRoom: String
  // @param repeat: Object
  // @param session: String ('work' or 'brake')
  // @param skipSession: func()
  // @param startTimer: func()
  // @internal module.repeatingDone()
  module.wrappingUpRepeating = async ( inRoom, aUser, repeat, session, skipSession, startTimer ) => {
    if ( repeat.on == true ) {
      if ( repeat.endTime < new Date().getTime() ) {
        l.karm.debug( 'if ===', 'repeat.endTime < new Date().getTime()' );
        
        await module.repeatingDone( inRoom );
      } else {
        l.karm.debug( 'if else', 'repeat.endTime < new Date().getTime()' );

        const newSesh = session === 'work' ? 'brake' : 'work';
        skipSession( inRoom, aUser );
        const newSeshInMin = repeat[ newSesh ];
        startTimer( inRoom, aUser, newSeshInMin );
      };
    };
  };

  return module;
};

module.exports = RepeatingTimers;
