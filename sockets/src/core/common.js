const l = require( './../config/winston' );

const CommonFuncs = function ( 
  gCore, 
  handle, 
  groupEmit 
) {
  const module = {};

  // @param String
  // @globals gCore (gCore.users)
  // @globals seshie (seshie.username)
  // @global @anotherFile groupEmit()
  module.commonUserFunctionality = ( event ) => {
    const users = gCore.users;
    const hashie = ( { 
      username: handle, 
      users, 
      count: users.length 
    } );
    groupEmit( event, hashie );
    l.bbc.debug( 'fin commonUserFunc(). emit', event );
    return hashie;
  };

  return module;
}

module.exports = CommonFuncs;
