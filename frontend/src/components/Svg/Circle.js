import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { circumference } from './helpers';

const TimerCircle = ( props ) => {
  const { className, r, cx, cy, fill, stroke, strokeWidth } = props;
  const { secondsLeft, duration } = props;

  const [ from, setFrom ] = useState( 0 );

  const circum = circumference( r );
  useEffect( () => { 
    const number = ( ( ( duration - secondsLeft ) / duration ) * circum );
    const final = ( Math.round( number * 4 ) / 4 ).toFixed( 2 )
    setFrom( final );
  }, [ circum, r, secondsLeft, duration ] );

  return (
    <>
      <circle 
        className={ `circle__${ className }` } 
        cx={ cx } 
        cy={ cy } 
        r={ r } 
        stroke={ stroke } 
        strokeWidth={ strokeWidth } 
        fill={ fill } 
      >
        <animate
          attributeName="stroke-dasharray" 
          from={ `${ from }, ${ circum }` } 
          to={ `${ circum }, 1` } 
          dur="9999h"
        />
      </circle>
      { props.children } 
    </>
  )
}

TimerCircle.propTypes = {
  r: PropTypes.number, 
  cx: PropTypes.number, 
  cy: PropTypes.number, 

  secondsLeft: PropTypes.number.isRequired, 
  duration: PropTypes.number.isRequired, 

  fill: PropTypes.string, 
  stroke: PropTypes.string, 
  strokeWidth: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ), 

  className: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ) 
};

TimerCircle.defaultProps = {  
  r: 45, 
  cx: 50, 
  cy: 50, 

  fill: 'none', 
  stroke: undefined, 
  strokeWidth: undefined, 

  className: undefined 
};

export default TimerCircle;
