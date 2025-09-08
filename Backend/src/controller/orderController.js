// import { create } from 'lodash';
import orderService from '../service/orderApiService.js';
import cancelRefundOrderService from '../service/cancelRefundOrder.js';

const createOrderFunc = async (req, res) => {
    try {
        const orderData = req.body.orderData;
        const userId = req.body.userId;
        const data = await orderService.handleCreateOrder(orderData, userId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const updateOrderStatusFunc = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const status = req.body.status;
        const paymentMethod = req.body.paymentMethod;
        const captureId = req.body.captureId;
        const data = await orderService.handleUpdateOrderStatus(
            orderId,
            status,
            paymentMethod,
            captureId
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const createPaypalOrderFunc = async (req, res) => {
    try {
        const orderId = req.body.orderIdDatabase;
        // console.log('checcc', orderId);
        const data = await orderService.handleCreatePayPalOrder(orderId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const createVnpayOrderFunc = async (req, res) => {
    try {
        const data = await orderService.handleCreateVnPayOrder();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const checkPaymentVNPayFunc = async (req, res) => {
    try {
        // console.log('check data request origin: ', req.query);
        const data = await orderService.handleCheckPayment(req.query);
        return res.redirect(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const getOrderDataVnpayToPaymentFunc = async (req, res) => {
    try {
        const orderId = req.query.orderId;
        const data = await orderService.handleGetOrderDataVnpayToPayment(
            orderId
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
            EC: '-1',
            DT: [],
        });
    }
};

const viewAllOrderFunc = async (req, res) => {
    try {
        const userId = req.query.userId;
        const data = await orderService.handleViewAllOrder(userId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const getOrderInformation = async (req, res) => {
    try {
        const orderId = req.query.orderId;
        const data = await orderService.handleGetOrderInformation(orderId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const userRefundOrderFunc = async (req, res) => {
    try {
        const userId = req.body.userId;
        const orderId = req.body.orderId;
        const reason = req.body.reason;
        const note = req.body.note;
        const data = await cancelRefundOrderService.handleUserRefundOrder(
            userId,
            orderId,
            reason,
            note
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const userCancelOrderFunc = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const data = await cancelRefundOrderService.handleUserCancelOrder(
            orderId
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const getRefundOrderFunc = async (req, res) => {
    try {
        const userId = req.query.userId;
        const data = await cancelRefundOrderService.handleUserGetRefundOrders(
            userId
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

export default {
    createOrderFunc,
    updateOrderStatusFunc,
    createPaypalOrderFunc,
    createVnpayOrderFunc,
    checkPaymentVNPayFunc,
    getOrderDataVnpayToPaymentFunc,
    viewAllOrderFunc,
    getOrderInformation,
    userRefundOrderFunc,
    userCancelOrderFunc,
    getRefundOrderFunc,
};
