import React, { useState } from 'react';

import Header from './../../components/Common/Header';
import RoomsGroup from './../../components/Group';

import { GroupContext } from '../../components/Contexts';

const FRoomsGroup = ( props ) => { 
  const groupName = props.match.params.name;
  const [ gName, setGroupName ] = useState( groupName );
  const [ groupOnOff, setGroupOnOff ] = useState( false );
  const [ groupSound, setGroupSound ] = useState( false );
  const [ checkAll, setCheckAll ] = useState( false );
  const groupObj = {
    gName, 
    setGroupName, 
    groupOnOff, 
    setGroupOnOff, 
    groupSound, 
    setGroupSound, 
    checkAll, 
    setCheckAll 
  };

  return (
  <>
    <Header title={ `${ groupName } Group` } />
    <div id="content">
      <GroupContext.Provider value={ groupObj }>
        <RoomsGroup 
          // name={ props.match.params.name } @TB
        />
      </GroupContext.Provider>
    </div>
  </>
) };

export default FRoomsGroup;
