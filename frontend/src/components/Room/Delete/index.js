import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFormik, Field, Form, ErrorMessage } from 'formik';
import { doc, deleteDoc } from "firebase/firestore";

import db from './../../../config/firebase';
import { isUndefined, isObject } from './../../../ancillary/helpers/general';
import { resetErrors } from './../../helpers';
import './../styles.scss';
import l from './../../../config/winston';

const deleteFromFirestore = async ( docName, data ) => {
  const docRef = doc( db, 'groups', docName, 'rooms', data );

  try {
    await deleteDoc( docRef );
    l.gen.info( 'Room successfully deleted: ', data );
  } catch ( err ) {
    l.gen.error( 'Error removing document: ', err );
  };
  // deleteDoc( docRef )
  //   .then( () => {
  //     l.gen.info( 'Room successfully deleted: ', data );
  // } ).catch( error => {
  //     l.gen.error( 'Error removing document: ', error );
  // } );

  // const ref = db.collection( 'groups' ).doc( doc ).collection( 'rooms' ).doc( data );
  // ref.delete().then( () => {
  //     l.gen.info( 'Room \'doc\' successfully deleted!' );
  // } ).catch( error => {
  //     l.gen.error( 'Error removing document: ', error );
  // } );
};

const DeletingRoom = props => {
  const {
    touched, 
    errors, 
    status, 
    isSubmitting, 
    setErrors 
  } = props;

  const [ showConfirm, setConfirm ] = useState( false );
  
  const handleDeleteStepOne = () => { setConfirm( prevState => !prevState ); };

  const displayLogic = { status, success: null };
  if ( !displayLogic.status ) {
    displayLogic.status = !displayLogic.status && isUndefined( displayLogic.status ) ? false : displayLogic.status;
  }
  displayLogic.success = isObject( status ) ? status.success : false;

  return(
    <>
      { !displayLogic.status && !displayLogic.success && 
      <>
        { !showConfirm && 
          <sup><i className="left-buffer color-serious fas fa-times" onClick={ handleDeleteStepOne }></i></sup>
        }
        { showConfirm && 
          <div>
            <Form>
              <Field component="input" name="deleteRoom" hidden={ true } />
              <ErrorMessage name="roomDelete" render={ err => <div id="feedback">{ err }</div> } />
              { touched.roomDelete && errors.roomDelete && resetErrors( setErrors ) }

              <button type="submit" className="as-text-addon as-link color-serious smaller-middle-upper-text" disabled={ isSubmitting }>
                <span>Confirm deleting room.</span>
              </button>
              <button type="button" className="as-text-addon as-link color-blue smaller-middle-upper-text" disabled={ isSubmitting } onClick={ () => handleDeleteStepOne() }>
                <span>Don't do it, friend!</span>
              </button>
            </Form>
          </div>
        }
      </>
      }

      { status && status.success && <div className="delete-msg">{ status.success }</div> }
      { status && status.msg && <div className="delete-msg">{ status.msg }</div> }
    </>
  );
}

const SwoleDeletingRoomForm = withFormik( {
  mapPropsToValues: () => ( { 
    deleteRoom: false
  } ), 

  handleSubmit: async ( values, { setSubmitting, setStatus, setErrors, resetForm, props } ) => {
    const { doc, setRooms, thisRoom, setDelete } = props;
    l.bbc.info( 'Delete handleSubmit() -- y the fudge is this being looked at' );
    const result = await deleteFromFirestore( doc, thisRoom );

    if ( result !== false ) {
      l.bbc.info( 'Delete handleSubmit() -- y the fudge is this being setDelete result being true' );
      setTimeout( () => {
        setDelete( thisRoom );
      }, 1500 );

      setTimeout( () => {
        setRooms( prevState => {
          const arrCopy = [ ...prevState ];
          arrCopy.splice( 
            prevState.findIndex( arrival => arrival.name === thisRoom ), 1 
          );
          return arrCopy;
        } );
        setSubmitting( false );
      }, 2000 );

      setStatus( { success: 'Successfully deleted. Removing from view.' } );
      
    } else if ( result === false ) {
      setSubmitting( false );
      setErrors( { roomDelete: 'Error uploading changes.' } );
    }
  }, 

  displayName: 'DeletingRoom' 
}, )( DeletingRoom );

SwoleDeletingRoomForm.propTypes = {
  doc: PropTypes.string.isRequired, 
  setRooms: PropTypes.func.isRequired, 
  thisRoom: PropTypes.string.isRequired 
};

export default SwoleDeletingRoomForm;
