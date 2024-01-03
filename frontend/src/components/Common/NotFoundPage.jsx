import React, { useEffect } from 'react';

import ReactGA from 'react-ga4';

import { Link } from 'react-router-dom';

import Header from './Header';

const NotFoundPage = () => {
  useEffect( () => { 
    ReactGA.initialize( 'G-MZDK05NDHT', {
      debug: true,
      titleCase: false,
      gaOptions: {
        userId: socket.id, 
        usernameId: nickname, 
        emailId: mail 
      }
    } );
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "First Hit" });
  }, [] );
  
  return (
    <>
      <Header title="Page Not Found - 404" />
      <div id="content">
        404 - <Link to="/">Go home</Link>
      </div>
    </>
) };

export default NotFoundPage;
