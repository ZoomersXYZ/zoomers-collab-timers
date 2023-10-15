import React, { useEffect, useContext } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import './../styles.scss';
import { ReapInput, HoursButton, SubmitButton } from './partials';
import { isEmpty } from './../../../ancillary/helpers/general';

import { RoomContext } from './../../Contexts';

const validationSchema = Yup.object().shape( {
  work: Yup.number().integer().min( 1 ).max( 720 ).positive( 'Number must be positive' ).required( 'Number required' ),
  brake: Yup.number().integer().min( 1 ).max( 720 ).positive( 'Number must be positive' ).required( 'Number required' ),
  length: Yup.number().integer().min( 1 ).max( 72 ).positive( 'Number must be positive' ).required( 'Number required' ) 
} );

const SubmitReap = props => {
  const ogProps = props;
  const aRoom = useContext( RoomContext );

  return(
    <Formik
      initialValues={ {
          work: 32, 
          brake: 8, 
          length: 5 
      } } 
      validationSchema={ validationSchema } 
      onSubmit={ (
        values, 
        { setStatus, props } 
      ) => {
        if (ogProps.noTimerLogic) {
          const { 
            work, 
            brake, 
            length 
          } = values;

          setStatus( true );
          aRoom.emitAll( 'turn on repeating timers', work, brake, length );
        };
      } }
      children={ props => 
        <SwoleSubmitReap 
          { ...props } 
          ogProps={ ogProps } 
        /> 
      } 
    />
  );
};

const SwoleSubmitReap = props => {
  const {
    handleSuccess, 
    session, 
    setErr, 
    className, 
    inlineSize, 
    blockSize, 
    noTimerLogic, 

    children 
  } = props.ogProps;
  const {
    touched, 
    errors, 
    status, 
    isSubmitting, 
    handleSubmit 
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
          { ...{ 
            inlineSize, 
            blockSize, 
          } } 
          scheme={ session.scheme } 
          otherScheme='def' 
          parentClassName={ className } 

          type="number" 
          name="work" 
          className="timer-text-field" 
        />

        <ReapInput  
          autoFocus={ false } 
          { ...{ 
            inlineSize, 
            blockSize, 
          } } 
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

export default SubmitReap;
