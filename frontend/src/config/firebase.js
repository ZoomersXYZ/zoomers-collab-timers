import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, 

  // databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, 
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, 
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, 
  appId: import.meta.env.VITE_FIREBASE_APP_ID, 
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID 
};

initializeApp( firebaseConfig );
const db = getFirestore();
// const analytics = getAnalytics( db );

// firebase.firestore().enablePersistence()
//   .catch( function( err ) {
//       if ( err.code === 'failed-precondition' ) {
//           // Multiple tabs open, persistence can only be enabled
//           // in one tab at a a time.
//           // ...
//       } else if ( err.code === 'unimplemented' ) {
//           // The current browser does not support all of the
//           // features required to enable persistence
//           // ...
//       }
//   } );
// Subsequent queries will use persistence, if it was enabled successfully

// export { db as default, analytics };
export default db;
