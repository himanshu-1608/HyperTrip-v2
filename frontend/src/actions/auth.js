import * as actionTypes from './actionTypes';

export const setStatusToLogin = (userDetails, token) => ({
  type: actionTypes.SET_LOGIN_STATUS,
  payload: {
    userDetails: { ...userDetails },
    token,
  },
});

export const setStatusToLogout = () => ({
  type: actionTypes.SET_LOGOUT_STATUS,
});
