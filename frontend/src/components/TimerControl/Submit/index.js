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
    handleErrors, 
    resetForm
  } = props;

  let setErrTimeout = null;
  let handleErrTimeout = null;

  useImperativeHandle( theRef, () => ( {
    submitForm: () => handleSubmit() 
  } ) );

  useEffect( () => { 
    return () => {
      if ( status && status.hasOwnProperty( 'success' ) && status.success === 'Successfully added new timer' ) {
        resetForm();
      };
      if ( setErrTimeout ) clearTimeout( setErrTimeout );
      if ( handleErrTimeout ) clearTimeout( handleErrTimeout );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  useEffect( () => { 
    if ( props.status && props.status.hasOwnProperty( 'success' ) && props.status.success === 'Successfully added new timer' ) {
      resetForm();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ props.status ] );

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
    </>
  );
}

// let flagStarted = false;
const SwoleSubmitTimeForm = withFormik( {
  mapPropsToValues: () => ( {
      newTimer: 5, 
  } ), 
  validationSchema, 
  handleSubmit: ( values, { setStatus, resetForm, props } ) => {
    const { aptRoom, socket, setNotify, setNotifyInfo } = props;
    setStatus( { success: 'Successfully added new timer' } );
    props.handleStatus( 'Successfully added new timer' );
    // setTimeout( resetForm, 1400 );
    // resetForm();
    // setTimeout( props.onHandleShowing, 1500 );
    // props.onHandleShowing();
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
