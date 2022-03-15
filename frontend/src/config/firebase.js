import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7R5A3HKruifUjoJ3XpGx2EXNPuExTQL0",
  authDomain: "collab-timers-k.firebaseapp.com",
  projectId: "collab-timers-k",
  storageBucket: "collab-timers-k.appspot.com",
  messagingSenderId: "987511800714",
  appId: "1:987511800714:web:4b930917fecf473c1f7e73",
  measurementId: "G-KEWSC4VG5H"
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
