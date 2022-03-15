import React from 'react';
import PropTypes from 'prop-types';

const IntroDiv = ( { 
  handleShowing, 
  introText, 
  endingText, 
  buttonIcon 
} ) => {

  return (
    <div className="intro-text-container">
      <h4>
        { introText }
      </h4>
      <p className="room__timer-oops">
        <button 
          className="as-text-addon as-link color-serious smaller-middle-upper-text" 
          onClick={ handleShowing }
        >
          <span className="button-content">
            { endingText } 
            <i className={ `icon-pad-left far ${ buttonIcon }` }></i>
          </span>
        </button>
      </p>
    </div>
  ); 
};

IntroDiv.propTypes = {
  handleShowing: PropTypes.func.isRequired, 
  introText: PropTypes.string, 
  endingText: PropTypes.string, 
  buttonIcon: PropTypes.string 
};

IntroDiv.defaultProps = {  
  buttonIcon: 'fa-stopwatch' 
};

export default IntroDiv;
