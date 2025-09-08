import order from '../models/order.js';
import cabin from '../models/cabin.js';
import flightService from './flightService.js';
// import { update } from 'lodash';
import refund from '../models/refund.js';
import flight from '../models/flight.js';

const handleUserCancelOrder = async (orderId) => {
    try {
        let orderData = await order.findById(orderId);
        if (
            orderData &&
            orderData.status === 'Chờ thanh toán' &&
            orderData.paymentMethod === 'Chưa có'
        ) {
            await unbookSeats(
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
                await unbookSeats(
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

            await order.deleteOne({ _id: orderId });

            return {
                EM: 'Cancel order successfully! ',
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: 'Order does not found! ',
                EC: 1,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr! ',
            EC: -1,
            DT: [],
        };
    }
};

const handleUserRefundOrder = async (userId, orderId, reason, note) => {
    try {
        let refundMoney = 0;
        const orderData = await order.findById(orderId);
        if (orderData.flightDepartureId !== null) {
            const flightDepartureData = await flight.findById(
                orderData.flightDepartureId
            );
            if (flightDepartureData) {
                for (
                    let i = 0;
                    i < flightDepartureData.seats_quantity.length;
                    i++
                ) {
                    if (
                        flightDepartureData.seats_quantity[
                            i
                        ].seat_class_id.equals(orderData.seatClassDepartureId)
                    ) {
                        const currentMoney =
                            Number(orderData.totalFlightDeparturePrice) *
                            (flightDepartureData.seats_quantity[i].refundMoney /
                                100);
                        refundMoney += currentMoney;
                    }
                }
            }
        }

        if (orderData.flightComebackId !== null) {
            const flightComebackData = await flight.findById(
                orderData.flightComebackId
            );
            if (flightComebackData) {
                for (
                    let i = 0;
                    i < flightComebackData.seats_quantity.length;
                    i++
                ) {
                    if (
                        flightComebackData.seats_quantity[
                            i
                        ].seat_class_id.equals(orderData.seatClassComebackId)
                    ) {
                        const currentMoney =
                            Number(orderData.totalFlightComebackPrice) *
                            (flightComebackData.seats_quantity[i].refundMoney /
                                100);
                        refundMoney += currentMoney;
                    }
                }
            }
        }

        if (refundMoney === 0) {
            return {
                EM: 'Flight in your order does not have refund money!',
                EC: 1,
                DT: [],
            };
        }

        // console.log('check refund money: ', refundMoney);
        await refund.create({
            userId: userId,
            orderId: orderId,
            refundMoney: refundMoney,
            reason: reason,
            note: note || '',
            status: 'Đang chờ hoàn tiền',
        });

        await order.updateOne(
            { _id: orderId },
            { status: 'Đang chờ hoàn tiền' }
        );

        return {
            EM: 'Your refund request was sended successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr! ',
            EC: -1,
            DT: [],
        };
    }
};

const unbookSeats = async (listSeatDetail, flightId, seatClassId) => {
    try {
        // console.log('check list seat adult:', listSeatDetail.adults);
        // console.log('check list seat child:', listSeatDetail.child);

        const updateSeatStatus = async (seatInfo) => {
            await cabin.updateOne(
                {
                    flight_id: flightId,
                    seat_class_id: seatClassId,
                    'cabin_map._id': seatInfo.rowId,
                    'cabin_map.seats._id': seatInfo.seat_id,
                },
                {
                    $set: {
                        'cabin_map.$[rowElem].seats.$[seatElem].status':
                            'available',
                    },
                    $unset: {
                        'cabin_map.$[rowElem].seats.$[seatElem].passenger_id':
                            '',
                    },
                },
                {
                    arrayFilters: [
                        { 'rowElem._id': seatInfo.rowId },
                        { 'seatElem._id': seatInfo.seat_id },
                    ],
                }
            );
        };

        if (listSeatDetail.adults.length > 0) {
            for (let i = 0; i < listSeatDetail.adults.length; i++) {
                await updateSeatStatus(listSeatDetail.adults[i]);
            }
        }

        if (listSeatDetail?.child && listSeatDetail?.child.length > 0) {
            for (let i = 0; i < listSeatDetail.child.length; i++) {
                await updateSeatStatus(listSeatDetail.child[i]);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const handleUserGetRefundOrders = async (userId) => {
    try {
        // console.log('check user id: ', userId);
        const data = await refund.find({
            userId: userId,
            status: { $in: ['Đang chờ hoàn tiền', 'Đã hoàn tiền'] },
        });
        console.log('data: ', data);
        return {
            EM: 'Get refund orders successfully! ',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr! ',
            EC: -1,
            DT: [],
        };
    }
};

const deleteAllUserRefundOrder = async (userId) => {
    try {
        await refund.deleteMany({ userId: userId });
        return true;
    } catch (error) {
        return false;
    }
};

export default {
    handleUserCancelOrder,
    handleUserRefundOrder,
    handleUserGetRefundOrders,
    deleteAllUserRefundOrder,
    unbookSeats,
};
