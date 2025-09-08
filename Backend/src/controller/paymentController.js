import paymentService from '../service/paymentApiService.js';
import orderService from '../service/orderApiService.js';

const PaypalPaymentFunc = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const orderIdDatabase = req.body.orderIdDatabase;
        const userId = req.body.userId;
        const language = req.body.language;
        let data = await paymentService.handlePaypalPayment(
            orderId,
            orderIdDatabase,
            userId,
            language
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

const handlePaypalWebhook = async (req, res) => {
    try {
        const webhookId = process.env.PAYPAL_WEBHOOK_ID;

        let rawBody;
        let event;

        if (Buffer.isBuffer(req.body)) {
            rawBody = req.body.toString('utf8');
            event = JSON.parse(rawBody);
        } else {
            event = req.body;
            rawBody = JSON.stringify(req.body);
        }

        const isVerified = await paymentService.verifyPaypalWebhookSignature(
            req.headers,
            rawBody,
            webhookId
        );

        if (!isVerified) {
            return res.status(400).send('Invalid signature');
        }

        if (event.event_type === 'CHECKOUT.ORDER.APPROVED') {
            const invoiceId = event.resource.purchase_units?.[0]?.invoice_id;
            await orderService.updateOrderStatusWebhook(
                invoiceId,
                'Đã thanh toán'
            );
        }

        return res.status(200).send('Webhook received');
    } catch (err) {
        return res.status(500).send('Server error');
    }
};

export default {
    PaypalPaymentFunc,
    handlePaypalWebhook,
};
