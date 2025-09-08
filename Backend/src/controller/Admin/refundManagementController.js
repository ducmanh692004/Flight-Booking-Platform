import refundManagementService from '../../service/admin/refundManagementService.js';

const getAllRefundFunc = async (req, res) => {
    try {
        const currentLimit = req.query.currentLimit;
        const currentPage = req.query.currentPage;
        // console.log('check data refund: ', currentLimit, currentPage);
        const data = await refundManagementService.handleGetAllRefund(
            currentLimit,
            currentPage
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

const processRefundFunc = async (req, res) => {
    try {
        const refundId = req.query.refundId;
        const data = await refundManagementService.handleProcessRefund(
            refundId
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

const ignoreRefundFunc = async (req, res) => {
    try {
        const refundId = req.body.refundId;
        const data = await refundManagementService.handleIgnoreRefund(refundId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        res.status(500).json({
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        });
    }
};

export default {
    getAllRefundFunc,
    processRefundFunc,
    ignoreRefundFunc,
};
