import express from 'express';
import paymentController from '../controller/paymentController.js';

const router = express.Router();
router.post(
    '/user/payment/Paypal-Payment',
    paymentController.PaypalPaymentFunc
);

router.post(
    '/user/payment/paypal-webhook',
    express.raw({ type: 'application/json' }),
    paymentController.handlePaypalWebhook
);

export default router;
