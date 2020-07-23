import React, { Fragment } from 'react';
import './App.css';

import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';

const App = () => (
  <Fragment>
    <Navbar></Navbar>
    <Landing></Landing>
  </Fragment>
);
export default App;
