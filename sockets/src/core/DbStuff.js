const db = require( '../config/firebase' );
const l = require( '../config/winston' );

const isEqual = require( 'lodash.isequal' );
const { isEmpty } = require( '../utilities/general' );

class DbStuff {
  _ref = null;

  constructor( seshie, nspName ) {
    this.seshie = seshie;
    this.nspName = nspName;
  };

  ref = () => {
    this._ref ??= db
      .collection( 'groups' )
      .doc( this.nspName )
      .collection( 'log' );
    return this._ref;
  };

    /**
     * -
     * 
     * @param arrival - object to send to socket client
     * @param hashieTimestamp - timestamp key of object to send to socket client
     * @param restOfHashie - object to send to socket client outside of timestamp key
     * @return bool
     */
    satisfyDuplicateIsh = ( arrival, hashieTimestamp, restOfHashie ) => {
      const { timestamp: arrivalTimestamp, ...restOfArrival } = arrival;
      if ( isEqual( restOfArrival, restOfHashie ) ) {
        // 15 sec is the default
        if ( ( hashieTimestamp - arrivalTimestamp ) < 15001 ) {
          return true;
          // if joining/leaving room, give 65 sec gap.
        } else if ( ( hashieTimestamp - arrivalTimestamp ) < 65001 ) {
          switch( restOfHashie.activity ) {
            case 'joined room':
            case 'left room':
              return true;
            default:
          };
        };
      };
      return false;
    };
    
    // * @param reversedCache - object containing all the recent objects sent out to socket client
    // * @param hashie - object to send to socket client
    duplicateIsh = ( reversedCached, hashie ) => reversedCached.find( arrival => {
      const { timestamp: hashieTimestamp, ...restOfHashie } = hashie;
      return this.satisfyDuplicateIsh( arrival, hashieTimestamp, restOfHashie );
    } );
    
    // @param String
    // @param String
    // @globals seshie
    logIt = ( inRoom, activity ) => {
    const { group, username, email } = this.seshie;
    // console.log( 'logIt 0', activity  );
    if ( isEmpty( inRoom ) ) {
      inRoom = null;
    };
    if ( isEmpty( username ) || isEmpty( email )  ) {
      return;
    };
    // console.log( 'logIt 1', activity );
    
    const hashie = {
      group, 
      username, 
      email, 
    
      timer: inRoom, 
      activity, 
      timestamp: new Date().getTime() 
    };
    
    const reversedCached = this.seshie.loggy.reverse();
    // don't log
    if ( this.duplicateIsh( reversedCached, hashie ) ) return;
    // console.log( 'logIt 2', activity );
    this.seshie.loggy.push( hashie );
    
    this.ref().doc().set( { ...hashie } );
    // console.log( 'logIt 3', activity );
    };

  // db [global import], l [global import]
  pullLogFromDb = async () => {
    const data = [];
    db
      .collection( 'groups' )
      .doc( this.nspName )
      .collection( 'log' )
      .orderBy( 'timestamp', 'desc' )
      .limit( 25 )
      .get()
      .then( snap => {
        snap.forEach( doc => data.push( doc.data() ) );
    }, reason => {
      l.gen.error( '#error pullLogFromDb() [no??] async -> db.collection post then -- -> rejection' + reason );
    } );
    return data;
  };
};

module.exports = { DbStuff };
