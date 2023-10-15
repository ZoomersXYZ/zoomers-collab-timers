const { instrument } = require( '@socket.io/admin-ui' );
const l = require( './config/winston' );
const v = process.env;

if ( v.NODE_ENV === 'development' ) {
  l.bbc.info( 'dev' );
  require( 'dotenv' ).config(); //( { path: './.env.dev' } )
};
l.bbc.info( 'TESTIE', v.TESTIE );

const express = require( 'express' );
const cors = require( 'cors' );
const app = express();

app.use( cors() );

const port = process.env.PORT || 8080;
const server = require( 'http' ).createServer( app );

const originArr = [ 
  // /\.zoomers\.xyz$/, // this regex doesnt include protocol or wildcard for subdomains?
  'https://capotimers.xyz', 
  'https://timers.zoomers.xyz', 
  'https://ci.timers.zoomers.xyz', 
  'https://citimers.zoomers.xyz', 

  'https://timer.atextbooksituation.com', 
  'https://timer-dev.atextbooksituation.com', 
  'https://timer-web.atextbooksituation.com', 
  
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://localhost:8000', 

  'http://weshouldjustbefriends.local:3000', 
  'http://wsjbf.dir:3000', 
  'http://ztimers.loca.lt', 

  'http://timer.atextbooksituation.com', 
  'http://timer-dev.atextbooksituation.com', 
  'http://timer-web.atextbooksituation.com' 
 ];

const io = require( 'socket.io' )( server, {
    cors: {
      origin: originArr, 
      // credentials: true, // access-control-allow-credentials: true
      // optionSuccessStatus: 200 
    }
} );

instrument( io, {
  auth: {
    type: "basic", 
    username: "chaseit", 
    password: "$2b$09$o1S3SWrY0fSRGeYA8iolkuOdbQ0vY2urvwL20U.B847H2DvAaGOUK" // encrypted with bcrypt. in password mgr
  },
} );

// const regex = '[a-zA-Z0-9-_\.\']+';

const group = require( './core/gNSP' );
// const groupRegexStr = `/^\/group\/${ regex }$/ )`;
// const groupRegex = new RegExp( groupRegexStr );
const groupRegex = /^\/group\/[a-zA-Z0-9-_\.']+$/;
const nspGroup = io.of( groupRegex );
nspGroup.on( 'connect', group );

// const room = require( './room/gNSP' );
// // const roomRegexStr = `/^\/group\/${ regex }\/room\/${ regex }$/ )`;
// // const roomRegex = new RegExp( roomRegexStr );
// const roomRegex = /^\/group\/[a-zA-Z0-9-_\.']+\/room\/[a-zA-Z0-9-_\.']+$/;
// const nspRoom = io.of( roomRegex );
// nspRoom.on( 'connect', room );

// Express
server.listen( port, () => {
  v.NODE_ENV !== 'production' ?
    console.log( 'Server listening at port %d :', port )
  :
    l.struct.info( 'Server listening at port:', port )
} );

// For production, use the build
// const path = require( 'path' );
// if ( v.NODE_ENV !== 'development' ) {
//   app.use( express.static( path.normalize( path.join( __dirname, '..', 'build' ) ) ) );
//   app.get( '/*', function ( req, res ) {
//     res.sendFile( path.normalize( path.join( __dirname, 'build', '..', 'index.html' ) ) );
//   } );
// } else {
  l.struct.info( 'Server listening at port kk:', port );
  app.get( '/', ( req, res ) => {
    res.send( 'Only route.' );
  } );
// };
