import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form, ErrorMessage, withFormik } from 'formik';
import * as Yup from 'yup';

import './styles.scss'

import { isEmpty } from './../../ancillary/helpers/general';

const validationSchema = Yup.object().shape( {
  nick: Yup.string().required( 'Name is required' ), 
  email: Yup.string().email().required( 'Email is required' ) 
} );

const ForcedInput = props => {
  const {
    touched, 
    errors, 
    isSubmitting, 
    setErrors, 

    resetErrors 
  } = props;

  return(
    <>
    { props.show && 
      <div className="forced-user-intro">
        <div className="the-modal">
          <Form className="the-modal">
              <h3 className="intro-header">Welcome!</h3>
            <div className="inner-form">
              <div className="intro-text">
                <p>Only name is mandatory.</p>
                <p>Email syncs with <a className="lighter-links" href="https://gravatar.com" target="_blank" rel="noopener noreferrer">Wordpress's Gravatar</a> for avatar.</p>
              </div>

              <Field autoFocus component="input" name="nick" className="casual-textfield intro-input" placeholder="Name" />
              <Field component="input" name="email" className="casual-textfield intro-input" placeholder="Email *optional" />

              <ErrorMessage name="create" render={ err => <div id="feedback">{ err }</div> } />
              { touched.create && errors.create && resetErrors( setErrors ) }

              <button className="casual-button intro-button" type="submit" disabled={ isSubmitting }>
                <i className="fad fa-person-booth icon-pad-right"></i>Enter
              </button>
            </div>
          </Form>
        </div>
      </div>
    }
    </>
  );
}

const SwoleForcedInputInfo = withFormik( {
  mapPropsToValues: () => ( { 
      nick: '', 
      email: '', 
  } ), 
  validationSchema, 
  handleSubmit: ( values, { setSubmitting, setStatus, setErrors, resetForm, props } ) => {
    const { nick, email } = values;

    !isEmpty( nick ) && !isEmpty( email ) && props.handler( nick, email );
  }, 

  displayName: 'AddingUserInfo' 
}, )( ForcedInput );

SwoleForcedInputInfo.propTypes = {
  show: PropTypes.bool.isRequired, 
  handler: PropTypes.func.isRequired 
};

export default SwoleForcedInputInfo;
