const initNsp = {

  // @param String
  // @param String
  sassy( roomie, nspName ) { 
    return {
      timerFlag: false, 
      session: 'work', 

      timer: null, 
      pausedAt: null, 

      duration: 0, 
      secondsLeft: 0, 
      secondsGoneBy: 1, 

      updateTimerInterval: null, 
      ongoingInterval: null, 
      goneByInterval: null, 
      roomie: roomie, 
      group: nspName, // DD
      repeat: { 
        on: false, 
        length: 0,  
        endTime: 0, 
        work: 0, 
        brake: 0  
      }
    };
  }, 

  // @param String
  seshie( groupName ) { 
    return { 
      // nspName
      group: groupName, 
      username: null, 
      email: null, 
      loggy: [], 

      // confirmIdPong: false, 
      // addedUser: false  
    };
  }, 

  core() { 
    return { 
      groups: [], 
      users: [], 
      userCount: 0, 
      numUsers: 0 // delete soon
    };
  }, 

  gCore() { 
    return {  
      users: [], 
      userCount: 0, 
      numUsers: 0 // delete soon
    };
  } 
};

module.exports = initNsp;
