import winston from 'winston';
import BrowserConsole from 'winston-transport-browserconsole';
// Thanks to @henhal -- https://github.com/winstonjs/winston/issues/1427#issuecomment-508650064
import { format } from 'util' ;
const { label, combine, timestamp, printf } = winston.format;
const SPLAT = Symbol.for( 'splat' );

const based = {
  level: 'debug', 
  handleExceptions: true, 
  json: false 
};

const getLogger = ( identifier, grok ) => winston.createLogger( {
  format: combine(
    label( { label: `[${ grok }]` } ), 
    timestamp( { format: 'YYYY-MM-DD HH:mm:ss' } ),
    printf( ( { timestamp, label, level, message, [ SPLAT ]: args = [] } ) =>
      `[ ${ timestamp } ] ${ label } { ${ level } }: ${ format( `${ message }: `, ...args ) }` 
    )
  ),
  transports: [ new BrowserConsole( based ) ], 
  exitOnError: false // do not exit on handled exceptions
} );

const logger = () => ( {
  struct: getLogger( 'struct' ), 
  gen: getLogger( 'gen' ), 
  bbc: getLogger( 'bbc' ), 
  karm: getLogger( 'karm' ), 
} );

export default logger();
