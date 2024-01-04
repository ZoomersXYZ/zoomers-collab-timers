const db = require( '../config/firebase' );
const l = require( '../config/winston' );

const isEqual = require( 'lodash.isequal' );
const { isEmpty } = require( '../utilities/general' );

const DbFuncs = function (
  sockId, 
  sassy, 
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
    // @param String
    // @param String
    // @param Boolean
    // @globals sassy
    // @globals seshie
    module.logIt = async ( inRoom, aUser, activity, desc = null, meta = null, repeatAuto = false ) => {
      const { group } = seshie;
      console.log('aUser', aUser);
      const { nickname, mail } = aUser;
      let manager = null;
      if ( isEmpty( inRoom ) ) {
        inRoom = null;
      } else if ( sassy.hasOwnProperty( inRoom ) && !isEmpty( sassy[ inRoom ].manager.username ) ) {
        manager = sassy[ inRoom ].manager
      };
      
      const hashie = {
        group, 
        username: nickname, 
        email: mail, 
        manager,   
        timer: inRoom, 

        repeat: repeatAuto, 
        activity, 
        desc, 
        meta, 
        timestamp: new Date().getTime() 
      };
     
      // l.bbc.debug( 'logIt hashie', JSON.stringify( hashie ) );

      const reversedCached = seshie.loggy.reverse();
      // don't log
      if ( duplicateIsh( reversedCached, hashie ) ) return;
      seshie.loggy.push( hashie );

      try {
        const res = await ref().doc().set( { ...hashie } );
        // @TODO some logs could maybe grab the last ref doc added ?
      } catch ( err ) {
        l.bbc.error( `${ sockId }: logIt set fail`, err );
      };
    };

    module.logItWrapper = async ( ...restoros ) => {
      await module.logIt( ...restoros );
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
