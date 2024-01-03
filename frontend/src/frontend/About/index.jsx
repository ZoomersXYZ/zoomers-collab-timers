import React, { useEffect } from 'react';

import ReactGA from 'react-ga4';

import Header from './../../components/Common/Header';

const AboutPage = () => {
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
      <Header title="About This" />
      <div id="content">
        <p>
          Simple description of the site. Displays <a href="https://cuckoo.team">Cuckoo.team</a> timers. Can have different timers grouped together. No login. Groups of timers are saved and can go back to them by their name.
        </p>
        <p>
          Tech is React JS on the frontend. [Google] Firebase's Firestore for minimal data. Plain JS/Node on the backend. Socket.io for websockets between the two sides.
        </p>

        <h2>How To</h2>
        <p>Yes</p>
      </div>
    </>
  );
};

export default AboutPage;
