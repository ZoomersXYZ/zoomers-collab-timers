// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
const escapeRegExp = ( string ) => string.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' );

const capitalize = ( str ) => str.charAt( 0 ).toUpperCase() + str.slice( 1 );

const replaceSymbolWithSpaces = ( str, symbol ) => {
  const regex = new RegExp( symbol, 'g' );
  return str.replace( regex, ' ' );
}

const LowerCasedNoSpaces = ( str ) =>
  str.toLowerCase().replace( /\s/g, '-' )

const dashToSpaces = ( str ) =>
  str.replace( '-', ' ' )

const toTitleCase = ( str ) => 
  str
    .toLowerCase()
    .split(' ')
    .map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) )
    .join(' ');

const reverseLowerCasedNoSpaces = ( str ) =>
  toTitleCase( dashToSpaces( str ) );

const isEmpty = ( value ) => {
  // general check
  if ( !value ) {
    return true;
  }

  if ( isBoolean( value ) ) {
    return !value;
  }

  if ( isArray( value ) || isString( value ) ) {
    return !value.length;
  }

  if ( isObject( value ) ) {
    return isEmptyObj( value );
  }

  // Not sure when it would get to this. Or if it would.
  return true;
}

const isBoolean = ( value ) => 'boolean' === typeof value;

const isString = ( value ) => Object.prototype.toString.call( value ) === '[object String]';

const isArray = ( value ) => Array.isArray( value );

const isObject = ( value ) => typeof value == 'object' && value instanceof Object && !( isArray( value ) );
const isObjectDeuces = ( obj ) => Object.prototype.toString.call( obj ) === '[object Object]';

const isEmptyObj = ( value ) => Object.keys( value ).length === 0 && value.constructor === Object;


const isUndefined = ( value ) => typeof( value ) === 'undefined';


const hoursInMilliseconds = ( hours ) => hours * 60 * 60 * 1000;

const daysInMilliseconds = ( days ) => hoursInMilliseconds( 24 * days );

// ES6
const groupBy = ( iterable, filter ) => {
  const map = new Map();
  iterable.forEach( ( singleIteration ) => {
    // Use the filter to get what value you want to group by
    const key = filter( singleIteration );
    // Try to see if what you want to group by is already in the map. By grabbing it
    const collection = map.get( key );

    if ( collection ) {
      // If the group by is already there, add on to its array
      collection.push( singleIteration );
    } else {
      // If the group by isn't there yet, create it
      map.set( key, [ singleIteration ] );
    }
  } );
  
  return map;
}

module.exports = { 
  escapeRegExp, 
  capitalize, 
  replaceSymbolWithSpaces, 
  isEmpty, 
  hoursInMilliseconds, 
  daysInMilliseconds, 
  groupBy, 

  isEmptyObj, 
  isObject, 
  isObjectDeuces, 
  
  isBoolean, 
  isString, 
  isArray, 

  isUndefined, 

  LowerCasedNoSpaces, 
  reverseLowerCasedNoSpaces 
};
