import { useState } from 'react';

const useRoomHooks = () => { 
  // Push notifications
  const [ push, setPush ] = useState( { 
    event: false, 
    onOff: 0, 
    title: 'Timer Notification', 
    body: 'You\'re notified' 
  } );

  const [ curr, setCurr ] = useState( { 
    current: 0, 
    formatted: '00:00', 
    duration: 0, 
    flags: {
      started: false, 
      ended: false, 
      triaged: false, 
    }, 
    paused: false, 
    pause: { 
      flag: false, 
      started: null, 
      goneBy: 0, 
      list: [] 
    },  
    goneBy: 0  
  } );

  const [ session, setSession ] = useState( { 
    term: 'work', 
    icon: 'briefcase', 
    opp: 'brake', 
    oppIcon: 'coffee', 
    scheme: '', 
    oppScheme: 'brake' 
  } );

  const wrapperSetSession = ( session = null ) => {      
    setSession( prev => {
      const theSwitch = session === null ? prev.term : session;
      const logicResult = ( 
        ( session === null && theSwitch === 'brake' ) 
        || 
        ( session != null && theSwitch === 'work' ) 
      );

      return (
        logicResult ? 
        { 
            term: 'work', 
            icon: 'briefcase', 
            opp: 'brake', 
            oppIcon: 'coffee', 
            scheme: '', 
            oppScheme: 'brake' 
        } 
        : 
        { 
            term: 'brake', 
            icon: 'coffee', 
            opp: 'work', 
            oppIcon: 'briefcase', 
            scheme: 'brake', 
            oppScheme: '' 
        } 
      );
    } );
  };

  const [ reap, setReap ] = useState( { 
    on: false, 
    length: 0, 
    endTime: 0, 
    work: 32, 
    brake: 8 
  } );

  return { 
    curry: { state: curr, set: setCurr }, 
    reap: { state: reap, set: setReap }, 
    session: { state: session, set: wrapperSetSession }, 

    push: { state: push, set: setPush }, 
    
    events: {
      TIMER_UPDATED: 'timer updated', 
      TIMER_PAUSED: 'timer paused', 
      TIMER_RESUMED: 'timer resumed', 
      TIMER_STOPPED: 'timer stopped', 
      TIMER_FINISHED: 'timer finished', 
      TIMER_CREATED: 'timer created', 
      TIMER_ALREADY_BEGUN: 'timer already begun', 

      REAP_ON: 'repeating timers on', 
      REAP_DONE: 'repeating timers done', 
      REAP_STOPPED: 'repeating timers stopped', 

      ROOM_ENTERED: 'room entered',       
      LEAVE_DOWN: 'leave down', 
      STOP_TIMER: 'stop timer' , 
      STOP_REAP: 'stop repeating timers' 
    }
  };
};

export default useRoomHooks;
