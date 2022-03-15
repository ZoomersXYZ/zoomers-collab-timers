      <ActivityLog 
        userEnabled={ userEnabled } 
        // group={ group } @KBJ
        // timer={ name } @KBJ - done
      />

      <CSSTransition 
        in={ showTimer } 
        timeout={ 2500 } 
        classNames="coretimer" 
        // appear={ true } 
        // mountOnEnter 
        unmountOnExit 
      >
        <div className={ `svg-parent ${ session.scheme }` }>
          <Svg 
            className={ CircleClass } 
            timer={ currentFormatted } 
            secondsLeft={ current } 
            duration={ totalDuration } 
            ongoingTime={ curr.ongoingTime } 
            { ...{ 
              width, 
              height 
            } } 
          />

          <div className="pause-button-parent">

            <button 
              id="pause-timer"
              className="casual-button link-underline-fade cap-it-up" 
              onClick={ ( e ) => 
                handlePauseResumeTimer( e, pauseTerm ) 
              } 
              onMouseEnter={ handleHourglassHover } 
              onMouseLeave={ handleHourglassOut } 
            >
              <div className="button-content">
                <div className="button-content-left">
                  <p className="no-gap">{ pauseTerm }</p>
                  <p className="no-gap">timer</p>
                </div>
                <div className="button-content-right">
                  <i className={ `bigger-icon icon-pad-left far fa-hourglass-${ pauseTerm === 'pause' ? hourglass : 'half' }` }></i>
                </div>
              </div>
            </button>

            <button 
              id="stop-timer"
              className="casual-button link-underline-fade" 
              onClick={ handleStopTimer } 
              onMouseEnter={ handleStoplightHover } 
              onMouseLeave={ handleStoplightOut } 
            >
              {}
              <div className="button-content">
                <div className="button-content-left">
                  <p className="no-gap">Stop</p>
                  <p className="no-gap">Current</p>
                  <p className="no-gap">Timer</p>
                </div>
                <div className="button-content-right">
                  <i className={ `bigger-icon icon-pad-left far fa-traffic-light-${ stoplight }` }></i>
                </div>
              </div>
            </button>

            { reap.on && 
              <button 
                id="stop-reap" 
                className="casual-button link-underline-fade" 
                onClick={ handleStopReap } 
                onMouseEnter={ handleStoplightHover } 
                onMouseLeave={ handleStoplightOut } 
              >
                {} 
                <div className="button-content">
                  <div className="button-content-left">
                    <p className="no-gap">Fully Stop</p>
                    <p className="no-gap">All</p>
                    <p className="no-gap">Repeating</p>
                  </div>
                  <div className="button-content-right">
                    <i className={ `bigger-icon icon-pad-left far fa-traffic-light-${ stoplight }` }></i>
                  </div>
                </div>
              </button>
            }
          </div> {/* .pause-button-parent */}
        </div>
        {/*  */}
      </CSSTransition>

      <TimerControl 
        // aptRoom={ name } @KBJ
        // socket={ socket } @KBJ
        time={ current } 
        duration={ totalDuration } 
        width={ width / 2 } 
        height={ height / 2 } 
        { ...{ 
          session, 
          setSession, 
          setPush, 
          setShowTimer, 
          reap 
        } }
      />