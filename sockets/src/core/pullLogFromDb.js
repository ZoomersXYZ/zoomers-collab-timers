const db = require( './../config/firebase' );
const l = require( './../config/winston' );

// let ref = null;

// db [global import], l [global import]
const pullLogFromDb = async () => {
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
    l.gen.error( '#error pullLogFromDb() [no??] async -> db.collection post then -- -> rejection' + reason );
  } );
  return data;
};



module.exports = { pullLogFromDb };