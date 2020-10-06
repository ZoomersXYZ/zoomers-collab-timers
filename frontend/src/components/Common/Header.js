import React from 'react';

const Header = ( { title } ) => (
  <header className="header">
    <div className="content-container">    
      <div className="header__content">
        <div className="header__titles">
          <h6>
            Zoomers' Collaborative Grouped Timers
          </h6>
          <h2>
            { title } 
          </h2>
        </div>

        <div className="header__button">
          <a className="" href="/">
            <button
              variant="success" 
              id="top-home-button" 
              className="casual-button header__button-home" 
            >
              <span className="header__button-text"><i className="fas fa-hand-point-left icon-pad-right"></i> Home</span>
            </button>
          </a>
        </div>
      </div>
      <div className="header__secondary"></div>
    </div>
  </header>
);

export default Header;
