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
        usernameId: localStorage.getItem('nick') ? localStorage.getItem('nick') : '', 
        emailId: localStorage.getItem('email') ? localStorage.getItem('email') : '' 
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
