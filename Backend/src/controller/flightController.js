import flightService from '../service/flightService.js';

const fetchFlightFunc = async (req, res) => {
    try {
        const departure_destination = req.body.departure_destination;
        const arrival_destination = req.body.arrival_destination;
        const departure_date = req.body.departure_date;
        const comeback_date = req.body.comeback_date;
        const flight_type = req.body.flight_type;
        const seat_class = req.body.seat_class;
        const data = await flightService.handleFetchFlightData(
            departure_destination,
            arrival_destination,
            departure_date,
            comeback_date,
            flight_type,
            seat_class
        );

        if (data) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

const filterFlightFunc = async (req, res) => {
    try {
        const dataFilter = req.body.dataFilter;
        const data = await flightService.handleFilterFlight(dataFilter);
        if (data) {
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

const searchSuggestionFunc = async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const data = await flightService.handleSearchSuggestion(keyword);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

const getFlightDataForConfirmOrder = async (req, res) => {
    try {
        const flightDepartureId = req.query.flightDepartureId;
        const flightComebackId = req.query?.flightComebackId;
        const data = await flightService.handleFetchFlightDataForConfirmOrder(
            flightDepartureId,
            flightComebackId
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

const checkSeatHaveEnoughFunc = async (req, res) => {
    try {
        const flightDepartureId = req.query.flightDepartureId;
        const flightComebackId = req.query?.flightComebackId;
        const seatClassDepartureId = req.query.seatClassDepartureId;
        const seatClassComebackId = req.query.seatClassComebackId;
        const totalPeople = req.query.totalPeople;
        const data = await flightService.handleCheckSeatHaveEnough(
            flightDepartureId,
            flightComebackId,
            seatClassDepartureId,
            seatClassComebackId,
            totalPeople
        );
        // console.log('helloo', data);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

// const getFlightDataForPayment = async (req, res) => {
//     try {
//         const flightDepartureId = req.query.flightDepartureId;
//         const flightComebackId = req.query.flightComebackId;
//         const seatClassIdDeparture = req.query.seatClassIdDeparture;
//         const seatClassIdComeback = req.query.seatClassIdComeback;
//         let data = await flightService.handleFetchFlightDataForPayment(
//             flightDepartureId,
//             flightComebackId,
//             seatClassIdDeparture,
//             seatClassIdComeback
//         );
//         return res.status(200).json({
//             EM: data.EM,
//             EC: data.EC,
//             DT: data.DT,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             EM: 'Something wrong in sever!',
//             EC: -1,
//             DT: [],
//         });
//     }
// };

const viewDestinationForHomepage = async (req, res) => {
    try {
        // const reverser = req.query.reveser;
        const data = await flightService.handleViewDestinationForHomepage();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        });
    }
};

export default {
    fetchFlightFunc,
    filterFlightFunc,
    searchSuggestionFunc,
    getFlightDataForConfirmOrder,
    checkSeatHaveEnoughFunc,
    viewDestinationForHomepage,
};
