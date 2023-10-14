import React, { useEffect, useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

import Submit from './Submit';
import SubmitReap from './SubmitReap';
import ClickToTimerCreation from './Partials/ClickToTimerCreation';
import IntroDiv from './Partials/IntroDiv';
import EndingDiv from './Partials/EndingDiv';

import { SocketContext, RoomContext } from './../Contexts';
import './styles.scss';

// import useRoomHooks from './../Room/Room/hooks';

const TimerControl = ( { 
  sessionObj, 

  time, 
  duration, 

  className, 
  inlineSize, 
  blockSize, 

  setShowTimer, 
  push 
} ) => {

  const socket = useContext( SocketContext );
  const __room = useContext( RoomContext );
  
  const filterOutRoom = ( room ) => {
    if ( __room.name !== room ) return true;
  };

  const [ showControl, setShowControl ] = useState( false );
  const [ showNormOrReap, setNormOrReap ] = useState( false );
  const onShowing = () => setShowControl( prevState => !prevState );
  const formRef = useRef( null )

  const onShowingNorm = (e) => {
    // setTimeout( () => {
      if (e && !e.target.ariaBusy) {
        __room.emitRoomEtc(ASK_SESSION, {session: sessionObj.state.term});
      }
      onShowing();
      setNormOrReap( true );
    // }, timeOut );
  };
  const onShowingReap = ( e ) => {
    onShowing( e );
    setNormOrReap( false );
  };

  const TIMER_STARTED = 'timer started';
  const SESSION_SKIPPED = 'session skipped';
  const SKIP_SESSION = 'skip session';
  const META_UPDATED = 'meta_updated';

  const ASK_SESSION = 'ask for session'

  useEffect( () => {
    const timerStarted = ( room ) => {
      if ( filterOutRoom( room ) ) { return; };
      // setShowControl( false );
      setShowTimer( true );
    };

    const skipSession = ( { room, session } ) => {
      if ( filterOutRoom( room ) ) return;
      sessionObj.set( session );
    };

    const metaUpdated = ( e ) => {
      sessionObj.set( e.session );
    };
    
    socket.on( TIMER_STARTED, timerStarted );
    socket.on( SESSION_SKIPPED, skipSession );
    socket.on( META_UPDATED, metaUpdated );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  // const [ timerOn, setTimerOn ] = useState( false );
  // useEffect(() => {
  //   // flags.started here
  // }, [flags.started here])

  const handleSessionTimer = ( e ) => {
    e.preventDefault();
    __room.emitAll( SKIP_SESSION );
    if ( formRef && formRef.current ) {
      formRef.current.focus();
    };
  };

  const [ err, setErr ]= useState( {} );
  const [ errReap, setErrReap ]= useState( {} );

  // const onlyLogIfValued = ( value ) => { if ( !isEmpty( value ) ) console.log( value.name, value ); };

  const noTimerLogic = !time && !duration;

  return (
    <div className={ `${ className }__root` }>
    { showControl && showNormOrReap && 
      <>

        <IntroDiv
          handleShowing={ onShowingNorm } 
          introText="Add Timer"
          endingText="Cancel starting a new timer."
        />

        <div className={ `${ className }__parent` }>
          <Submit 
            handleSuccess={ onShowingNorm } 
            session={ sessionObj.state } 
            { ...{  
              setErr, 
              className, 
              inlineSize, 
              blockSize, 
              formRef, 
              push 
            } }
          >
            <EndingDiv 
              showWhich={ true } 
              session={ sessionObj.state } 
              { ...{                  
                time, 
                duration, 
                handleSessionTimer 
              } }
            />
          </Submit>


        { err && Object.keys( err ).length > 0 && 
        <div id="feedback">
          { Object.entries( err ).map( ( solo, index ) => ( 
            <div key={ index }>
              { solo }
            </div>
          ) ) }
        </div>
        } 
      </div>
      </>
    }

    { showControl && !showNormOrReap && 
      <>
        <IntroDiv
          handleShowing={ onShowingReap } 
          introText="Begin Repeating Timers" 
          endingText="Cancel starting a repeating timer." 
        />

        <div className={ `${ className }__parent repeating` }>
          <SubmitReap 
            handleSuccess={ onShowingReap } 
            session={ sessionObj.state } 
            setErr={ setErrReap } 
            { ...{ 
              className, 
              inlineSize, 
              blockSize, 
              noTimerLogic, 
              push 
            } }
          >
            <EndingDiv 
              showWhich={ true } 
              session={ sessionObj.state } 
              { ...{                 
                time, 
                duration, 
                handleSessionTimer 
              } }
            />
          </SubmitReap>
          

          { errReap && Object.keys( errReap ).length > 0 && 
          <div id="feedback">
            { Object.entries( errReap ).map( ( solo, index ) => ( 
              <div key={ index }>
                { solo }
              </div>
            ) ) }
          </div>
          }           
        </div>
      </>
    }

    { !showControl && 
      <ClickToTimerCreation
        showNorm={ onShowingNorm } 
        showReap={ onShowingReap } 
      />
    }
    </div>
  ); 
};

TimerControl.propTypes = {
  // socket: PropTypes.object.isRequired, 
  time: PropTypes.number, 
  inlineSize: PropTypes.number, 
  blockSize: PropTypes.number, 

  className: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ), 

  sessionObj: PropTypes.object.isRequired, 
  duration: PropTypes.number, 
  setPush: PropTypes.func, 
  setShowTimer: PropTypes.func
};

TimerControl.defaultProps = {  
  inlineSize: 150, 
  blockSize: 150, 
  className: 'control' 
};

export default TimerControl;
