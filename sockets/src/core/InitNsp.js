const InitNsp = function() {
  const module = {};

  module.resetTimer = function() {
    return {
      manager: {
        username: null, 
        email: null 
      }, 

      flags: {
        started: null, 
        ended: null, 
        triaged: false 
      }, 

      pause: { 
        flag: false, 
        started: null, 
        goneBy: 0, 
        list: []  
      }, 
      // list: [ [ 
      //   { started, ended, duration } ], 
      //   [ { started, ended, duration } 
      // ] ] 

      duration: 0, 
      secondsLeft: 0, 
      goneBy: 0 
    };
  };

  // @param String
  // @param String
  module.sassy = function( roomie, nspName ) { 
    return {
      ...module.resetTimer(), 

      session: 'work', 

      intervals: {        
        updateTimer: null, 
        onGoing: null, 
        goneBy: null 
      }, 

      roomie, 
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
  
  module.gCore = function( nspName ) { 
    return {  
      users: [], 
      userCount: 0, 
      numUsers: 0, // delete soon
      group: nspName
    };
  };

  module.core = function() { 
    return { 
      users: {}, 
      userCount: 0, 
      groups: [], 
      initialized: false 
    };
  };

  return module;
};

module.exports = InitNsp;
