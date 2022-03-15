import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

import Circle from './../Circle';
import './../styles.scss';
import { isEmpty } from './../../../ancillary/helpers/general';

const validationSchema = Yup.object().shape( {
  newTimer: Yup.number().integer().min( 1 ).max( 720 ).positive( 'Number must be positive' ).required( 'Number required' ) 
} );

const SubmitTime = props => {
  const {
    touched, 
    errors, 
    status, 
    isSubmitting 
  } = props;
  const {
    className, 
    width, 
    height, 
    sessionScheme, 
    children, 

    setErr,
    handleSuccess, 
  } = props;
  const session = sessionScheme;

  useEffect( () => { 
    if ( status === true ) handleSuccess();
  }, [ status, handleSuccess ] );

  useEffect( () => { 
    const resetErrors = ( errors, setErr, timeOut = 2500 ) => {
      setErr( errors );
      if ( errors && !isEmpty( errors ) ) {
        setTimeout( () => setErr( {} ), timeOut );
      };
    };
    if ( touched.newTimer && errors ) {
      resetErrors( errors, setErr );
    };
  }, [ touched.newTimer, errors, setErr ] );

  return(
  <Form>
    <div className="timers-container">
      <div className={ `${ className }__div ${ session ? session : 'def' }` }>
        <Circle 
          className={ className } 
          width={ width } 
          height={ height } 
        >
          <>
          <Field autoFocus component="input" name="newTimer" className="timer-text-field" />
          
          <button className="casual-button" type="submit" disabled={ isSubmitting }>
            Submit
          </button>
          </>
        </Circle>
      </div>
      { children } 
    </div>
  </Form>
  );
};

const SwoleSubmitTimeForm = withFormik( {
  mapPropsToValues: () => ( {
      newTimer: 5, 
  } ), 
  validationSchema, 
  handleSubmit: ( 
    values, 
    { setStatus, props } 
  ) => {
    const { 
      aptRoom, 
      socket, 
      setPush, 
      sessionScheme 
    } = props;

    setStatus( true );

    socket.emit( 
      'start timer', 
      aptRoom, values.newTimer 
    );

    setPush( prev => { 
      return {
        ...prev, 
        event: 'start', 
        onOff: prev.onOff + 1, 
        title: `${ aptRoom } ${ sessionScheme } timer for ${ values.newTimer } has begun`, 
        body: 'Let\'s go!' 
      };
    } );
  }, 

  displayName: 'SubmitTime' 
}, )( SubmitTime );

export default SwoleSubmitTimeForm;
