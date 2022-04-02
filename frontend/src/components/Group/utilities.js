import { collection, getDocs } from "firebase/firestore";
import db from './../../config/firebase';

const getData = async ( document ) => {
  let data = [];
  const groupsRef = collection( db, 'groups', document, 'rooms' );
  const docs = await getDocs( groupsRef );
  docs.forEach( doc => 
    data.push( { 
      name: doc.id, 
      ...doc.data() 
    } )
  );
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
