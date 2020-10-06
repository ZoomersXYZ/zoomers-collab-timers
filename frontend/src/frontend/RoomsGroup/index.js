import React from 'react';

import RoomsGroup from './../../components/Group';

import Header from './../../components/Common/Header';

const FRoomsGroup = ( props ) => (
  <>
    <Header title={ `${ props.match.params.name } Group` } />
    <div id="content">
      <RoomsGroup 
        name={ props.match.params.name } 
      />
    </div>
  </>
);

export default FRoomsGroup;
