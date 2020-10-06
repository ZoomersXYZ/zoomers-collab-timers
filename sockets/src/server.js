if ( process.env.NODE_ENV === 'development' ) {
  require( 'dotenv' ).config();
};

const express = require( 'express' );
const cors = require( 'cors' );
const app = express();
app.use( cors() );

const port = process.env.PORT || 8080;

// Socket.io
const server = require( 'http' ).createServer( app );
// const io = require( 'socket.io' )( server, { transports: [ 'websocket' ] } );
// const io = require( 'socket.io' )( server, { cookie: false } );
const io = require( 'socket.io' )( server );

const group = require( './groupNamespace' );

// Express
server.listen( port, () => {
  console.log( 'Server listening at port %d', port );
} );

// For production, use the build
// const path = require( 'path' );
// if ( process.env.NODE_ENV !== 'development' ) {
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



const nspGroup = io.of( /^\/group\/[a-zA-Z0-9-_\.]+$/ );
nspGroup.on( 'connect', group );
