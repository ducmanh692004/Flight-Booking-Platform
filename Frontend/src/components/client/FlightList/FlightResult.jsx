import React from 'react';
import { getHourMinute, getFlightDuration } from '../../../utils/myFunction';
import { useFormatter } from '../../hooks/useFomatter';
import { useState } from 'react';
import dayjs from 'dayjs';
import FlightInformation from './FlightInformation/FlightInformation';
import FlightRefund from './FlightInformation/FlightRefund';
import FlightChange from './FlightInformation/FlightChange';
import FlightPromotion from './FlightInformation/FlightPromotion';
import { useTranslation } from 'react-i18next';

const FlightResult = (props) => {
    const { t } = useTranslation();
    const flightData = props.flightData;
    const { formatCurrency } = useFormatter();

    const defaultShowChildComponent = {
        flightChange: false,
        flightInformation: false,
        flightPromotion: false,
        flightRefund: false,
    };

    const [showChildComponent, setShowChildComponent] = useState(
        defaultShowChildComponent
    );

    const [dataChildComponent, setDataChildComponent] = useState({});

    const formatUtcToLocal = (utcStr, timezone, format = 'HH:mm') => {
        return dayjs.utc(utcStr).tz(timezone).format(format);
    };

    const handleChangeComponentInformation = (
        componentName,
        flightInformation
    ) => {
        if (dataChildComponent._id !== flightInformation._id) {
            setShowChildComponent(defaultShowChildComponent);
        }

        if (componentName === 'A') {
            setShowChildComponent((prev) => ({
                ...defaultShowChildComponent,
                flightInformation: !prev.flightInformation,
            }));
            setDataChildComponent(flightInformation);
        } else if (componentName === 'B') {
            setShowChildComponent((prev) => ({
                ...defaultShowChildComponent,
                flightRefund: !prev.flightRefund,
            }));
            setDataChildComponent(flightInformation);
        } else if (componentName === 'C') {
            setShowChildComponent((prev) => ({
                ...defaultShowChildComponent,
                flightChange: !prev.flightChange,
            }));
            setDataChildComponent(flightInformation);
        } else if (componentName === 'D') {
            setShowChildComponent((prev) => ({
                ...defaultShowChildComponent,
                flightPromotion: !prev.flightPromotion,
            }));
            setDataChildComponent(flightInformation);
        }
    };

    return (
        <div className="container-fluid px-0 py-3">
            <div className="row">
                <div className="col-12">
                    <div className="flight-results d-flex flex-column justify-content-center">
                        {flightData && flightData.length > 0 ? (
                            flightData.map((flight) => (
                                <div
                                    key={flight._id}
                                    className="flight-card p-3 bg-light mb-2 rounded shadow-sm border border-gray-800"
                                    style={{
                                        border: '1px solid',
                                    }}
                                >
                                    <div className="row align-items-center">
                                        <div className="col-md-8">
                                            <div className="row align-items-center">
                                                <div className="col-auto">
                                                    <div className="d-flex align-items-center mb-2 gap-2">
                                                        <img
                                                            style={{
                                                                width: '60px',
                                                                height: '20px',
                                                            }}
                                                            src={
                                                                flight.airline
                                                                    .logo_url
                                                            }
                                                        />
                                                        <span className="fw-semibold">
                                                            {
                                                                flight.airline
                                                                    .name
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row align-items-center mb-3">
                                                <div className="col-auto">
                                                    <div className="flight-time">
                                                        {formatUtcToLocal(
                                                            flight.segments[0]
                                                                .departure_time,
                                                            flight.segments[0]
                                                                .departure_airport_id
                                                                .time_zon
                                                        )}
                                                    </div>
                                                    <div className="flight-route">
                                                        {
                                                            flight.segments[0]
                                                                .departure_airport_id
                                                                .code
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-auto px-2">
                                                    <div className="text-center">
                                                        <div className="flight-duration">
                                                            {getFlightDuration(
                                                                flight
                                                                    .segments[0]
                                                                    .departure_time,
                                                                flight.segments[
                                                                    flight
                                                                        .segments
                                                                        .length -
                                                                        1
                                                                ].arrival_time
                                                            )}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '12px',
                                                                color: '#6c757d',
                                                            }}
                                                        >
                                                            {flight.segments
                                                                .length === 1
                                                                ? `${t(
                                                                      'yourFlight.directFlight'
                                                                  )}`
                                                                : flight
                                                                      .segments
                                                                      .length ===
                                                                  2
                                                                ? `${t(
                                                                      'yourFlight.oneStop'
                                                                  )}`
                                                                : flight
                                                                      .segments
                                                                      .length ===
                                                                  3
                                                                ? `${t(
                                                                      'yourFlight.twoStops'
                                                                  )}`
                                                                : `${t(
                                                                      'yourFlight.threeStops'
                                                                  )}`}
                                                        </div>
                                                        <div className="d-flex justify-content-center align-items-center mt-1">
                                                            <div
                                                                style={{
                                                                    width: '60px',
                                                                    height: '1px',
                                                                    background:
                                                                        '#dee2e6',
                                                                }}
                                                            ></div>
                                                            <i
                                                                className="bi bi-airplane"
                                                                style={{
                                                                    fontSize:
                                                                        '12px',
                                                                    color: '#6c757d',
                                                                    margin: '0 4px',
                                                                }}
                                                            ></i>
                                                            <div
                                                                style={{
                                                                    width: '60px',
                                                                    height: '1px',
                                                                    background:
                                                                        '#dee2e6',
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <div className="flight-time">
                                                        {formatUtcToLocal(
                                                            flight.segments[
                                                                flight.segments
                                                                    .length - 1
                                                            ].arrival_time,
                                                            flight.segments[
                                                                flight.segments
                                                                    .length - 1
                                                            ].arrival_airport_id
                                                                .time_zon
                                                        )}
                                                    </div>
                                                    <div className="d-flex justify-content-center align-items-center gap-2">
                                                        <div className="flight-route">
                                                            {
                                                                flight.segments[
                                                                    flight
                                                                        .segments
                                                                        .length -
                                                                        1
                                                                ]
                                                                    .arrival_airport_id
                                                                    .code
                                                            }
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '10px',
                                                                color: '#6c757d',
                                                            }}
                                                        >
                                                            {/* +1 ngày */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2">
                                                <div className="d-flex gap-3 small text-muted">
                                                    <span
                                                        className="text-decoration-underline"
                                                        onClick={() =>
                                                            handleChangeComponentInformation(
                                                                'A',
                                                                flight
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'flightResult.detail'
                                                        )}
                                                    </span>
                                                    <span
                                                        className="text-decoration-underline"
                                                        onClick={() =>
                                                            handleChangeComponentInformation(
                                                                'B',
                                                                flight
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'flightResult.refund'
                                                        )}
                                                    </span>
                                                    <span
                                                        className="text-decoration-underline"
                                                        onClick={() =>
                                                            handleChangeComponentInformation(
                                                                'C',
                                                                flight
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'flightResult.changeFlight'
                                                        )}
                                                    </span>
                                                    <span
                                                        className="text-decoration-underline"
                                                        onClick={() =>
                                                            handleChangeComponentInformation(
                                                                'D',
                                                                flight
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'flightResult.promotions'
                                                        )}{' '}
                                                        🎁
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 text-end">
                                            <div className="flight-price mb-2">
                                                {flight.price} {flight.currency}
                                                <span
                                                    className="small fw-normal text-primary"
                                                    style={{
                                                        fontWeight: 700,
                                                        fontSize: '17px',
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        flight.seats_quantity[0]
                                                            .price
                                                            .$numberDecimal
                                                    )}
                                                    /
                                                    {t(
                                                        'confirmUserFlight.perPerson'
                                                    )}
                                                </span>
                                            </div>
                                            <button
                                                className="btn btn-primary btn-choose text-white"
                                                onClick={() =>
                                                    props.handleChooseFlight(
                                                        flight
                                                    )
                                                }
                                            >
                                                {t('flightResult.select')}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-3 content-render">
                                        {/* <hr></hr> */}
                                        {showChildComponent.flightChange &&
                                            (dataChildComponent._id ===
                                                flight._id) ===
                                                true && (
                                                <FlightChange
                                                    dataFlight={
                                                        dataChildComponent
                                                    }
                                                />
                                            )}
                                        {showChildComponent.flightInformation &&
                                            (dataChildComponent._id ===
                                                flight._id) ===
                                                true && (
                                                <FlightInformation
                                                    dataFlight={
                                                        dataChildComponent
                                                    }
                                                />
                                            )}
                                        {showChildComponent.flightRefund &&
                                            (dataChildComponent._id ===
                                                flight._id) ===
                                                true && (
                                                <FlightRefund
                                                    dataFlight={
                                                        dataChildComponent
                                                    }
                                                />
                                            )}
                                        {showChildComponent.flightPromotion &&
                                            (dataChildComponent._id ===
                                                flight._id) ===
                                                true && (
                                                <FlightPromotion
                                                    dataFlight={
                                                        dataChildComponent
                                                    }
                                                />
                                            )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div
                                className="bg-warning p-2 rounded d-flex justify-content-center align-items-center"
                                style={{
                                    width: 'fit-content',
                                    marginRight: 'auto',
                                    marginLeft: 'auto',
                                    marginTop: '30px',
                                }}
                            >
                                <h6 className="mb-0">
                                    {t('flightResult.noFlightsFound')}
                                </h6>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightResult;
