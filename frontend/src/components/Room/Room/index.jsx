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

import { RoomContext } from './../../Contexts';
import RoomOverlay from './roomOverlay';
import Notice from './notice';

const Room = ( { 
  userEnabled, 
  inlineSize, 
  blockSize 
} ) => { 
  const aRoom = useContext( RoomContext );
  const aptRoom = aRoom.name;

  const {
      curry, flags, reap, session, push, events 
  } = useRoomHooks();

  const setupCurr = ( e ) => {
    let { current, duration, ...rest } = e;
    current = ( !current || isNaN( current ) ) ? 0 : current;
    duration = ( !duration || isNaN( duration ) ) ? 0 : duration;
    return { current, duration, ...rest };
  };

  const updateTheTimer = (current) => {
    // const forCurr = {current: current, duration: duration, goneBy: goneBy};
    curry.interval = setInterval(() => {
      --current;
      curry.set(prev => setupCurr( { 
        ...prev, 
        current: current 
      } ) );
      if (curry.current < 0) {
        clearInterval(curry.interval);
        curry.interval = null;;
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

  useMoveInToMyRoom( setPauseTerm, setShowTimer, curry, flags, reap, push, events, session, setSubmittingPauseResumeTimer, setSubmittingStopTimer, setSubmittingStopReap, setupCurr, updateTheTimer );
  useEffect( () => { 
    aRoom.emitAll( events.ROOM_ENTERED );

    return () => {
      aRoom.emitAll( events.LEAVE_DOWN );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  useEffect( () => { 
    if ( showTimer && !curry.state.current ) {
      setShowTimer( false );
    } else if ( !showTimer && curry.state.current ) {
      setShowTimer( true );
    };
  }, [ curry.state, showTimer ] );

  // DELETE soon 2023-10-10 16:29 | 
  // useEffect( () => { 
  //   console.log( 'curry.session running', aptRoom, session.state.term );
  //   // session.set( curry.state.term );
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
          { ...{ 
            pauseTerm, 
            inlineSize, 
            blockSize, 

            curry, 
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
        curry={ curry } 
        updateTheTimer={ updateTheTimer } 
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
