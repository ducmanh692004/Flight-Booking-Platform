import axios from '../config/axios';

const fetchListFlightOneWay = (
    departure_destination,
    arrival_destination,
    departure_date,
    comeback_date,
    flight_type,
    seat_class
) => {
    return axios.post('/api/v1/user/flight/fetchData', {
        departure_destination,
        arrival_destination,
        departure_date,
        comeback_date,
        flight_type,
        seat_class,
    });
};

const handleFetchSearchSuggestion = (keyword) => {
    return axios.post('/api/v1/user/flight/searchSuggestion', { keyword });
};

const fetchAllSeatClassFlight = (flightDepartureId, flightComebackId) => {
    // console.log(flightDepartureId, flightComebackId);
    return axios.get(
        `/api/v1/user/flight/getFlightDataForConfirmOrder?flightDepartureId=${flightDepartureId}&flightComebackId=${flightComebackId}`
    );
};

const handleCheckSeatHaveEnough = (
    flightDepartureId,
    flightComebackId,
    seatClassDepartureId,
    seatClassComebackId,
    totalPeople
) => {
    return axios.get(
        `/api/v1/user/flight/checkSeatHaveEnough?flightDepartureId=${flightDepartureId}&flightComebackId=${flightComebackId}
        &seatClassDepartureId=${seatClassDepartureId}&seatClassComebackId=${seatClassComebackId}&totalPeople=${totalPeople}`
    );
};

const handleFetchFlightHomePage = () => {
    return axios.get('/api/v1/user/view-destination-for-homepage');
};

export {
    fetchListFlightOneWay,
    handleFetchSearchSuggestion,
    fetchAllSeatClassFlight,
    handleCheckSeatHaveEnough,
    handleFetchFlightHomePage,
};
