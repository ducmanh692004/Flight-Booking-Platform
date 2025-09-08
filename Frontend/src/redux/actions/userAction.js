export const FETCH_USER_LOGIN_SUCCESS = 'FETCH_USER_LOGIN_SUCCESS';
export const USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS';
export const UPDATE_INFORMATION = 'UPDATE_INFORMATION';
export const UPDATE_LANGUAGE = 'UPDATE_LANGUAGE';

export const updateLanguage = (data) => {
    return {
        type: UPDATE_LANGUAGE,
        payload: data,
    };
};

export const doLogin = (data) => {
    return {
        type: FETCH_USER_LOGIN_SUCCESS,
        payload: data,
    };
};

export const doLogout = () => {
    return {
        type: USER_LOGOUT_SUCCESS,
    };
};

export const updateInformation = (data) => {
    return {
        type: UPDATE_INFORMATION,
        payload: data,
    };
};
