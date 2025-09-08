import axios from '../config/axios';

const fetchPayPalPayment = (orderId, orderIdDatabase, userId, language) => {
    return axios.post('/api/v1/user/payment/Paypal-Payment', {
        orderId,
        orderIdDatabase,
        userId,
        language,
    });
};

// const getClientTokenPayPal = () => {
//     return axios.post('/api/v1/user/payment/get-client-token');
// };

// const createOrderPayPal = (orderIdDatabase) => {
//     return axios.post('/api/v1/user/payment/create-paypal-order', {
//         orderIdDatabase,
//     });
// };

export { fetchPayPalPayment };
