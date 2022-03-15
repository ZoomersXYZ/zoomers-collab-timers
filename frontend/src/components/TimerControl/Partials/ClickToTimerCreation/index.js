import React from 'react';
import PropTypes from 'prop-types';

const ClickToTimerCreation = ( { showNorm, showReap } ) => {
  return (
    <div className="room__not-available">
      <div>
        <button 
          className="as-text-addon as-link color-serious smaller-middle-upper-text link-underline-fade" 
          onClick={ showNorm } 
        >
          <span className="button-content">
            Click to begin a new timer.
            <i className="icon-pad-left far fa-stopwatch"></i>
          </span>
        </button>
      </div>

      <div>
        <button 
          className="as-text-addon as-link color-serious smaller-middle-upper-text link-underline-fade" 
          onClick={ showReap } 
        >
          <span className="button-content">
            Click to begin a repeating timer.
            <i className="icon-pad-left far fa-stopwatch"></i>
          </span>
        </button>
      </div>
    </div>
  ); 
};

ClickToTimerCreation.propTypes = {
  showNorm: PropTypes.func.isRequired, 
  showReap: PropTypes.func.isRequired
};

export default ClickToTimerCreation;
