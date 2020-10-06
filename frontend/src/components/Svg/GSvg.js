import React from 'react';
import PropTypes from 'prop-types';

const GSvg = ( { name, className, width, height, children } ) => (
  <g 
    id={ name ? `g__${ name }` : undefined } 
    className={ className } 
    transform={ `translate( ${ width }, ${ height } )` } 
  >
    { children } 
  </g>
);

GSvg.propTypes = {
  name: PropTypes.string, 
  width: PropTypes.number, 
  height: PropTypes.number, 
  className: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ) 
};

GSvg.defaultProps = {
  name: undefined, 
  width: 100, 
  height: 100, 
  className: undefined 
};

export default GSvg;
