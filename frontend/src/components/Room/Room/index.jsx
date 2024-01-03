import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import TimerControl from './../../TimerControl';
import ActivityLog from './../../ActivityLog';
import './styles.scss';
import BrowserNotification from './../../BrowserNotification/Common';

import useRoomHooks from './hooks';
import useMoveInToMyRoom from './moveInToMyRoom';
import Core from './core';

import { AnalyticsContext, RoomContext } from './../../Contexts';
import RoomOverlay from './roomOverlay';
import Notice from './notice';

const Room = ( { 
  userEnabled, 
  inlineSize, 
  blockSize 
} ) => { 
  const aRoom = useContext( RoomContext );
  const aptRoom = aRoom.name;
  const sendEvent = useContext( AnalyticsContext );  

  const {
      // curry, flags, reap, session, push, events 
      flags, reap, session, push, events 
  } = useRoomHooks();

  const [curry, setCurry] = useState( { 
    secondsLeft: 0, 
    formatted: '00:00', 
    duration: 0,     
    paused: false, 
    goneBy: 0, 
    interval: null 
  } );

  const startMethod = (curr) => {      
    const forCurr = {secondsLeft: curr.secondsLeft, duration: curr.duration, goneBy: curr.goneBy};
    setCurry(prev => setupCurr({ 
      ...prev, 
      ...forCurr 
    }));
    updateTheTimer(curr, forCurr.secondsLeft);
  };

  const setupCurr = ( e ) => {
    let { secondsLeft, duration, ...rest } = e;
    secondsLeft = ( !secondsLeft || isNaN( secondsLeft ) ) ? 0 : secondsLeft;
    duration = ( !duration || isNaN( duration ) ) ? 0 : duration;
    return { secondsLeft, duration, ...rest };
  };

  const updateTheTimer = (curr, secondsLeft) => {
    // const forCurr = {secondsLeft: secondsLeft, duration: duration, goneBy: goneBy};
    curry.interval = setInterval(() => {
      --secondsLeft;

      setCurry(prev => setupCurr( { 
        ...prev, 
        secondsLeft: secondsLeft 
      } ) );

      if (secondsLeft <= 0) {
        clearInterval(curry.interval);
        curry.interval = null;
      };
    }, 1000);
  };

  // States
  const [ showTimer, setShowTimer ] = useState( false );
  const [ pauseTerm, setPauseTerm ] = useState( 'pause' );
  const [ view, setView ] = useState( false );

  // States shown in Core
  const [ submittingPauseResumeTimer, setSubmittingPauseResumeTimer ] = useState( false );
  const [ submittingStopTimer, setSubmittingStopTimer ] = useState( false );
  const [ submittingStopReap, setSubmittingStopReap ] = useState( false );

  const [ isResetDisabled, setIsResetDisabled ] = useState( false );

  useMoveInToMyRoom( setPauseTerm, setShowTimer, curry, setCurry, flags, reap, push, events, session, setSubmittingPauseResumeTimer, setSubmittingStopTimer, setSubmittingStopReap, setupCurr, updateTheTimer );
  useEffect( () => { 
    aRoom.emitAll( events.ROOM_ENTERED );
    
    sendEvent( {
      category: "timer", 
      action: "entered", 
      label: aptRoom, // optional
      // value: 99, // optional, must be a number
      nonInteraction: false, // optional
    } );

    return () => {
      aRoom.emitAll( events.LEAVE_DOWN );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const handleResetTimer = () => {
    setIsResetDisabled( true );
    // Logic
    clearInterval(curry.interval);
    curry.interval = null;

    aRoom.emitAll( events.RUN_FIRST_RUN );

    setTimeout(() => {
      setIsResetDisabled( false );
    }, 2000);
  };

  useEffect( () => { 
    if ( showTimer && !curry.secondsLeft ) {
      setShowTimer( false );
    } else if ( !showTimer && curry.secondsLeft ) {
      setShowTimer( true );
    };
  }, [ curry, showTimer ] );

  // DELETE soon 2023-10-10 16:29 | 
  // useEffect( () => { 
  //   console.log( 'curry.session running', aptRoom, session.state.term );
  //   // session.set( curry.term );
  // }, [ session.state.term ] );

  const [ efficiency, setEfficiency ] = useState( 0 );

  return (
    <div className="content">
      <h2 className="theh">
        { aptRoom }
      </h2>

      <Notice 
        msg=''
      />

      <BrowserNotification 
        type="notifications" 
        core={ push.state } 
      />

      <ActivityLog 
        userEnabled={ userEnabled } 
      />

      <CSSTransition 
        in={ showTimer } 
        timeout={ 3000 } 
        classNames="coretimer" 
        unmountOnExit 
      >
        <>
        <span>
          <a id="resetClick" onClick={ handleResetTimer } className={ isResetDisabled ? 'disabled-link' : '' }>
            Reset timer
          </a>
        </span>


        { reap.state.on && 
          <div className="repeat-timer-headers">
            <h4>
              Repeat, Pomo timers started at { reap.state.DateObjStartTime.toLocaleString( 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true } ) } 
            </h4>
            <h4>
              Repeat, Pomo timers end at { reap.state.DateObjEndTime.toLocaleString( 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true } ) } 
            </h4>
          </div>
        }        

        { !reap.state.on && flags.state.started && 
          <div>
            Efficiency: { efficiency }
          </div>
        }

        <RoomOverlay { ...{ view } } />

        <Core 
          sessionScheme={ session.state.scheme } 
          repeat={reap.state.on}
          curryState={ curry } 
          { ...{ 
            pauseTerm, 
            inlineSize, 
            blockSize, 
            
            push, 
            reap, 
            events, 

            setView, 

            submittingPauseResumeTimer, 
            setSubmittingPauseResumeTimer, 
            submittingStopReap, 
            setSubmittingStopReap, 
            submittingStopTimer, 
            setSubmittingStopTimer, 
          } } 
        />
        </>
        {/*  */}
      </CSSTransition>

      <TimerControl 
        inlineSize={ inlineSize / 2 } 
        blockSize={ blockSize / 2 } 
        sessionObj={ session } 
        flags={ flags } 
        started={ flags.state.started } 
        { ...{ 
          setShowTimer, 
          push, 

          setSubmittingPauseResumeTimer, 
          setSubmittingStopTimer, 
          setSubmittingStopReap 
        } } 
        startMethod={ startMethod } 
      />

    </div>
  ); 
};

Room.propTypes = {
  userEnabled: PropTypes.bool, 
  inlineSize: PropTypes.number, 
  blockSize: PropTypes.number 
};

Room.defaultProps = {  
  userEnabled: false, 
  inlineSize: 300, 
  blockSize: 300, 
};

export default Room;
