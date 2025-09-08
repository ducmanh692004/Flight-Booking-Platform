import { useEffect, useState } from 'react';
import { GrFormNextLink } from 'react-icons/gr';
import { GrFormPreviousLink } from 'react-icons/gr';
import { useFormatter } from '../../../hooks/useFomatter';
import DynamicIcon from '../../FlightList/DynamicIcon';
import { MdOutlineDone } from 'react-icons/md';
import { MdOutlineCancel } from 'react-icons/md';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { TranslateText } from '../../../Translate';

const SelectOtherSeatClass = (props) => {
    const [activeTrip, setActiveTrip] = useState('departure');
    const [currentSeatIndex, setCurrentSeatIndex] = useState(0);
    const seatClassDeparture = props.dataFlightDeparture.seats_quantity;
    const seatClassComeback = props.dataFlightComeback?.seats_quantity;
    const [currentChooseSeatClass, setCurrentChooseSeatClass] = useState([]);
    const { formatCurrency } = useFormatter();
    const { t } = useTranslation();

    const handlePreviousSeat = () => {
        setCurrentSeatIndex((prev) => (prev > 0 ? prev - 1 : 0));
    };

    const handleNextSeat = () => {
        const maxIndex = currentChooseSeatClass.length - 3;
        setCurrentSeatIndex((prev) => (prev < maxIndex ? prev + 1 : maxIndex));
    };

    const visibleSeatClasses = currentChooseSeatClass.slice(
        currentSeatIndex,
        currentSeatIndex + 3
    );

    const handleAssignState = () => {
        if (props.seatClassDeparture) {
            setCurrentChooseSeatClass(seatClassDeparture);
        }
    };

    useEffect(() => {
        handleAssignState();
    }, []);

    useEffect(() => {
        if (
            activeTrip === 'departure' &&
            seatClassDeparture &&
            seatClassDeparture.length > 0
        ) {
            setCurrentChooseSeatClass(seatClassDeparture);
            console.log(visibleSeatClasses);
        } else if (
            activeTrip === 'comeback' &&
            seatClassComeback &&
            seatClassComeback.length > 0
        ) {
            setCurrentChooseSeatClass(seatClassComeback);
        }

        setCurrentSeatIndex(0);
        console.log('checkkk', seatClassComeback);
    }, [activeTrip, seatClassDeparture, seatClassComeback]);

    if (
        props.dataFlightDeparture &&
        Object.keys(props.dataFlightDeparture).length > 0
    ) {
        return (
            // <div className="mt-4 shadow-sm" >
            <div className="shadow-sm mt-4">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-12">
                        {/* Header với icon hành lý */}
                        <div
                            className="card mb-0"
                            style={{
                                background:
                                    'linear-gradient(135deg, #c5f3f5ff 0%, #d8fcddff 100%)',
                                border: '1px solid #B3E5E5',
                                // border: '1px solid #B3E5E5',
                            }}
                        >
                            <div className="card-body">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div>
                                        <h5 className="card-title mb-2 text-dark fw-semibold">
                                            {t(
                                                'chooseOtherSeatClass.headerTitle'
                                            )}{' '}
                                        </h5>
                                        <p className="text-muted mb-0">
                                            {t(
                                                'chooseOtherSeatClass.headerSub'
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Toggle buttons cho chuyến bay đi/về */}
                                <div
                                    className="btn-group w-100 mb-4 px-4"
                                    role="group"
                                >
                                    <Button
                                        variant={
                                            activeTrip === 'departure'
                                                ? 'primary'
                                                : 'outline-primary'
                                        }
                                        onClick={() =>
                                            setActiveTrip('departure')
                                        }
                                    >
                                        <div className="fw-semibold">
                                            {t('chooseOtherSeatClass.stepDep')}
                                        </div>
                                        <small className="d-block">
                                            {
                                                props.dataFlightDeparture
                                                    ?.segments[0]
                                                    ?.departure_airport_id.code
                                            }
                                            {' - '}
                                            {
                                                props.dataFlightDeparture
                                                    ?.segments[
                                                    props.dataFlightDeparture
                                                        .segments.length - 1
                                                ]?.arrival_airport_id.code
                                            }
                                        </small>
                                        <small
                                            className={
                                                activeTrip === 'departure'
                                                    ? 'd-block text-light'
                                                    : 'd-block text-primary'
                                            }
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: '16px',
                                            }}
                                        >
                                            {/* {
                                                props.currentSeatClassDeparture
                                                    .name
                                            } */}
                                            <TranslateText
                                                text={
                                                    props
                                                        .currentSeatClassDeparture
                                                        .name
                                                }
                                            />
                                        </small>
                                    </Button>
                                    {seatClassComeback &&
                                        seatClassComeback.length > 0 && (
                                            <Button
                                                variant={
                                                    activeTrip === 'comeback'
                                                        ? 'primary'
                                                        : 'outline-primary'
                                                }
                                                onClick={() =>
                                                    setActiveTrip('comeback')
                                                }
                                            >
                                                <div className="fw-semibold">
                                                    {t(
                                                        'chooseOtherSeatClass.stepRet'
                                                    )}{' '}
                                                </div>
                                                <small className="d-block">
                                                    {
                                                        props.dataFlightComeback
                                                            .segments[0]
                                                            .departure_airport_id
                                                            .code
                                                    }
                                                    {' - '}
                                                    {
                                                        props.dataFlightComeback
                                                            .segments[
                                                            props
                                                                .dataFlightComeback
                                                                .segments
                                                                .length - 1
                                                        ].arrival_airport_id
                                                            .code
                                                    }
                                                </small>
                                                <small
                                                    className={
                                                        activeTrip ===
                                                        'comeback'
                                                            ? 'd-block text-light'
                                                            : 'd-block text-primary'
                                                    }
                                                    style={{
                                                        fontWeight: 'bold',
                                                        fontSize: '16px',
                                                    }}
                                                >
                                                    {/* {
                                                        props
                                                            .currentSeatClassComeback
                                                            .name
                                                    } */}
                                                    <TranslateText
                                                        text={
                                                            props
                                                                .currentSeatClassComeback
                                                                .name
                                                        }
                                                    />
                                                </small>
                                            </Button>
                                        )}
                                </div>

                                <div className="container d-flex justify-content-between mb-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <div
                                            className="bg-primary p-1 px-2 rounded"
                                            style={{ color: 'white' }}
                                        >
                                            {activeTrip === 'departure'
                                                ? `${t(
                                                      'chooseOtherSeatClass.dirDep'
                                                  )}`
                                                : `${t(
                                                      'chooseOtherSeatClass.dirRet'
                                                  )}`}
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center px-1 gap-2">
                                            <h6 className="mb-0">
                                                {activeTrip === 'departure'
                                                    ? props.dataFlightDeparture
                                                          .segments[0]
                                                          .departure_airport_id
                                                          .province
                                                    : props.dataFlightComeback
                                                          .segments[0]
                                                          .departure_airport_id
                                                          .province}
                                            </h6>
                                            <span> - </span>
                                            <h6 className="mb-0">
                                                {activeTrip === 'departure'
                                                    ? props.dataFlightDeparture
                                                          .segments[
                                                          props
                                                              .dataFlightDeparture
                                                              .segments.length -
                                                              1
                                                      ].arrival_airport_id
                                                          .province
                                                    : props.dataFlightComeback
                                                          .segments[
                                                          props
                                                              .dataFlightComeback
                                                              .segments.length -
                                                              1
                                                      ].arrival_airport_id
                                                          .province}
                                            </h6>
                                        </div>

                                        <hr
                                            className="mb-0 mt-0"
                                            style={{
                                                width: '1.5px',
                                                height: '15px',
                                                color: 'gray',
                                            }}
                                        ></hr>
                                        {/* <span>5-9-2025</span> */}
                                    </div>
                                    <div className="d-flex justify-content-end align-items-center mb-0">
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-primary btn-sm d-flex justify-content-center algin-items-center"
                                                onClick={handlePreviousSeat}
                                            >
                                                <GrFormPreviousLink color="white" />{' '}
                                            </button>

                                            <button
                                                className="btn btn-primary btn-sm d-flex justify-content-center align-items-center"
                                                onClick={handleNextSeat}
                                            >
                                                <GrFormNextLink color="white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="row g-3">
                                        {visibleSeatClasses &&
                                            visibleSeatClasses.length > 0 &&
                                            visibleSeatClasses.map(
                                                (seatClass, index) => (
                                                    <div
                                                        key={index}
                                                        className="col-12 col-md-6 col-lg-4"
                                                    >
                                                        <div
                                                            className="card h-100 border-2 position-relative seat-class-card"
                                                            style={
                                                                (activeTrip ===
                                                                    'departure' &&
                                                                    props
                                                                        .currentSeatClassDeparture
                                                                        ?.name ===
                                                                        seatClass
                                                                            .seat_class_id
                                                                            .name) ||
                                                                (activeTrip ===
                                                                    'comeback' &&
                                                                    props
                                                                        .currentSeatClassComeback
                                                                        ?.name ===
                                                                        seatClass
                                                                            .seat_class_id
                                                                            .name)
                                                                    ? {
                                                                          borderColor:
                                                                              '#0d6efd',
                                                                          cursor: 'pointer',
                                                                      }
                                                                    : {
                                                                          cursor: 'pointer',
                                                                      }
                                                            }
                                                            onClick={() =>
                                                                props.handleChangeCurrentSeatClass(
                                                                    activeTrip,
                                                                    seatClass.seat_class_id
                                                                )
                                                            }
                                                        >
                                                            <div className="card-body text-center">
                                                                <div className=" d-flex flex-column align-items-start gap-1 justify-content-center align-items-center">
                                                                    <h6 className="fw-bold mt-0 mb-0">
                                                                        {/* {
                                                                            seatClass
                                                                                .seat_class_id
                                                                                .name
                                                                        } */}
                                                                        <TranslateText
                                                                            text={
                                                                                seatClass
                                                                                    .seat_class_id
                                                                                    .name
                                                                            }
                                                                        />
                                                                    </h6>
                                                                    <div className="d-flex justify-content-center align-items-center w-100">
                                                                        <h6 className="fw-semibold text-primary mb-0 mt-0">
                                                                            {formatCurrency(
                                                                                seatClass
                                                                                    .price
                                                                                    .$numberDecimal
                                                                            )}{' '}
                                                                        </h6>
                                                                        <small className="text-muted mt-0 mb-0">
                                                                            {t(
                                                                                'chooseOtherSeatClass.perPax'
                                                                            )}
                                                                        </small>
                                                                    </div>
                                                                </div>

                                                                <hr className="mt-2 mb-2"></hr>

                                                                {/* Danh sách tính năng */}
                                                                <ul className="list-unstyled text-start mb-3">
                                                                    {seatClass.utils.map(
                                                                        (
                                                                            feature,
                                                                            index
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="d-flex align-items-center gap-2 small text-muted mb-1"
                                                                            >
                                                                                <DynamicIcon
                                                                                    iconName={
                                                                                        feature.name
                                                                                    }
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                    color="gray"
                                                                                />
                                                                                <span
                                                                                    className="text-muted me-2"
                                                                                    style={{
                                                                                        fontWeight:
                                                                                            '500',
                                                                                    }}
                                                                                >
                                                                                    {/* {
                                                                                        feature.name
                                                                                    } */}
                                                                                    <TranslateText
                                                                                        text={
                                                                                            feature.name
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                                <div className="d-flex flex-column justify-content-between">
                                                                    {seatClass.changeFlight ===
                                                                    'yes' ? (
                                                                        <div className="d-flex align-items-center gap-1">
                                                                            <MdOutlineDone color="green" />
                                                                            <span
                                                                                style={{
                                                                                    fontSize:
                                                                                        '14px',
                                                                                }}
                                                                            >
                                                                                {t(
                                                                                    'chooseOtherSeatClass.changeOk'
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="d-flex align-items-center gap-1">
                                                                            <MdOutlineCancel color="red" />
                                                                            <span
                                                                                style={{
                                                                                    fontSize:
                                                                                        '14px',
                                                                                }}
                                                                            >
                                                                                {t(
                                                                                    'chooseOtherSeatClass.changeNo'
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    {seatClass.refund ===
                                                                    0 ? (
                                                                        <div className="d-flex align-items-center gap-1">
                                                                            <MdOutlineCancel color="red" />
                                                                            <span
                                                                                style={{
                                                                                    fontSize:
                                                                                        '14px',
                                                                                }}
                                                                            >
                                                                                {t(
                                                                                    'chooseOtherSeatClass.refundOk'
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="d-flex align-items-center gap-1">
                                                                            <MdOutlineDone color="green" />
                                                                            <span
                                                                                style={{
                                                                                    fontSize:
                                                                                        '14px',
                                                                                }}
                                                                            >
                                                                                {t(
                                                                                    'chooseOtherSeatClass.refundNo'
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            // </div>
        );
    } else {
        return <></>;
    }
};

export default SelectOtherSeatClass;
