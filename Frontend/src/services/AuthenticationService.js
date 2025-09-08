import axios from '../config/axios';

const googleAuthentication = async (idToken) => {
    return axios.post(
        '/api/v1/user/authentication-google',
        {
            idToken: idToken,
        },
        {
            withCredentials: true,
        }
    );
};

const facebookAuthentication = async (idToken) => {
    return axios.post(
        '/api/v1/user/authentication-facebook',
        {
            idToken: idToken,
        },
        {
            withCredentials: true,
        }
    );
};

const getAccount = async () => {
    return axios.get('/api/v1/checkAuth');
};

const handleTakeRefreshToken = async () => {
    return axios.post(
        '/api/v1/getNewAccessToken',
        {},
        {
            withCredentials: true,
        }
    );
};

const handleLogoutRemoveRerefreshToken = async () => {
    return axios.get(
        '/api/v1/logout',
        {},
        {
            withCredentials: true,
        }
    );
};

const sendSupport = async (formData) => {
    return axios.post('/api/v1/user/send-support', { formData });
};

export {
    googleAuthentication,
    facebookAuthentication,
    handleTakeRefreshToken,
    getAccount,
    handleLogoutRemoveRerefreshToken,
    sendSupport,
};
