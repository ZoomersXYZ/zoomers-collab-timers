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
    if ( simpMe.addedUser ) {
      console.log('BROKE addedUser already added');
      return;
    };
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

    console.log('core.users[nspName]', core.users[nspName]);
    core.users[nspName] ??= {}
    core.users[nspName][sockId] = coreHashie;
    // ++core.numUsers;
    
    simpMe.addedUser = true;

    // simpMe.sUser = `${ nspName }-${ handle }-${ emailAcct }`;
    // socket.join( simpMe.sUser );
    socket.join(`group-${nspName}`);
    
    // Not sure confirmIdPong is needed, even as extra precaution. It sometimes doesn't work
    // const confirmId = setInterval( () => { 
    //   const event = 'confirm initial ping';
    //   socket.emit( event, sockId );
    //   // MASS COMMENTING OF LOGS 2023-10-09 BUT CHECK THIS LATER :D
    //   // l.parm.debug( `${ sockId }: confirmId count: ${ simpMe.confirmIdCount }. gEmit event`, event );
    //   ++simpMe.confirmIdCount;
    //   if ( simpMe.confirmIdPong > 0 ) {
    //     l.parm.debug('confirmIdPong if worked. count:', {id: simpMe.confirmIdCount, ping: simpMe.confirmIdPong});
    //     simpMe.confirmIdCount = 0;
    //     simpMe.confirmIdPong = 0;
    //     module.listUsers();
    //     clearInterval( confirmId );
        
    //   } else if ( simpMe.confirmIdCount > 3 ) {
    //     l.parm.debug( 'confirmIdPong did not work' );
    //     simpMe.confirmIdCount = 0;
    //     module.listUsers();
    //     clearInterval( confirmId );
    //   };
    // }, 1000 );

    setTimeout( () => module.listUsers(), 1500 );

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
