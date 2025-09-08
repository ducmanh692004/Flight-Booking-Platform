import flight from '../models/flight.js';
import airport from '../models/airport.js';
import seatclass from '../models/seatClass.js';
import mongoose from 'mongoose';

// const moment = require('moment-timezone');
import moment from 'moment-timezone';

const handleFetchFlightData = async (
    departure_destination,
    arrival_destination,
    departure_date,
    comeback_date,
    flight_type,
    seat_class
) => {
    try {
        let dataOneWayFlight = [];
        const data = await searchOneFlight(
            departure_destination,
            arrival_destination,
            departure_date,
            seat_class
        );
        if (data.EC !== 0) {
            return {
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            };
        } else {
            dataOneWayFlight = data.DT;
        }

        let dataRoundTripFlight = [];

        if (flight_type === 'round-trip') {
            const dataRoundTrip = await searchOneFlight(
                arrival_destination,
                departure_destination,
                comeback_date,
                seat_class
            );
            if (dataRoundTrip.EC !== 0) {
                return {
                    EM: dataRoundTrip.EM,
                    EC: dataRoundTrip.EC,
                    DT: dataRoundTrip.DT,
                };
            } else {
                dataRoundTripFlight = dataRoundTrip.DT;
            }
        }

        return {
            EM: 'Fetch flight data successfully!',
            EC: 0,
            DT: {
                dataOneWayFlight,
                dataRoundTripFlight,
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const searchOneFlight = async (
    departure_destination,
    arrival_destination,
    departure_date,
    seat_class
) => {
    try {
        const departureAirportInformation = await airport.findOne({
            province: departure_destination,
        });

        const arrivalAirportInformation = await airport.findOne({
            province: arrival_destination,
        });

        const timezon = departureAirportInformation?.time_zon || 'UTC';
        // console.log('check date: ', departure_date);
        const { start, end } = convertToUTCDateRange(departure_date, timezon);

        if (
            !departureAirportInformation?._id ||
            !arrivalAirportInformation?._id
        ) {
            return {
                EM: 'Can not find siutable destination from your search',
                EC: -1,
                DT: [],
            };
        }

        const dataFlights = await flight
            .find({
                status: 'active',
                $expr: {
                    $and: [
                        {
                            $eq: [
                                {
                                    $arrayElemAt: [
                                        '$segments.departure_airport_id',
                                        0,
                                    ],
                                },
                                departureAirportInformation._id,
                            ],
                        },
                        {
                            $eq: [
                                {
                                    $arrayElemAt: [
                                        '$segments.arrival_airport_id',
                                        {
                                            $subtract: [
                                                { $size: '$segments' },
                                                1,
                                            ],
                                        },
                                    ],
                                },
                                arrivalAirportInformation._id,
                            ],
                        },
                        {
                            $gte: [
                                {
                                    $arrayElemAt: [
                                        '$segments.departure_time',
                                        0,
                                    ],
                                },
                                start,
                            ],
                        },
                        {
                            $lt: [
                                {
                                    $arrayElemAt: [
                                        '$segments.departure_time',
                                        0,
                                    ],
                                },
                                end,
                            ],
                        },
                    ],
                },
                seats_quantity: {
                    $elemMatch: {
                        seat_class_id: seat_class,
                    },
                },
            })
            .populate('airline')
            .populate('segments.departure_airport_id')
            .populate('segments.arrival_airport_id')
            .populate('seats_quantity.seat_class_id')
            .populate('seats_quantity.utils');

        const dataFilter = dataFlights.map((flight) => {
            const matchedSeat = flight.seats_quantity.find(
                (item) => item.seat_class_id._id.toString() === seat_class
            );

            return {
                ...flight.toObject(),
                seats_quantity: matchedSeat ? [matchedSeat] : [],
            };
        });

        if (dataFlights.length > 0) {
            return {
                EM: 'Fetch flight data successfully!',
                EC: 0,
                DT: dataFilter,
            };
        } else {
            return {
                EM: 'Can not find siutable flight from your search',
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const convertToUTCDateRange = (dateString, timezon) => {
    // Ép thành 00:00:00 UTC của ngày đó
    const startLocal = moment.tz(`${dateString}T00:00:00.00`, timezon);
    const endLocal = startLocal.clone().add(1, 'day');

    // Ngày kế tiếp 00:00:00 UTC
    return {
        start: startLocal.toDate(),
        end: endLocal.toDate(),
    };
};

const takeFlightDataForCart = async (flight_id, seat_class_id) => {
    try {
        const flightData = await flight
            .findById(flight_id)
            .populate({
                path: 'airline',
            })
            .populate({
                path: 'segments.departure_airport_id',
            })
            .populate({
                path: 'segments.arrival_airport_id',
            })
            .populate({
                path: 'seats_quantity.seat_class_id',
            })
            .populate({
                path: 'seats_quantity.utils',
            });

        // console.log('checkkkkkkkkkk', flightData);

        if (!flightData) {
            throw new Error('Can not find siutable flight');
        }

        const filteredSeat = flightData.seats_quantity.find(
            (seat) =>
                seat.seat_class_id._id.toString() === seat_class_id.toString()
        );

        return {
            _id: flightData._id,
            airline: flightData.airline,
            flight_number: flightData.flight_number,
            segments: flightData.segments.map((seg) => ({
                _id: seg._id,
                departure_airport_id: seg.departure_airport_id,
                arrival_airport_id: seg.arrival_airport_id,
                departure_time: seg.departure_time,
                arrival_time: seg.arrival_time,
            })),
            seats_quantity: [filteredSeat],
            status: flightData.status,
            __v: flightData.__v,
        };
    } catch (error) {
        console.error('Error', error.message);
        throw error;
    }
};

const handleSearchSuggestion = async (keyword) => {
    try {
        const regex = new RegExp(keyword, 'i');
        const results = await airport
            .find({
                $or: [
                    { province: { $regex: regex } },
                    { name: { $regex: regex } },
                ],
            })
            .limit(10);
        return {
            EM: 'Search suggestion successfully!',
            EC: 0,
            DT: results,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleFetchFlightDataForConfirmOrder = async (
    flightDepartureId,
    flightComebackId
) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(flightDepartureId)) {
            return {
                EM: 'Your flight to search is not valid!',
                EC: 1,
                DT: [],
            };
        }

        const dataFlightDeparture = await flight
            .findById(flightDepartureId)
            .populate('airline')
            .populate('segments.departure_airport_id')
            .populate('segments.arrival_airport_id')
            .populate('seats_quantity.seat_class_id')
            .populate('seats_quantity.utils');

        if (!dataFlightDeparture) {
            return {
                EM: 'Flight departure not found!',
                EC: 1,
                DT: [],
            };
        }

        let dataFlightComeback = {};

        if (flightComebackId !== 'undefined') {
            dataFlightComeback = await flight
                .findById(flightComebackId)
                .populate('airline')
                .populate('segments.departure_airport_id')
                .populate('segments.arrival_airport_id')
                .populate('seats_quantity.seat_class_id')
                .populate('seats_quantity.utils');

            if (!dataFlightComeback) {
                return {
                    EM: 'Flight comeback not found!',
                    EC: 1,
                    DT: [],
                };
            }
        }
        const dataResponse = {
            dataFlightDeparture: dataFlightDeparture,
            dataFlightComeback:
                Object.keys(dataFlightComeback).length > 0
                    ? dataFlightComeback
                    : [],
        };

        return {
            EM: 'Get all flight information to confirm order successfully!',
            EC: 0,
            DT: dataResponse,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const updateFlightSeat = async (flightId, seatClassId, amount, updateType) => {
    const queryFlightId = new mongoose.Types.ObjectId(flightId);
    const querySeatClassId = new mongoose.Types.ObjectId(seatClassId);
    const incrementValue = updateType === 'add' ? amount : -amount;

    // console.log(
    //     'check data update flight seat: ',
    //     queryFlightId,
    //     querySeatClassId,
    //     incrementValue
    // );

    const filter = {
        _id: queryFlightId,
    };

    const update = {
        $inc: {
            'seats_quantity.$[elem].current_seat': incrementValue,
        },
    };

    const options = {
        arrayFilters: [
            {
                'elem.seat_class_id': querySeatClassId,
                ...(updateType === 'add'
                    ? {}
                    : { 'elem.current_seat': { $gte: amount } }),
            },
        ],
    };

    const result = await flight.updateOne(filter, update, options);
};

const handleCheckSeatHaveEnough = async (
    flightDepartureId,
    flightComebackId,
    seatClassDepartureId,
    seatClassComebackId,
    totalPeople
) => {
    try {
        let data = await flight.findOne({ _id: flightDepartureId.trim() });
        if (!data) {
            return {
                EM: 'Flight departure is not found!',
                EC: 1,
                DT: [],
            };
        }
        // console.log('hiiiii', data);
        // console.log('check data seatClassDeparture:', flightDepartureId);
        // console.log('check data seatClassComeback:', flightComebackId);

        const seatDepartureCheck = data.seats_quantity.find((seat) => {
            return (
                seat.seat_class_id.equals(seatClassDepartureId) &&
                seat.maximum_seat - seat.current_seat >= totalPeople
            );
        });

        // console.log('check seatDepartureCheck: ', seatDepartureCheck);

        if (!seatDepartureCheck) {
            return {
                EM: 'Current seat quantity of seat class in your departure flight is not enough for your order!',
                EC: 1,
                DT: [],
            };
        }

        // console.log('check flight cb id: ', flightComebackId);
        if (
            flightComebackId &&
            mongoose.Types.ObjectId.isValid(flightComebackId)
        ) {
            let dataComeback = await flight.findOne({
                _id: flightComebackId.trim(),
            });
            const seatComebackCheck = dataComeback.seats_quantity.find(
                (seat) => {
                    return (
                        seat.seat_class_id.equals(seatClassComebackId) &&
                        seat.maximum_seat - seat.current_seat >= totalPeople
                    );
                }
            );

            if (!dataComeback) {
                return {
                    EM: 'Flight comeback is not found!',
                    EC: 1,
                    DT: [],
                };
            }

            if (!seatComebackCheck) {
                return {
                    EM: 'Current seat quantity of seat class in your comeback flight is not enough for your order!',
                    EC: 1,
                    DT: [],
                };
            }
        }

        return {
            EM: 'Check seat have enough successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleViewDestinationForHomepage = async () => {
    try {
        const dataForFlight = await flight
            .find({})
            .populate({
                path: 'segments.departure_airport_id',
                model: 'Airport',
                select: 'province image_province',
            })
            .populate({
                path: 'segments.arrival_airport_id',
                model: 'Airport',
                select: 'province image_province',
            })
            .select('segments');

        const clearArray = [];
        for (let i = 0; i < dataForFlight.length; i++) {
            // if (clearArray.length === 20) {
            //     return {
            //         EM: 'Get all destination for homepage successfully!',
            //         EC: 0,
            //         DT: clearArray,
            //     };
            // }
            // for (let j = 0; j < clearArray.length; j++) {
            //     if (
            //         clearArray[j].arrivalProvince ===
            //         dataForFlight[i].segments[
            //             dataForFlight[i].segments.length - 1
            //         ].arrival_airport_id.province
            //     ) {
            //         continue;
            //     }

            //     clearArray.push({
            //         departureProvince:
            //             dataForFlight[i].segments[0].departure_airport_id
            //                 .province,
            //         arrivalProvince:
            //             dataForFlight[i].segments[
            //                 dataForFlight[i].segments.length - 1
            //             ].arrival_airport_id.province,
            //         image: dataForFlight[i].segments[
            //             dataForFlight[i].segments.length - 1
            //         ].arrival_airport_id.image_province,
            //         departure: dataForFlight[i].segments[0].departure_time,
            //     });
            // }
            const existing = clearArray.some(
                (item) =>
                    item.arrivalProvince ===
                    dataForFlight[i].segments[
                        dataForFlight[i].segments.length - 1
                    ].arrival_airport_id.province
            );

            if (!existing) {
                clearArray.push({
                    departureProvince:
                        dataForFlight[i].segments[0].departure_airport_id
                            .province,
                    arrivalProvince:
                        dataForFlight[i].segments[
                            dataForFlight[i].segments.length - 1
                        ].arrival_airport_id.province,
                    image: dataForFlight[i].segments[
                        dataForFlight[i].segments.length - 1
                    ].arrival_airport_id.image_province,
                    departure: dataForFlight[i].segments[0].departure_time,
                });
            }

            // clearArray.push(
            //     dataForFlight[i].segments[0].departure_airport_id.province
            // );
            // dataForFlight[i].segments[0].departure_airport_id.province =
            //     dataForFlight[i].segments[0].departure_airport_id.province;
        }

        const index = clearArray.length / 2;

        return {
            EM: 'Get all flight successfully!',
            EC: 0,
            DT: {
                arr1: clearArray.slice(0, index),
                arr2: clearArray.slice(index),
            },
        };
    } catch (error) {
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

export default {
    handleFetchFlightData,
    takeFlightDataForCart,
    handleSearchSuggestion,
    handleFetchFlightDataForConfirmOrder,
    updateFlightSeat,
    handleCheckSeatHaveEnough,
    handleViewDestinationForHomepage,
};
