import React, { useEffect, useContext } from 'react';
// import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Circle from './../Circle';
import './../styles.scss';
import { isEmpty } from './../../../ancillary/helpers/general';

// import { SocketContext, RoomContext, UserContext } from './../../Contexts';
import { RoomContext } from './../../Contexts';

const validationSchema = Yup.object().shape( {
  newTimer: Yup.number().integer().min( 1 ).max( 720 ).positive( 'Number must be positive' ).required( 'Number required' ) 
} );

const SubmitTime = props => {
  const ogProps = props;
  // const socket = useContext( SocketContext );
  const aRoom = useContext( RoomContext );
  // const aUser = useContext( UserContext );

  return(
    <Formik
      initialValues={ {
        newTimer: 5, 
      } } 
      validationSchema={ validationSchema } 
      onSubmit={ ( 
        values, actions
      ) => {
        const {
          setPush, 
          sessionScheme, 
          emitAll 
        } = ogProps;
        actions.setStatus( true );

        // socket.emit( 
        //   'start timer', 
        //   aRoom.name, aUser, values.newTimer 
        //   // aRoom.name, values.newTimer 
        // );
        emitAll( 'start timer', values.newTimer );

        setPush( prev => { 
          return {
            ...prev, 
            event: 'start', 
            onOff: prev.onOff + 1, 
            title: `${ aRoom.name } ${ sessionScheme } timer for ${ values.newTimer } has begun`, 
            body: 'Let\'s go!' 
          };
        } );
      } } 
      children={ props => 
        <SwoleSubmitTime 
          { ...props } 
          { ...ogProps } 
        /> 
      } 
    />
  );
};

const SwoleSubmitTime = props => {
  const {
    className, 
    width, 
    height, 
    sessionScheme, 
    children, 

    setErr, 
    handleSuccess 
  } = props;
  const {
    status, 
    errors, 
    isSubmitting, 
    touched 
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

export default SubmitTime;
