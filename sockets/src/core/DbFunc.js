const db = require( '../config/firebase' );
const l = require( '../config/winston' );

const isEqual = require( 'lodash.isequal' );
const { isEmpty } = require( '../utilities/general' );

const DbFuncs = function (
  sockId, 
  seshie, 
  nspName 
) {
  const module = {};
  let _ref = null;

  ref = () => {
    _ref ??= db
      .collection( 'groups' )
      .doc( nspName )
      .collection( 'log' );
    return _ref;
  };

  // @globals seshie
  module.getGroupLog = async () => {
    try {
      seshie.loggy ||= await pullLogFromDb();
    } catch( err ) {
      l.gen.error( `${ sockId }: #error getLog() async -> catch -- -> await rejection`, `--- ${ err } ---` );
    };

    // const cutFullLog = seshie.loggy.filter( arrival => arrival.group === nspName ).slice( 0, 10 );
    // const reversedCut = cutFullLog.reverse();
    
    // const sendingOut = [ 
    //   ...new Set( 
    //     [ ...reversedCut, ...seshie.loggy ] 
    //   ) 
    // ];

    // socket.emit( 'activity log', sendingOut );
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
      return satisfyDuplicateIsh( arrival, hashieTimestamp, restOfHashie );
    } );
    
    // @param String
    // @param String
    // @globals seshie
    module.logIt = async ( inRoom, activity ) => {
      const { group, username, email } = seshie;
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
      
      const reversedCached = seshie.loggy.reverse();
      // don't log
      if ( duplicateIsh( reversedCached, hashie ) ) return;
      // console.log( 'logIt 2', activity );
      seshie.loggy.push( hashie );

      try {
        const res = await ref().doc().set( { ...hashie } );
        // l.bbc.info( 'logIt set success', res );
        // undefined
      } catch ( err ) {
        l.bbc.error( `${ sockId }: logIt set fail`, err );
      };

      // console.log( 'logIt 3', activity );
    };

    module.logItWrapper = async ( inRoom, activity ) => {
      await module.logIt( inRoom, activity );
    };

  // db [global import]
  // l [global import]
  // @globals nspName
  pullLogFromDb = async () => {
    const data = [];
    db
      .collection( 'groups' )
      .doc( nspName )
      .collection( 'log' )
      .orderBy( 'timestamp', 'desc' )
      .limit( 25 )
      .get()
      .then( snap => {
        snap.forEach( doc => data.push( doc.data() ) );
    }, reason => {
      l.gen.error( `${ sockId }: #error pullLogFromDb() [no??] async -> db.collection post then -- -> rejection`, reason );
    } );
    return data;
  };

  return module;
};

module.exports = DbFuncs;
