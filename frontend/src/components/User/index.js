import React from 'react';
import PropTypes from 'prop-types';

import Gravatar from 'react-gravatar';

import './styles.scss';

const User = ( { name, email } ) => {
  return (
    <>
    { name && email && 
      <div className="socket-user">
        <div className="avatar">
          { email && 
          <Gravatar email={ email } className="avatar__image" />
          }
          <div className="name">
            { name } 
          </div>
        </div>
      </div>
    }
    </>
  );
};

User.propTypes = {
  name: PropTypes.string.isRequired, 
  email: PropTypes.string.isRequired 
};

export default User;
