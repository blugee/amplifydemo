import {   SIGNIN_USER_SUCCESS_DATA, SIGNOUT_USER_SUCCESS_DATA, SET_TIMEOUT } from "../../constants/ActionTypes";





export const userSignInSuccessData = (authUser) => {
  return {
    type: SIGNIN_USER_SUCCESS_DATA,
    payload: authUser
  }
};
export const userSignOutSuccessData = () => {
  return {
    type: SIGNOUT_USER_SUCCESS_DATA,
  }
};

export const setTimeOut = (timeOut) => {
  return { type: SET_TIMEOUT, payload: timeOut };
}