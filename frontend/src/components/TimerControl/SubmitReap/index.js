import React, { useEffect } from 'react';
import { Form, withFormik } from 'formik';
import * as Yup from 'yup';

import './../styles.scss';
import { ReapInput, HoursButton, SubmitButton } from './partials';
import { isEmpty } from './../../../ancillary/helpers/general';

const validationSchema = Yup.object().shape( {
  work: Yup.number().integer().min( 1 ).max( 720 ).positive( 'Number must be positive' ).required( 'Number required' ),
  brake: Yup.number().integer().min( 1 ).max( 720 ).positive( 'Number must be positive' ).required( 'Number required' ),
  length: Yup.number().integer().min( 1 ).max( 72 ).positive( 'Number must be positive' ).required( 'Number required' ) 
} );

const SubmitReap = props => {
  const {
    touched, 
    errors, 
    status, 
    isSubmitting, 
    handleSubmit 
  } = props;
  const {
    className, 
    width, 
    height, 
    session, 
    children, 

    setErr, 
    handleSuccess, 

    noTimerLogic 
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

  const buttonClass = 'casual-button link-underline-fade cap-it-up';
  return(
    <Form>
      <div className="timers-container">
        <ReapInput  
          autoFocus={ true } 
          width={ width } 
          height={ height } 
          scheme={ session.scheme } 
          otherScheme='def' 
          parentClassName={ className } 

          type="number" 
          name="work" 
          className="timer-text-field" 
        />

        <ReapInput  
          autoFocus={ false } 
          width={ width } 
          height={ height } 
          scheme={ session.oppScheme } 
          otherScheme='defOpp' 
          parentClassName={ className } 

          type="number" 
          name="brake" 
          className="timer-text-field" 
        />
        
        <HoursButton 
          type="number" 
          name="length" 
          className="timer-text-field less-space" 
          buttonClass={ buttonClass } 
        />
      </div>

      <div className="timers-container">
        { noTimerLogic && 
          <SubmitButton 
            className={ buttonClass } 
            isSubmitting={ isSubmitting } 
            handle={ handleSubmit } 
            icon={ session.oppIcon } 
          />
        }

        { children } 
      </div>
    </Form>
  );
};

const SwoleReap = withFormik( {
  mapPropsToValues: () => ( {
      work: 32, 
      brake: 8, 
      length: 5 
  } ), 
  validationSchema, 
  handleSubmit: ( 
    values, 
    { setStatus, props } 
  ) => {    
    const { 
      aptRoom, 
      socket, 
      setPush 
    } = props;
    const { 
      work, 
      brake, 
      length 
    } = values;

    setStatus( true );
    // 18 seconds total length - wat ?
    socket.emit( 
      'turn on repeating timers', 
      // aptRoom, work, brake, 0.005 
      aptRoom, work, brake, length 
    );
    setPush( prev => { 
      return {
        ...prev, 
        event: 'start', 
        onOff: prev.onOff + 1, 
        title: `${ aptRoom } repeating timer for ${ length } hours has begun`, 
        body: 'Let\'s go!' 
      };
    } );
  }, 

  displayName: 'SubmitReap' 
}, )( SubmitReap );

export default SwoleReap;
