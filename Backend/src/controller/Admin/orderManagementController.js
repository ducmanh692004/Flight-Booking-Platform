// controllers/admin/orderManagementController.js
import orderService from '../../service/admin/orderManagementService.js';

const setStatus = (status) => {
    const trimmedStatus = status ? String(status).trim() : '';

    if (trimmedStatus === 'payment_success') {
        return 'Đã thanh toán';
    }

    if (trimmedStatus === 'payment_pending') {
        return 'Chờ thanh toán';
    }

    if (trimmedStatus === 'refund_success') {
        return 'Đã hoàn tiền';
    }
    return '';
};

const getAllOrderFunc = async (req, res) => {
    try {
        const currentLimit = req.query.currentLimit;
        const currentPage = req.query.currentPage;
        const statusFromFrontend = req.query.status;

        const translatedStatus = setStatus(statusFromFrontend);

        const data = await orderService.handleGetAllOrder(
            currentLimit,
            currentPage,
            translatedStatus
        );

        if (data.EC !== 0) {
            return res.status(500).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }

        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

const deleteOrderFunc = async (req, res) => {
    try {
        const orderId = req.query.orderId;
        const data = await orderService.handleDeleteOrder(orderId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            EM: 'Something wrong in server!',
            EC: '-1',
            DT: [],
        });
    }
};

export default {
    getAllOrderFunc,
    deleteOrderFunc,
};
