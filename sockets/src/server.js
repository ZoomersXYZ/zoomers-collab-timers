const l = require( './config/winston' );
const v = process.env;

l.bbc.info( 'TESTIE 1', v.TESTIE );
if ( v.NODE_ENV === 'development' ) {
  console.log( 'dev' );
  // require( 'dotenv' ).config( { path: './.env.dev' } );
  require( 'dotenv' ).config();
};
l.bbc.info( 'TESTIE 2', v.TESTIE );

const express = require( 'express' );
const cors = require( 'cors' );
const app = express();
app.use( cors() );

const port = v.PORT || 8080;

// Socket.io
const server = require( 'http' ).createServer( app );
// const io = require( 'socket.io' )( server, { transports: [ 'websocket' ] } );
// const io = require( 'socket.io' )( server, { cookie: false } );

const origin = v.NODE_ENV === 'production' ? 'https://timers.zoomers.xyz' : 'http://localhost:3000';

const io = require( 'socket.io' )( server, {
    cors: {
      // origin: '*',
      origin: origin,
      credentials: true, // access-control-allow-credentials:true
      optionSuccessStatus: 200 
    }
} );
// const io = ;
// const {
//     // io, 
//     // _io, 
//     // getIo, 
//     initIo, 
// } = require( './socket' );

// const io = initIo( server );

const group = require( './core/gNSP' );

// Express
server.listen( port, () => {
  console.log( 'Server listening at port %d', port );
  l.struct.info( 'Server listening at port', port );
} );

// For production, use the build
// const path = require( 'path' );
// if ( v.NODE_ENV !== 'development' ) {
//   app.use( express.static( path.normalize( path.join( __dirname, '..', 'build' ) ) ) );
//   app.get( '/*', function ( req, res ) {
//     res.sendFile( path.normalize( path.join( __dirname, 'build', '..', 'index.html' ) ) );
//   } );
// } else {
//   app.get( '/', ( req, res ) => {
//     res.send( 'Only route.' );
//   } );
// };

app.get( '/', ( req, res ) => {
  res.send( 'Only route.' );
} );

// const { nspGroup } = require( './socket' );

const nspGroup = io.of( /^\/group\/[a-zA-Z0-9-_\.]+$/ );
nspGroup.on( 'connect', group );
