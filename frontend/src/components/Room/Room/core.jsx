import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import Svg from './../TimerSvgs';
import './styles.scss';

import { RoomContext } from './../../Contexts';

let stoplightInterval = null;
let hourglassInterval = null;

const RoomCore = ( props ) => { 
  const {
    pauseTerm, 
    inlineSize, 
    blockSize, 
    sessionScheme, 

    circleClass,

    setView, 

    repeat, 

    submittingPauseResumeTimer, 
    setSubmittingPauseResumeTimer, 
    submittingStopReap, 
    setSubmittingStopReap, 
    submittingStopTimer, 
    setSubmittingStopTimer, 
  } = props;
  const { curry, reap, push, events } = props;
  const aRoom = useContext( RoomContext );

  const delay = 1000;

  // States

  const [ stoplight, setStoplight ] = useState( 'stop' );
  const [ hourglass, setHourglass ] = useState( 'start' );

  const delayView = ( notCallback = null ) => {
    // notCallback( true )
    // setTimeout( () => notCallback( false ), delay );
    setView( true )
    setTimeout( () => setView( false ), 1000 );
  };

  const handlePauseResumeTimer = ( e, pauseTerm ) => {
    setSubmittingPauseResumeTimer( true );
    setTimeout( () => setSubmittingPauseResumeTimer( false ), 1000 );
    // delayView( setSubmittingPauseResumeTimer );
    delayView();

    aRoom.emitAll( pauseTerm );
    push.set( prev => { 
      return { 
        ...prev, 
        event: 'paused', 
        title: 'Paused timer', 
        onOff: prev.onOff + 1 
      }; 
    } );
  };

  const handleStopTimer = ( e ) => {
    setSubmittingStopTimer( true );
    // setTimeout( () => setSubmittingStopTimer( false ), delay );
    delayView();

    aRoom.emitAll( events.STOP_TIMER );
  };

  const handleStopReap = ( e ) => {
    setSubmittingStopReap( true );
    // setTimeout( () => setSubmittingStopReap( false ), delay );
    delayView();

    aRoom.emitAll( events.STOP_REAP );
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

  return (    
    <div className={ `svg-parent ${ sessionScheme }` }>      
      <Svg 
        className={ circleClass } 
        secondsLeft={ curry.state.current } 
        duration={ curry.state.duration } 
        goneBy={ curry.state.goneBy } 
        { ...{ 
          inlineSize, 
          blockSize 
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
          disabled={ submittingPauseResumeTimer } 
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
          disabled={ submittingStopTimer } 
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

        { repeat && 
          <button 
            id="stop-reap" 
            className="casual-button link-underline-fade" 
            onClick={ handleStopReap } 
            onMouseEnter={ handleStoplightHover } 
            onMouseLeave={ handleStoplightOut } 
            disabled={ submittingStopReap } 
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
      {/* .svg-parent */}
    </div>
  ); 
};

RoomCore.propTypes = {
  pauseTerm: PropTypes.string, 
  inlineSize: PropTypes.number, 
  blockSize: PropTypes.number, 
  circleClass: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ) 
};

RoomCore.defaultProps = {  
  inlineSize: 300, 
  blockSize: 300, 
  circleClass: 'roompop' 
};

export default RoomCore;
