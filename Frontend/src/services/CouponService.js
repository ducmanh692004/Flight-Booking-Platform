import axios from '../config/axios';

const fetchCouponDataForUser = () => {
    return axios.get('/api/v1/user/coupon/fetchData');
};

const handleGetAllCoupon = () => {
    return axios.get('/api/v1/user/coupon/get-all');
};

const fetchCheckUseCoupon = (userId, totalOrder, couponId) => {
    return axios.get(
        `/api/v1/user/coupon/use-coupon?userId=${userId}&totalOrder=${totalOrder}&couponId=${couponId}`
    );
};

export { fetchCouponDataForUser, fetchCheckUseCoupon, handleGetAllCoupon };
