const InitNsp = function() {
  const module = {};

  module.resetTimer = function() {
    return {
      manager: {
        username: null, 
        email: null 
      }, 
      
      timerFlag: false, 
      pause: { 
        flag: false, 
        started: null, 
        goneBy: 0, 
        list: []  
      }, 
      // list: [ [ { started, ended, duration } ], [ { started, ended, duration } ] ] 

      duration: 0, 
      secondsLeft: 0, 
      secondsGoneBy: 0, 
      started: null 
    };
  };

  // @param String
  // @param String
  module.sassy = function( roomie, nspName ) { 
    return {
      ...module.resetTimer(), 

      session: 'work', 

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
  };

  // @param String
  module.seshie = function( groupName ) { 
    return { 
      group: groupName, 
      username: null, 
      email: null, 
      loggy: [] 
    };
  };
  
  module.gCore = function() { 
    return {  
      users: [], 
      userCount: 0, 
      numUsers: 0 // delete soon 
    };
  };

  module.core = function() { 
    return { 
      ...module.gCore(), 
      groups: [] 
    };
  };

  return module;
};

module.exports = InitNsp;
