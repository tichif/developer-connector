import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';

const Education = ({ education }) => {
  const educations = education.map((item) => (
    <tr key={item._id}>
      <td>{item.school}</td>
      <td className='hide-sm'>{item.degree}</td>
      <td className='hide-sm'>
        <Moment format='YYYY/MM/DD'>{item.from}</Moment> -{' '}
        {item.to === null ? (
          'Now'
        ) : (
          <Moment format='YYYY/MM/DD'>{item.to}</Moment>
        )}
      </td>
      <td>
        <button className='btn btn-danger'>Delete</button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className='my-2'>Education credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
};

export default connect()(Education);
