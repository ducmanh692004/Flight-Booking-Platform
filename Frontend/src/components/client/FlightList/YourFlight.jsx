// import { IoAirplaneOutline } from 'lucide-react';
import { getFlightDuration } from '../../../utils/myFunction';
import dayjs from 'dayjs';
import FlightSelectedInformation from './FlightSelectedInformation';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const YourFlight = (props) => {
    const { t } = useTranslation();
    const dataSearch = props.dataSearch;
    const flightDataDeparture = props.flightDataDeparture;
    const flightDataComeback = props.flightDataComeback;
    const [showSelectedFlight, setShowSelectedFlight] = useState(false);
    const [dataSelectedFlight, setDataSelectedFlight] = useState({});

    const formatUtcToLocal = (utcStr, timezone, format = 'HH:mm') => {
        return dayjs.utc(utcStr).tz(timezone).format(format);
    };

    const handleShowViewSelectFlight = (flight) => {
        setShowSelectedFlight(true);
        setDataSelectedFlight(flight);
    };

    const handleHideSelectedFlight = () => {
        setShowSelectedFlight(false);
    };

    return (
        <div
            className="card shadow-sm"
            style={{ maxWidth: '400px', margin: '0 auto' }}
        >
            <div className="card-body p-4">
                {/* Header */}
                <div className="d-flex align-items-center mb-3">
                    <i
                        className="bi bi-airplane text-primary me-2"
                        style={{ fontSize: '1.2rem' }}
                    ></i>
                    <h6 className="card-title mb-0">{t('yourFlight.yourFlight')}</h6>
                    {/* <hr></hr> */}
                </div>
                <hr></hr>
                {/* Date and Route */}
                <div className="mb-3">
                    <div className="d-flex align-items-center mb-1">
                        <div
                            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{
                                width: '24px',
                                height: '24px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                            }}
                        >
                            1
                        </div>
                        <small className="text-muted">
                            {dataSearch.departure_date}
                        </small>
                    </div>
                    <h6
                        className="text-primary mb-0"
                        style={{ marginLeft: '32px' }}
                    >
                        {dataSearch.departure_destination} -{' '}
                        {dataSearch.arrival_destination}
                    </h6>
                </div>
                {Object.keys(flightDataDeparture).length > 0 && (
                    <div>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center">
                                <div className="rounded d-flex align-items-center justify-content-center me-2">
                                    <img
                                        src={
                                            flightDataDeparture.airline.logo_url
                                        }
                                        style={{
                                            width: '70px',
                                            height: '30px',
                                        }}
                                    ></img>
                                </div>
                                {/* <span className="fw-medium">
                                    {flightDataDeparture.airline.name}
                                </span> */}
                            </div>
                            <a
                                href="#"
                                className="text-primary text-decoration-none fw-medium"
                                onClick={() =>
                                    handleShowViewSelectFlight(
                                        flightDataDeparture
                                    )
                                }
                            >
                                {t('yourFlight.details')}
                            </a>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="text-center">
                                <div className="h4 fw-bold mb-0">
                                    {formatUtcToLocal(
                                        flightDataDeparture.segments[0]
                                            .departure_time,
                                        flightDataDeparture.segments[0]
                                            .departure_airport_id.time_zone,
                                        'HH:mm'
                                    )}
                                </div>
                                <small className="text-muted">
                                    {
                                        flightDataDeparture.segments[0]
                                            .departure_airport_id.code
                                    }
                                </small>
                            </div>

                            <div className="flex-fill mx-3 text-center">
                                <div className="d-flex align-items-center justify-content-center mb-1">
                                    <hr
                                        className="flex-fill border-secondary"
                                        style={{ margin: '5px' }}
                                    />
                                    <i className="bi bi-airplane text-muted"></i>
                                    <hr
                                        className="flex-fill border-secondary"
                                        style={{ margin: '5px' }}
                                    />
                                </div>
                                <small className="text-muted d-block">
                                    {' '}
                                    {getFlightDuration(
                                        flightDataDeparture.segments[0]
                                            .departure_time,
                                        flightDataDeparture.segments[
                                            flightDataDeparture.segments
                                                .length - 1
                                        ].arrival_time
                                    )}
                                </small>
                                <small className="text-muted">
                                    {' '}
                                    {flightDataDeparture.segments.length === 1
                                        ? t('yourFlight.directFlight')
                                        : flightDataDeparture.segments
                                              .length === 2
                                        ? t('yourFlight.oneStop')
                                        : flightDataDeparture.segments
                                              .length === 3
                                        ? t('yourFlight.twoStops')
                                        : t('yourFlight.threeStops')}
                                </small>
                            </div>

                            <div className="text-center">
                                <div className="h4 fw-bold mb-0">
                                    {' '}
                                    {formatUtcToLocal(
                                        flightDataDeparture.segments[
                                            flightDataDeparture.segments
                                                .length - 1
                                        ].arrival_time,
                                        flightDataDeparture.segments[
                                            flightDataDeparture.segments
                                                .length - 1
                                        ].arrival_airport_id.time_zon
                                    )}
                                </div>
                                <small className="text-muted">
                                    {' '}
                                    {
                                        flightDataDeparture.segments[
                                            flightDataDeparture.segments
                                                .length - 1
                                        ].arrival_airport_id.code
                                    }
                                </small>
                            </div>
                        </div>

                        {/* Change Flight Link */}
                        <div
                            className="text-center rounded pt-1 pb-1"
                            style={{ backgroundColor: 'whitesmoke' }}
                            onClick={() =>
                                props.handleChangeFlight('departure')
                            }
                        >
                            <a
                                href="#"
                                className="text-primary text-decoration-none fw-medium"
                            >
                                {t('yourFlight.changeFlight')}
                            </a>
                        </div>
                    </div>
                )}
                <hr></hr>

                {dataSearch.flight_type === 'round-trip' && (
                    <div className="mb-3">
                        <div className="d-flex align-items-center mb-1">
                            <div
                                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                }}
                            >
                                2
                            </div>
                            <small className="text-muted">
                                {dataSearch.comeback_date}
                            </small>
                        </div>
                        <h6
                            className="text-primary mb-0"
                            style={{ marginLeft: '32px' }}
                        >
                            {dataSearch.arrival_destination} -{' '}
                            {dataSearch.departure_destination}
                        </h6>
                    </div>
                )}
                {/* Airline */}
                {Object.keys(flightDataComeback).length > 0 &&
                    dataSearch.flight_type === 'round-trip' && (
                        <div>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="rounded d-flex align-items-center justify-content-center me-2">
                                        <img
                                            src={
                                                flightDataComeback.airline
                                                    .logo_url
                                            }
                                            style={{
                                                width: '70px',
                                                height: '30px',
                                            }}
                                        ></img>
                                    </div>
                                    {/* <span className="fw-medium">
                                        {flightDataComeback.airline.name}
                                    </span> */}
                                </div>
                                <a
                                    href="#"
                                    className="text-primary text-decoration-none fw-medium"
                                    onClick={() =>
                                        handleShowViewSelectFlight(
                                            flightDataComeback
                                        )
                                    }
                                >
                                    Chi tiết
                                </a>
                            </div>

                            {/* Flight Times */}
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="text-center">
                                    <div className="h4 fw-bold mb-0">
                                        {formatUtcToLocal(
                                            flightDataComeback.segments[0]
                                                .departure_time,
                                            flightDataComeback.segments[0]
                                                .departure_airport_id.time_zon
                                        )}
                                    </div>
                                    <small className="text-muted">
                                        {
                                            flightDataComeback.segments[0]
                                                .departure_airport_id.code
                                        }
                                    </small>
                                </div>

                                <div className="flex-fill mx-3 text-center">
                                    <div className="d-flex align-items-center justify-content-center mb-1">
                                        <hr
                                            className="flex-fill border-secondary"
                                            style={{ margin: '5px' }}
                                        />
                                        <i className="bi bi-airplane text-muted"></i>
                                        <hr
                                            className="flex-fill border-secondary"
                                            style={{ margin: '5px' }}
                                        />
                                    </div>
                                    <small className="text-muted d-block">
                                        {getFlightDuration(
                                            flightDataComeback.segments[0]
                                                .departure_time,
                                            flightDataComeback.segments[
                                                flightDataComeback.segments
                                                    .length - 1
                                            ].arrival_time
                                        )}
                                    </small>
                                    <small className="text-muted">
                                        {' '}
                                        {flightDataComeback.segments.length ===
                                        1
                                            ? t('yourFlight.directFlight')
                                            : flightDataComeback.segments
                                                  .length === 2
                                            ? t('yourFlight.oneStop')
                                            : flightDataComeback.segments
                                                  .length === 3
                                            ? t('yourFlight.twoStops')
                                            : t('yourFlight.threeStops')}{' '}
                                    </small>
                                </div>

                                <div className="text-center">
                                    <div className="h4 fw-bold mb-0">
                                        {formatUtcToLocal(
                                            flightDataComeback.segments[
                                                flightDataComeback.segments
                                                    .length - 1
                                            ].arrival_time,
                                            flightDataComeback.segments[
                                                flightDataComeback.segments
                                                    .length - 1
                                            ].arrival_airport_id.time_zon
                                        )}
                                    </div>
                                    <small className="text-muted">
                                        {
                                            flightDataComeback.segments[
                                                flightDataComeback.segments
                                                    .length - 1
                                            ].arrival_airport_id.code
                                        }
                                    </small>
                                </div>
                            </div>

                            {/* Change Flight Link */}
                            <div
                                className="text-center pt-1 pb-1 rounded"
                                style={{ backgroundColor: 'whitesmoke' }}
                                onClick={() =>
                                    props.handleChangeFlight('comeback')
                                }
                            >
                                <a
                                    href="#"
                                    className="p-1 rounded text-primary text-decoration-none fw-medium"
                                >
                                    {t('yourFlight.changeFlight')}
                                </a>
                            </div>
                        </div>
                    )}
            </div>

            <FlightSelectedInformation
                show={showSelectedFlight}
                setShow={handleHideSelectedFlight}
                dataFlight={dataSelectedFlight}
            />
        </div>
    );
};

export default YourFlight;
