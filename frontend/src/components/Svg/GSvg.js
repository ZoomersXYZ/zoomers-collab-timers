import React from 'react';
import PropTypes from 'prop-types';

const GSvg = ( { name, className, inlineSize, blockSize, children } ) => (
  <g 
    id={ name ? `g__${ name }` : undefined } 
    className={ className } 
    transform={ `translate( ${ inlineSize }, ${ blockSize } )` } 
  >
    { children } 
  </g>
);

GSvg.propTypes = {
  name: PropTypes.string, 
  inlineSize: PropTypes.number, 
  blockSize: PropTypes.number, 
  className: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ) 
};

GSvg.defaultProps = {
  name: undefined, 
  inlineSize: 100, 
  blockSize: 100, 
  className: undefined 
};

export default GSvg;
