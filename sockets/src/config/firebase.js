const firebase = require( '@firebase/app' ).default;
require( '@firebase/firestore' );

const firebaseConfig = { 
  apiKey: process.env.FIREBASE_API_KEY, 
  authDomain: process.env.FIREBASE_AUTH_DOMAIN, 
  projectId: process.env.FIREBASE_PROJECT_ID 
};

firebase.initializeApp( firebaseConfig );
const db = firebase.firestore();

module.exports = db;
