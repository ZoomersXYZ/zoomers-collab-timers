import React, { useEffect, useContext } from 'react';
// import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Circle from './../Circle';
import './../styles.scss';
import { isEmpty } from './../../../ancillary/helpers/general';

import { RoomContext } from './../../Contexts';

const validationSchema = Yup.object().shape( {
  newTimer: Yup.number().integer().min( 1 ).max( 720 ).positive( 'Number must be positive' ).required( 'Number required' ) 
} );

const SubmitTime = props => {
  const ogProps = props;
  const aRoom = useContext( RoomContext );

  return(
    <Formik
      initialValues={ { newTimer: 5 } } 
      validationSchema={ validationSchema } 
      onSubmit={ ( 
        values, actions
      ) => {
        const { session, push } = ogProps;
        actions.setStatus( true );
        aRoom.emitAll( 'start timer', values.newTimer );

        push.set( prev => { 
          return {
            ...prev, 
            event: 'start', 
            onOff: prev.onOff + 1, 
            title: `${ aRoom.name } ${ session.scheme } timer for ${ values.newTimer } has begun`, 
            body: 'Let\'s go!' 
          };
        } );
      } } 
      children={ props => 
        <SwoleSubmitTime 
          { ...props } 
          ogProps={ ogProps } 
        /> 
      } 
    />
  );
};

const SwoleSubmitTime = props => {
  const {
    handleSuccess, 
    session, 
    setErr, 
    className, 
    inlineSize, 
    blockSize, 
    formRef, 

    children 
  } = props.ogProps;
  const {
    status, 
    errors, 
    isSubmitting, 
    touched 
  } = props;

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
      <div className={ `${ className }__div ${ session.scheme ? session.scheme : 'def' }` }>
        <Circle 
          { ...{ 
            className, 
            inlineSize, 
            blockSize 
          } } 
        >
          <>
          <Field autoFocus component="input" name="newTimer" className="timer-text-field" innerRef={ formRef } />
          <button className="casual-button" type="submit" disabled={ isSubmitting } hidden={ true }>
            Submit
          </button>
          </>
        </Circle>
      </div>
      { children } 
      <div className="">
        <button className="weird-submit" type="submit" disabled={ isSubmitting } hidden={ false }>
          Go!
        </button>
      </div>
    </div>
  </Form>
  );
};

export default SubmitTime;
