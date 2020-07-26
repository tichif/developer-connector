import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import DashboardActions from './DashboardActions';

const Dashboard = ({
  getCurrentProfile,
  profile: { profile, loading },
  auth: { user },
}) => {
  useEffect(() => {
    getCurrentProfile();
    // eslint-disable-next-line
  }, []);

  return loading && profile === null ? (
    <Spinner></Spinner>
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {user && user.name}{' '}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions></DashboardActions>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not set up a profile, Please add some info.</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
