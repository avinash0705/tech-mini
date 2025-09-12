// User Actions
export const SET_LOGIN_STATUS = 'SET_LOGIN_STATUS';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';
export const LOGOUT = 'LOGOUT';

export const setLoginStatus = (status) => ({
    type: SET_LOGIN_STATUS,
    payload: status
});

export const setUserDetails = (details) => ({
    type: SET_USER_DETAILS,
    payload: details
});

export const logout = () => ({
    type: LOGOUT
});
