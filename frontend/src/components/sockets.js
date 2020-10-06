// @TODO give credit
import io from 'socket.io-client';

class Sockets {
  // Used as Handler for the proxy for `multi` method, should work, but didn't test it
  // Use for all undefined methods
  get = ( target, prop ) => {
    return ( ...args ) => {
      const output = [];
      for( const alias of target._aliases ) {
        output.push( target._sockets[ alias ][ prop ]( ...args ) )
      };
      return output;
    };
  };

  // Used to proxy methods, and only methods
  multi = ( aliases ) =>
    new Proxy( { _sockets: this, _aliases: aliases }, this );

  addNamespace = ( alias, namespace ) => {
    if ( this[ alias ] ) return false;

    Object.defineProperty( this, alias, { 
      enumerable: true, 
      writable: false, 
      configurable: false, 
      value: io( namespace )
    } );
  };
};

export default Sockets;
