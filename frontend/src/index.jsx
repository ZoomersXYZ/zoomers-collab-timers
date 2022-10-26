import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './AppRouter';
import './index.scss';
// import * as serviceWorker from './serviceWorker';

const container = document.getElementById( 'root' ); // 'app'
const root = createRoot( container ); // container! if TS
root.render( <AppRouter /> );

// Old
// ReactDOM.render( <AppRouter />, document.getElementById( 'root' ) );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
// if ( import.meta.env.VITE_NOTIF === 'register' || import.meta.env.PROD ) {
  // serviceWorker.register( './custom-sw-import.js' );
// } else {
  // serviceWorker.unregister( './custom-sw-import.js' );
// };
