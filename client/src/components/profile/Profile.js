import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getProfileById } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';

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
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experiences</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((experience) => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    ></ProfileExperience>
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>
            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map((education) => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    ></ProfileEducation>
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
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
