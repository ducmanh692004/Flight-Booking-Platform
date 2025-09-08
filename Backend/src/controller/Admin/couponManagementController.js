// const cloudinary = require('cloudinary').v2;
import couponManagementService from '../../service/admin/couponManagementService.js';

const getAllCouponFunc = async (req, res) => {
    try {
        const currentLimit = req.query?.currentLimit;
        const currentPage = req.query?.currentPage;
        if (!currentLimit || !currentPage) {
            return res.status(500).json({
                EM: 'Something wrong in sever!',
                EC: -1,
                DT: [],
            });
        }
        const data = await couponManagementService.handleGetAllCoupon(
            currentLimit,
            currentPage
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

const createNewCouponFunc = async (req, res) => {
    try {
        const formData = req.body.formData;
        const data = await couponManagementService.handleCreateNewCoupon(
            formData
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

const updateCouponFunc = async (req, res) => {
    try {
        const formData = req.body.formData;

        const data = await couponManagementService.handleUpdateCoupon(formData);
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

const deleteCouponFunc = async (req, res) => {
    try {
        const couponId = req.query.couponId;
        const data = await couponManagementService.handleDeleteCoupon(couponId);
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
    getAllCouponFunc,
    createNewCouponFunc,
    updateCouponFunc,
    deleteCouponFunc,
};
