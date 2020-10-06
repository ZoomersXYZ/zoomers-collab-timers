import db from './../../config/firebase';

const getData = ( document ) => {
  let data = [];
  db.collection( 'groups' ).doc( document ).collection( 'rooms' ).get().then( snapshot => {
    if ( Object.keys( snapshot ).length > 0 ) {
      snapshot.forEach( doc => 
        data.push( { 
          name: doc.id, 
          ...doc.data() 
        } )
      );
    };
  } );
  // console.log( 'fucking data', data );
  return data;
};

const getLocal = () => {
  const nick = localStorage.getItem( 'nick' );
  const email = localStorage.getItem( 'email' );
  return { nick, email };
};

const setLocal = ( nick, email ) => {
  localStorage.setItem( 'nick', nick );
  localStorage.setItem( 'email', email );
  return true;
};

export { getData, getLocal, setLocal };
