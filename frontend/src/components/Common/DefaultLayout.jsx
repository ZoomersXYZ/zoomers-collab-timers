import React from 'react';
import Footer from './Footer';
import Loading from './LoadingPage';

import './styles.scss';

const DefaultLayout = ( { children } ) => (
  <div id="groot">
    <Loading />
    { children } 
    <Footer />
  </div>
);

export default DefaultLayout;
