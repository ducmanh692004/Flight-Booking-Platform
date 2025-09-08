// import axios from 'axios';
// import orderService from '../service/orderApiService';
// import emailService from '../service/emailService';
// import userService from '../service/userApiService';
import axios from 'axios';

// const { app } = require('firebase-admin');
// const fetch = require('node-fetch');
import fetch from 'node-fetch';
const handlePaypalPayment = async () => {};

const handlePayPalPayment = async (totalMoney, currency, orderIdDatabase) => {
    try {
        // console.log('totalMoney: ', totalMoney);
        // convert to vietnam money
        const base64Credentials = Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
        ).toString('base64');

        const response = await fetch(
            `${process.env.PAYPAL_API}/v1/oauth2/token`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${base64Credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'grant_type=client_credentials',
            }
        );
        const data = await response.json();
        const accessToken = data.access_token;

        const createOrderRes = await fetch(
            `${process.env.PAYPAL_API}/v2/checkout/orders`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            amount: {
                                currency_code: currency,
                                value: totalMoney / 25000,
                            },
                            invoice_id: orderIdDatabase,
                        },
                    ],
                    application_context: {
                        return_url:
                            'https://jetnow.vercel.app/account/orderHistory',
                        cancel_url:
                            'https://jetnow.vercel.app/account/orderHistory',
                    },
                }),
            }
        );

        const createOrderData = await createOrderRes.json();
        // console.log('check data create: ', createOrderData);
        const approveUrl = createOrderData.links.find(
            (link) => link.rel === 'approve'
        )?.href;
        return {
            approveUrl,
            paypalOrderId: createOrderData.id,
        };
    } catch (error) {
        console.log(error);
    }
};

const verifyPaypalWebhookSignature = async (headers, rawBody, webhookId) => {
    const transmissionId = headers['paypal-transmission-id'];
    const transmissionTime = headers['paypal-transmission-time'];
    const certUrl = headers['paypal-cert-url'];
    const authAlgo = headers['paypal-auth-algo'];
    const transmissionSig = headers['paypal-transmission-sig'];

    const accessToken = await getAccessToken();

    const response = await fetch(
        `${process.env.PAYPAL_API}/v1/notifications/verify-webhook-signature`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                auth_algo: authAlgo,
                cert_url: certUrl,
                transmission_id: transmissionId,
                transmission_sig: transmissionSig,
                transmission_time: transmissionTime,
                webhook_id: webhookId,
                webhook_event: JSON.parse(rawBody),
            }),
        }
    );

    const data = await response.json();
    return data.verification_status === 'SUCCESS';
};

const getAccessToken = async () => {
    const credentials = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    const response = await fetch(`${process.env.PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
};

const handleRefundOrder = async (captureId, refundMoney) => {
    try {
        const access_token = await getAccessToken();
        const refundRes = await axios.post(
            `https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`,
            {
                amount: {
                    value: refundMoney,
                    currency_code: 'USD',
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        // console.log('refund paypal', refundRes);

        if (refundRes.statusText === 'Created') {
            // console.log('refund success');
            return true;
        }

        return false;
    } catch (error) {
        // console.log('bugggg', error.response.data.details);
        return false;
    }
};

export default {
    handlePaypalPayment,
    handlePayPalPayment,
    verifyPaypalWebhookSignature,
    handleRefundOrder,
};
