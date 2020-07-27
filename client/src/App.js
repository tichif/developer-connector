import React, { Fragment, useEffect } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layouts/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import Profiles from './components/profiles/Profiles';

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
              <Route exact path='/profiles' component={Profiles}></Route>
              <PrivateRoute
                exact
                path='/dashboard'
                component={Dashboard}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path='/create-profile'
                component={CreateProfile}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path='/edit-profile'
                component={EditProfile}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path='/add-experience'
                component={AddExperience}
              ></PrivateRoute>
              <PrivateRoute
                exact
                path='/add-education'
                component={AddEducation}
              ></PrivateRoute>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};
export default App;
