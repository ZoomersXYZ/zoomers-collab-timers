import React from 'react';
import PropTypes from 'prop-types';

const TimerText = ( props ) => {
  const { timer, secondsLeft, duration } = props;

  const currTime = new Date();
  const endTime = new Date( currTime.getTime() + 1000 * secondsLeft );
  const userVisibleEndTime = endTime.toLocaleString( 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true } );

  const initialDy = 5;

  return (
    <>
      <tspan x={ 0 } dy={ initialDy }><tspan className="text__bolden">{ timer }</tspan> Remaining</tspan>
      <tspan x={ 0 } dy={ initialDy + 25 }>Ends at <tspan className="text__bolden">{ userVisibleEndTime }</tspan></tspan>
      <tspan x={ 0 } dy={ initialDy + 25 }>Total Length: <tspan className="text__bolden">{ duration / 60 } min</tspan></tspan>
    </>
  )
}

TimerText.propTypes = {
  timer: PropTypes.string, 
  secondsLeft: PropTypes.number, 
  duration: PropTypes.number 
};

export default TimerText;
