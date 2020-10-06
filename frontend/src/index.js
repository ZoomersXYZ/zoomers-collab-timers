import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import AppRouter from './AppRouter';
import * as serviceWorker from './serviceWorker';

ReactDOM.render( <AppRouter />, document.getElementById( 'root' ) );

// Learn more about service workers: https://bit.ly/CRA-PWA
if ( process.env.REACT_APP_NOTIF === 'register' || process.env.NODE_ENV === 'production' ) {
  serviceWorker.register( './custom-sw-import.js' );
} else {
  serviceWorker.unregister( './custom-sw-import.js' );
};
