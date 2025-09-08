import order from '../../models/order.js';
import cancelRefundOrderService from '../cancelRefundOrder.js';
import flightService from '../flightService.js';

const handleGetAllOrder = async (limit, page, status) => {
    try {
        // console.log('jj', status);
        // if (status.trim() == 'Đã thanh toán') {

        let otherCondition = '';
        if (status === 'Đã thanh toán') {
            otherCondition = 'Đang chờ hoàn tiền';
        } else {
            otherCondition = status;
        }

        const dataOrder = await order
            .find({ status: { $in: [status, otherCondition] } })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: 'flightDepartureId',
                model: 'Flight',
                select: 'segments.departure_time segment.departure_airport_id segments.arrival_airport_id',
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
                        select: 'name province',
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
                select: 'segments.departure_time segments.departure_airport_id segments.arrival_airport_id',
                as: 'comebackFlightData',
                populate: [
                    {
                        path: 'segments.departure_airport_id',
                        model: 'Airport',
                        select: 'name province',
                    },
                    {
                        path: 'segments.arrival_airport_id',
                        model: 'Airport',
                        select: 'name province',
                    },
                ],
            })
            .populate({
                path: 'seatClassComebackId',
                model: 'Seat_Class',
                select: 'name _id',
            });

        const totalOrder = await order.countDocuments({
            status: status,
        });

        return {
            EM: 'Get all order successfully!',
            EC: 0,
            DT: {
                dataOrder: dataOrder,
                totalPages: Math.ceil(totalOrder / limit),
            },
        };
        // } else {
        //     console.log('omg');
        //     return {
        //         EM: '!',
        //         EC: 1,
        //         DT: [],
        //     };
        // }

        // }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        };
    }
};

const handleDeleteOrder = async (orderId) => {
    try {
        const checkOrder = await order.findById(orderId);
        if (checkOrder.status === 'Chờ thanh toán') {
            await cancelRefundOrderService.unbookSeats(
                checkOrder.seatDetailDataDeparture,
                checkOrder.flightDepartureId,
                checkOrder.seatClassDepartureId
            );

            await flightService.updateFlightSeat(
                checkOrder.flightDepartureId,
                checkOrder.seatClassDepartureId,
                checkOrder.peopleQuantity.adult +
                    checkOrder.peopleQuantity.child,
                'remove'
            );

            if (checkOrder.flightComebackId !== null) {
                await cancelRefundOrderService.unbookSeats(
                    checkOrder.seatDetailDataComeback,
                    checkOrder.flightComebackId,
                    checkOrder.seatClassComebackId
                );

                await flightService.updateFlightSeat(
                    checkOrder.flightComebackId,
                    checkOrder.seatClassComebackId,
                    checkOrder.peopleQuantity.adult +
                        checkOrder.peopleQuantity.child,
                    'remove'
                );
            }

            await order.findByIdAndDelete(orderId);
            return {
                EM: 'Delete order successfully!',
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: 'You not allow to delete this order!',
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in server!',
            EC: -1,
            DT: [],
        };
    }
};

export default {
    handleGetAllOrder,
    handleDeleteOrder,
};
