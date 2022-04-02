import React, { useState, useContext } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { doc, setDoc } from "firebase/firestore";

import db from './../../../config/firebase';
import './../styles.scss'
import { resetErrors } from './../../helpers.js';

import { GroupContext, UserContext } from './../../Contexts';

const addToFirestore = async ( docName, data, aUser ) => {
  const docRef = doc( db, 'groups', docName, 'rooms', data );
  const hashie = { 
    name: data, 
    creator: aUser, 
    timers: [], 
    createdAt: new Date().getTime(), 
    lastUsed: new Date().getTime() 
  };
  // @TODO does set return true or something truthy if it's 
  
  try {
    await setDoc( docRef, hashie );
    hashie.new = true;
  } catch ( err ) {
    console.error( err );
  };

  console.log( 'add to firestore', hashie );
  return hashie;
};

const AddRoom = async ( props ) => {
  const ogProps = props;
  const { gName } = useContext( GroupContext );
  const aUser = useContext( UserContext );

  return(
    <Formik
      initialValues={ {
        newRoom: '', 
      } } 
      onSubmit={ async ( 
        values, { setSubmitting, setStatus, setErrors, resetForm } 
      ) => {
        console.log( 'Add values', values );
        const result = await addToFirestore( gName, values.newRoom, aUser );

        if ( result !== null && result.hasOwnProperty( 'new' ) ) {
          setTimeout( () =>
            ogProps.setRooms( prevState => {
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
      } }
      children={ props => <SwoleAddRoom { ...props } /> } 
    />
  );
};

const SwoleAddRoom = props => {
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
};

export default AddRoom;
