import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import G from './../../Svg/GSvg';
import './styles.scss';

const Circle = ( props ) => {
  const { className, inlineSize, blockSize, children, theRef, onDoubleClick } = props;

  const [ refCurr, setRefCurr ] = useState( null );
  useEffect( () => {
    if ( theRef ) setRefCurr( theRef.current );
  }, [ theRef ] );

  // Calculations for circles
  const r = Math.ceil( inlineSize / 2.15 );
  const cx = inlineSize / 2;
  const cy = blockSize / 2;
  const strokeWidth = 11;

  // Misc
  const circleFill = '#5153c1';
  // const circleFill = '#f4eff5';
  return ( 
    <svg 
      className={ `${ className }__svg` } 
      width={ inlineSize } 
      height={ blockSize } 
      xmlns="http://www.w3.org/2000/svg" 
      onDoubleClick={ onDoubleClick || ( refCurr && refCurr.submitForm ) } 
    >
      <circle 
        { ...{            
          cx,           
          cy, 
          r, 
          strokeWidth 
        } } 

        stroke="#bec9ff" 
        fill={ circleFill } 
        className={ `${ className }__circle` } 
      ></circle>
      <G 
        inlineSize={ inlineSize / 10 } 
        blockSize={ Math.round( blockSize / 4.5 ) } 
        classname={ `g__text__${ className }` } 
      >
        <foreignObject 
          x="0" 
          y="0" 
          width={ Math.round( inlineSize / 1.25 ) } 
          height={ Math.round( blockSize / 1.875 ) } 
          className={ `${ className }__fo` } 
        >
          <div xmlns="http://www.w3.org/1999/xhtml" className={ `${ className }__fo-child nice-input` }>
            { children }
          </div>
        </foreignObject>
      </G>
    </svg>
  )
};

Circle.propTypes = {
  inlineSize: PropTypes.number, 
  blockSize: PropTypes.number, 
  // theRef: PropTypes.object, 

  className: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ) 
};

Circle.defaultProps = {  
  inlineSize: 150, 
  blockSize: 150, 
  className: 'control' 
};

export default Circle;
