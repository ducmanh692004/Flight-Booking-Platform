import { useEffect, useState } from 'react';
import { LuBaggageClaim } from 'react-icons/lu';
import {
    Modal,
    Button,
    Form,
    Card,
    Row,
    Col,
    Container,
    Badge,
} from 'react-bootstrap';
import { BsSuitcaseFill } from 'react-icons/bs';
import { FaSuitcase } from 'react-icons/fa';
import { useFormatter } from '../../../hooks/useFomatter';
import { useTranslation } from 'react-i18next';

const SelectMoreBaggage = (props) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [show, setShow] = useState(false);
    const [currentSelect, setCurrentSelect] = useState('departure');
    const [departureBaggePrice, setDepartureBaggagePrice] = useState(0);
    const [comebackBaggePrice, setComebackBaggagePrice] = useState(0);
    // const [totalPrice, setTotalPrice] = useState(0);
    const [totalPriceDeparture, setTotalPriceDeparture] = useState(0);
    const [totalPriceComeback, setTotalPriceComeback] = useState(0);
    const [kgDeparture, setKgDeparture] = useState(0);
    const [kgComeback, setKgComeback] = useState(0);
    const { formatCurrency } = useFormatter();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const toggleBaggage = (optionIndex) => {
        setSelectedOptions((prev) =>
            prev.includes(optionIndex)
                ? prev.filter((i) => i !== optionIndex)
                : [...prev, optionIndex]
        );
    };
    const { t } = useTranslation();

    const handleChange = (field) => {
        if (field === 'departure') {
            setCurrentSelect('departure');
        } else if (field === 'comeback') {
            setCurrentSelect('comeback');
        }
    };

    const setPriceToBaggage = () => {
        if (Array.isArray(props.dataFlightDeparture.seats_quantity)) {
            for (
                let i = 0;
                i < props.dataFlightDeparture.seats_quantity.length;
                i++
            ) {
                if (
                    props.dataFlightDeparture.seats_quantity[i].seat_class_id
                        ._id === props.currentSeatClassDeparture._id
                ) {
                    // console.log(
                    //     'okkk departure!!!',
                    //     props.dataFlightDeparture.seats_quantity[i]
                    //         .price_baggage.$numberDecimal
                    // );
                    setDepartureBaggagePrice(
                        Number(
                            props.dataFlightDeparture.seats_quantity[i]
                                .price_baggage.$numberDecimal
                        )
                    );

                    setKgDeparture(
                        Number(
                            props.dataFlightDeparture.seats_quantity[i]
                                .free_baggage
                        )
                    );
                }
            }
        }

        if (Array.isArray(props.dataFlightComeback.seats_quantity)) {
            for (
                let i = 0;
                i < props.dataFlightComeback.seats_quantity.length;
                i++
            ) {
                if (
                    props.dataFlightComeback.seats_quantity[i].seat_class_id
                        ._id === props.currentSeatClassComeback._id
                ) {
                    // console.log('okkk comeback!!!');
                    // console.log(
                    //     'noooooooooo',
                    //     props.dataFlightComeback.seats_quantity[i]
                    // );
                    setComebackBaggagePrice(
                        Number(
                            props.dataFlightComeback.seats_quantity[i]
                                .price_baggage.$numberDecimal
                        )
                    );

                    setKgComeback(
                        Number(
                            props.dataFlightComeback.seats_quantity[i]
                                .free_baggage
                        )
                    );
                    // break;
                }
            }
        }
    };

    const calculateTotalPrice = () => {
        if (
            Array.isArray(props.currentDepartureBaggage.adults) &&
            props.currentDepartureBaggage.adults.length > 0
        ) {
            let currentTotal = 0;
            for (
                let i = 0;
                i < props.currentDepartureBaggage.adults.length;
                i++
            ) {
                if (props.currentDepartureBaggage.adults[i].baggage > 1) {
                    currentTotal +=
                        (props.currentDepartureBaggage.adults[i].baggage - 1) *
                        departureBaggePrice;
                }
            }
            if (props.currentDepartureBaggage.child.length > 0) {
                for (
                    let j = 0;
                    j < props.currentDepartureBaggage.child.length;
                    j++
                ) {
                    if (props.currentDepartureBaggage.child[j].baggage > 1) {
                        currentTotal +=
                            (props.currentDepartureBaggage.child[j].baggage -
                                1) *
                            departureBaggePrice;
                    }
                }
            }

            setTotalPriceDeparture(currentTotal);
            props.handleSetPriceBaggage('departure', currentTotal);
        }

        if (
            Array.isArray(props.currentComebackBaggage.adults) &&
            props.currentComebackBaggage.adults.length > 0
        ) {
            let currentTotal = 0;
            for (
                let i = 0;
                i < props.currentComebackBaggage.adults.length;
                i++
            ) {
                if (props.currentComebackBaggage.adults[i].baggage > 1) {
                    currentTotal +=
                        (props.currentComebackBaggage.adults[i].baggage - 1) *
                        comebackBaggePrice;
                }
            }

            if (props.currentComebackBaggage.child.length > 0) {
                for (
                    let j = 0;
                    j < props.currentComebackBaggage.child.length;
                    j++
                ) {
                    if (props.currentComebackBaggage.child[j].baggage > 1) {
                        currentTotal +=
                            (props.currentComebackBaggage.child[j].baggage -
                                1) *
                            comebackBaggePrice;
                    }
                }
            }

            setTotalPriceComeback(currentTotal);
            props.handleSetPriceBaggage('comeback', currentTotal);
        }
    };

    useEffect(() => {
        setPriceToBaggage();
    }, [
        props.dataFlightDeparture,
        props.dataFlightComeback,
        props.currentSeatClassDeparture,
        props.currentSeatClassComeback,
    ]);

    useEffect(() => {
        calculateTotalPrice();
    }, [props.currentDepartureBaggage, props.currentComebackBaggage]);

    if (props.dataFlightDeparture) {
        return (
            <div className="shadow-sm mt-4">
                <div
                    className="card"
                    style={{
                        background:
                            'linear-gradient(135deg, #c5f3f5ff 0%, #d8fcddff 100%)',
                        border: '1px solid #B3E5E5',
                    }}
                >
                    <div className="card-body p-4">
                        <h5 className="card-title mb-3 text-dark fw-semibold">
                            {/* {{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: '#2D3748',
                        }} */}
                            {t('baggage.flightEssentials')}
                        </h5>

                        <div className="row">
                            <div className="col-12">
                                <div
                                    className="card mb-3"
                                    style={{
                                        backgroundColor: 'white',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <div className="card-body p-3">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="me-3">
                                                <LuBaggageClaim className="fs-3" />
                                            </div>
                                            <div>
                                                <h5
                                                    className="mb-1"
                                                    style={{
                                                        fontSize: '18px',
                                                        fontWeight: '600',
                                                        color: '#2D3748',
                                                    }}
                                                >
                                                    {t('baggage.title')}
                                                </h5>
                                                <p
                                                    className="mb-0"
                                                    style={{
                                                        fontSize: '14px',
                                                        color: '#718096',
                                                    }}
                                                >
                                                    {t(
                                                        'baggage.flightsHaveBaggageInfo'
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <p
                                                className="mb-2"
                                                style={{
                                                    fontSize: '14px',
                                                    color: '#D69E2E',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                {t(
                                                    'baggage.segmentsWithoutBaggage'
                                                )}
                                            </p>

                                            <div className="row">
                                                <div className="col-md-6 mb-2">
                                                    <div
                                                        className="p-3"
                                                        style={{
                                                            backgroundColor:
                                                                '#F7FAFC',
                                                            border: '1px solid #E2E8F0',
                                                            borderRadius: '6px',
                                                        }}
                                                    >
                                                        {Array.isArray(
                                                            props
                                                                .dataFlightDeparture
                                                                .segments
                                                        ) && (
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div
                                                                    style={{
                                                                        fontSize:
                                                                            '14px',
                                                                        fontWeight:
                                                                            '500',
                                                                        color: '#2D3748',
                                                                    }}
                                                                >
                                                                    1.{' '}
                                                                    {
                                                                        props
                                                                            .dataFlightDeparture
                                                                            .segments[0]
                                                                            .departure_airport_id
                                                                            .code
                                                                    }{' '}
                                                                    -{' '}
                                                                    {
                                                                        props
                                                                            .dataFlightDeparture
                                                                            .segments[
                                                                            props
                                                                                .dataFlightDeparture
                                                                                .segments
                                                                                .length -
                                                                                1
                                                                        ]
                                                                            .arrival_airport_id
                                                                            .code
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {Array.isArray(
                                                    props.dataFlightComeback
                                                        .segments
                                                ) && (
                                                    <div className="col-md-6 mb-2">
                                                        <div
                                                            className="p-3"
                                                            style={{
                                                                backgroundColor:
                                                                    '#F7FAFC',
                                                                border: '1px solid #E2E8F0',
                                                                borderRadius:
                                                                    '6px',
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div
                                                                    style={{
                                                                        fontSize:
                                                                            '14px',
                                                                        fontWeight:
                                                                            '500',
                                                                        color: '#2D3748',
                                                                    }}
                                                                >
                                                                    2.{' '}
                                                                    {
                                                                        props
                                                                            .dataFlightComeback
                                                                            .segments[0]
                                                                            .departure_airport_id
                                                                            .code
                                                                    }{' '}
                                                                    -{' '}
                                                                    {
                                                                        props
                                                                            .dataFlightComeback
                                                                            .segments[
                                                                            props
                                                                                .dataFlightComeback
                                                                                .segments
                                                                                .length -
                                                                                1
                                                                        ]
                                                                            .arrival_airport_id
                                                                            .code
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center gap-2">
                                                <span
                                                    style={{
                                                        fontSize: '14px',
                                                        color: '#718096',
                                                    }}
                                                >
                                                    {t('search.from')}{' '}
                                                </span>
                                                {Array.isArray(
                                                    props.dataFlightDeparture
                                                        .segments
                                                ) && (
                                                    <div>
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    '17px',
                                                                fontWeight:
                                                                    '600',
                                                                color: '#E53E3E',
                                                            }}
                                                        >
                                                            {formatCurrency(
                                                                (() => {
                                                                    const found =
                                                                        props.dataFlightDeparture.seats_quantity.find(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                props
                                                                                    .currentSeatClassDeparture
                                                                                    ._id ===
                                                                                item
                                                                                    .seat_class_id
                                                                                    ._id
                                                                        );
                                                                    return found
                                                                        ? Number(
                                                                              found
                                                                                  .price_baggage
                                                                                  .$numberDecimal
                                                                          )
                                                                        : 0;
                                                                })()
                                                            )}{' '}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    '14px',
                                                                color: '#718096',
                                                            }}
                                                        >
                                                            {t(
                                                                'baggage.whenAddingOnePiece'
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                className="btn d-flex align-items-center"
                                                style={{
                                                    backgroundColor:
                                                        'transparent',
                                                    border: 'none',
                                                    color: '#4A9EFF',
                                                    fontSize: '16px',
                                                    fontWeight: '500',
                                                    padding: '0',
                                                }}
                                                onClick={() => handleShow()}
                                            >
                                                {t('payment.select')}
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="ms-1"
                                                >
                                                    <path
                                                        d="M9 18L15 12L9 6"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={show} onHide={handleClose} size="xl" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('baggage.addBaggage')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex col-12">
                            <div className="col-4 p-2">
                                <div
                                    className="rounded d-flex flex-column gap-2 p-4"
                                    style={{
                                        border: '1px solid rgb(185, 186, 187)',
                                    }}
                                >
                                    <h5>{t('baggage.selectFlight')}</h5>
                                    <hr className="mt-0 mb-2"></hr>
                                    <Button
                                        variant={
                                            currentSelect === 'departure'
                                                ? 'primary'
                                                : 'outline-primary'
                                        }
                                        onClick={() =>
                                            handleChange('departure')
                                        }
                                    >
                                        <span>{t('flightType.departure')}</span>
                                        <hr className="mt-2 mb-2"></hr>
                                        <h6>
                                            {Array.isArray(
                                                props.dataFlightDeparture
                                                    .segments
                                            ) && (
                                                <>
                                                    {
                                                        props
                                                            .dataFlightDeparture
                                                            .segments[0]
                                                            ?.departure_airport_id
                                                            ?.province
                                                    }
                                                    {' - '}
                                                    {
                                                        props
                                                            .dataFlightDeparture
                                                            .segments[
                                                            props
                                                                .dataFlightDeparture
                                                                .segments
                                                                .length - 1
                                                        ]?.arrival_airport_id
                                                            ?.province
                                                    }
                                                </>
                                            )}
                                        </h6>
                                    </Button>
                                    {Array.isArray(
                                        props.dataFlightComeback.seats_quantity
                                    ) > 0 && (
                                        <Button
                                            variant={
                                                currentSelect === 'comeback'
                                                    ? 'primary'
                                                    : 'outline-primary'
                                            }
                                            onClick={() =>
                                                handleChange('comeback')
                                            }
                                        >
                                            <span>
                                                {t('flightType.return')}
                                            </span>
                                            <hr className="mt-2 mb-2"></hr>
                                            <h6>
                                                {Array.isArray(
                                                    props.dataFlightComeback
                                                        .segments
                                                ) && (
                                                    <>
                                                        {
                                                            props
                                                                .dataFlightComeback
                                                                .segments[0]
                                                                ?.departure_airport_id
                                                                ?.province
                                                        }
                                                        {' - '}
                                                        {
                                                            props
                                                                .dataFlightComeback
                                                                .segments[
                                                                props
                                                                    .dataFlightComeback
                                                                    .segments
                                                                    .length - 1
                                                            ]
                                                                ?.arrival_airport_id
                                                                ?.province
                                                        }
                                                    </>
                                                )}
                                            </h6>{' '}
                                        </Button>
                                    )}
                                </div>
                                <div
                                    className="mt-3 p-3 px-4 rounded"
                                    style={{
                                        border: '1px solid rgb(185, 186, 187)',
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span style={{ fontWeight: '500' }}>
                                            {t('baggage.departureBaggage')}
                                        </span>
                                        <span
                                            className="text-primary"
                                            style={{ fontWeight: '500' }}
                                        >
                                            {formatCurrency(
                                                totalPriceDeparture
                                            )}
                                        </span>
                                    </div>
                                    <hr className="mt-2 mb-2"></hr>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <span style={{ fontWeight: '500' }}>
                                            {t('baggage.returnBaggage')}
                                        </span>
                                        <span
                                            className="text-primary"
                                            style={{ fontWeight: '500' }}
                                        >
                                            {formatCurrency(totalPriceComeback)}
                                        </span>
                                    </div>

                                    <hr className="mt-2 mb-2"></hr>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <span style={{ fontWeight: '500' }}>
                                            {t('yourCurrentFlight.totalAmount')}
                                        </span>
                                        <span
                                            className="text-primary"
                                            style={{ fontWeight: '500' }}
                                        >
                                            {formatCurrency(
                                                totalPriceComeback +
                                                    totalPriceDeparture
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-8 p-2">
                                <div
                                    className="rounded d-flex flex-column gap-2 p-4"
                                    style={{
                                        border: '1px solid rgb(185, 186, 187)',
                                    }}
                                >
                                    {Array.isArray(
                                        props.dataFlightDeparture.segments
                                    ) && (
                                        <h6
                                            className="bg-primary p-2 px-2 rounded text-white"
                                            style={{ width: 'fit-content' }}
                                        >
                                            {currentSelect === 'departure'
                                                ? props.dataFlightDeparture
                                                      .segments[0]
                                                      .departure_airport_id
                                                      .province
                                                : props.dataFlightComeback
                                                      .segments[0]
                                                      .departure_airport_id
                                                      .province}{' '}
                                            {' - '}
                                            {currentSelect === 'departure'
                                                ? props.dataFlightDeparture
                                                      .segments[
                                                      props.dataFlightDeparture
                                                          .segments.length - 1
                                                  ].arrival_airport_id.province
                                                : props.dataFlightComeback
                                                      .segments[
                                                      props.dataFlightComeback
                                                          .segments.length - 1
                                                  ].arrival_airport_id
                                                      .province}{' '}
                                        </h6>
                                    )}

                                    <hr className="mt-0 mb-2"></hr>

                                    <div
                                        className="d-flex flex-column gap-2"
                                        style={{
                                            overflowY: 'auto',
                                            maxHeight: '55vh',
                                        }}
                                    >
                                        {Object.keys(props.peopleQuantity || {})
                                            .length > 0 &&
                                            Array.from({
                                                length:
                                                    props.peopleQuantity
                                                        .adult || 0,
                                            }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="d-flex flex-column gap-2 rounded p-3"
                                                    style={{
                                                        border: '1px solid rgb(185, 186, 187)',
                                                    }}
                                                >
                                                    <div className="d-flex flex-column">
                                                        <span
                                                            className="mt-0 mb-0 text-muted"
                                                            style={{
                                                                fontWeight: 500,
                                                                fontSize:
                                                                    '14px',
                                                            }}
                                                        >
                                                            {t(
                                                                'baggage.passengers'
                                                            )}{' '}
                                                            {i + 1}/
                                                            {props
                                                                .peopleQuantity
                                                                .adult +
                                                                props
                                                                    .peopleQuantity
                                                                    .child}
                                                        </span>
                                                        <span
                                                            className="mt-0 mb-0"
                                                            style={{
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            {t('search.adult')}{' '}
                                                            {i + 1}
                                                        </span>
                                                    </div>
                                                    <hr
                                                        className="mt-0 mb-0"
                                                        style={{
                                                            height: '0.5px',
                                                        }}
                                                    ></hr>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                                            <FaSuitcase className="text-primary" />
                                                            <div className="d-flex flex-column">
                                                                <span
                                                                    className="text-muted"
                                                                    style={{
                                                                        fontWeight: 500,
                                                                        fontSize:
                                                                            '14px',
                                                                    }}
                                                                >
                                                                    {t(
                                                                        'baggage.includedFree'
                                                                    )}
                                                                </span>
                                                                <h6>
                                                                    1{' '}
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}{' '}
                                                                    (
                                                                    {
                                                                        kgDeparture
                                                                    }{' '}
                                                                    kg/
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}
                                                                    )
                                                                </h6>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                                            <div className="d-flex flex-column">
                                                                <span
                                                                    className="text-muted"
                                                                    style={{
                                                                        fontWeight: 500,
                                                                        fontSize:
                                                                            '14px',
                                                                    }}
                                                                >
                                                                    {t(
                                                                        'baggage.totalBaggage'
                                                                    )}
                                                                </span>
                                                                <h6>
                                                                    {currentSelect ===
                                                                    'departure'
                                                                        ? props
                                                                              .currentDepartureBaggage
                                                                              .adults[
                                                                              i
                                                                          ]
                                                                              .baggage
                                                                        : props
                                                                              .currentComebackBaggage
                                                                              .adults[
                                                                              i
                                                                          ]
                                                                              .baggage}{' '}
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}{' '}
                                                                    (
                                                                    {
                                                                        kgDeparture
                                                                    }{' '}
                                                                    kg/{' '}
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}
                                                                    )
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column gap-2">
                                                        <Button
                                                            variant={
                                                                (currentSelect ===
                                                                    'departure' &&
                                                                    props
                                                                        .currentDepartureBaggage
                                                                        .adults[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        1) ||
                                                                (currentSelect ===
                                                                    'comeback' &&
                                                                    props
                                                                        .currentComebackBaggage
                                                                        .adults[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        1)
                                                                    ? 'outline-primary'
                                                                    : 'outline-secondary'
                                                            }
                                                            className="d-flex align-items-center justify-content-between w-100 p-1 px-2"
                                                            style={{
                                                                borderWidth:
                                                                    '2px',
                                                            }}
                                                            onClick={() =>
                                                                props.handleChangeBaggage(
                                                                    'adults',
                                                                    i,
                                                                    currentSelect,
                                                                    1
                                                                )
                                                            }
                                                        >
                                                            <div className="d-flex gap-1 align-items-center">
                                                                <BsSuitcaseFill className="mb-0 mt-0" />
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            '14px',
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    1{' '}
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        '14px',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {' '}
                                                                {t(
                                                                    'baggage.free'
                                                                )}
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            variant={
                                                                (currentSelect ===
                                                                    'departure' &&
                                                                    props
                                                                        .currentDepartureBaggage
                                                                        .adults[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        2) ||
                                                                (currentSelect ===
                                                                    'comeback' &&
                                                                    props
                                                                        .currentComebackBaggage
                                                                        .adults[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        2)
                                                                    ? 'outline-primary'
                                                                    : 'outline-secondary'
                                                            }
                                                            className="d-flex align-items-center justify-content-between w-100 p-1 px-2"
                                                            style={{
                                                                borderWidth:
                                                                    '2px',
                                                            }}
                                                            onClick={() =>
                                                                props.handleChangeBaggage(
                                                                    'adults',
                                                                    i,
                                                                    currentSelect,
                                                                    2
                                                                )
                                                            }
                                                        >
                                                            <div className="d-flex gap-1 align-items-center">
                                                                <div className="d-flex justify-content-center align-items-center">
                                                                    <BsSuitcaseFill className="mb-0 mt-0" />
                                                                    <BsSuitcaseFill className="mb-0 mt-0" />
                                                                </div>

                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            '14px',
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    2{' '}
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        '14px',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {' '}
                                                                {currentSelect ===
                                                                'departure'
                                                                    ? formatCurrency(
                                                                          departureBaggePrice *
                                                                              1
                                                                      )
                                                                    : formatCurrency(
                                                                          comebackBaggePrice *
                                                                              1
                                                                      )}
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            variant={
                                                                (currentSelect ===
                                                                    'departure' &&
                                                                    props
                                                                        .currentDepartureBaggage
                                                                        .adults[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        3) ||
                                                                (currentSelect ===
                                                                    'comeback' &&
                                                                    props
                                                                        .currentComebackBaggage
                                                                        .adults[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        3)
                                                                    ? 'outline-primary'
                                                                    : 'outline-secondary'
                                                            }
                                                            className="d-flex align-items-center justify-content-between w-100 p-1 px-2"
                                                            style={{
                                                                borderWidth:
                                                                    '2px',
                                                            }}
                                                            onClick={() =>
                                                                props.handleChangeBaggage(
                                                                    'adults',
                                                                    i,
                                                                    currentSelect,
                                                                    3
                                                                )
                                                            }
                                                        >
                                                            <div className="d-flex gap-1 align-items-center">
                                                                <div className="d-flex justify-content-center align-items-center">
                                                                    <BsSuitcaseFill className="mb-0 mt-0" />
                                                                    <BsSuitcaseFill className="mb-0 mt-0" />
                                                                    <BsSuitcaseFill className="mb-0 mt-0" />
                                                                </div>{' '}
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            '14px',
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    3{' '}
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        '14px',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {' '}
                                                                {currentSelect ===
                                                                'departure'
                                                                    ? formatCurrency(
                                                                          departureBaggePrice *
                                                                              2
                                                                      )
                                                                    : formatCurrency(
                                                                          comebackBaggePrice *
                                                                              2
                                                                      )}
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        {Object.keys(props.peopleQuantity || {})
                                            .length > 0 &&
                                            Array.from({
                                                length:
                                                    props.peopleQuantity
                                                        .child || 0,
                                            }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="d-flex flex-column gap-2 rounded p-3"
                                                    style={{
                                                        border: '1px solid rgb(185, 186, 187)',
                                                    }}
                                                >
                                                    <div className="d-flex flex-column">
                                                        <span
                                                            className="mt-0 mb-0 text-muted"
                                                            style={{
                                                                fontWeight: 500,
                                                                fontSize:
                                                                    '14px',
                                                            }}
                                                        >
                                                            {t(
                                                                'baggage.passengers'
                                                            )}{' '}
                                                            {props
                                                                .peopleQuantity
                                                                .adult +
                                                                i +
                                                                1}
                                                            /
                                                            {props
                                                                .peopleQuantity
                                                                .adult +
                                                                props
                                                                    .peopleQuantity
                                                                    .child}
                                                        </span>
                                                        <span
                                                            className="mt-0 mb-0"
                                                            style={{
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            {t(
                                                                'passengerInfo.child'
                                                            )}{' '}
                                                            {i + 1}
                                                        </span>
                                                    </div>
                                                    <hr
                                                        className="mt-0 mb-0"
                                                        style={{
                                                            height: '0.5px',
                                                        }}
                                                    ></hr>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                                            <FaSuitcase className="text-primary" />
                                                            <div className="d-flex flex-column">
                                                                <span
                                                                    className="text-muted"
                                                                    style={{
                                                                        fontWeight: 500,
                                                                        fontSize:
                                                                            '14px',
                                                                    }}
                                                                >
                                                                    {t(
                                                                        'baggage.includedFree'
                                                                    )}
                                                                </span>
                                                                <h6>
                                                                    {' '}
                                                                    {t(
                                                                        'baggage.onePiece'
                                                                    )}{' '}
                                                                    (
                                                                    {
                                                                        kgDeparture
                                                                    }{' '}
                                                                    kg/
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}
                                                                    )
                                                                </h6>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                                            <div className="d-flex flex-column">
                                                                <span
                                                                    className="text-muted"
                                                                    style={{
                                                                        fontWeight: 500,
                                                                        fontSize:
                                                                            '14px',
                                                                    }}
                                                                >
                                                                    {t(
                                                                        'baggage.totalBaggage'
                                                                    )}
                                                                </span>
                                                                <h6>
                                                                    {currentSelect ===
                                                                    'departure'
                                                                        ? props
                                                                              .currentDepartureBaggage
                                                                              .child[
                                                                              i
                                                                          ]
                                                                              .baggage
                                                                        : props
                                                                              .currentComebackBaggage
                                                                              .child[
                                                                              i
                                                                          ]
                                                                              .baggage}{' '}
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}{' '}
                                                                    (
                                                                    {
                                                                        kgDeparture
                                                                    }{' '}
                                                                    kg/
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}
                                                                    )
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column gap-2">
                                                        <Button
                                                            variant={
                                                                (currentSelect ===
                                                                    'departure' &&
                                                                    props
                                                                        .currentDepartureBaggage
                                                                        .child[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        1) ||
                                                                (currentSelect ===
                                                                    'comeback' &&
                                                                    props
                                                                        .currentComebackBaggage
                                                                        .child[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        1)
                                                                    ? 'outline-primary'
                                                                    : 'outline-secondary'
                                                            }
                                                            className="d-flex align-items-center justify-content-between w-100 p-1 px-2"
                                                            style={{
                                                                borderWidth:
                                                                    '2px',
                                                            }}
                                                            onClick={() =>
                                                                props.handleChangeBaggage(
                                                                    'child',
                                                                    i,
                                                                    currentSelect,
                                                                    1
                                                                )
                                                            }
                                                        >
                                                            <div className="d-flex gap-1 align-items-center">
                                                                <BsSuitcaseFill className="mb-0 mt-0" />
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            '14px',
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    1{' '}
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        '14px',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {' '}
                                                                {t(
                                                                    'baggage.free'
                                                                )}
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            variant={
                                                                (currentSelect ===
                                                                    'departure' &&
                                                                    props
                                                                        .currentDepartureBaggage
                                                                        .child[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        2) ||
                                                                (currentSelect ===
                                                                    'comeback' &&
                                                                    props
                                                                        .currentComebackBaggage
                                                                        .child[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        2)
                                                                    ? 'outline-primary'
                                                                    : 'outline-secondary'
                                                            }
                                                            className="d-flex align-items-center justify-content-between w-100 p-1 px-2"
                                                            style={{
                                                                borderWidth:
                                                                    '2px',
                                                            }}
                                                            onClick={() =>
                                                                props.handleChangeBaggage(
                                                                    'child',
                                                                    i,
                                                                    currentSelect,
                                                                    2
                                                                )
                                                            }
                                                        >
                                                            <div className="d-flex gap-1 align-items-center">
                                                                <div className="d-flex justify-content-center align-items-center">
                                                                    <BsSuitcaseFill className="mb-0 mt-0" />
                                                                    <BsSuitcaseFill className="mb-0 mt-0" />
                                                                </div>

                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            '14px',
                                                                        fontWeight: 500,
                                                                    }}
                                                                >
                                                                    2{' '}
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        '14px',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {' '}
                                                                {currentSelect ===
                                                                'departure'
                                                                    ? formatCurrency(
                                                                          departureBaggePrice *
                                                                              1
                                                                      )
                                                                    : formatCurrency(
                                                                          comebackBaggePrice *
                                                                              1
                                                                      )}{' '}
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            variant={
                                                                (currentSelect ===
                                                                    'departure' &&
                                                                    props
                                                                        .currentDepartureBaggage
                                                                        .child[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        3) ||
                                                                (currentSelect ===
                                                                    'comeback' &&
                                                                    props
                                                                        .currentComebackBaggage
                                                                        .child[
                                                                        i
                                                                    ]
                                                                        .baggage ===
                                                                        3)
                                                                    ? 'outline-primary'
                                                                    : 'outline-secondary'
                                                            }
                                                            className="d-flex align-items-center justify-content-between w-100 p-1 px-2"
                                                            style={{
                                                                borderWidth:
                                                                    '2px',
                                                            }}
                                                            onClick={() =>
                                                                props.handleChangeBaggage(
                                                                    'child',
                                                                    i,
                                                                    currentSelect,
                                                                    3
                                                                )
                                                            }
                                                        >
                                                            <div className="d-flex gap-1 align-items-center">
                                                                <div className="d-flex justify-content-center align-items-center">
                                                                    <BsSuitcaseFill className="mb-0 mt-0" />
                                                                    <BsSuitcaseFill className="mb-0 mt-0" />
                                                                    <BsSuitcaseFill className="mb-0 mt-0" />
                                                                </div>{' '}
                                                                <span>
                                                                    3{' '}
                                                                    {t(
                                                                        'baggage.pieces'
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        '14px',
                                                                    fontWeight: 500,
                                                                }}
                                                            >
                                                                {' '}
                                                                {currentSelect ===
                                                                'departure'
                                                                    ? formatCurrency(
                                                                          departureBaggePrice *
                                                                              2
                                                                      )
                                                                    : formatCurrency(
                                                                          comebackBaggePrice *
                                                                              2
                                                                      )}{' '}
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            {t('account.confirm')}
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            {t('flightSelectedInformation.close')}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    } else {
        return <></>;
    }
};

export default SelectMoreBaggage;
