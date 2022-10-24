import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const InnerText = ( props ) => {
  const { secondsLeft, duration } = props;
  const [ timer, setTimer ] = useState( null );

  useEffect( () => { 
    // @param number
    // @param number*
    const timeFormatted = function( remaining, divideBy = 1 ) {
      const seconds = Math.floor( ( remaining / divideBy ) % 60 );
      const minutes = Math.floor( ( remaining / ( divideBy * 60 ) ) % 60 );
      const hours = Math.floor( ( remaining / ( divideBy * 60 * 60 ) ) % 24 );
      const days = Math.floor( remaining / ( divideBy * 60 * 60 * 24 ) );
      
      let formattedTime = '';
      formattedTime += days === 0 ? '' : days + ':';

      formattedTime += hours > 0 && hours < 10 ? '0' + hours + ':' 
      : hours === 0 ? '' : hours + ':';

      formattedTime += minutes < 10 ? '0' + minutes + ':' 
      : minutes === 0 ? '00' : minutes + ':';

      formattedTime += seconds < 10 ? '0' + seconds 
      : seconds === 0 ? '00' : seconds;
      
      return formattedTime;
    };

    setTimer( timeFormatted( secondsLeft ) );
  }, [ secondsLeft ] );

  const currTime = new Date();
  const endTime = new Date( currTime.getTime() + 1000 * secondsLeft );
  const userVisibleEndTime = endTime.toLocaleString( 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true } );

  const initialDy = 5;

  return (
    <>
      <tspan x={ 0 } dy={ initialDy }><tspan className="text__bolden">{ timer }</tspan> Remaining</tspan>
      <tspan x={ 0 } dy={ initialDy + 25 }>Ends at <tspan className="text__bolden">{ userVisibleEndTime }</tspan></tspan>
      <tspan x={ 0 } dy={ initialDy + 25 }>Total Length: <tspan className="text__bolden">{ Math.round( duration / 60 ) } min</tspan></tspan>
    </>
  )
}

InnerText.propTypes = {
  timer: PropTypes.string, 
  secondsLeft: PropTypes.number, 
  duration: PropTypes.number 
};

export default InnerText;
