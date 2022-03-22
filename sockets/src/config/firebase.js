const firebase = require( '@firebase/app' ).default;
require( '@firebase/firestore' );

const firebaseConfig = { 
  // apiKey: process.env.FIREBASE_API_KEY, 
  // authDomain: process.env.FIREBASE_AUTH_DOMAIN, 
  // projectId: process.env.FIREBASE_PROJECT_ID 
  apiKey: "AIzaSyC7R5A3HKruifUjoJ3XpGx2EXNPuExTQL0",
  authDomain: "collab-timers-k.firebaseapp.com",
  projectId: "collab-timers-k" 
};

firebase.initializeApp( firebaseConfig );
const db = firebase.firestore();

module.exports = db;
