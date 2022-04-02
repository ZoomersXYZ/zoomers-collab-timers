const l = require( './../config/winston' );

const User = function ( 
  sockId, 
  
  seshie, 
  core, 
  gCore, 
  nspName, 

  groupEmit, 
  logItWrapper, 
  commonUserFunc, 
  // disconnect, 
  simpMe 
) {
  const module = {};

  simpMe.userModuleCount++;
  if ( simpMe.userModuleCount === 1 ) {
    simpMe.addedUser = false;
  };
  // @param String
  // @param String (email address)
  // @globals seshie
  // @globals core
  // @globals gCore
  // @globals nspName
  // @globals socket.id as sockId
  // @anotherFile groupEmit()
  // @anotherFile async logItWrapper()
  module.addUser = async ( handle, emailAcct ) => {
    // l.karm.debug( 'addUser()', 'beg' );
    if ( simpMe.addedUser ) return;
    l.karm.debug( `${ sockId }: addUser() past if`, 'addedUser' );
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
    
    simpMe.addedUser = true;
    
    // Not sure confirmIdPong is needed, even as extra precaution. It sometimes doesn't work
    const confirmId = setInterval( () => { 
      const event = 'confirm initial ping';
      groupEmit( event, sockId );
      l.karm.debug( `${ sockId }: confirmId count: ${ simpMe.confirmIdCount }. gEmit event`, event );
      simpMe.confirmIdCount++;
      
      if ( simpMe.confirmIdPong ) {
        l.karm.debug( 'confirmIdPong if worked. count:', simpMe.confirmIdCount );
        module.listUsers();
        clearInterval( confirmId );
        
        simpMe.confirmIdCount = 0;
      } else if ( simpMe.confirmIdCount > 3 ) {
        l.karm.debug( 'confirmIdPong did not work' );
        module.listUsers();
        clearInterval( confirmId );
      };
    }, 1000 );
    const event = 'joined room';
    await logItWrapper( null, event );
    l.bbc.debug( `${ sockId }: fin addUser logItWrapper()`, event );
  };

  // @anotherFile groupEmit()
  module.listUsers = () => {
    const event = 'list users';
    const hashie = commonUserFunc( event );
    groupEmit( event, hashie );
    l.bbc.debug( `${ sockId }: fin listUsers() emit`, hashie.hasOwnProperty( 'count' ) && hashie.count );
    // l.bbc.debug( 'fin listUsers() emit', hashie );
  };

  // module.disconnectWrapper = function() {
  //   if ( addedUser ) disconnect();
  // };

  l.karm.debug( `${ sockId }: userModuleCount`, simpMe.userModuleCount );
  
  return module;
};

module.exports = User;
