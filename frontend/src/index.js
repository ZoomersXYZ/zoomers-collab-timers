import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import AppRouter from './AppRouter';
import * as serviceWorker from './serviceWorker';

ReactDOM.render( <AppRouter />, document.getElementById( 'root' ) );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
// if ( process.env.REACT_APP_NOTIF === 'register' || process.env.NODE_ENV === 'production' ) {
  // serviceWorker.register( './custom-sw-import.js' );
// } else {
  // serviceWorker.unregister( './custom-sw-import.js' );
// };
