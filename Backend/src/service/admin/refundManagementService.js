import refund from '../../models/refund.js';
import order from '../../models/order.js';
import paymentService from '../paymentApiService.js';
import canRefundOrderService from '../cancelRefundOrder.js';
import flightService from '../flightService.js';
// import {
//     sendConfirmRefundMoney,
//     sendConfirmRejectRefundMoney,
// } from '../emailService.js';
import emailServicer from '../emailService.js';

const handleGetAllRefund = async (limit, page) => {
    try {
        // console.log('manhdzzzz:  ', limit, page);
        const dataRefund = await refund
            .find({})
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // console.log(':::', dataRefund);
        if (dataRefund.length > 0) {
            const totalCount = await refund.countDocuments();
            const totalPages = Math.ceil(totalCount / limit);
            return {
                EM: 'Get all refund order successfully!',
                EC: 0,
                DT: {
                    refunds: dataRefund,
                    totalPages: totalPages,
                },
            };
        } else {
            return {
                EM: 'System does not have any refund order!',
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in server! ',
            EC: -1,
            DT: [],
        };
    }
};

const handleProcessRefund = async (refundId) => {
    try {
        const dataRefund = await refund.findById(refundId);
        if (
            dataRefund === undefined &&
            dataRefund.status !== 'Đang chờ hoàn tiền'
        ) {
            return {
                EM: 'Refund order not found! ',
                EC: -1,
                DT: [],
            };
        }

        const orderData = await order.findById(dataRefund.orderId);
        // console.log('data order:', orderData);

        // console.log(
        //     'llll',
        //     orderData.formData.email,
        //     String(orderData._id),
        //     convertVNDToUSD(parseInt(dataRefund.refundMoney))
        // );

        // // console.log(
        // //     'data refund: ',
        // //     orderData.captureId,
        // //     parseInt(dataRefund.refundMoney)
        // // );

        // // console.log('jjj', parseInt(dataRefund.refundMoney));
        // // if ()
        let result = true;
        if (orderData.paymentMethod === 'PayPal') {
            result = await paymentService.handleRefundOrder(
                orderData.captureId,
                (parseInt(dataRefund.refundMoney) / 25000).toFixed(2)
            );
        }

        // console.log('maaaaa', result);

        if (result === true) {
            await refund.updateOne(
                { _id: refundId },
                { status: 'Đã hoàn tiền' }
            );
            await order.updateOne(
                {
                    _id: dataRefund.orderId,
                },
                {
                    status: 'Đã hoàn tiền',
                }
            );

            await canRefundOrderService.unbookSeats(
                orderData.seatDetailDataDeparture,
                orderData.flightDepartureId,
                orderData.seatClassDepartureId
            );
            await flightService.updateFlightSeat(
                orderData.flightDepartureId,
                orderData.seatClassDepartureId,
                orderData.peopleQuantity.adult + orderData.peopleQuantity.child,
                'remove'
            );

            if (orderData.flightComebackId !== null) {
                await canRefundOrderService.unbookSeats(
                    orderData.seatDetailDataComeback,
                    orderData.flightComebackId,
                    orderData.seatClassComebackId
                );
                await flightService.updateFlightSeat(
                    orderData.flightComebackId,
                    orderData.seatClassComebackId,
                    orderData.peopleQuantity.adult +
                        orderData.peopleQuantity.child,
                    'remove'
                );
            }

            await emailServicer.sendConfirmRefundMoney(
                orderData.formData.email,
                String(orderData._id),
                convertVNDToUSD(parseInt(dataRefund.refundMoney))
            );

            return {
                EM: 'Process refund money successfully! ',
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: 'Process refund failed! ',
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in server! ',
            EC: -1,
            DT: [],
        };
    }
};

const handleIgnoreRefund = async (refundId) => {
    try {
        const dataRefund = await refund.findById(refundId);
        if (dataRefund) {
            const orderData = await order.findById(dataRefund.orderId);

            await refund.updateOne({ _id: refundId }, { status: 'Đã từ chối' });

            await order.updateOne(
                {
                    _id: dataRefund.orderId,
                },
                {
                    status: 'Đã thanh toán',
                }
            );

            await emailServicer.sendConfirmRejectRefundMoney(
                orderData.formData.email,
                dataRefund.orderId
            );

            return {
                EM: 'Ignore refund successfully! ',
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in server! ',
            EC: -1,
            DT: [],
        };
    }
};

const convertVNDToUSD = (vndAmount) => {
    if (typeof vndAmount !== 'number' || isNaN(vndAmount)) {
        return '$0.00';
    }
    const usd = vndAmount / 25000;
    return usd.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });
};

export default {
    handleGetAllRefund,
    handleProcessRefund,
    handleIgnoreRefund,
};
