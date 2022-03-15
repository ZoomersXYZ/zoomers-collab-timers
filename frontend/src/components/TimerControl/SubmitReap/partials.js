import React from 'react';
import { useField } from 'formik';

import Circle from './../Circle';

const ReapInput = ( props ) => {
  const {
    autoFocus, 
    width, 
    height, 
    scheme, 
    otherScheme, 
    parentClassName, 
    className, 
  } = props;
  const actualFocus = autoFocus ? true : false;
  const [ field ] = useField( props );
  return (
    <div className={ `width-5 ${ parentClassName }__div ${ scheme ? scheme : otherScheme }` }>
      <Circle 
        className={ parentClassName } 
        width={ width } 
        height={ height } 
        onDoubleClick={ null } 
      >
        <input { ...field } className={ className } autoFocus={ actualFocus } />
      </Circle>
    </div>
  );
};

const HoursButton = ( props ) => {
  const [ field ] = useField( props );
  const { buttonClass, className } = props;
  return (
    <div className="width-8 hours-button-parent hours width-">
      <button 
        className={ buttonClass } 
        disabled 
      >
        <div className="button-content nice-input-in-circles">
          <div className="button-content-left repeatLength">          
            <input { ...field } className={ className } />
            <span>In Hours</span>
          </div>

          <div className="button-content-right">
            <i className={ 'bigger-icon far fa-stopwatch' }></i>
          </div>
        </div>
      </button>
    </div>
  );
};

const SubmitButton = ( { className, isSubmitting, icon, handle } ) => (
  <div className="width-10 submit">
    <button 
      className={ className } 
      type="submit" 
      disabled={ isSubmitting } 
      onClick={ handle } 
    >
      <SubmitAdditions icon={ icon } />
    </button>
  </div>
);

const SubmitAdditions = ( { icon } ) => (
  <div className="button-content">
    <div className="button-content-left vertical-middle">
    </div>
    <div className="button-content-right">
      <i className={ `bigger-icon icon-pad-left far fa-${ icon }` }></i>
    </div>
  </div>
);

export { ReapInput, HoursButton, SubmitButton };
