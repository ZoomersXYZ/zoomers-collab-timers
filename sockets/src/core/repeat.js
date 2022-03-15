const l = require( './../config/winston' );

const RepeatingTimers = function ( 
  sockId, 
  v, 
  
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
  // @global @anotherFile emitRoom()
  // @global @anotherFile async logItWrapper()
  // @anotherFile startTimer()
  module.repeatingStart = async ( inRoom, work, brake, length ) => {
    const curr = sassy[ inRoom ];
    const { roomie, session } = curr;
    const theTime = new Date().getTime();
    v.HR_REPEAT ??= 1;
    curr.repeat = { 
      on: true, 
      length, 
      // endTime: theTime + ( length * 60 * 60 * 1000 ), 
      // silly way to allow debugging quicker times. For 240x less: 7.5. For 180x less: 10.
      // 240x/180x less. 1H is 15/20s. 2H is 30/40s. 3H is 45/70s
      startTime: theTime, 
      endTime: theTime + ( length * ( 60 / v.HR_REPEAT ) * ( 60 / v.HR_REPEAT ) * 1000 ), 
      work, 
      brake 
    };
    
    emitRoom( 'repeating timers on', { room: inRoom, ...curr.repeat } );
    await logItWrapper( inRoom, 'repeating timers on & started' );

    if ( session === 'brake' ) {
      emitRoom( 'session skipped', { room: roomie, session: session } );
    };
    startTimer( inRoom, work );
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
  // @global @anotherFile emitRoom()
  // @global @anotherFile async logItWrapper()
  // @internal resetRepeating()
  module.repeatingDone = async ( inRoom ) => {
    const curr = sassy[ inRoom ];
    const { repeat } = curr;

    resetRepeating( inRoom );
    emitRoom( 'repeating timers done', { room: inRoom } );
    await logItWrapper( inRoom, `repeating timers done after ${ repeat.length } hours` );
  };

  // @param inRoom: String
  // @global @anotherFile emitRoom()
  // @global @anotherFile async logItWrapper()
  // @internal resetRepeating()
  // @anotherFile stopTimer()
  module.repeatingStop = async ( inRoom ) => {
    resetRepeating( inRoom );
    stopTimer( inRoom );

    emitRoom( 'repeating timers stopped', { room: inRoom } );
    await logItWrapper( inRoom, `repeating timers force stopped` );
  };

  // @param inRoom: String
  // @param repeat: Object
  // @param session: String ('work' or 'brake')
  // @param skipSession: func()
  // @param startTimer: func()
  // @internal module.repeatingDone()
  module.wrappingUpRepeating = ( inRoom, repeat, session, skipSession, startTimer ) => {
    if ( repeat.on == true ) {
      if ( repeat.endTime < new Date().getTime() ) {
        l.karm.debug( 'if ===', 'repeat.endTime < new Date().getTime()' );
        
        module.repeatingDone();
      } else {
        l.karm.debug( 'if else', 'repeat.endTime < new Date().getTime()' );

        const newSesh = session === 'work' ? 'brake' : 'work';
        skipSession( inRoom );
        const newSeshInMin = repeat[ newSesh ];
        startTimer( inRoom, newSeshInMin );
      };
    };
  };

  return module;
};

module.exports = RepeatingTimers;
