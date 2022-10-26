import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header';

const NotFoundPage = () => (
  <>
    <Header title="Page Not Found - 404" />
    <div id="content">
      404 - <Link to="/">Go home</Link>
    </div>
  </>
);

export default NotFoundPage;
