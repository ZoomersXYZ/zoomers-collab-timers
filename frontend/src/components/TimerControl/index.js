import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import Submit from './Submit';
import Circle from './Circle';

import { isEmpty } from './../../ancillary/helpers/general';

import './styles.scss';

const TimerControl = ( { 
  socket, 
  aptRoom, 
  session, 
  setSession, 
  time, 
  duration, 
  width, 
  height, 
  className, 
  setNotify, 
  setNotifyInfo, 
  setShowTimer 
} ) => {
  const theRef = useRef( null );

  const filterOutRoom = ( room ) => {
    if ( aptRoom !== room ) { return true; };
  };

  const [ showControl, setShowControl ] = useState( false );
  const [ showNormOrRepeat, setNormOrRepeat ] = useState( false );
  const onHandleShowing = ( e ) => setShowControl( prevState => !prevState );
  const onHandleNormOrRepeat = ( e ) => setNormOrRepeat( prevState => !prevState );

  const onHandleShowingNorm = ( e ) => {
    setShowControl( prevState => !prevState );
    setNormOrRepeat( true );
  };
  const onHandleShowingRepeat = ( e ) => {
    setShowControl( prevState => !prevState );
    setNormOrRepeat( false );
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
          opp: 'break', 
          oppIcon: 'coffee', 
          scheme: '', 
          oppScheme: 'break' 
        } 
        : 
        { 
          term: 'break', 
          icon: 'coffee', 
          opp: 'work', 
          oppIcon: 'briefcase', 
          scheme: 'break', 
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


  const [ formStatus, setFormStatus ] = useState( null );
  const handleFormStatus = ( arg ) => {
    if ( !isEmpty( arg ) ) {
      setFormStatus( arg );
      setTimeout( setFormStatus( null ), 1500 );
    } else {
      setFormStatus( arg );
    };
    setTimeout( onHandleShowing, 1500 );
  };

  const [ formErr, setFormErr ] = useState( null );
  const handleFormErrors = ( arg ) => {
    if ( !isEmpty( arg ) ) {
      setFormErr( arg.newTimer );
    } else {
      setFormErr( arg );
    }
  };

  const handleSessionTimer = ( e ) => {
    e.preventDefault();
    socket.emit( SKIP_SESSION, aptRoom );
  };

  const repeatingInput = ( el, index ) => el.children[ index ].getElementsByTagName( 'input' )[ 0 ].value;

  const handleRepeatingSubmit = ( e ) => {
    let parent = e.target;
    while ( !parent.className.includes( 'control__parent' ) ) {
      parent = parent.parentElement;
    };
    const workTime = repeatingInput( parent, 0 );
    const breakTime = repeatingInput( parent, 1 );
    const length = repeatingInput( parent, 2 );
    
    socket.emit( 'repeating timer on', aptRoom, workTime, breakTime, length );
  };

  return (
    <div className={ `${ className }__root` }>
    { showControl && showNormOrRepeat && 
      <>

        <div className="intro-text">
          <h4>
            Add Timer
          </h4>
          <p className="room__timer-oops">
            <button 
              className="as-text-addon as-link color-serious smaller-middle-upper-text" 
              onClick={ onHandleShowing }
            >
              <span className="button-content">
                Cancel starting a new timer.
                <i className="icon-pad-left far fa-stopwatch"></i>
              </span>
            </button>
          </p>
        </div>

        <div className={ `${ className }__parent` }>
          <div className={ `${ className }__div ${ session.scheme ? session.scheme : 'def' }` }>
            <Circle 
              className={ className } 
              width={ width } 
              height={ height } 
              theRef={ theRef } 
            >
              <Submit 
                aptRoom={ aptRoom } 
                theRef={ theRef } 
                socket={ socket } 
                handleStatus={ handleFormStatus } 
                handleErrors={ handleFormErrors } 
                onHandleShowing={ onHandleShowing } 

                setNotify={ setNotify } 
                setNotifyInfo={ setNotifyInfo } 
              />
            </Circle>
            { formErr && <div id="feedback">{ formErr }</div> }
            { formStatus && <div className="success-msg">{ formStatus }</div> }
          </div>

          { !time && !duration && 
            <div className={ `session-button-parent ${ session.oppScheme ? session.oppScheme : 'defOpp' }` }>
              <button 
                className="casual-button link-underline-fade cap-it-up" 
                onClick={ handleSessionTimer }
              >
                <div className="button-content">
                  <div className="button-content-left">
                    <p className="no-gap">Switch</p>
                    <p className="no-gap">to</p>
                    <p className="no-gap">{ session.opp }</p>
                  </div>
                  <div className="button-content-right">
                    <i className={ `bigger-icon icon-pad-left far fa-${ session.oppIcon }` }></i>
                  </div>
                </div>
              </button>
            </div>
          }

          { ( !isNaN( time ) && time > 0 ) && ( !isNaN( duration ) && duration > 0 ) && 
            <div className={ `session-oops-parent ${ session.oppScheme ? session.oppScheme : 'defOpp' }` }>
              <p className="session-oops">
                Stop the timer if you would <br /> like to switch to { session.opp === 'break' ? 'a break' : "workin'" }.
              </p>
            </div>
          }          
        </div>
      </>
    }

    { showControl && !showNormOrRepeat && 
      <>

        <div className="intro-text">
          <h4>
            Begin Repeating Timers
          </h4>
          <p className="room__timer-oops">
            <button 
              className="as-text-addon as-link color-serious smaller-middle-upper-text" 
              onClick={ onHandleShowing }
            >
              <span className="button-content">
                Cancel starting new repeating timers.
                <i className="icon-pad-left far fa-stopwatch"></i>
              </span>
            </button>
          </p>
        </div>

        <div className={ `${ className }__parent repeating` }>

          <div className={ `${ className }__div ${ session.scheme ? session.scheme : 'def' }` }>
            <Circle 
              className={ className } 
              width={ width } 
              height={ height } 
              onDoubleClick={ null } 
            >
              <input name="workTimer" className="timer-text-field" defaultValue="32" />
            </Circle>
          </div>

          <div className={ `${ className }__div ${ session.oppScheme ? session.oppScheme : 'defOpp' }` }>
            <Circle 
              className={ className } 
              width={ width } 
              height={ height } 
              onDoubleClick={ false } 
            >
              <input name="breakTimer" className="timer-text-field" defaultValue="8" />
            </Circle>
          </div>

          <div className="hours-button-parent hours">
            <button 
              className="casual-button link-underline-fade cap-it-up" 
            >
              <div className="button-content nice-input-in-circles">
                <div className="button-content-left repeatLength">
                  <input name="repeatLength" className="timer-text-field less-space" defaultValue="5" />
                  <span>In Hours</span>
                </div>
                <div className="button-content-right">
                  <i className={ 'bigger-icon far fa-stopwatch' }></i>
                </div>
              </div>
            </button>
          </div>

          { !time && !duration && 
            <div className="submit">
              <button 
                className="casual-button link-underline-fade cap-it-up" 
                onClick={ handleRepeatingSubmit } 
              >
                <div className="button-content">
                  <div className="button-content-left vertical-middle">
                  </div>
                  <div className="button-content-right">
                    <i className={ `bigger-icon icon-pad-left far fa-${ session.oppIcon }` }></i>
                  </div>
                </div>
              </button>
            </div>
          }

          { ( !isNaN( time ) && time > 0 ) && ( !isNaN( duration ) && duration > 0 ) && 
            <div className={ `session-oops-parent ${ session.oppScheme ? session.oppScheme : 'defOpp' }` }>
              <p className="session-oops">
                Stop the repeating if you would <br /> like to switch to { session.opp === 'break' ? 'a break' : "workin'" }.
              </p>
            </div>
          }

        </div>
      </>
    }

    { !showControl && 
      <div className="room__not-available">
        <div>
          <button 
            className="as-text-addon as-link color-serious smaller-middle-upper-text link-underline-fade" 
            onClick={ onHandleShowingNorm } 
          >
            <span className="button-content">
              Click to begin a new timer.
              <i className="icon-pad-left far fa-stopwatch"></i>
            </span>
          </button>
        </div>

        <div>
          <button 
            className="as-text-addon as-link color-serious smaller-middle-upper-text link-underline-fade" 
            onClick={ onHandleShowingRepeat } 
          >
            <span className="button-content">
              Click to begin a repeating timer.
              <i className="icon-pad-left far fa-stopwatch"></i>
            </span>
          </button>
        </div>
      </div>
    }
    </div>
  ); 
};

TimerControl.propTypes = {
  socket: PropTypes.object.isRequired, 
  time: PropTypes.number, 
  width: PropTypes.number, 
  height: PropTypes.number, 

  className: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ) 
};

TimerControl.defaultProps = {  
  width: 150, 
  height: 150, 
  className: 'control' 
};

export default TimerControl;
