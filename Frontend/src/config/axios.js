// src/config/axios.js
import axios from 'axios';
import { toast } from 'react-toastify';
import { store } from '../redux/store';
import { clearCart } from '../redux/actions/cartAction';
import { doLogout } from '../redux/actions/userAction';
import { handleTakeRefreshToken } from '../services/AuthenticationService';

const instance = axios.create({
    baseURL: 'http://localhost:8081',
    withCredentials: true,
});

const handleResolveLogoutUser = () => {
    store.dispatch(doLogout());
    store.dispatch(clearCart());
    localStorage.removeItem('jwt');
};

instance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Interceptor xử lý lỗi response
instance.interceptors.response.use(
    function (response) {
        return response.data;
    },
    async function (err) {
        const originalRequest = err.config;
        const status = err?.response?.status || 500;

        switch (status) {
            case 401: {
                const errorCode = err?.response?.data?.EC;
                // console.log('hiiii');
                if (errorCode === 692004) {
                    try {
                        if (localStorage.getItem('loggined') === 'true') {
                            handleResolveLogoutUser();
                            toast.error(
                                'Phiên đăng nhập hết hạn vui lòng đăng nhập lại!'
                            );
                            localStorage.removeItem('loggined');
                        }

                        return Promise.reject(err);
                    } catch (error) {
                        handleResolveLogoutUser();
                    }
                }

                if (!originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        // const refereshToken = cookie/
                        const res = await handleTakeRefreshToken();
                        const newAccessToken = res.DT;

                        if (newAccessToken) {
                            localStorage.setItem('jwt', newAccessToken);
                            originalRequest.headers[
                                'Authorization'
                            ] = `Bearer ${newAccessToken}`;
                            return instance(originalRequest);
                        }
                    } catch (refreshErr) {
                        console.log(refreshErr);
                    }
                }

                return Promise.reject(err);
            }

            case 402: {
                // store.dispatch(doLogout());
                // store.dispatch(clearCart());
                // localStorage.removeItem('jwt');
                return Promise.reject(err);
            }

            case 403: {
                toast.error('Bạn không có quyền truy cập tài nguyên này!');
                return Promise.reject(err);
            }

            case 400:
            case 404:
            case 409: {
                return Promise.reject(err);
            }

            default: {
                console.log('Lỗi không xác định: ', status);
                return Promise.reject(err);
            }
        }
    }
);

export default instance;
