import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import Svg from './../TimerSvgs';
import TimerControl from './../../TimerControl';
import ActivityLog from './../../ActivityLog';
import './styles.scss';

import BrowserNotification from './../../BrowserNotification/Common';

import { 
  // GroupContext, 
  SocketContext, 
  RoomContext, 
  // UserContext 
} from './../../Contexts';

let stoplightInterval = null;
let hourglassInterval = null;

const Room = ( { 
  // isNew, 
  userEnabled,  
  width, 
  height, 
  CircleClass 
} ) => { 
  // const { gName } = useContext( GroupContext );
  const socket = useContext( SocketContext );
  const aRoom = useContext( RoomContext );
  // const aUser = useContext( UserContext );
  const aptRoom = aRoom.name;

  // const emitAll = ( msg, ...restoros ) => socket.emit( msg, aptRoom, aUser, ...restoros );
  const emitAll = ( msg ) => socket.emit( msg, aptRoom );
  const filterOutRoom = ( room ) => {
    if ( aptRoom !== room ) { return true; };
  };


  // States
  const [ showTimer, setShowTimer ] = useState( false );
  // Push notifications
  const [ push, setPush ] = useState( { 
    event: false, 
    onOff: 0, 
    title: 'Timer Notification', 
    body: 'You\'re notified' 
  } );

  const [ curr, setCurr ] = useState( { 
    current: 0, 
    currentFormatted: '00:00', 
    totalDuration: 0, 
    started: 0, 
    paused: false, 
    pausedAt: 0, 
    ongoingTime: 0  
  } );  
  const [ session, setSession ] = useState( { 
    term: 'work', 
    icon: 'briefcase', 
    opp: 'brake', 
    oppIcon: 'coffee', 
    scheme: '', 
    oppScheme: 'brake' 
  } );
  const [ reap, setReap ] = useState( { 
    on: false, 
    length: 0, 
    endTime: 0, 
    work: 32, 
    brake: 8 
  } );

  const [ stoplight, setStoplight ] = useState( 'stop' );
  const [ hourglass, setHourglass ] = useState( 'start' );

  const TIMER_UPDATED = 'timer updated';
  const TIMER_PAUSED = 'timer paused';
  const TIMER_RESUMED = 'timer resumed';
  const TIMER_STOPPED = 'timer stopped';
  const TIMER_FINISHED = 'timer finished';
  const TIMER_CREATED = 'timer created';

  const REAP_ON = 'repeating timers on';
  const REAP_DONE = 'repeating timers done';
  const REAP_STOPPED = 'repeating timers stopped';

  const ROOM_ENTERED = 'room entered';
  const LEAVE_DOWN = 'leave down';
  const STOP_TIMER = 'stop timer';  
  const STOP_REAP = 'stop repeating timers';

  const moveInToMyRoom = ( setCurr ) => {
    const updateTimer = e => {
      const { paused, room } = e;
      if ( filterOutRoom( room ) ) { return; };

      if ( paused ) {
        setPauseTerm( 'unpause' );
      } else {
        setPauseTerm( 'pause' );
      }
      setCurr( setupCurr( e ) );
    };

    const timerPaused = ( room ) => { 
      if ( filterOutRoom( room ) ) { return; };
      // console.log( 'timerPause happening', aptRoom );
      setPauseTerm( 'unpause' );
    };

    const timerResumed = ( room ) => {
      if ( filterOutRoom( room ) ) { return; };
      // console.log( 'timerResumed happening', aptRoom );
      setPauseTerm( 'pause' );
    };    

    const __endTimer = ( room ) => {
      if ( filterOutRoom( room ) ) { return false; };
      setShowTimer( false );
      // console.log( 'showtimer off' );

      setCurr( setupCurr( { 
        current: null, 
        currentFormatted: null, 
        totalDuration: null 
      } ) );
    };

    const timerStopped = ( room ) => {
      __endTimer( room );
      
      setPush( prev => {
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
      setPush( prev => {
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
      setReap( { 
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
      setReap( { 
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

      setPush( prev => {
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

      setPush( prev => {
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
      emitAll( TIMER_CREATED );
    };

    socket.on( TIMER_UPDATED, updateTimer );
    socket.on( TIMER_PAUSED, timerPaused );
    socket.on( TIMER_RESUMED, timerResumed );
    socket.on( TIMER_STOPPED, timerStopped );
    socket.on( TIMER_FINISHED, timerFinished );

    socket.on( REAP_ON, reapTimerOn );
    socket.on( REAP_DONE, reapTimerDone );
    socket.on( REAP_STOPPED, reapTimerStopped );
  };

  const setupCurr = ( e ) => {
    let { current, currentFormatted, totalDuration, ...rest } = e;
    current = ( !current || isNaN( current ) ) ? 0 : current;
    totalDuration = ( !totalDuration || isNaN( totalDuration ) ) ? 0 : totalDuration;
    currentFormatted = !currentFormatted ? '00:00' || '0:00:00' || '00:00:00' : currentFormatted;
    return { current, currentFormatted, totalDuration, ...rest };
  };

  const [ pauseTerm, setPauseTerm ] = useState( 'pause' );
  useEffect( () => { 
    emitAll( ROOM_ENTERED );

    moveInToMyRoom( setCurr );
    return () => {
      emitAll( LEAVE_DOWN );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  useEffect( () => { 
    if ( showTimer && !curr.current ) {
      setShowTimer( false );
    } else if ( !showTimer && curr.current ) {
      setShowTimer( true );
    };
  }, [ curr, showTimer ] );

  const handlePauseResumeTimer = ( e, pauseTerm ) => {
    emitAll( pauseTerm );
    setPush( prev => { 
      return { 
        ...prev, 
        event: 'other', 
        title: 'Paused timer', 
        onOff: prev.onOff + 1 
      }; 
    } );
  };

  const handleStopTimer = ( e ) => {
    emitAll( STOP_TIMER );
  };

  const handleStopReap = ( e ) => {
    emitAll( STOP_REAP );
  };

  const handleStoplightHover = () => {
    stoplightInterval = setInterval( () => {
      setStoplight( prevState => prevState === 'stop' ? 'go' : 'stop' );
    }, 750 );
  };
  const handleStoplightOut = () => {
    clearInterval( stoplightInterval );
    setStoplight( 'stop' );
  };

  const handleHourglassHover = () => {
    hourglassInterval = setInterval( () => {
      setHourglass( prevState => prevState === 'start' ? 'end' : 'start' );
    }, 750 );
  };
  const handleHourglassOut = () => {
    clearInterval( hourglassInterval );
    setHourglass( 'start' );
  };
  
  // const { current, currentFormatted, totalDuration } = curr;

  return (
    <div className="content">
      <h2 className="theh">
        { aptRoom }
      </h2>

      <BrowserNotification 
        type="notifications" 
        core={ push } 
        // label={ aptRoom } @KBJ
        // group={ group } @KBJ
        // timer={ aptRoom } @KBJ
        // run={ push.onOff } 
        // event={ push.event } 
        // title={ push.title } 
        // body={ push.body } 
      />

      <ActivityLog 
        userEnabled={ userEnabled } 
        // group={ group } @KBJ
        // timer={ aptRoom } @KBJ - done
      />

      <CSSTransition 
        in={ showTimer } 
        timeout={ 2500 } 
        classNames="coretimer" 
        // appear={ true } 
        // mountOnEnter 
        unmountOnExit 
      >
        <>
        { reap.on && 
          <div className="repeat-timer-headers">
            <h4>
              Repeat, Pomo timers started at { reap.DateObjStartTime.toLocaleString( 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true } ) } 
            </h4>
            <h4>
              Repeat, Pomo timers end at { reap.DateObjEndTime.toLocaleString( 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true } ) } 
            </h4>
          </div>
        }
        <div className={ `svg-parent ${ session.scheme }` }>
          <Svg 
            className={ CircleClass } 
            timer={ curr.currentFormatted } 
            secondsLeft={ curr.current } 
            duration={ curr.totalDuration } 
            ongoingTime={ curr.ongoingTime } 
            { ...{ 
              width, 
              height 
            } } 
          />

          <div className="pause-button-parent">

            <button 
              id="pause-timer"
              className="casual-button link-underline-fade cap-it-up" 
              onClick={ ( e ) => 
                handlePauseResumeTimer( e, pauseTerm ) 
              } 
              onMouseEnter={ handleHourglassHover } 
              onMouseLeave={ handleHourglassOut } 
            >
              <div className="button-content">
                <div className="button-content-left">
                  <p className="no-gap">{ pauseTerm }</p>
                  <p className="no-gap">timer</p>
                </div>
                <div className="button-content-right">
                  <i className={ `bigger-icon icon-pad-left far fa-hourglass-${ pauseTerm === 'pause' ? hourglass : 'half' }` }></i>
                </div>
              </div>
            </button>

            <button 
              id="stop-timer"
              className="casual-button link-underline-fade" 
              onClick={ handleStopTimer } 
              onMouseEnter={ handleStoplightHover } 
              onMouseLeave={ handleStoplightOut } 
            >
              {}
              <div className="button-content">
                <div className="button-content-left">
                  <p className="no-gap">Stop</p>
                  <p className="no-gap">Current</p>
                  <p className="no-gap">Timer</p>
                </div>
                <div className="button-content-right">
                  <i className={ `bigger-icon icon-pad-left far fa-traffic-light-${ stoplight }` }></i>
                </div>
              </div>
            </button>

            { reap.on && 
              <button 
                id="stop-reap" 
                className="casual-button link-underline-fade" 
                onClick={ handleStopReap } 
                onMouseEnter={ handleStoplightHover } 
                onMouseLeave={ handleStoplightOut } 
              >
                {} 
                <div className="button-content">
                  <div className="button-content-left">
                    <p className="no-gap">Fully Stop</p>
                    <p className="no-gap">All</p>
                    <p className="no-gap">Repeating</p>
                  </div>
                  <div className="button-content-right">
                    <i className={ `bigger-icon icon-pad-left far fa-traffic-light-${ stoplight }` }></i>
                  </div>
                </div>
              </button>
            }
          </div> {/* .pause-button-parent */}
        </div>
        </>
        {/*  */}
      </CSSTransition>

      <TimerControl 
        time={ curr.current } 
        duration={ curr.totalDuration } 
        width={ width / 2 } 
        height={ height / 2 } 
        { ...{ 
          emitAll, 
          session, 
          setSession, 
          setPush, 
          setShowTimer, 
          reap 
        } }
      />

    </div>
  ); 
};

Room.propTypes = {
  isNew: PropTypes.bool, 
  userEnabled: PropTypes.bool, 

  width: PropTypes.number, 
  height: PropTypes.number, 
  CircleClass: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ) 
};

Room.defaultProps = { 
  isNew: false, 
  userEnabled: false, 

  width: 300, 
  height: 300, 
  CircleClass: 'roompop' 
};

export default Room;
