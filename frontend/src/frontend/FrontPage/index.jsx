import React, { useEffect } from 'react';

import ReactGA from 'react-ga4';

import MainEntry from './../../components/MainEntry';

import Header from './../../components/Common/Header';

const FrontPage = () => {
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
      <Header title="Welcome!" />
      <div id="content">
        <MainEntry />
      </div>
    </>
  );
};

export default FrontPage;
