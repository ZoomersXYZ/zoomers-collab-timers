import React from 'react';
import { withRouter } from 'react-router-dom';

import './styles.scss';

const MainEntry = ( { history } ) => {
  const handleForm = ( e ) => {
    e.preventDefault();
    const group = e.target.elements.group.value.trim();
    history.push( `/group/${ group }` );
  };
  
  return(
    <div className="entrance__main">
      <p className="entrance__intro-text entrance__big">
        Enter group of timers name here.
      </p>
      <form className="input-group" onSubmit={ handleForm }>
      <div>
        <input autoFocus className="input-group__input casual-textfield entrance__bigger" type="text" name="group" />
      </div>
      <div className="entrance__gap"></div>
        <button className="casual-button entrance__button entrance__big">Enter <i className="grow icon-pad-left far fa-person-booth"></i></button>
      </form>
    </div>
  );
}

export default withRouter( MainEntry );
