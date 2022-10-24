  // GLOBAL
  nspaceEmit = function( event, msg = null ) {
    if ( isEmpty( msg ) ) {
      nspace.emit( event );
    } else {
      nspace.emit( event, msg );
    };
    
    if ( event !== 'timer updated' ) {
      l.bbc.debug( 'nspaceEmit 1st', event );
    };

    if ( !isEmpty( msg ) ) {
      if ( msg.hasOwnProperty( 'length' ) ) {
        l.bbc.debug( 'nspaceEmit 2nd', msg.length );
      } else if ( msg.hasOwnProperty( 'count' ) ) {
        l.bbc.debug( 'nspaceEmit 2nd', msg.count );
      };
    };
  };