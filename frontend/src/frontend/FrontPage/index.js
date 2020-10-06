import React from 'react';

import MainEntry from './../../components/MainEntry';

import Header from './../../components/Common/Header';

const FrontPage = () => {
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
