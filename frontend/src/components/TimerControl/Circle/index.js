import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import G from './../../Svg/GSvg';
import './styles.scss';

const Circle = ( props ) => {
  const { className, width, height, children, theRef, onDoubleClick } = props;

  const [ refCurr, setRefCurr ] = useState( null );
  useEffect( () => {
    if ( theRef ) setRefCurr( theRef.current );
  }, [ theRef ] );

  // Calculations for circles
  const r = Math.ceil( width / 2.15 );
  const cx = width / 2;
  const cy = height / 2;
  const strokeWidth = 11;

  // Misc
  const circleFill = '#5153c1';
  // const circleFill = '#f4eff5';
  return ( 
    <svg 
      className={ `${ className }__svg` } 
      width={ width } 
      height={ height } 
      xmlns="http://www.w3.org/2000/svg" 
      onDoubleClick={ onDoubleClick || ( refCurr && refCurr.submitForm ) } 
    >
      <circle 
        cx={ cx } 
        cy={ cy } 
        r={ r } 
        stroke="#bec9ff" 
        strokeWidth={ strokeWidth } 
        fill={ circleFill } 
        className={ `${ className }__circle` } 
      ></circle>
      <G 
        width={ width / 10 } 
        height={ Math.round( height / 4.5 ) } 
        classname={ `g__text__${ className }` } 
      >
        <foreignObject 
          x="0" 
          y="0" 
          width={ Math.round( width / 1.25 ) } 
          height={ Math.round( height / 1.875 ) } 
          className={ `${ className }__fo` } 
        >
          <div xmlns="http://www.w3.org/1999/xhtml" className={ `${ className }__fo-child` }>
            { children }
          </div>
        </foreignObject>
      </G>
    </svg>
  );
};

Circle.propTypes = {
  width: PropTypes.number, 
  height: PropTypes.number, 
  // theRef: PropTypes.object, 

  className: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ) 
};

Circle.defaultProps = {  
  width: 150, 
  height: 150, 
  className: 'control' 
};

export default Circle;
