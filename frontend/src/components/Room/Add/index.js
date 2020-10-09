import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Field, Form, ErrorMessage, withFormik } from 'formik';

import db from './../../../config/firebase';
import './../styles.scss'
import { resetErrors } from './../../helpers.js';

const addToFirestore = ( doc, data ) => {
  const ref = db.collection( 'groups' ).doc( doc ).collection( 'rooms' ).doc( data );
  const hashie = { 
    name: data, 
    timers: [], 
    createdAt: new Date().getTime(), 
    lastUsed: new Date().getTime() 
  };
  // @TODO does set return true or something truthy if it's 
  ref.set( hashie ).then( () => hashie.new = true ).catch( err => console.error( err ) );
  console.log( 'add to firestore', hashie );
  return hashie;
};

const AddingRoom = props => {
  const {
    touched, 
    errors, 
    isSubmitting, 
    setErrors, 
    
    status 
  } = props;

  const [ showForm, setShowForm ] = useState( false );
  
  const onHandleShowingForm = () => setShowForm( prevState => !prevState );

  return(
    <div className="add">
        { showForm && 
          <div>
            <Form>
              <Field autoFocus component="input" name="newRoom" className="casual-textfield" />

              <ErrorMessage name="newRoom" render={ err => <div id="feedback">{ err }</div> } />
              { touched.create && errors.create && resetErrors( setErrors ) }

              <button className="casual-button" type="submit" disabled={ isSubmitting }>
                Submit
              </button>
              <button className="casual-button" id="create-room-cancel" type="button" disabled={ isSubmitting } onClick={ () => onHandleShowingForm() }>
                Cancel. Walk away!
              </button>
            </Form>
          </div>
        }

        { !isSubmitting && !showForm && 
          <p>
            <button className="add casual-button link-underline-fade" onClick={ onHandleShowingForm }>Add a room <i className="icon-pad-left far fa-door-closed"></i></button>
          </p>
        }

      { status && status.success && <div className="success-msg">{ status.success }</div> }
      { status && status.msg && <div className="success-msg">{ status.msg }</div> }
      { status && status.success && showForm && onHandleShowingForm() }
    </div>
  );
}

const SwoleAddingRoomForm = withFormik( {
  mapPropsToValues: () => ( { 
      newRoom: '', 
  } ), 

  handleSubmit: ( values, { setSubmitting, setStatus, setErrors, resetForm, props } ) => {
    const { doc, setRooms } = props;
    const { newRoom } = values;
    const result = addToFirestore( doc, newRoom );

    if ( result !== null && result.hasOwnProperty( 'new' ) ) {
      setTimeout( () =>
        setRooms( prevState => {
          if ( prevState ) {
            return prevState.concat( result );
          } else {
            return [ result ];
          }
        } ), 
        1500 
      );

      setStatus( { success: 'Successfully added new room' } );
      setTimeout( resetForm, 2000 );
      
    } else if ( result === false ) {
      setSubmitting( false );
      setErrors( { newRoom: 'Error uploading new room' } );
    }
  }, 

  displayName: 'AddingRoom' 
}, )( AddingRoom );

SwoleAddingRoomForm.propTypes = {
  doc: PropTypes.string.isRequired, 
  setRooms: PropTypes.func.isRequired 
};

export default SwoleAddingRoomForm;
