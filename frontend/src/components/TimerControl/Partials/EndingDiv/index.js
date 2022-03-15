import React from 'react';
import PropTypes from 'prop-types';

const EndingDiv = ( { 
  showWhich, 
  session, 
  time, 
  duration, 
  handleSessionTimer 
} ) => {

  const logic = ( !isNaN( time ) && time > 0 ) && ( !isNaN( duration ) && duration > 0 );
  const noTimerLogic = !time && !duration;
  return (
    <>
    { showWhich && noTimerLogic && 
      <div className={ `width-8 session-button-parent ${ session.oppScheme ? session.oppScheme : 'defOpp' }` }>
        <button 
          className="casual-button link-underline-fade cap-it-up" 
          onClick={ handleSessionTimer }
        >
          <div className="button-content">
            <div className="button-content-left">
              <p className="no-gap">Switch</p>
              <p className="no-gap">to</p>
              <p className="no-gap">{ session.opp }</p>
            </div>
            <div className="button-content-right">
              <i className={ `bigger-icon icon-pad-left far fa-${ session.oppIcon }` }></i>
            </div>
          </div>
        </button>
      </div>
    }

    { logic && 
      <div className={ `session-oops-parent ${ session.oppScheme ? session.oppScheme : 'defOpp' }` }>
        <p className="session-oops">
          { showWhich ?
            <>Stop the timer if you would <br /> like to switch to { session.opp === 'brake' ? 'a break' : "workin'" }.</>
          :
            <>Stop the timer if you would <br /> like to switch to a new repeating timer.</>
            }
        </p>
      </div>
    }
    </>
  ); 
};

EndingDiv.propTypes = {
  showWhich: PropTypes.bool.isRequired, 
  session: PropTypes.object, 
  time: PropTypes.number, 
  duration: PropTypes.number, 

  handleSessionTimer: PropTypes.func 
};

EndingDiv.defaultProps = {  
  showWhich: true 
};

export default EndingDiv;
