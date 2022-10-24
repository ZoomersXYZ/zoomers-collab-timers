const winston = require( 'winston' );

// Imports the Google Cloud client library for Winston
const { LoggingWinston } = require( '@google-cloud/logging-winston' );

const { createLogger, transports } = require( 'winston' );
// Thanks to @henhal -- https://github.com/winstonjs/winston/issues/1427#issuecomment-508650064
const { format } = require( 'util' );
// const { debug } = require('console');
const { label, combine, timestamp, printf } = winston.format;
const SPLAT = Symbol.for( 'splat' );

const baseFile = {
  filename: './logs/g-app.log', 
  level: 'debug', 
  handleExceptions: true, 
  maxsize: 52428800, 
  maxFiles: 10, 
};
// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const loggingWinston = new LoggingWinston();
const getLogger = ( grok ) => createLogger( {
  format: combine(
    label( { label: `[${ grok }]` } ), 
    timestamp( { format: 'YYYY-MM-DD HH:mm:ss' } ),
    printf( ( { timestamp, label, level, message, [ SPLAT ]: args = [] } ) =>
      `[ ${ timestamp } ] ${ label } { ${ level } }: ${ format( `${ message }: `, ...args ) }` 
    )
  ),
  level: 'debug', 
  transports: ( process.env.NODE_ENV === 'production' ) ? [
    new winston.transports.Console(), 
    loggingWinston 
  ] : [ 
    new transports.File( baseFile ) 
  ], 
  exitOnError: false // do not exit on handled exceptions
} );

const logger = () => ( {
  getLogger, 
  struct: getLogger( 'struct' ), 
  gen: getLogger( 'gen' ), 
  bbc: getLogger( 'bbc' ), 
  karm: getLogger( 'karm' ), 
} );

module.exports = logger();
