// Room and another

    setCurry(prev => {
      const updatedCurry = setupCurr({ ...prev, ...forCurr });
      console.log('curryStart', updatedCurry);
      return updatedCurry;
    });

      setCurry(prev => {
        const updatedCurry = setupCurr({ ...prev, secondsLeft });
        console.log('updateTheTimer', updatedCurry);
        return updatedCurry;
      });

// moveInToMyRoom

    const updateTimer = e => {
      // const { pause, room } = e;
      const { room, session, repeat, flags, pause } = e;
      if ( filterOutRoom( room ) ) { return; };
      // @TODO 2022-11-18 16:27 | this is deprecated and should be removed
      // if ( pause.flag ) {
      //   setPauseTerm( 'unpause' );
      // } else {
      //   setPauseTerm( 'pause' );
      // };
      // const forCurr = { secondsLeft: e.secondsLeft, duration: e.duration, goneBy: e.goneBy };
      // currySet( setupCurr( forCurr ) );

      const { length, startTime, endTime, work, brake } = repeat;
      const DateObjEndTime = new Date( endTime );
      const DateObjStartTime = new Date( startTime );
      if ( repeat.on && !reap.state.on ) {
        reap.set( { 
          on: true, 
          length, 
          startTime, 
          endTime, 
          work, 
          brake, 
          DateObjStartTime, 
          DateObjEndTime
        } );
      };
    };