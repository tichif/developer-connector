import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({
  getCurrentProfile,
  profile: { profile, loading },
  auth: { user },
  deleteAccount,
}) => {
  useEffect(() => {
    getCurrentProfile();
    // eslint-disable-next-line
  }, [getCurrentProfile]);

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
          <Experience experience={profile.experience}></Experience>
          <Education education={profile.education}></Education>
          <div className='my-2'>
            <button className='btn btn-danger' onClick={() => deleteAccount()}>
              <i className='fas fa-user-minus'> Delete my account</i>
            </button>
          </div>
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
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
