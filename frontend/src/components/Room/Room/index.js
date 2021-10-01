import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Svg from './../TimerSvgs';
import TimerControl from './../../TimerControl';
import ActivityLog from './../../ActivityLog';
import './styles.scss';

import BrowserNotification from './../../CommonNotification';

let stoplightInterval = null;
let hourglassInterval = null;

const Room = ( { socket, group, roomie, log, userEnabled, width, height, className } ) => { 
  // Push notifications
  const [ notify, setNotify ] = useState( 0 );
  const [ notifyInfo, setNotifyInfo ] = useState( { title: 'Timer Notification', body: 'You\'re notified' } );
  // const { name, timers, createdAt, lastUsed } = roomie;
  const { name } = roomie;
  const aptRoom = name;

  const emitRoom = ( msg ) => socket.emit( msg, aptRoom );
  const filterOutRoom = ( room ) => {
    if ( aptRoom !== room ) { return true; };
  };

  const [ curr, setCurr ] = useState( { 
    current: 0, 
    currentFormatted: '00:00', 
    totalDuration: 0, 
    started: 0, 
    paused: false, 
    pausedAt: 0, 
    ongoingTime: 0  
  } );
  const [ session, setSession ] = useState( { term: 'work', icon: 'briefcase', opp: 'break', oppIcon: 'coffee', scheme: '', oppScheme: 'break' } );

  const [ stoplight, setStoplight ] = useState( 'stop' );
  const [ hourglass, setHourglass ] = useState( 'start' );

  const TIMER_UPDATED = 'timer updated';
  const TIMER_PAUSED = 'timer paused';
  const TIMER_RESUMED = 'timer resumed';
  const TIMER_STOPPED = 'timer stopped';
  const TIMER_FINISHED = 'timer finished';
  const TIMER_CREATED = 'timer created';

  const ROOM_ENTERED = 'room entered';
  const LEAVE_DOWN = 'leave down';
  const STOP_TIMER = 'stop timer';

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
      setPauseTerm( 'unpause' );
    };

    const timerResumed = () => {
      setPauseTerm( 'pause' );
    };    

    const timerStopped = () => {
      setCurr( setupCurr( { 
        current: null, 
        currentFormatted: null, 
        totalDuration: null 
      } ) );      
    };
    const timerFinished = () => {
      // Browser notification
      setNotifyInfo( { title: `${ name } timer finished`, body: 'Timer up. What\'s next?', sound: 1 } );
      setNotify( prevState => prevState + 1 );

      timerStopped();
    };

    if ( roomie.hasOwnProperty( 'new' ) && roomie.new ) {
      emitRoom( TIMER_CREATED );
      // socket.emit( TIMER_CREATED );
    };

    socket.on( TIMER_UPDATED, updateTimer );
    socket.on( TIMER_PAUSED, timerPaused );
    socket.on( TIMER_RESUMED, timerResumed );
    socket.on( TIMER_STOPPED, timerStopped );
    socket.on( TIMER_FINISHED, timerFinished );
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
    emitRoom( ROOM_ENTERED );

    moveInToMyRoom( setCurr );
    return () => {
      emitRoom( LEAVE_DOWN );
      socket.emit( 'leave down', name );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const handlePauseResumeTimer = ( e, pauseTerm ) => {
    emitRoom( pauseTerm );
    // notify.show();
    setNotify( prevState => prevState + 1 );

    // socket.emit( pauseTerm );
  };

  const handleStopTimer = ( e ) => {
    emitRoom( STOP_TIMER );
    // socket.emit( 'stop timer' );
  };

  const handleStoplightHover = () => {
    stoplightInterval = setInterval( () => {
      setStoplight( prevState => prevState === 'stop' ? 'go' : 'stop' );
    }, 500 );
  };
  const handleStoplightOut = () => {
    clearInterval( stoplightInterval );
    setStoplight( 'stop' );
  };

  const handleHourglassHover = () => {
    hourglassInterval = setInterval( () => {
      setHourglass( prevState => prevState === 'start' ? 'end' : 'start' );
    }, 500 );
  };
  const handleHourglassOut = () => {
    clearInterval( hourglassInterval );
    setHourglass( 'start' );
  };
  
  const { current, currentFormatted, totalDuration } = curr;

  return (
    <div className="content">
      <BrowserNotification 
        run={ notify } 
        title={ notifyInfo.title } 
        body={ notifyInfo.body } 
      />
      <h2 className="theh">
        { name } 
      </h2>

      <ActivityLog 
        log={ log } 
        userEnabled={ userEnabled } 
        timer={ name } 
      />

      { ( !isNaN( current ) && current > 0 ) && ( !isNaN( totalDuration ) && totalDuration > 0 ) && 
        <div className={ `svg-parent ${ session.scheme }` }>
          <Svg 
            className={ className } 
            timer={ currentFormatted } 
            secondsLeft={ current } 
            duration={ totalDuration } 
            ongoingTime={ curr.ongoingTime } 

            width={ width } 
            height={ height } 
          />
          <div className="pause-button-parent">
            <button 
              id="pause-timer"
              className="casual-button link-underline-fade cap-it-up" 
              onClick={ ( e ) => handlePauseResumeTimer( e, pauseTerm ) } 
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
              <div className="button-content">
                <div className="button-content-left">
                  <p className="no-gap">Stop</p>
                  <p className="no-gap">Timer</p>
                </div>
                <div className="button-content-right">
                  <i className={ `bigger-icon icon-pad-left far fa-traffic-light-${ stoplight }` }></i>
                </div>
              </div>
            </button>
          </div>
        </div>
      }

      <TimerControl 
        aptRoom={ name }
        socket={ socket } 
        time={ current } 
        duration={ totalDuration } 
        width={ width / 2 } 
        height={ height / 2 } 
        session={ session } 
        setSession={ setSession } 
        
        setNotify={ setNotify } 
        setNotifyInfo={ setNotifyInfo } 
      />      
    </div>
  ); 
};

Room.propTypes = {
  roomie: PropTypes.object.isRequired, 

  width: PropTypes.number, 
  height: PropTypes.number, 

  className: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ), 

  // nick, 
  // email, 
  // sockets, 
  // group 
};

Room.defaultProps = {  
  width: 300, 
  height: 300, 
  className: 'roompop' 
};

export default Room;
