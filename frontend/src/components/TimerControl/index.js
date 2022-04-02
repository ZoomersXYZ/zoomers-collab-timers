import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import Submit from './Submit';
import SubmitReap from './SubmitReap';
import ClickToTimerCreation from './Partials/ClickToTimerCreation';
import IntroDiv from './Partials/IntroDiv';
import EndingDiv from './Partials/EndingDiv';

import { SocketContext, RoomContext } from './../Contexts';
import './styles.scss';

const TimerControl = ( { 
  emitAll, 

  session, 
  setSession, 

  time, 
  duration, 

  className, 
  width, 
  height, 
  
  setPush, 

  setShowTimer, 
  // reap
} ) => {
  const socket = useContext( SocketContext );
  const __room = useContext( RoomContext );
  const aptRoom = __room.name;
  
  const filterOutRoom = ( room ) => {
    if ( aptRoom !== room ) { return true; };
  };

  const [ showControl, setShowControl ] = useState( false );
  const [ showNormOrReap, setNormOrReap ] = useState( false );
  const onShowing = () => setShowControl( prevState => !prevState );

  const onShowingNorm = ( timeOut = 500 ) => {
    // setTimeout( () => {
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

  useEffect( () => {
    const timerStarted = ( room ) => {
      if ( filterOutRoom( room ) ) { return; };
      console.log( 'timerStarted() room', room );
      // setShowControl( false );
      setShowTimer( true );
    };

    const skipSession = ( { room, session } ) => {
      if ( filterOutRoom( room ) ) { return; };
      
      setSession( session === 'work' ? 
        { 
          term: 'work', 
          icon: 'briefcase', 
          opp: 'brake', 
          oppIcon: 'coffee', 
          scheme: '', 
          oppScheme: 'brake' 
        } 
        : 
        { 
          term: 'brake', 
          icon: 'coffee', 
          opp: 'work', 
          oppIcon: 'briefcase', 
          scheme: 'brake', 
          oppScheme: '' 
        } 
      )
    };

    const metaUpdated = ( e ) => {
      setSession( e.session );
    };
    
    socket.on( TIMER_STARTED, timerStarted );
    socket.on( SESSION_SKIPPED, skipSession );
    socket.on( META_UPDATED, metaUpdated );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const handleSessionTimer = ( e ) => {
    e.preventDefault();
    emitAll( SKIP_SESSION );
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
            sessionScheme={ session.scheme } 
            { ...{ 
              emitAll, 
              aptRoom, 
              socket, 
              setErr, 
              setPush, 
              className, 
              width, 
              height 
            } }
          >
            <EndingDiv 
              showWhich={ true } 
              { ...{ 
                session, 
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
            setErr={ setErrReap } 
            { ...{ 
              emitAll, 
              aptRoom, 
              socket, 
              setPush, 
              session, 
              className, 
              width, 
              height, 
              noTimerLogic, 

              time, 
              duration, 
              handleSessionTimer 
            } }
          >
            <EndingDiv 
              showWhich={ true } 
              { ...{ 
                session, 
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
  width: PropTypes.number, 
  height: PropTypes.number, 

  className: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ), 
  // aptRoom: PropTypes.string.isRequired, 

  session: PropTypes.object.isRequired, // the hashie
  setSession: PropTypes.func, 
  duration: PropTypes.number, 
  setPush: PropTypes.func, 
  setShowTimer: PropTypes.func
};

TimerControl.defaultProps = {  
  width: 150, 
  height: 150, 
  className: 'control' 
};

export default TimerControl;
