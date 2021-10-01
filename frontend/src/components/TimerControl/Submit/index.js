import React, { useEffect, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

import './../styles.scss';

const validationSchema = Yup.object().shape( {
  newTimer: Yup.number().integer().min( 1 ).max( 999 ).positive( 'Number must be positive' ).required( 'Number required' ) 
} );

// resetFormTimeout

const SubmitTime = props => {
  const {
    touched, 
    errors, 
    status, 
    isSubmitting, 
    setErrors 
  } = props;
  const { 
    theRef, 
    handleSubmit, 
    handleStatus, 
    handleErrors  
  } = props;

  let setErrTimeout = null;
  let handleErrTimeout = null;

  useImperativeHandle( theRef, () => ( {
    submitForm: () => handleSubmit() 
  } ) );

  useEffect( () => { 
    return () => {
      if ( setErrTimeout ) clearTimeout( setErrTimeout );
      if ( handleErrTimeout ) clearTimeout( handleErrTimeout );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const resetErrors = ( setErrors, handleErrors, timeOut = 2500 ) => {
    setErrTimeout = setTimeout( () => setErrors( {} ), timeOut );
    handleErrTimeout = setTimeout( () => handleErrors( null ), timeOut );
  }

  return(
    <>
    <Form>
      <Field autoFocus component="input" name="newTimer" className="timer-text-field" />
      <button className="casual-button" type="submit" disabled={ isSubmitting }>
        Submit
      </button>
    </Form>
      { touched && touched.newTimer && errors.newTimer && handleErrors( errors ) } 
      { touched && touched.newTimer && errors.newTimer && resetErrors( setErrors, handleErrors ) } 
      
      { status && status.success && handleStatus( status ) } 
      { !status && handleStatus( status ) } 
    </>
  );
}

// let flagStarted = false;
const SwoleSubmitTimeForm = withFormik( {
  mapPropsToValues: () => ( {
      newTimer: 50, 
  } ), 
  validationSchema, 
  handleSubmit: ( values, { setStatus, resetForm, props } ) => {
    const { aptRoom, socket, setNotify, setNotifyInfo } = props;
    setStatus( { success: 'Successfully added new timer' } );
    setTimeout( resetForm, 1400 );
    setTimeout( props.onHandleShowing, 1500 );
    socket.emit( 'start timer', aptRoom, values.newTimer );

    setNotifyInfo( { title: `${ aptRoom } timer has begun`, body: 'Let\'s go!' } );
    setNotify( prevState => prevState + 1 );
  }, 

  displayName: 'SubmitTime' 
}, )( SubmitTime );

SwoleSubmitTimeForm.propTypes = {
  socket: PropTypes.object.isRequired, 
  theRef: PropTypes.object
};

export default SwoleSubmitTimeForm;
