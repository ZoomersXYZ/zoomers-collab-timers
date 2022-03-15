const io = require( 'socket.io' );

let _io;

function initIo( server ) {
  _io = io( server, {
    cors: {
      origin: '*',
      credentials: true, // access-control-allow-credentials:true
      optionSuccessStatus: 200 
    }
} );
  return _io;
};

const getIo = _ => _io;

// const nspGroup = getIo().of( /^\/group\/[a-zA-Z0-9-_\.]+$/ );
// const nsp = () => getIo().of( /^\/group\/[a-zA-Z0-9-_\.]+$/ );

module.exports = {
    io, 
    _io, 
    getIo, 
    initIo, 
    // nspGroup, 
    // nsp
};
