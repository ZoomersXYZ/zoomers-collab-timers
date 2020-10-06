import React from 'react';
import PropTypes from 'prop-types';

import User from './../User';

import './styles.scss';

const Users = ( { data, groupName } ) => {
  return (
    <div id="parent-socket-users">
      <h3>
        Users online, occupying { groupName }:
      </h3>
      <div id="socket-users">
        { data.map( ( arrival, index ) => 
          <User
            key={ `socket-users-${ index }` } 
            name={ arrival.username ? arrival.username : '' } 
            email={ arrival.email ? arrival.email : '' } 
          />
        ) } 
      </div>
    </div>
  );
};

Users.propTypes = {
  data: PropTypes.array.isRequired, 
};

export default Users;
