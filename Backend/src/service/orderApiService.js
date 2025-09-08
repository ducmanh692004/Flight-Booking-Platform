import flight from '../models/flight.js';
import flightService from './flightService.js';
import order from '../models/order.js';
import cabinService from './cabinApiService.js';
// import mongoose from 'mongoose';
// const fetch = require('node-fetch');
import fetch from 'node-fetch';
import querystring from 'qs';
import * as crypto from 'crypto';

// const {
//     VNPay,
//     ignoreLogger,
//     ProductCode,
//     VnpLocale,
//     dateFormat,
// } = require('vnpay');
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from 'vnpay';

const handleCreateOrder = async (orderData, userId) => {
    try {
        // let data = await order.create(orderData);
        // console.log('check order data: ', orderData);
        // console.log('check user id: ', userId);
        // console.log('check data orderrrr: ', orderData);
        let data = await flight.findOne({
            _id: orderData.flightDepartureId,
        });

        // console.log('check data flight:', data);
        if (!data) {
            return {
                EM: 'Flight departure is not found!',
                EC: 1,
                DT: [],
            };
        }

        const seatDepartureCheck = data.seats_quantity.find((seat) => {
            return (
                seat.seat_class_id.equals(
                    orderData.currentSeatClassDeparture._id
                ) &&
                seat.maximum_seat - seat.current_seat >=
                    orderData.peopleQuantity.adult +
                        orderData.peopleQuantity.child
            );
        });

        // console.log('check data seat found: ', seatDepartureCheck);

        if (!seatDepartureCheck) {
            return {
                EM: 'Current seat quantity of seat class in your departure flight is not enough for your order!',
                EC: 1,
                DT: [],
            };
        }

        /// handle if flight have flight comebackk
        if (orderData?.flightComebackId && orderData?.flightComebackId !== '') {
            let dataComeback = await flight.findOne({
                _id: orderData.flightComebackId,
            });

            if (!dataComeback) {
                return {
                    EM: 'Flight comeback is not found!',
                    EC: 1,
                    DT: [],
                };
            }

            const seatComebackCheck = dataComeback.seats_quantity.find(
                (seat) => {
                    return (
                        seat.seat_class_id.equals(
                            orderData.currentSeatClassComeback._id
                        ) &&
                        seat.maximum_seat - seat.current_seat >=
                            orderData.peopleQuantity.adult +
                                orderData.peopleQuantity.child
                    );
                }
            );

            // console.log('check data seat comeback found: ', seatComebackCheck);

            if (!seatComebackCheck) {
                return {
                    EM: 'Current seat quantity of seat class in your comeback flight is not enough for your order!',
                    EC: 1,
                    DT: [],
                };
            }
        }

        const seatDetailDepartureResolve = {};

        const seatDetailComebackResolve = {};

        const updateCabinAdultDeparture =
            await cabinService.assignSeatsForPassengers(
                orderData.flightDepartureId,
                orderData.currentSeatClassDeparture._id,
                userId,
                orderData.currentSeatDetailDeparture.adults
            );
        seatDetailDepartureResolve.adults = updateCabinAdultDeparture;
        // console.log('checkk: ', updateCabinAdultDeparture);

        if (orderData.currentSeatDetailDeparture.child.length > 0) {
            const updateCabinChildDeparture =
                await cabinService.assignSeatsForPassengers(
                    orderData.flightDepartureId,
                    orderData.currentSeatClassDeparture._id,
                    userId,
                    orderData.currentSeatDetailDeparture.child
                );
            // console.log(
            //     'check cabin update child departure:',
            //     updateCabinChildDeparture
            // );
            seatDetailDepartureResolve.child = updateCabinChildDeparture;
        }

        if (orderData?.flightComebackId && orderData.flightComebackId !== '') {
            const updateCabinAdultComeback =
                await cabinService.assignSeatsForPassengers(
                    orderData.flightComebackId,
                    orderData.currentSeatClassComeback._id,
                    userId,
                    orderData.currentSeatDetailComeback.adults
                );
            // console.log(
            //     'check cabin update adult comeback:',
            //     updateCabinAdultComeback
            // );
            seatDetailComebackResolve.adults = updateCabinAdultComeback;

            if (orderData.currentSeatDetailComeback.child.length > 0) {
                const updateCabinChildComeback =
                    await cabinService.assignSeatsForPassengers(
                        orderData.flightComebackId,
                        orderData.currentSeatClassComeback._id,
                        userId,
                        orderData.currentSeatDetailComeback.child
                    );
                // console.log(
                //     'check cabin update child comeback:',
                //     updateCabinChildComeback
                // );
                seatDetailComebackResolve.child = updateCabinChildComeback;
            }
        }

        await flightService.updateFlightSeat(
            orderData.flightDepartureId,
            orderData.currentSeatClassDeparture._id,
            orderData.peopleQuantity.adult + orderData.peopleQuantity.child,
            'add'
        );

        if (orderData?.flightComebackId && orderData.flightComebackId !== '') {
            await flightService.updateFlightSeat(
                orderData.flightComebackId,
                orderData.currentSeatClassComeback._id,
                orderData.peopleQuantity.adult + orderData.peopleQuantity.child,
                'add'
            );
        }

        // console.log(
        //     'check data seat detail departure: ',
        //     seatDetailDepartureResolve
        // );
        // console.log(
        //     'check data seat detail comeback: ',
        //     seatDetailComebackResolve
        // );

        let dataOrder = await order.create({
            userId: userId,
            status: 'Chờ thanh toán',
            paymentMethod: 'Chưa có',
            flightDepartureId: orderData.flightDepartureId,
            flightComebackId: orderData?.flightComebackId || null,
            seatClassDepartureId: orderData.currentSeatClassDeparture._id,
            seatClassComebackId:
                orderData?.currentSeatClassComeback?._id || null,
            peopleQuantity: orderData.peopleQuantity,
            totalFlightDeparturePrice: orderData.priceTotalFlightDeparture,
            totalFlightComebackPrice: orderData.priceTotalFlightComeback,
            totalBaggagePrice: orderData.totalBaggagePrice,
            totalSeatDetailPrice: orderData.totalSeatDetailPrice,
            discountValue: orderData.discountValue,
            seatDetailDataDeparture: seatDetailDepartureResolve,
            seatDetailDataComeback: seatDetailComebackResolve,
            baggageDataDeparture: orderData.currentDepartureBaggage,

            baggageDataComeback:
                orderData?.flightComebackId && orderData.flightComebackId !== ''
                    ? orderData.currentComebackBaggage
                    : null,
            formData: orderData.formData,
            formDataChild: orderData.formAllDataChild,
            formDataAdult: orderData.formAllDataAdult,
        });

        // Resolve when payment method is paypal
        // if (paymentMethod === 'PayPal') {
        //     const dataPayPal = await paymentService.handlePayPalPayment(
        //         Number(orderData.priceTotalFlightDeparture) +
        //             Number(orderData.priceTotalFlightComeback) +
        //             Number(orderData.totalBaggagePrice) +
        //             Number(orderData.totalSeatDetailPrice),
        //         'USD',
        //         dataOrder._id
        //     );
        return {
            EM: 'Create order with status pending successfully!',
            EC: 0,
            DT: dataOrder._id,
        };
        // }
    } catch (error) {
        console.log(error);
    }
};

// const handleUpdateOrderStatus = async (orderId, paymentMethod) => {
//     try {
//         await order.updateOne(
//             { _id: orderId },
//             { status: 'Đã thanh toán', paymentMethod: paymentMethod }
//         );
//     } catch (error) {
//         console.log(error);
//     }
// };

const handleCreatePayPalOrder = async (orderId) => {
    try {
        // console.log('check id: ', orderId);
        const dataOrder = await order.findById(orderId);
        // console.log('dataOrder: ', dataOrder);
        if (!dataOrder) {
            return {
                EM: 'Order not found!',
                EC: 1,
                DT: [],
            };
        }
        // const dataPayPal = await paymentService.handlePayPalPayment(
        //     Number(dataOrder.totalFlightDeparturePrice) +
        //         Number(dataOrder.totalFlightComebackPrice) +
        //         Number(dataOrder.totalBaggagePrice) +
        //         Number(dataOrder.totalSeatDetailPrice),
        //     'USD',
        //     dataOrder._id
        // );

        const totalMoney =
            Number(dataOrder.totalFlightDeparturePrice) +
            Number(dataOrder.totalFlightComebackPrice) +
            Number(dataOrder.totalBaggagePrice) +
            Number(dataOrder.totalSeatDetailPrice);

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
                                currency_code: 'USD',
                                value: (totalMoney / 25000).toFixed(2),
                            },
                            invoice_id: dataOrder._id,
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
        return {
            EM: 'Create order on paypal successfully!',
            EC: 0,
            DT: createOrderData.id,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        };
    }
};

// const updateOrderStatusWebhook = async (orderId, status) => {
//     try {
//         await order.findByIdAndUpdate(orderId, { status });
//     } catch (error) {
//         throw error;
//     }
// };

const handleUpdateOrderStatus = async (
    orderId,
    status,
    paymentMethod,
    captureId
) => {
    try {
        await order.updateOne(
            { _id: orderId },
            {
                status: status,
                paymentMethod: paymentMethod,
                captureId: captureId,
            }
        );
        return {
            EM: 'Update order status successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        };
    }
};

// const {
//     VNPay,
//     ignoreLogger,
//     ProductCode,
//     VnpLocale,
//     dateFormat,
// } = require('vnpay');

const handleCreateVnPayOrder = async (totalMoney, orderIdDatabase) => {
    try {
        const vnpay = new VNPay({
            tmnCode: process.env.VNPAY_TMN_CODE,
            secureSecret: process.env.VNPAY_SECURE_SECRET,
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger,
        });

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // console.log('check total mn: ', totalMoney);

        const vnpayResponse = await vnpay.buildPaymentUrl({
            vnp_Amount: totalMoney, // Số tiền thanh toán
            vnp_IpAddr: process.env.VNPAY_IP_ADDRESS, // Địa chỉ IP của người dùng
            vnp_TxnRef: orderIdDatabase, // Mã đơn hàng
            vnp_OrderInfo: `JetNow`, // Thông tin đơn hàng
            vnp_OrderType: ProductCode.Other, // Loại sản phẩm
            vnp_ReturnUrl:
                'https://jetnow.onrender.com/api/v1/user/order/check-payment-vnpay', // URL trả về sau khi thanh toán
            vnp_Locale: VnpLocale.VN, // Ngôn ngữ: 'vn' hoặc 'en'
            vnp_CreateDate: dateFormat(new Date()), // Ngày tạo yêu cầu thanh toán
            vnp_ExpireDate: dateFormat(tomorrow), // Ngày hết hạn của yêu cầu thanh toán
        });

        return vnpayResponse;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const handleGetOrderDataVnpayToPayment = async (orderId) => {
    try {
        const dataOrder = await order.findById(orderId);
        if (!dataOrder) {
            return {
                EM: 'Order does not found!',
                EC: 1,
                DT: [],
            };
        }

        const UrlRidirect = await handleCreateVnPayOrder(
            Number(dataOrder.totalFlightDeparturePrice) +
                Number(dataOrder.totalFlightComebackPrice) +
                Number(dataOrder.totalBaggagePrice) +
                Number(dataOrder.totalSeatDetailPrice),
            dataOrder._id
        );

        return {
            EM: 'Get order data successfully!',
            EC: 0,
            DT: UrlRidirect,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        };
    }
};

const handleCheckPayment = async (data) => {
    try {
        const vnp_Params = { ...data };

        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        const sortedParams = sortObject(vnp_Params);

        // const querystring = require('qs');
        const signData = querystring.stringify(sortedParams, { encode: false });

        // const crypto = require('crypto');
        const hash = crypto
            .createHmac('sha512', process.env.VNPAY_SECURE_SECRET)
            .update(signData)
            .digest('hex');

        // console.log('kkkk', signData);
        // console.log('aaaa', secureHash);
        // console.log('ccc', hash);

        if (secureHash === hash) {
            const orderId = vnp_Params['vnp_TxnRef'];
            const status = vnp_Params['vnp_ResponseCode'];

            if (status === '00') {
                await order.updateOne(
                    { _id: orderId },
                    { status: 'Đã thanh toán', paymentMethod: 'VNPay' }
                );

                return `https://jetnow.vercel.app/payment-success?orderId=${orderId}&totalPrice=${
                    vnp_Params['vnp_Amount'] / 100
                }&paymentMethod=VNPay&paymentStatus=Thanh+to%C3%A1n+thành+công!`;
            } else {
                return `https://jetnow.vercel.app/payment-fail?error=ThanhToanThatBai`;
            }
        } else {
            return `https://jetnow.vercel.app/payment-fail?error=InvalidSignature`;
        }
    } catch (err) {
        console.log(err);
        return 'https://jetnow.vercel.app/payment-fail?error=ServerError';
    }
};

const sortObject = (obj) => {
    const sorted = {};
    const keys = Object.keys(obj).sort();

    for (const key of keys) {
        sorted[key] = obj[key];
    }

    return sorted;
};

const handleViewAllOrder = async (userId) => {
    try {
        const dataOrder = await order
            .find({ userId: userId })
            .populate({
                path: 'flightDepartureId',
                model: 'Flight',
                select: 'segments.departure_time segment.departure_airport_id segementt.arrival_airport_id',
                as: 'departureFlightData',
                populate: [
                    {
                        path: 'segments.departure_airport_id',
                        model: 'Airport',
                        select: 'code province',
                    },
                    {
                        path: 'segments.arrival_airport_id',
                        model: 'Airport',
                        select: 'code province',
                    },
                ],
            })
            .populate({
                path: 'seatClassDepartureId',
                model: 'Seat_Class',
                select: 'name _id',
            })

            .populate({
                path: 'flightComebackId',
                model: 'Flight',
                select: 'segments.departure_time segment.departure_airport_id segementt.arrival_airport_id seats_quantity.price',
                as: 'comebackFlightData',
                populate: [
                    {
                        path: 'segments.departure_airport_id',
                        model: 'Airport',
                        select: 'code province',
                    },
                    {
                        path: 'segments.arrival_airport_id',
                        model: 'Airport',
                        select: 'code province',
                    },
                ],
            })
            .populate({
                path: 'seatClassComebackId',
                model: 'Seat_Class',
                select: 'name _id',
            });
        return {
            EM: 'Get all order successfully!',
            EC: 0,
            DT: dataOrder,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        };
    }
};
const handleGetOrderInformation = async (orderId) => {
    try {
        const dataOrder = await order
            .findById(orderId)
            .populate({
                path: 'flightDepartureId',
                model: 'Flight',
                as: 'departureFlightData',
                populate: [
                    {
                        path: 'airline',
                        model: 'Airline',
                        // select: 'name logo_url',
                    },
                    {
                        path: 'segments.departure_airport_id',
                        model: 'Airport',
                        select: 'code province name',
                    },
                    {
                        path: 'segments.arrival_airport_id',
                        model: 'Airport',
                        select: 'code province name',
                    },
                    {
                        path: 'seats_quantity.seat_class_id',
                        model: 'Seat_Class',
                        select: 'name',
                    },
                    {
                        path: 'seats_quantity.utils',
                        model: 'Utils',
                        select: 'name refund_money refund_percentage',
                    },
                ],
            })
            .populate({
                path: 'flightComebackId',
                model: 'Flight',
                as: 'comebackFlightData',
                populate: [
                    {
                        path: 'airline',
                        model: 'Airline',
                        // select: 'name logo_url',
                    },
                    {
                        path: 'segments.departure_airport_id',
                        model: 'Airport',
                        select: 'code province name',
                    },
                    {
                        path: 'segments.arrival_airport_id',
                        model: 'Airport',
                        select: 'code province name',
                    },
                    {
                        path: 'seats_quantity.seat_class_id',
                        model: 'Seat_Class',
                        select: 'name',
                    },
                    {
                        path: 'seats_quantity.utils',
                        model: 'Utils',
                        select: 'name refund_money refund_percentage',
                    },
                ],
            })
            .populate('seatClassDepartureId')
            .populate('seatClassComebackId');

        if (!dataOrder) {
            return {
                EM: 'Order not found!',
                EC: 1,
                DT: null,
            };
        }

        const selectedDepartureSeatClassId = dataOrder.seatClassDepartureId
            ? dataOrder.seatClassDepartureId._id.toString()
            : null;

        if (
            dataOrder.flightDepartureId &&
            dataOrder.flightDepartureId.seats_quantity &&
            Array.isArray(dataOrder.flightDepartureId.seats_quantity) &&
            selectedDepartureSeatClassId
        ) {
            const filteredSeats =
                dataOrder.flightDepartureId.seats_quantity.filter(
                    (seat) =>
                        seat.seat_class_id &&
                        seat.seat_class_id._id.toString() ===
                            selectedDepartureSeatClassId
                );

            if (filteredSeats.length > 0) {
                const selectedSeatQuantity = filteredSeats[0];
                const originalPrice = selectedSeatQuantity.price;
                const refundPercentage =
                    selectedSeatQuantity.utils?.refund_percentage || 0;
                const refundMoney =
                    selectedSeatQuantity.utils?.refund_money || 0;

                selectedSeatQuantity.refundAmount =
                    originalPrice * (refundPercentage / 100) + refundMoney;
                dataOrder.flightDepartureId.seats_quantity =
                    selectedSeatQuantity;
            } else {
                dataOrder.flightDepartureId.seats_quantity = null;
            }
        } else {
            dataOrder.flightDepartureId.seats_quantity = null;
        }

        if (dataOrder.flightComebackId) {
            const selectedComebackSeatClassId = dataOrder.seatClassComebackId
                ? dataOrder.seatClassComebackId._id.toString()
                : null;

            if (
                dataOrder.flightComebackId &&
                dataOrder.flightComebackId.seats_quantity &&
                Array.isArray(dataOrder.flightComebackId.seats_quantity) &&
                selectedComebackSeatClassId
            ) {
                const filteredSeats =
                    dataOrder.flightComebackId.seats_quantity.filter(
                        (seat) =>
                            seat.seat_class_id &&
                            seat.seat_class_id._id.toString() ===
                                selectedComebackSeatClassId
                    );

                if (filteredSeats.length > 0) {
                    const selectedSeatQuantity = filteredSeats[0];
                    const originalPrice = selectedSeatQuantity.price;
                    const refundPercentage =
                        selectedSeatQuantity.utils?.refund_percentage || 0;
                    const refundMoney =
                        selectedSeatQuantity.utils?.refund_money || 0;

                    selectedSeatQuantity.refundAmount =
                        originalPrice * (refundPercentage / 100) + refundMoney;
                    dataOrder.flightComebackId.seats_quantity =
                        selectedSeatQuantity;
                } else {
                    dataOrder.flightComebackId.seats_quantity = null;
                }
            } else {
                dataOrder.flightComebackId.seats_quantity = null;
            }
        }

        return {
            EM: 'Get order successfully!',
            EC: 0,
            DT: dataOrder,
        };
    } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        return {
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        };
    }
};

const deleteAllUserOrder = async (userId) => {
    try {
        await order.deleteMany({ userId: userId });
        return true;
    } catch (error) {
        return false;
    }
};

export default {
    handleCreateOrder,
    handleCreatePayPalOrder,
    handleUpdateOrderStatus,
    handleCreateVnPayOrder,
    handleCheckPayment,
    handleGetOrderDataVnpayToPayment,
    handleViewAllOrder,
    handleGetOrderInformation,
    deleteAllUserOrder,
};
