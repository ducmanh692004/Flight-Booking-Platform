import axios from '../config/axios';

const handleLogin = async (email, password) => {
    return axios.post(
        '/api/v1/user/login',
        {
            email: email,
            password: password,
        },
        {
            withCredentials: true,
        }
    );
};

const handleRegister = async (fullname, email, password) => {
    return axios.post('/api/v1/user/register', {
        fullname,
        email,
        password,
    });
};

const checkUserHavePassword = async (userId, email) => {
    return axios.get(
        `/api/v1/user/check-have-password?userId=${userId}&email=${email}`
    );
};

const handleUserAddPassword = async (userId, email, password) => {
    return axios.post('/api/v1/user/add-password', {
        userId,
        email,
        password,
    });
};

const handleUserUpdatePassword = async (
    userId,
    email,
    oldPassword,
    newPassword
) => {
    return axios.post('/api/v1/user/update-password', {
        userId,
        email,
        oldPassword,
        newPassword,
    });
};

const handleUpdateAccountInformation = async (
    userId,
    email,
    fullname,
    phone,
    address,
    sex,
    birthDay
) => {
    return axios.post('/api/v1/user/update-account-information', {
        userId,
        email,
        fullname,
        phone,
        address,
        sex,
        birthDay,
    });
};

const handleSendEmailResetPassword = async (email) => {
    return axios.post('/api/v1/user/send-email-reset-password', {
        email,
    });
};

const handleConfirmOtpForgetPassword = async (email, otp) => {
    return axios.post('/api/v1/user/confirm-otp-forget-password', {
        email,
        otp,
    });
};

const handleInsertNewPassword = async (email, password) => {
    return axios.post('/api/v1/user/insert-new-password-otp', {
        email,
        password,
    });
};

const handleConfirmOtpRegisterAccount = async (email, otp) => {
    return axios.post('/api/v1/user/confirm-otp-register-account', {
        email,
        otp,
    });
};

export {
    handleLogin,
    handleRegister,
    checkUserHavePassword,
    handleUserAddPassword,
    handleUserUpdatePassword,
    handleUpdateAccountInformation,
    handleSendEmailResetPassword,
    handleConfirmOtpForgetPassword,
    handleInsertNewPassword,
    handleConfirmOtpRegisterAccount,
};
