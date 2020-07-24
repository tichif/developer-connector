import React, { Fragment, useEffect } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';

// Set the token in the global header
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // load the user every time the app launch
  useEffect(() => {
    store.dispatch(loadUser());
    // eslint-disable-next-line
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar></Navbar>
          <Route exact path='/' component={Landing}></Route>
          <section className='container'>
            <Alert></Alert>
            <Switch>
              <Route exact path='/register' component={Register}></Route>
              <Route exact path='/login' component={Login}></Route>
              <PrivateRoute
                exact
                path='/dashboard'
                component={Dashboard}
              ></PrivateRoute>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};
export default App;
