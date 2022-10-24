import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { 
  SocketContext, 
  RoomContext 
} from './../../Contexts';

const useMoveInToMyRoom = ( 
    setPauseTerm, 
    setShowTimer, 
    
    curry, 
    reap, 
    push, 
    events 
 ) => { 
  const socket = useContext( SocketContext );
  const aRoom = useContext( RoomContext );  
  
  const filterOutRoom = ( room ) => {
    if ( aRoom.name !== room ) return true;
  };

  useEffect( () => { 
    const setupCurr = ( e ) => {
      let { current, duration, flags, ...rest } = e;
      current = ( !current || isNaN( current ) ) ? 0 : current;
      duration = ( !duration || isNaN( duration ) ) ? 0 : duration;
      return { current, duration, flags, ...rest };
    };

    const updateTimer = e => {
      const { paused, room } = e;
      if ( filterOutRoom( room ) ) { return; };

      if ( paused ) {
        setPauseTerm( 'unpause' );
      } else {
        setPauseTerm( 'pause' );
      };

      curry.set( setupCurr( e ) );

    };

    const timerPaused = ( room ) => { 
      if ( filterOutRoom( room ) ) { return; };
      setPauseTerm( 'unpause' );
    };

    const timerResumed = ( room ) => {
      if ( filterOutRoom( room ) ) { return; };
      setPauseTerm( 'pause' );
    };    

    const __endTimer = ( room ) => {
      if ( filterOutRoom( room ) ) { return false; };
      setShowTimer( false );
      curry.set( prev => setupCurr( { 
        ...prev, 
        current: null, 
        formatted: null, 
        duration: null 
      } ) );
    };

    const timerStopped = ( room ) => {
      __endTimer( room );
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

    const timerFinished = ( room ) => { 
      if ( filterOutRoom( room ) ) { return; };
      // Browser notification
      push.set( prev => {
        return { 
          ...prev, 
          event: 'end', 
          onOff: prev.onOff + 1, 
          title: `${ room } timer finished`,
          body: 'Timer up. What\'s next?' 
        };
      } );

      __endTimer( room );
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
      __endTimer( room );
    };

    const reapTimerDone = ( room ) => {
      __endReap( room );
      push.set( prev => {
        return { 
          ...prev, 
          event: 'repeating end', 
          onOff: prev.onOff + 1, 
          title: `${ room } repeating timer finished`,
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
          event: 'repeating end', 
          onOff: prev.onOff + 1, 
          title: `${ room } repeating timer force stopped`,
          body: 'Hm. What up?' 
        };
      } );
    };

    if ( aRoom.hasOwnProperty( 'new' ) && aRoom.new ) {
      aRoom.emitAll( events.TIMER_CREATED );
    };

    socket.on( events.TIMER_UPDATED, updateTimer );
    socket.on( events.TIMER_PAUSED, timerPaused );
    socket.on( events.TIMER_RESUMED, timerResumed );
    socket.on( events.TIMER_STOPPED, timerStopped );
    socket.on( events.TIMER_FINISHED, timerFinished );

    socket.on( events.REAP_ON, reapTimerOn );
    socket.on( events.REAP_DONE, reapTimerDone );
    socket.on( events.REAP_STOPPED, reapTimerStopped );
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
