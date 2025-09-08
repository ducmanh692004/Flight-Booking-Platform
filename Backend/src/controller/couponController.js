import couponService from '../service/couponService.js';

const fetchCouponFunc = async (req, res) => {
    try {
        const data = await couponService.handleFetchCouponForUser();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

const useCouponFunc = async (req, res) => {
    try {
        const userId = req.query.userId;
        const totalOrder = req.query.totalOrder;
        const couponId = req.query.couponId;
        const data = await couponService.handleUseCoupon(
            userId,
            totalOrder,
            couponId
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

const getAllCouponFunc = async (req, res) => {
    try {
        const data = await couponService.handleGetAllCoupon();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

export default {
    fetchCouponFunc,
    useCouponFunc,
    getAllCouponFunc,
};
