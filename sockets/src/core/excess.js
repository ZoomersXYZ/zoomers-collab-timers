////
// Timer.js
////

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

  // updatingTimer = ( inRoom, current, duration, started, pause, flags, goneBy, repeat, session ) => {
  //   const hashish = {
  //     current,
  //     duration,
  //     started,
  //     pause,
  //     flags,
  //     goneBy,
  //     repeat,
  //     session
  //   };
  //   emitRoom( 'timer updated', { room: inRoom, ...hashish } );
  //   return hashish;
  // };

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

  // @params inRoom: String
  // @global sassy
  // @internal-ish clearInterval()
  // clearUpdateTimer = ( inRoom ) => { 
  //   const curr = sassy[ inRoom ];
  //   // clearInterval( curr.intervals.updateTimerInterval );
  //   clearInterval( updateTimerInterval );
  // };
  