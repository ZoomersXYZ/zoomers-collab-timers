import React from 'react';
import PropTypes from 'prop-types';

import { stringOrFalse, numberOrFalse } from './../../ancillary/helpers/proptypesCustomValidators';

const SvgText = ( props ) => {
  const { transformRotation, x, y, translateWidth, translateHeight } = props;
  const { dx, dy, fill, fontWeight, fontSize, textAnchor, className } = props;

  const translate = `translate( ${ translateWidth }, ${ translateHeight } )`;
  const rotation = `rotate( ${ transformRotation } )`;
  const transform = transformRotation ? rotation : ( translateWidth || translateHeight ? translate : undefined );

  const fontSizeWithPercent = fontSize ? fontSize + '%' : false;
  const style = {
    textAnchor, fontSize: fontSizeWithPercent, fontWeight 
  };
  const optional = { className, dx, dy, fill };
  
  return (
    <text
      transform={ transform } 
      x={ transformRotation ? x : undefined } 
      y={ transformRotation ? y : undefined } 

      { ...optional } 
      style={ style } 
      >
        { props.children } 
    </text>
  )
}

SvgText.propTypes = {
  transformRotation: numberOrFalse, 
  x: numberOrFalse, 
  y: numberOrFalse, 

  translateWidth: numberOrFalse, 
  translateHeight: numberOrFalse, 

  dx: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number, 
    PropTypes.bool 
  ] ), 
  dy: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number, 
    PropTypes.bool 
  ] ), 
  fill: stringOrFalse, 
  fontWeight: numberOrFalse, 
  fontSize: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number, 
    PropTypes.bool 
  ] ), 
  textAnchor: stringOrFalse, 

  className: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ) 
};

SvgText.defaultProps = {  
  translateWidth: false, 
  translateHeight: false, 

  x: false, 
  y: false, 
  transformRotation: false, 

  dx: undefined, 
  dy: undefined, 
  fill: undefined, 
  fontWeight: false, 
  fontSize: false, 
  textAnchor: false, 
  className: undefined 
};

export default SvgText;
