import axios from '../config/axios';

const handleCreateOrder = (orderData, userId) => {
    return axios.post('/api/v1/user/order/createOrder', {
        orderData,
        userId,
    });
};

// Order PayPal
const createOrderPayPal = (orderIdDatabase) => {
    return axios.post('/api/v1/user/order/create-paypal-order', {
        orderIdDatabase,
    });
};

const handleUpdateOrderStatus = (orderId, status, paymentMethod, captureId) => {
    return axios.post('api/v1/user/order/update-order-status', {
        orderId,
        status,
        paymentMethod,
        captureId,
    });
};

const createOrderDataVNPayToPayment = (orderId) => {
    return axios.get(
        `/api/v1/user/order/create-order-data-vnpay?orderId=${orderId}`
    );
};

const viewAllOrderData = (userId) => {
    return axios.get(`/api/v1/user/order/view-all-order?userId=${userId}`);
};

const getOrderDetailInformation = (orderId) => {
    return axios.get(`/api/v1/user/get-order-information?orderId=${orderId}`);
};

// Cancel order and refund money
const cancelOrder = (orderId) => {
    return axios.post('/api/v1/user/order/cancel-order', {
        orderId,
    });
};

const refundOrder = (userId, orderId, reason, note) => {
    return axios.post('/api/v1/user/order/refund-order', {
        userId,
        orderId,
        reason,
        note,
    });
};

const userGetRefundOrder = (userId) => {
    return axios.get(`/api/v1/user/order/get-refund-orders?userId=${userId}`);
};

export {
    handleCreateOrder,
    handleUpdateOrderStatus,
    createOrderPayPal,
    createOrderDataVNPayToPayment,
    viewAllOrderData,
    getOrderDetailInformation,
    refundOrder,
    cancelOrder,
    userGetRefundOrder,
};
