import flight from '../../models/flight.js';
import airport from '../../models/airport.js';
import Seat_Class from '../../models/seatClass.js';
import airline from '../../models/airline.js';
import utils from '../../models/utils.js';
// import order from '../../models/order';
import cabin from '../../models/cabin.js';
import cabinApiService from '../cabinApiService.js';
// import { create } from 'lodash';

const handleGetAllFlight = async (limit, page) => {
    try {
        const data = await flight
            .find()
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('segments _id flight_number airline status')
            .populate({
                path: 'airline',
                model: 'Airline',
                select: 'logo name',
            })

            .populate({
                path: 'segments.departure_airport_id',
                model: 'Airport',
                select: 'province code',
            })
            .populate({
                path: 'segments.arrival_airport_id',
                model: 'Airport',
                select: 'code province',
            });

        const totalFlight = await flight.countDocuments({});

        return {
            EM: 'Get all flight successfully!',
            EC: 0,
            DT: {
                flightData: data,
                totalPages: Math.ceil(totalFlight / limit),
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleCreateNewFlight = async (flightData) => {
    try {
        // console.log('view: ', flightData);
        const currentLayout = [];
        const currentSeatClassId = [];
        const currentPriceChooseSeat = [];

        for (let j = 0; j < flightData.seats_quantity.length; j++) {
            currentLayout.push(flightData.seats_quantity[j].layout);
            currentSeatClassId.push(flightData.seats_quantity[j].seat_class_id);
            currentPriceChooseSeat.push({
                price_normal_seat:
                    flightData.seats_quantity[j].normal_seat_price,
                price_window_seat:
                    flightData.seats_quantity[j].window_seat_price,
            });
            flightData.seats_quantity[j].current_seat = 0;

            delete flightData.seats_quantity[j].layout;
        }
        flightData.status = 'active';

        const newFlight = await flight.create(flightData);

        for (let i = 0; i < currentLayout.length; i++) {
            await cabinApiService.createNewCabin(
                currentLayout[i],
                currentSeatClassId[i],
                newFlight._id,
                currentPriceChooseSeat[i],
                flightData.seats_quantity[i].maximum_seat
            );
        }

        return {
            EM: 'Create new flight successfully!',
            EC: 0,
            DT: [],
        };

        // console.log('check flight after resolve: ', flightData);
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleGetDetailFlight = async (flightId) => {
    try {
        const data = await flight
            .findOne({ _id: flightId })
            .populate({
                path: 'airline',
                model: 'Airline',
                select: 'logo name',
            })
            .populate({
                path: 'segments.departure_airport_id',
                model: 'Airport',
                select: 'province code name time_zon',
            })
            .populate({
                path: 'segments.arrival_airport_id',
                model: 'Airport',
                select: 'province code name time_zon',
            })
            .populate({
                path: 'seats_quantity.seat_class_id',
                model: 'Seat_Class',
            })
            .populate({
                path: 'seats_quantity.utils',
                module: 'Utils',
                select: 'name',
            });
        if (data) {
            return {
                EM: 'Get detail flight successfully!',
                EC: 0,
                DT: data,
            };
        } else {
            return {
                EM: 'Can not get detail flight!',
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleGetFlightDataToUpdate = async (flightId) => {
    try {
        const data = await flight
            .findOne({ _id: flightId })
            .populate({
                path: 'airline',
                model: 'Airline',
                select: 'logo name',
            })
            .populate({
                path: 'segments.departure_airport_id',
                model: 'Airport',
                select: 'province code name',
            })
            .populate({
                path: 'segments.arrival_airport_id',
                model: 'Airport',
                select: 'province code name',
            })
            .populate({
                path: 'seats_quantity.seat_class_id',
                model: 'Seat_Class',
            })
            .populate({
                path: 'seats_quantity.utils',
                module: 'Utils',
                select: 'name',
            });

        const seatPositionPriceData = [];

        for (let i = 0; i < data.seats_quantity.length; i++) {
            const priceSeatChoose = await cabin
                .findOne({
                    flight_id: data._id,
                    seat_class_id: data.seats_quantity[i].seat_class_id,
                })
                .select('price_normal_seat price_window_seat layout');

            seatPositionPriceData.push(priceSeatChoose);
        }

        if (data) {
            return {
                EM: 'Get detail flight successfully!',
                EC: 0,
                DT: {
                    flightData: data,
                    seatPositionPriceData: seatPositionPriceData,
                },
            };
        } else {
            return {
                EM: 'Can not get detail flight!',
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleUpdateFlight = async (formData) => {
    try {
        for (let i = 0; i < formData.flightData.seats_quantity.length; i++) {
            parseInt(formData.flightData.seats_quantity[i].price);
            parseInt(formData.flightData.seats_quantity[i].child_price);
            parseInt(formData.flightData.seats_quantity[i].price_baggage);
        }
        await flight.replaceOne(
            { _id: formData.flightData._id },
            formData.flightData
        );
        return {
            EM: 'Update flight successfully!',
            EC: 0,
            DT: [],
        };
        // await flight.updateOne(
        //     { _id: formData.flightData._id },

        // );
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleDeleteFlight = async (flightId) => {
    try {
        // console.log('check flightId delete: ', flightId);
        const checkData = await flight
            .findById(flightId)
            .select('seats_quantity.current_seat');
        // console.log('check data order found:', checkData);
        for (let i = 0; i < checkData.seats_quantity.length; i++) {
            if (checkData.seats_quantity[i].current_seat > 0) {
                return {
                    EM: 'Flight is ordered by user, you can not delete this flight!',
                    EC: -1,
                    DT: [],
                };
            }
        }

        await flight.deleteOne({ _id: flightId });
        return {
            EM: 'Delete flight successfully!',
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleSearchDestinationSuggestion = async (keyword) => {
    try {
        const regex = new RegExp(keyword, 'i');
        const results = await airport
            .find({
                $or: [
                    { country: { $regex: regex } },
                    { name: { $regex: regex } },
                ],
            })
            .limit(5);

        if (results.length > 0) {
            return {
                EM: 'Search suggestion successfully!',
                EC: 0,
                DT: results,
            };
        } else {
            return {
                EM: 'Can not find destination with your keywords',
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

const handleSearchAirlineSuggestion = async (keyword) => {
    try {
        const regex = new RegExp(keyword, 'i');
        const results = await airline
            .find({
                $or: [
                    { name: { $regex: regex } },
                    { country: { $regex: regex } },
                ],
            })
            .limit(5);

        if (results.length > 0) {
            return {
                EM: 'Search suggestion successfully!',
                EC: 0,
                DT: results,
            };
        } else {
            return {
                EM: 'Can not find destination with your keywords',
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

const handleFetchAllSeatClass = async () => {
    try {
        const data = await Seat_Class.find({});
        return {
            EM: 'Get all seat class successfully!',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

const handleFetchAllUtils = async () => {
    try {
        const data = await utils.find({});
        return {
            EM: 'Get all utils successfully!',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'error from server',
            EC: -1,
            DT: [],
        };
    }
};

export default {
    handleGetAllFlight,
    handleCreateNewFlight,
    handleGetDetailFlight,
    handleGetFlightDataToUpdate,
    handleUpdateFlight,
    handleDeleteFlight,
    handleSearchDestinationSuggestion,
    handleSearchAirlineSuggestion,
    handleFetchAllSeatClass,
    handleFetchAllUtils,
};
