import React from 'react';
import PropTypes from 'prop-types';

import Gravatar from 'react-gravatar';
import { isEmpty } from './../../ancillary/helpers/general';

import './styles.scss';

const Activity = ( { name, email, manager, group, timer, activity, formattedTime } ) => {
  let extra = '';
  if ( activity.slice( -4 ) !== 'room' ) {
    if ( 
      // ( !group && activity.slice( 0, 7 ) !== 'skipped' ) 
      // || 
      ( group && activity.slice( 0, 7 ) === 'skipped' ) ) {
      extra = ' for ';
    };
  };
  let manageFlag = true;
  if ( isEmpty( manager.username ) || isEmpty( manager.email ) ) {
    manageFlag = null;
  } else if ( name === manager.username && email === manager.email) {
    manageFlag = false;
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

        { group && timer && manageFlag === true && 
        <>
          {} <Gravatar email={ manager.email } className="avatar__image" />{ manager.username }'s {} 
        </>
        }

        { group && timer && manageFlag === false && 
          <> {} their {} </>
        }

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
  manager: PropTypes.object, 

  group: PropTypes.string, 
  timer: PropTypes.string, 
  activity: PropTypes.string, 
  formattedTime: PropTypes.string 
};

export default Activity;
