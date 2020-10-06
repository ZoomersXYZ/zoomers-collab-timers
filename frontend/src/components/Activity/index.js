import React from 'react';
import PropTypes from 'prop-types';

import Gravatar from 'react-gravatar';

import './styles.scss';

const Activity = ( { name, email, group, timer, activity, formattedTime } ) => {
  let extra = '';
  if ( activity.slice( -4 ) !== 'room' ) {
    if ( 
      // ( !group && activity.slice( 0, 7 ) !== 'skipped' ) 
      // || 
      ( group && activity.slice( 0, 7 ) === 'skipped' ) ) {
      extra = ' for ';
    };
  };

  return (
    <div className="log">
      <div>
        { email && 
        <Gravatar email={ email } className="avatar__image" />
        }
      </div>
      
      <div className="text-content">
        {} { name } { activity } {}
        { extra }

        { group && timer && 
        <>
          {} <span className="timer-emphasis">{ timer }</span> {} 
        </>
        }
         timer 
         {} <span className="seperator"> <b>|</b> </span>
        {} <span className="lowercaseFns">{ formattedTime }</span>
      </div>
    </div>
  );
};

Activity.propTypes = {
  name: PropTypes.string, 
  email: PropTypes.string, 
  group: PropTypes.string, 
  timer: PropTypes.string, 
  activity: PropTypes.string, 
  timestamp: PropTypes.number 
};

export default Activity;
