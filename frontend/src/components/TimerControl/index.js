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
  const onHandleShowing = ( e ) => setShowControl( prevState => !prevState );

  const TIMER_STARTED = 'timer_started';
  const SESSION_SKIPPED = 'session skipped';
  const SKIP_SESSION = 'skip session';
  const META_UPDATED = 'meta_updated';

  useEffect( () => {
    const timerStarted = ( room ) => {
      console.log( 'timerStarted() room', room );
      if ( filterOutRoom( room ) ) { return; };
      setShowControl( false );
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

  return (
    <div className={ `${ className }__root` }>
    { showControl && 
      <>
        <div className="intro-text">
          <h4>
            Add Timer
          </h4>
          <p className="room__timer-oops">
            <button className="as-text-addon as-link color-serious smaller-middle-upper-text" onClick={ onHandleShowing }>
              <span className="button-content">Cancel starting a new timer.<i className="icon-pad-left far fa-stopwatch"></i></span>
            </button>
          </p>
        </div>
        <div className={ `${ className }__parent` }>
          <div className={ `${ className }__div ${ session.scheme }` }>
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
            <div className={ `session-button-parent ${ session.oppScheme }` }>
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
            <div className={ `session-oops-parent ${ session.oppScheme }` }>
              <p className="session-oops">
                Stop the timer if you would <br /> like to switch to { session.opp === 'break' ? 'a break' : "workin'" }.
              </p>
            </div>
          }
        </div>
      </>
    }
    { !showControl && 
      <p className="room__not-available">
        <button 
          className="as-text-addon as-link color-serious smaller-middle-upper-text link-underline-fade" 
          onClick={ onHandleShowing } 
        >
          <span className="button-content">Click here to start a new timer.<i className="icon-pad-left far fa-stopwatch"></i></span>
        </button>
      </p>
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
