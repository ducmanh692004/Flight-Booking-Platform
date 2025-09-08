import { useLocation } from 'react-router-dom';
import YourFlight from './YourFlight';
import Filter from './Filter';
import FindOtherFlight from './FindOtherFlight';
import FlightResult from './FlightResult';
import { fetchListFlightOneWay } from '../../../services/UserFlightList';
import { parseDate, getDuration } from '../../../utils/myFunction';
import { useEffect, useState } from 'react';
import PageNotFound from '../../auth/PageNotFound';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import ConfirmUserFlight from './ConfirmUserFlight';
import { getAccount } from '../../../services/AuthenticationService';

const FlightList = () => {
    const [flightData, setFlightData] = useState({});
    const [typeFLight, setTypeFlight] = useState('');
    const [dataSearch, setDataSearch] = useState({});
    const [flightDataDeparture, setFlightDataDeparture] = useState({});
    const [flightDataComeback, setFlightDataComback] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [flightFiltered, setFlightFiltered] = useState([]);
    const [currentChoose, setCurrentChoose] = useState('departure');
    const [showConfirmFlight, setShowConfirmFlight] = useState(false);

    const defaultFilter = {
        stopTypes: [],
        airlines: [],
        departure_time: [],
        arrival_time: [],
    };
    const [filters, setFilters] = useState(defaultFilter);

    const [filterPrice, setFilterPrice] = useState('');

    const handleChooseFlight = async (flight) => {
        if (currentChoose === 'departure') {
            setFlightDataDeparture(flight);
            if (dataSearch.flight_type === 'one-way') {
                setShowConfirmFlight(true);
            } else if (
                dataSearch.flight_type === 'round-trip' &&
                Object.keys(flightDataComeback).length > 0
            ) {
                setShowConfirmFlight(true);
            } else if (dataSearch.flight_type === 'round-trip') {
                setCurrentChoose('comeback');
                setFlightFiltered(flightData.dataRoundTripFlight);
                handleResetFilters();
            }
            // do some thing to show confirm order ticket
        } else if (currentChoose === 'comeback') {
            setFlightDataComback(flight);
            setShowConfirmFlight(true);
        }
    };

    const handleShowConfirmOrderTicket = () => {
        setShowConfirmFlight(true);
        // do some thing to show confirm order ticket
    };

    const handleCloseConfirmOrderTicket = () => {
        setShowConfirmFlight(false);
    };

    const handleChangeStopDuration = (stopTypes) => {
        setFilters((prev) => {
            const currentStopTypes = prev.stopTypes;
            const stopIndex = currentStopTypes.indexOf(stopTypes);

            if (stopIndex === -1) {
                return {
                    ...prev,
                    stopTypes: [...currentStopTypes, stopTypes],
                };
            } else {
                const updatedStopTypes = [...currentStopTypes];
                updatedStopTypes.splice(stopIndex, 1);
                return {
                    ...prev,
                    stopTypes: updatedStopTypes,
                };
            }
        });
    };

    const handleChangeFlight = (type) => {
        if (currentChoose === 'comeback' && type === 'departure') {
            setCurrentChoose('departure');
            setFlightFiltered(flightData.dataOneWayFlight);
            handleResetFilters();
        } else if (currentChoose === 'departure' && type === 'comeback') {
            setCurrentChoose('comeback');
            setFlightFiltered(flightData.dataRoundTripFlight);
            handleResetFilters();
        }
    };

    const handleChangeDepartureTime = (time) => {
        setFilters((prev) => {
            const currentDepartureTime = prev.departure_time;
            const timeIndex = currentDepartureTime.indexOf(time);

            if (timeIndex === -1) {
                return {
                    ...prev,
                    departure_time: [...currentDepartureTime, time],
                };
            } else {
                const updatedDepartureTime = [...currentDepartureTime];
                updatedDepartureTime.splice(timeIndex, 1);
                return {
                    ...prev,
                    departure_time: updatedDepartureTime,
                };
            }
        });
    };

    const handleChangeArrivalTime = (time) => {
        setFilters((prev) => {
            const currentArrivalTime = prev.arrival_time;
            const timeIndex = currentArrivalTime.indexOf(time);

            if (timeIndex === -1) {
                return {
                    ...prev,
                    arrival_time: [...currentArrivalTime, time],
                };
            } else {
                const updatedArrivalTime = [...currentArrivalTime];
                updatedArrivalTime.splice(timeIndex, 1);
                return {
                    ...prev,
                    arrival_time: updatedArrivalTime,
                };
            }
        });
    };

    const handleChangeAirline = (airlineName) => {
        setFilters((prevFilters) => {
            const currentAirlines = prevFilters.airlines;
            const airlineIndex = currentAirlines.indexOf(airlineName);

            if (airlineIndex === -1) {
                return {
                    ...prevFilters,
                    airlines: [...currentAirlines, airlineName],
                };
            } else {
                const updatedAirlines = [...currentAirlines];
                updatedAirlines.splice(airlineIndex, 1);
                return {
                    ...prevFilters,
                    airlines: updatedAirlines,
                };
            }
        });
    };

    const handleResetFilters = () => {
        setFilters(defaultFilter);
    };

    const location = useLocation();

    const takeDataFromUrl = async () => {
        const dataFetch = new URLSearchParams(location.search);
        const departure = dataFetch.get('departure_destination');
        const arrival = dataFetch.get('arrival_destination');
        const departure_datee = dataFetch.get('departure_date');
        const comeback_date = dataFetch.get('comeback_date');
        const people_quantity_string = dataFetch.get('people_quantity');
        const people_quantity = JSON.parse(people_quantity_string);
        const seat_class_string = dataFetch.get('seat_class');
        const seat_class = JSON.parse(seat_class_string);
        const flight_type = dataFetch.get('flight_type');
        setTypeFlight(flight_type);

        const departureDateParse = parseDate(departure_datee);
        const comebackDateParse = parseDate(comeback_date);

        if ([...dataFetch.keys()].length === 0) {
            console.log('erorrrrrr');
            setDataSearch({});
        }

        if (
            !departure ||
            !arrival ||
            !departure_datee ||
            Object.keys(people_quantity).length === 0 ||
            Object.keys(seat_class).length === 0 ||
            !comeback_date ||
            !seat_class ||
            !flight_type
        ) {
            console.log('errrorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
            setDataSearch({});
        } else {
            setDataSearch({
                departure_destination: departure,
                arrival_destination: arrival,
                departure_date: departureDateParse,
                comeback_date: comebackDateParse,
                people_quantity: people_quantity,
                seat_class: seat_class,
                flight_type: flight_type,
            });
        }
        setLoading(true);
    };

    const fetchFligthData = async () => {
        // await takeDataFromUrl();

        let response = await fetchListFlightOneWay(
            dataSearch.departure_destination,
            dataSearch.arrival_destination,
            dataSearch.departure_date,
            dataSearch.comeback_date,
            dataSearch.flight_type,
            dataSearch.seat_class.id
        );

        if (response && response.EC !== 0) {
            toast.error(response.EM);
            setFlightData({});
            setFlightFiltered([]);
        } else {
            setFlightData(response.DT);
            setFlightFiltered(response.DT.dataOneWayFlight);
        }
        await getAccount();
    };

    const compareInRange = (utcTime, selectedRanges, tz) => {
        const hour = dayjs.utc(utcTime).tz(tz).hour();
        console.log(hour);

        for (let i = 0; i < selectedRanges.length; i++) {
            if (selectedRanges[i] - 6 <= hour && hour < selectedRanges[i]) {
                return true;
            }
        }
        return false;
    };

    const filterFlights = (flights, currentFilters) => {
        return flights.filter((flight) => {
            const airlineName = flight.airline.name || '';
            const numStops = (flight.segments?.length || 1) - 1;

            const departureSegment = flight.segments[0];
            const arrivalSegment = flight.segments[flight.segments.length - 1];

            const departureTime = departureSegment.departure_time;
            const arrivalTime = arrivalSegment.arrival_time;

            const timezoneDeparture =
                departureSegment.departure_airport_id.time_zon;
            const timezoneArrival = arrivalSegment.arrival_airport_id.time_zon;

            if (
                currentFilters.airlines.length > 0 &&
                !currentFilters.airlines.includes(airlineName)
            ) {
                return false;
            }

            if (currentFilters.stopTypes.length > 0) {
                if (
                    !currentFilters.stopTypes.includes(numStops) &&
                    !(currentFilters.stopTypes.includes(2) && numStops >= 2)
                ) {
                    return false;
                }
            }

            if (currentFilters.departure_time.length > 0) {
                if (
                    !compareInRange(
                        departureTime,
                        currentFilters.departure_time,
                        timezoneDeparture
                    )
                ) {
                    return false;
                }
            }

            if (currentFilters.arrival_time.length > 0) {
                if (
                    !compareInRange(
                        arrivalTime,
                        currentFilters.arrival_time,
                        timezoneArrival
                    )
                ) {
                    return false;
                }
            }

            return true;
        });
    };

    useEffect(() => {
        if (Object.keys(dataSearch).length > 0) {
            fetchFligthData();
        }
    }, [dataSearch]);

    useEffect(() => {
        takeDataFromUrl();
    }, []);

    useEffect(() => {
        let currentFlightsSource = [];

        if (
            currentChoose === 'departure' ||
            dataSearch.flight_type === 'one-way'
        ) {
            currentFlightsSource = flightData.dataOneWayFlight || [];
        } else if (
            currentChoose === 'comeback' ||
            Object.keys(flightDataDeparture).length > 0
        ) {
            currentFlightsSource = flightData.dataRoundTripFlight || [];
        }

        const filteredResult = filterFlights(currentFlightsSource, filters);

        const finalSortedResult = [...filteredResult];

        if (filterPrice === 'ASC') {
            finalSortedResult.sort(
                (a, b) =>
                    parseFloat(
                        a.seats_quantity?.[0]?.price?.$numberDecimal || 0
                    ) -
                    parseFloat(
                        b.seats_quantity?.[0]?.price?.$numberDecimal || 0
                    )
            );
        } else if (filterPrice === 'DESC') {
            finalSortedResult.sort(
                (a, b) =>
                    parseFloat(
                        b.seats_quantity?.[0]?.price?.$numberDecimal || 0
                    ) -
                    parseFloat(
                        a.seats_quantity?.[0]?.price?.$numberDecimal || 0
                    )
            );
        }

        setFlightFiltered(finalSortedResult);
    }, [filters, flightData, filterPrice]);

    const handleChangePriceSort = (value) => {
        setFilterPrice(value);
    };

    if (Object.keys(dataSearch).length === 0) {
        return <PageNotFound />;
    }

    return (
        <div style={{ backgroundColor: 'whitesmoke' }}>
            <div className="container d-flex gap-5 justify-content-center pt-4">
                <div className="col-3">
                    <YourFlight
                        dataSearch={dataSearch}
                        flightDataDeparture={flightDataDeparture}
                        flightDataComeback={flightDataComeback}
                        handleChangeFlight={handleChangeFlight}
                    />
                    <Filter
                        flightData={
                            currentChoose === 'departure' // the reason make can not change FLIGHT
                                ? flightData.dataOneWayFlight
                                : flightData.dataRoundTripFlight
                        }
                        handleChangeAirline={handleChangeAirline}
                        handleChangeStopDuration={handleChangeStopDuration}
                        handleChangeDepartureTime={handleChangeDepartureTime}
                        handleChangeArrivalTime={handleChangeArrivalTime}
                        handleResetFilters={handleResetFilters}
                        filters={filters}
                    />
                </div>

                {/* <div className="col-1"></div> */}

                <div className="col-8">
                    <FindOtherFlight
                        dataSearch={dataSearch}
                        takeDataFromUrl={takeDataFromUrl}
                        handleChangePriceSort={handleChangePriceSort}
                        filterPrice={filterPrice}
                        handleChangeStopDuration={handleChangeStopDuration}
                        dataStopDuration={filters.stopTypes}
                    />
                    <FlightResult
                        flightData={flightFiltered}
                        handleChooseFlight={handleChooseFlight}
                    />
                </div>
            </div>

            <ConfirmUserFlight
                show={showConfirmFlight}
                dataPeopleQuantity={dataSearch.people_quantity}
                setShow={handleCloseConfirmOrderTicket}
                dataFlightDeparture={flightDataDeparture}
                dataFlightComeback={flightDataComeback}
            />
        </div>

        // <div></div>
    );
};

export default FlightList;
