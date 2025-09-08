import { getFlightDuration } from '../../../../utils/myFunction';
import dayjs from 'dayjs';
import FlightSelectedInformation from '../../FlightList/FlightSelectedInformation';
import { useState } from 'react';
import { getDateOnly } from '../../../../utils/myFunction';
import { FaArrowDown } from 'react-icons/fa';
import { useFormatter } from '../../../hooks/useFomatter';
import { set } from 'lodash';
import { useTranslation } from 'react-i18next';

const YourCurrentFlight = (props) => {
    const flightDataDeparture = props.flightDataDeparture;
    const flightDataComeback = props.flightDataComeback;
    const [showSelectedFlight, setShowSelectedFlight] = useState(false);
    const [dataSelectedFlight, setDataSelectedFlight] = useState({});
    const [currentFlight, setCurrentFlight] = useState('');
    const [showDetailPrice, setShowDetailPrice] = useState(false);
    const { formatCurrency } = useFormatter();

    const { t } = useTranslation();
    const formatUtcToLocal = (utcStr, timezone, format = 'HH:mm') => {
        return dayjs.utc(utcStr).tz(timezone).format(format);
    };

    const handleShowViewSelectFlight = (flight, type) => {
        setShowSelectedFlight(true);
        setDataSelectedFlight(flight);
        setCurrentFlight(type);
    };

    const handleHideSelectedFlight = () => {
        setShowSelectedFlight(false);
    };

    if (Object.keys(flightDataDeparture).length > 0) {
        return (
            <div style={{ maxWidth: 'auto', position: 'sticky', top: '120px' }}>
                <div className="card shadow-sm">
                    <div className="card-body p-4 pt-3 pb-2">
                        <div className="d-flex align-items-center">
                            <h5 className="card-title mb-0 mt-0">
                                {t('yourCurrentFlight.yourFlight')}
                            </h5>
                        </div>
                        <hr className="mt-3"></hr>
                        {/* Date and Route */}
                        <div className="mb-2">
                            <div className="d-flex align-items-center mb-0">
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
                                <h6 className="text-primary mb-0">
                                    {
                                        flightDataDeparture.segments[0]
                                            .departure_airport_id.province
                                    }{' '}
                                    -{' '}
                                    {
                                        flightDataDeparture.segments[
                                            flightDataDeparture.segments
                                                .length - 1
                                        ].arrival_airport_id.province
                                    }
                                </h6>
                            </div>
                            <small
                                className="text-muted"
                                style={{ marginLeft: '32px' }}
                            >
                                {getDateOnly(
                                    flightDataDeparture.segments[0]
                                        .departure_time
                                )}
                            </small>
                        </div>
                        {Object.keys(flightDataDeparture).length > 0 && (
                            <div>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded d-flex align-items-center justify-content-center me-2">
                                            <img
                                                src={
                                                    flightDataDeparture.airline
                                                        .logo_url
                                                }
                                                style={{
                                                    width: '60px',
                                                    height: '20px',
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
                                                flightDataDeparture,
                                                'departure'
                                            )
                                        }
                                    >
                                        {t('yourCurrentFlight.details')}
                                    </a>
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="text-center">
                                        <div className="h5 mb-0">
                                            {formatUtcToLocal(
                                                flightDataDeparture.segments[0]
                                                    .departure_time,
                                                flightDataDeparture.segments[0]
                                                    .departure_airport_id
                                                    .time_zone,
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
                                            {flightDataDeparture.segments
                                                .length === 1
                                                ? `${t(
                                                      'yourCurrentFlight.directFlight'
                                                  )}`
                                                : flightDataDeparture.segments
                                                      .length === 2
                                                ? `${t(
                                                      'yourCurrentFlight.oneStop'
                                                  )}`
                                                : flightDataDeparture.segments
                                                      .length === 3
                                                ? `${t(
                                                      'yourCurrentFlight.twoStops'
                                                  )}`
                                                : `${t(
                                                      'yourCurrentFlight.threeStops'
                                                  )}`}
                                        </small>
                                    </div>

                                    <div className="text-center">
                                        <div className="h5 mb-0">
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
                            </div>
                        )}
                        <hr
                            className="mt-3 mb-3"
                            style={{ height: '0.5px' }}
                        ></hr>

                        {flightDataComeback &&
                            Object.keys(flightDataComeback).length > 0 && (
                                <div className="mb-2">
                                    <div className="d-flex align-items-center mb-0">
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
                                        <h6 className="text-primary mb-0">
                                            {
                                                flightDataComeback.segments[0]
                                                    .departure_airport_id
                                                    .province
                                            }{' '}
                                            -{' '}
                                            {
                                                flightDataComeback.segments[
                                                    flightDataComeback.segments
                                                        .length - 1
                                                ].arrival_airport_id.province
                                            }
                                        </h6>
                                    </div>
                                    <small
                                        className="text-muted"
                                        style={{ marginLeft: '32px' }}
                                    >
                                        {getDateOnly(
                                            flightDataComeback.segments[0]
                                                .departure_time
                                        )}
                                    </small>
                                </div>
                            )}
                        {/* Airline */}
                        {Object.keys(flightDataComeback).length > 0 && (
                            <div>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded d-flex align-items-center justify-content-center me-2">
                                            <img
                                                src={
                                                    flightDataComeback.airline
                                                        .logo_url
                                                }
                                                style={{
                                                    width: '60px',
                                                    height: '20px',
                                                }}
                                            ></img>
                                        </div>
                                        {/* <span className="fw-medium">
                                        {flightDataComeback.airline.name}
                                    </span> */}
                                    </div>
                                    <a
                                        className="text-primary text-decoration-none fw-medium"
                                        onClick={() =>
                                            handleShowViewSelectFlight(
                                                flightDataComeback,
                                                'comeback'
                                            )
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {t('yourCurrentFlight.details')}
                                    </a>
                                </div>

                                {/* Flight Times */}
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="text-center">
                                        <div className="h5 mb-0">
                                            {formatUtcToLocal(
                                                flightDataComeback.segments[0]
                                                    .departure_time,
                                                flightDataComeback.segments[0]
                                                    .departure_airport_id
                                                    .time_zon
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
                                            {flightDataComeback.segments
                                                .length === 1
                                                ? `${t(
                                                      'yourCurrentFlight.directFlight'
                                                  )}`
                                                : flightDataComeback.segments
                                                      .length === 2
                                                ? `${t(
                                                      'yourCurrentFlight.oneStop'
                                                  )}`
                                                : flightDataComeback.segments
                                                      .length === 3
                                                ? `${t(
                                                      'yourCurrentFlight.twoStops'
                                                  )}`
                                                : `${t(
                                                      'yourCurrentFlight.threeStops'
                                                  )}`}{' '}
                                        </small>
                                    </div>

                                    <div className="text-center">
                                        <div className="h5 mb-0">
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
                            </div>
                        )}
                    </div>

                    <FlightSelectedInformation
                        show={showSelectedFlight}
                        setShow={handleHideSelectedFlight}
                        dataFlight={dataSelectedFlight}
                        currentChooseSeatClass={
                            currentFlight === 'departure'
                                ? props.currentSeatClassDeparture
                                : props.currentSeatClassComeback
                        }
                    />
                </div>
                <div className="rounded border p-3 pb-2 mt-3 shadow-sm">
                    <div className="border-bottom mb-2">
                        <h5 className="mt-0 mb-2">
                            {t('yourCurrentFlight.summary')}
                        </h5>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <span
                            // className="text-muted"
                            style={{ fontWeight: '500' }}
                        >
                            {t('yourCurrentFlight.totalAmount')}
                        </span>
                        <div className="d-flex align-items-center gap-1">
                            <h6 className="text-primary mt-0 mb-0">
                                {formatCurrency(
                                    props.totalPriceFlightComeback +
                                        props.totalPriceFlightDeparture +
                                        props.totalBaggageComeback +
                                        props.totalBaggageDeparture +
                                        props.priceDetailSeatComeback +
                                        props.priceDetailSeatDeparture -
                                        props.discountValue
                                )}
                            </h6>
                            <div
                                className="d-flex align-items-center justify-content-center bg-secondary rounded-circle px-1"
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer',
                                }}
                                onClick={() =>
                                    setShowDetailPrice(!showDetailPrice)
                                }
                            >
                                <FaArrowDown
                                    style={{ fontSize: '11px' }}
                                    color="white"
                                />
                            </div>
                        </div>
                    </div>

                    {showDetailPrice && (
                        <div>
                            <hr className="mt-2 mb-2"></hr>

                            <div className="d-flex justify-content-between align-items-center">
                                <span
                                    className="text-muted"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {t('yourCurrentFlight.departureTicket')}
                                </span>
                                <span
                                    className="text-primary"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {formatCurrency(
                                        props.totalPriceFlightDeparture
                                    )}
                                </span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <span
                                    className="text-muted"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {t('yourCurrentFlight.returnTicket')}
                                </span>
                                <span
                                    className="text-primary"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {formatCurrency(
                                        props.totalPriceFlightComeback
                                    )}
                                </span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <span
                                    className="text-muted"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {t('yourCurrentFlight.departureBaggage')}
                                </span>
                                <span
                                    className="text-primary"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {formatCurrency(
                                        props.totalBaggageDeparture
                                    )}
                                </span>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <span
                                    className="text-muted"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {t('yourCurrentFlight.returnBaggage')}
                                </span>
                                <span
                                    className="text-primary"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {formatCurrency(props.totalBaggageComeback)}
                                </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span
                                    className="text-muted"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {t('yourCurrentFlight.selectDepartureSeat')}
                                </span>
                                <span
                                    className="text-primary"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {formatCurrency(
                                        props.priceDetailSeatDeparture
                                    )}
                                </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span
                                    className="text-muted"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {t('yourCurrentFlight.selectReturnSeat')}
                                </span>
                                <span
                                    className="text-primary"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {formatCurrency(
                                        props.priceDetailSeatComeback
                                    )}
                                </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span
                                    className="text-muted"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {t('yourCurrentFlight.discountAmount')}
                                </span>
                                <span
                                    className="text-primary"
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '15px',
                                    }}
                                >
                                    {formatCurrency(props.discountValue)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    } else {
        return <></>;
    }
};

export default YourCurrentFlight;
