const l = require( './../config/winston' );

const User = function ( 
  seshie, 
  core, 
  gCore, 
  nspName, 
  sockId, 

  groupEmit, 
  logItWrapper, 
  commonUserFunctionality, 
  // disconnect, 
  simpMe 
) {
  const module = {};
  
  let addedUser = false;
  // @param String
  // @param String (email address)
  // @globals seshie
  // @globals core
  // @globals gCore
  // @globals nspName
  // @globals socket.id as sockId
  // @global @anotherFile groupEmit()
  // @global @anotherFile logItWrapper()
  module.addUser = async ( handle, emailAcct ) => {
    // l.karm.debug( 'addUser()', 'beg' );
    if ( addedUser ) return;
    l.karm.debug( 'addUser() past if', 'addedUser' );
    seshie.username = handle;
    seshie.email = emailAcct;
    const userHashie = { 
      id: sockId, 

      group: nspName, 
      username: seshie.username, 
      email: seshie.email 
    };
    core.users.push( userHashie );
    delete userHashie.group;
    gCore.users.push( userHashie );
    ++core.numUsers;
    ++gCore.numUsers;
    
    addedUser = true;

    // Not sure if this is still needed. Just an extra possible precaution
    // @DONOW relies on pongId() via confirmIdPong
    // l.karm.debug( 'confirmId(', 'pre' );
    const confirmId = setInterval( () => { 
      // l.karm.debug( 'confirmId(', 'beg' );
      const event = 'confirm initial ping';
      groupEmit( event, sockId );
      l.karm.debug( 'confirmId gEmit', event );
      // if ( seshie.confirmIdPong ) {
      //   l.karm.debug( 'confirmId( if', 'seshie.confirmIdPong' );
      if ( simpMe.confirmIdPong ) {
        module.listUsers();
        clearInterval( confirmId );
      };
    }, 1000 );

    const event = 'joined room';
    await logItWrapper( null, event );
    l.bbc.debug( 'fin addUser logItWrapper()', event );
  };

  // @global @anotherFile groupEmit()
  module.listUsers = () => {
    const event = 'list users';
    const hashie = commonUserFunctionality( event );
    groupEmit( event, hashie );
    l.karm.debug( 'fin listUsers() emit', hashie.hasOwnProperty( 'count' ) && hashie.count );
    // l.bbc.debug( 'fin listUsers() emit', hashie );
  };

  module.disconnectWrapper = function() {
    if ( addedUser ) disconnect();
  };

  return module;
};

module.exports = User;
