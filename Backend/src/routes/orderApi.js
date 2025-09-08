import express from 'express';
import orderController from '../controller/orderController.js';

const router = express.Router();

router.post('/user/order/createOrder', orderController.createOrderFunc);
router.post(
    '/user/order/update-order-status',
    orderController.updateOrderStatusFunc
);

// Router paypal payment
router.post(
    '/user/order/create-paypal-order',
    orderController.createPaypalOrderFunc
);

router.get('/user/get-order-information', orderController.getOrderInformation);

// Router vnpay payment
// router.post(
//     '/user/order/create-vnpay-order',
//     orderController.createVnpayOrderFunc
// );
router.get(
    '/user/order/check-payment-vnpay',
    orderController.checkPaymentVNPayFunc
);
router.get(
    '/user/order/create-order-data-vnpay',
    orderController.getOrderDataVnpayToPaymentFunc
);

router.get('/user/order/view-all-order', orderController.viewAllOrderFunc);

// cancel order and refund money
router.post('/user/order/cancel-order', orderController.userCancelOrderFunc);

router.post('/user/order/refund-order', orderController.userRefundOrderFunc);

router.get('/user/order/get-refund-orders', orderController.getRefundOrderFunc);
export default router;
