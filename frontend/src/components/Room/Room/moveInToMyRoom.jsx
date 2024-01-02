import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { 
  SocketContext, 
  RoomContext 
} from './../../Contexts';

let updateTimer = null;
const useMoveInToMyRoom = ( 
    // pauseTerm, 
    setPauseTerm, 
    setShowTimer, 
    
    curry, 
    flags, 
    reap, 
    push, 
    events, 
    sessionObj, 

    setSubmittingPauseResumeTimer, 
    setSubmittingStopTimer, 
    setSubmittingStopReap, 
    
    setupCurr, 
    updateTheTimer 
    // pause 
 ) => { 
  const socket = useContext( SocketContext );
  const aRoom = useContext( RoomContext );  
  
  const filterOutRoom = ( room ) => {
    if ( aRoom.name !== room ) return true;
  };

  const curryStateRef = useRef(curryState);
  useEffect(() => {
    curryStateRef.current = curryState;
  }, [curryState]);

  useEffect( () => { 
    const firstTimer = e => {
      const { 
        room, 
        secondsLeft, 
        duration, 
        started, 
        pause, 
        goneBy, 
        session, 
        repeat 
    } = e;
      if ( filterOutRoom( room ) ) { console.log('filtered out first'); return; };
      if ( secondsLeft <= 0 || duration <= 0 ) {
        return;
      };
      
      if ( pause.flag ) {
        setPauseTerm( 'unpause' );
        console.log('unpause');
      } else {
        setPauseTerm( 'pause' );
        console.log('pause');
      };

      if ( session != sessionObj.state.term ) {
        console.log( 'first session', session );
        sessionObj.set( session );
      };

      const { length, startTime, endTime, work, brake } = repeat;
      const DateObjEndTime = new Date( endTime );
      const DateObjStartTime = new Date( startTime );
      if ( repeat.on ) {
        reap.set( { 
          on: true, 
          length, 
          startTime, 
          endTime, 
          work, 
          brake, 
          DateObjStartTime, 
          DateObjEndTime 
        } );
      };
      
      const forCurr = { current: current, duration: duration, goneBy: goneBy };
      curry.set(setupCurr(forCurr));
      updateTheTimer(forCurr.current);
  };

    const timerPaused = ( room ) => { 
      if ( filterOutRoom( room ) ) { return; };
      setPauseTerm( 'unpause' );

      setSubmittingPauseResumeTimer( true );
      setTimeout( () => setSubmittingPauseResumeTimer( false ), 1000 );

      clearInterval(curry.state.interval);
      curry.state.interval = null;
    };

    const timerResumed = ( room ) => {
      if ( filterOutRoom( room ) ) { return; };
      setPauseTerm( 'pause' );

      setSubmittingPauseResumeTimer( true );
      setTimeout( () => setSubmittingPauseResumeTimer( false ), 1000 );

      updateTheTimer(curry.state.current);
    };

    const __endTimer = ( room, reapOn = false ) => {
      if ( filterOutRoom( room ) ) { return false; };

      setSubmittingPauseResumeTimer( true );
      setTimeout( () => setSubmittingPauseResumeTimer( false ), 3000 );
      setSubmittingStopTimer( true );
      setTimeout( () => setSubmittingStopTimer( false ), 3000 );
      if ( reapOn ) {
        setSubmittingStopReap( true );
        setTimeout( () => setSubmittingStopReap( false ), 3000 );
      };

      setTimeout( () => setShowTimer( false ), 2000 );
      curry.set( prev => setupCurr( { 
        ...prev, 
        secondsLeft: null, 
        formatted: null, 
        duration: null 
      } ) );
      flags.set({
        started: false, 
        ended: false, 
        triaged: false 
      });

      clearInterval(curry.state.interval);
      curry.state.interval = null;

      // reset pause
      setPauseTerm( 'pause' );
    };

    const timerStopped = ( props ) => {
      const {room, reapOn} = props;
      __endTimer( room, reapOn );
      if (!reapOn) {
        push.set( prev => {
          return { 
            ...prev, 
            event: 'end', 
            onOff: prev.onOff + 1, 
            title: `${ room } timer stopped`,
            body: 'Timer stopped. What up?' 
          };
        } );
      };
    };

    const timerFinished = ( props ) => { 
      const {room, reapOn} = props;
      if ( filterOutRoom( room ) ) { return; };
      // Browser notification
      if (!reapOn) {
        push.set( prev => {
          return { 
            ...prev, 
            event: 'end', 
            onOff: prev.onOff + 1, 
            title: `${ room } timer finished`,
            body: 'Timer up. What\'s next?' 
          };
        } );
      };

      __endTimer( room, reapOn );
    };

    const timerAlreadyBegun = ( room ) => { 
      if ( filterOutRoom( room ) ) { return; };
      // Some overlay letting the person know
      
    };
    

    const reapTimerOn = ( e ) => {
      const { length, startTime, endTime, work, brake, room } = e;
      if ( filterOutRoom( room ) ) { return; };
      const DateObjEndTime = new Date( endTime );
      const DateObjStartTime = new Date( startTime );
      reap.set( { 
        on: true, 
        length, 
        startTime, 
        endTime, 
        work, 
        brake, 
        DateObjStartTime, 
        DateObjEndTime
      } );
      
      // setSubmittingPauseResumeTimer( true );
      // setTimeout( () => setSubmittingPauseResumeTimer( false ), 2000 );
      // setSubmittingStopTimer( true );
      // setTimeout( () => setSubmittingStopTimer( false ), 2000 );

      setSubmittingStopReap( true );
      setTimeout( () => setSubmittingStopReap( false ), 2000 );
    };

    const __endReap = ( room ) => {
      if ( filterOutRoom( room ) ) { return false; };
      reap.set( { 
        on: false, 
        length: 0, 
        startTime: 0, 
        endTime: 0, 
        work: 0, 
        brake: 0 
      } );
      __endTimer( room, true );
    };

    const reapTimerDone = ( room ) => {
      __endReap( room );
      push.set( prev => {
        return { 
          ...prev, 
          event: 'repeat', 
          onOff: prev.onOff + 1, 
          title: `${ room } repeating timers finished`,
          body: 'So. What\'s next?' 
        };
      } );
    };

    // dupe
    const reapTimerStopped = ( room ) => {
      __endReap( room );
      push.set( prev => {
        return { 
          ...prev, 
          event: 'repeat', 
          onOff: prev.onOff + 1, 
          title: `${ room } repeating timers force stopped`,
          body: 'Hm. What up?' 
        };
      } );
    };

    if ( aRoom.hasOwnProperty( 'new' ) && aRoom.new ) {
      aRoom.emitAll( events.TIMER_CREATED );
    };

    // const reapUnpause = () => {
    //   console.log('reapUnpause')
    //   if (pauseTerm == 'unpause') {
    //     setPauseTerm('pause');
    //   };
    // };
    
    socket.on( 'timer first', firstTimer );
    // socket.on( events.TIMER_UPDATED, updateTimer );
    socket.on( events.TIMER_PAUSED, timerPaused );
    socket.on( events.TIMER_RESUMED, timerResumed );
    socket.on( events.TIMER_STOPPED, timerStopped );
    socket.on( events.TIMER_FINISHED, timerFinished );
    socket.on( events.TIMER_ALREADY_BEGUN, timerAlreadyBegun );

    socket.on( events.REAP_ON, reapTimerOn );
    socket.on( events.REAP_DONE, reapTimerDone );
    socket.on( events.REAP_STOPPED, reapTimerStopped );
    // socket.on('unpause button', reapUnpause);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );
};

useMoveInToMyRoom.propTypes = {
  setCurr: PropTypes.func, 
  filterOutRoom: PropTypes.func, 
  setPauseTerm: PropTypes.func, 
  setShowTimer: PropTypes.func, 
  setPush: PropTypes.func, 
  setReap: PropTypes.func, 
  events: PropTypes.object 
};

export default useMoveInToMyRoom;
