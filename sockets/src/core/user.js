const l = require( './../config/winston' );

const User = function ( 
  socket, 
  sockId, 
  
  seshie, 
  core, 
  gCore, 
  nspName, 

  groupEmit, 
  logItWrapper, 
  commonUserFunc, 
  simpMe 
) {
  const module = {};

  simpMe.userModuleCount++;
  // @TODO wtf is this?
  // if ( simpMe.userModuleCount === 1 ) {
    // simpMe.addedUser = false;
  // };
  
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
    // MASS COMMENTING OF LOGS 2023-10-09
    // l.parm.debug( 'addUser()', 'beg' );
    if ( simpMe.addedUser ) return;
    // MASS COMMENTING OF LOGS 2023-10-09
    // l.parm.debug( `${ sockId }: addUser() past if`, 'addedUser' );
    seshie.username = handle;
    seshie.email = emailAcct;    
    const coreHashie = { 
      id: sockId, 

      group: nspName, 
      username: seshie.username, 
      email: seshie.email 
    };

    core.users[nspName] ??= []
    core.users[nspName].push( coreHashie );
    // ++core.numUsers;
    
    simpMe.addedUser = true;

    simpMe.sUser = `${ nspName }-${ handle }-${ emailAcct }`;
    // socket.join( simpMe.sUser );
    socket.join(`group-${nspName}`);
    
    // Not sure confirmIdPong is needed, even as extra precaution. It sometimes doesn't work
    // const confirmId = setInterval( () => { 
    //   const event = 'confirm initial ping';
    //   groupEmit( event, sockId );
    //   // MASS COMMENTING OF LOGS 2023-10-09 BUT CHECK THIS LATER :D
    //   // l.parm.debug( `${ sockId }: confirmId count: ${ simpMe.confirmIdCount }. gEmit event`, event );
    //   simpMe.confirmIdCount++;
      
    //   if ( simpMe.confirmIdPong > 1 ) {
    //     l.parm.debug( 'confirmIdPong if worked. count:', simpMe.confirmIdCount );
    //     module.listUsers();
    //     clearInterval( confirmId );
        
    //     simpMe.confirmIdCount = 0;
    //   } else if ( simpMe.confirmIdCount > 3 ) {
    //     l.parm.debug( 'confirmIdPong did not work' );
    //     module.listUsers();
    //     clearInterval( confirmId );
    //   };
    // }, 1000 );

    module.listUsers();
    // }, 1000);

    const event = 'joined group';
    const aUser = { nick: handle, email: emailAcct };
    await logItWrapper( null, aUser, event );
    // MASS COMMENTING OF LOGS 2023-10-09
    // l.bbc.debug( `${ sockId }: fin addUser logItWrapper()`, event );
  };

  // @anotherFile groupEmit()
  module.listUsers = () => {
    const event = 'list users';
    const hashie = commonUserFunc( event );
    groupEmit( event, hashie );

    // MASS COMMENTING OF LOGS 2023-10-09
    // l.bbc.debug( `${ sockId }: fin listUsers() emit`, hashie.hasOwnProperty( 'count' ) && hashie.count );
  };

  // MASS COMMENTING OF LOGS 2023-10-09
  // l.parm.debug( `${ sockId }: userModuleCount`, simpMe.userModuleCount );
  
  return module;
};

module.exports = User;
