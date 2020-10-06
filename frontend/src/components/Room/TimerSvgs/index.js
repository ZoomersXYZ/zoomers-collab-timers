import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import G from './../../Svg/GSvg';
import TimerCircle from './../../Svg/Circle';
import Text from './../../Svg/Text';
import InnerText from './../../Svg/InnerText';
import { circumference } from './../../Svg/helpers';
import './styles.scss';
import './transition.scss';

const TimerSvgs = ( props ) => {
  // Props
  const { className, width, height } = props;
  const { timer, secondsLeft, duration, ongoingTime } = props;

  // Expanding circles on hover
  const [ freezeOngoing, setFreezeOngoing ] = useState( 0 );
  useEffect( () => { 
    setFreezeOngoing( ongoingTime );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  const [ expandCircle, setExpand ] = useState( false );
  const [ animation, setAnimation ] = useState( undefined );
  useEffect( () => { 
    const theTimeout = setTimeout( () => {
      if ( expandCircle ) {
        setAnimation( undefined );
      } else {
        setAnimation( `circle__pulse ${ animationDuration }s linear 0s ${ animationIterationCount } normal forwards ${ animationPlayState }` );
      }
    }, 500 );

    return () => {
      clearTimeout( theTimeout );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ expandCircle ] );

  // Dimensionso of svg and basis for other vairable calculations
  const [ sWidth, setWidth ] = useState( 0 );
  const [ sHeight, setHeight ] = useState( 0 );
  const setDimensions = ( w, h ) => {
    setWidth( w );
    setHeight( h );
  };
  useEffect( () => {
    setDimensions( width, height );
  }, [ width, height ] );

  // Calculations for circles
  const r = Math.ceil( sWidth * .4 );
  const cx = sWidth / 2;
  const cy = sHeight / 2;
  const strokeWidth = 15;
  const strokeDasharray = `${ circumference( r ) }, 0`;

  // Animation and end in-line style including stroke-dasharray as well
  const animationDuration = 60;
  let animationIterationCount, animationPlayState;
  if ( secondsLeft ) {
    animationIterationCount = Math.ceil( secondsLeft / animationDuration ) + 1;
    animationPlayState = 'running';
  } else {
    animationIterationCount = 0;
    animationPlayState = 'paused';
  }
  const overStyle = { 
    animation, 
    WebkitAnimation: animation, 
    MozAnimation: animation, 

    strokeDasharray 
  };

  // Handlers
  const handleCircleHover = () => {
    return ( freezeOngoing <= 3 ) ? false : setExpand( true );
  }

  const handleCircleExit = () => {
    if ( freezeOngoing <= 3 ) {
      setFreezeOngoing( ongoingTime )
    };
    setExpand( false );
  };
    

  // Misc
  const circleFill = '#5153c1';
  // const circleFill = '#f4eff5';

  return (
    <div className={ `svgs_parent__${ className }` }
        >
      <CSSTransition 
        in={ expandCircle } 
        timeout={ 2000 } 
        classNames="poppop" 
      >
        <svg 
          className={ `circle__bag svg_bag__${ className }` } 
          width={ sWidth } 
          height={ sHeight } 
        >
          <circle 
            cx={ cx } 
            cy={ cy } 
            r={ r } 
            stroke="#bec9ff" 
            strokeWidth={ strokeWidth } 
            fill={ circleFill } 
            className="circle__roompop" 
          >
          </circle>
        </svg>
      </CSSTransition>

      <CSSTransition 
        in={ expandCircle } 
        timeout={ 2000 } 
        classNames="poppop" 
      >
        <svg
          className={ `circle__bag svg_text__${ className }` } 
          width={ sWidth } 
          height={ sHeight } 
        >
          <G 
            width={ sWidth / 2 } 
            height={ Math.round( sHeight / 2.75 ) } 
            classname={ `g__text__${ className }` } 
          >
            <Text 
              dx={ 0 }
              dy={ 20 } 
              fontSize="25px" 
              className={ `text__${ className }`} 
            >
              <InnerText 
                timer={ timer } 
                secondsLeft={ secondsLeft } 
                duration={ duration } 
              />
            </Text>
          </G>
        </svg>
      </CSSTransition>
      
      <CSSTransition 
        in={ expandCircle } 
        timeout={ 7500 } 
        classNames="animation-specific" 
      >
        <svg 
          id={ props.name ? props.name + '__svg' : undefined } 
          className={ `svg__${ className }` } 
          width={ sWidth } 
          height={ sHeight } 
          style={ overStyle } 
        >
          <TimerCircle 
            className={ className } 
            cx={ cx } 
            cy={ cy } 
            r={ r } 

            secondsLeft={ secondsLeft } 
            duration={ duration } 

            fill="none" 
            stroke="rgba( 255,255,255,.9 )" 
            strokeWidth={ strokeWidth } 

            expandCircle={ expandCircle } 
          />
        </svg>
      </CSSTransition>

      <CSSTransition 
        in={ expandCircle } 
        timeout={ 2000 } 
        classNames="poppop" 
      >
        <svg
          width={ sWidth } 
          height={ sHeight } 
          className="svg__final" 
          onMouseOver={ handleCircleHover }
          onMouseOut={ handleCircleExit }
        ></svg>
      </CSSTransition>
    </div>
  );
};

TimerSvgs.propTypes = {
  name: PropTypes.string, 

  width: PropTypes.number, 
  height: PropTypes.number, 

  timer: PropTypes.string.isRequired, 
  secondsLeft: PropTypes.number.isRequired, 
  duration: PropTypes.number.isRequired, 

  className: PropTypes.oneOfType( [
    PropTypes.string, 
    PropTypes.number 
  ] ) 
};

TimerSvgs.defaultProps = {  
  width: 100, 
  height: 100, 

  className: undefined 
};

export default TimerSvgs;
