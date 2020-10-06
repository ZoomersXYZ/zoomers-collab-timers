import React from 'react';

const LoadingPage = () => {
  return(
    <>
    { false && 
      <div className="loader">
        <div>
          <img alt="loading-data" className="loader__image" src="/images/loader.gif" />
        </div>
      </div>
    }
    </>
  )
};

export default LoadingPage;
