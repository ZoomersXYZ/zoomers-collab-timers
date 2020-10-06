const winston = require( 'winston' );
const { createLogger, transports } = require( 'winston' );
// Thanks to @henhal -- https://github.com/winstonjs/winston/issues/1427#issuecomment-508650064
const { format } = require( 'util' );
const { label, combine, timestamp, printf } = winston.format;
const SPLAT = Symbol.for( 'splat' );

const baseFile = {
  filename: './logs/g-app.log', 
  level: 'debug', 
  handleExceptions: true, 
  json: false, 
  maxsize: 52428800, 
  maxFiles: 10, 
};

const getLogger = ( grok ) => createLogger( {
  format: combine(
    label( { label: `[${ grok }]` } ), 
    timestamp( { format: 'YYYY-MM-DD HH:mm:ss' } ),
    printf( ( { timestamp, label, level, message, [ SPLAT ]: args = [] } ) =>
      `[ ${ timestamp } ] ${ label } { ${ level } }: ${ format( `${ message }: `, ...args ) }` 
    )
  ),
  transports: [ new transports.File( baseFile ) ], 
  exitOnError: false // do not exit on handled exceptions
} );

const logger = () => ( {
  struct: getLogger( 'struct' ), 
  gen: getLogger( 'gen' ), 
  bbc: getLogger( 'bbc' ), 
} );

module.exports = logger();
