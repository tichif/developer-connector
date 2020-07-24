import { v4 as uuid } from 'uuid';

import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, time = 2000) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: {
      id,
      msg,
      alertType,
    },
  });

  setTimeout(() => {
    dispatch({
      type: REMOVE_ALERT,
      payload: id,
    });
  }, time);
};
