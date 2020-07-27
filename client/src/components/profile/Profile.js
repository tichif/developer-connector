import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getProfileById } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';

const Profile = ({
  match,
  profile: { profile, loading },
  auth,
  getProfileById,
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner></Spinner>
      ) : (
        <Fragment>
          <Link className='btn btn-light my-1' to='/profiles'>
            Back
          </Link>
          {/* Check this profile is ours */}
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark my-1'>
                Edit profile
              </Link>
            )}
          <div className='profile-grid my-1'>
            <ProfileTop profile={profile}></ProfileTop>
            <ProfileAbout profile={profile}></ProfileAbout>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
