import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

const initialState = {
  // Value by default
  // get the token to localStorage
  token: localStorage.getItem('token'),
  // Check if the user is authenticated
  isAuthenticated: null,
  loading: true,
  // the user's info
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
      // set the token to the localStorage
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        loading: false,
        isAuthenticated: true,
      };
    case REGISTER_FAIL:
      // delete token in the localStorage
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        loading: false,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}
