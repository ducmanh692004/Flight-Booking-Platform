import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getFlightDuration } from '../../../utils/myFunction';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import FlightSelectedInformation from './FlightSelectedInformation';
import { getDateOnly } from '../../../utils/myFunction';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../../redux/actions/cartAction';
import { useSelector } from 'react-redux';
import { useFormatter } from '../../hooks/useFomatter';
import { toast } from 'react-toastify';
import { addCartItem } from '../../../services/CartService';
// import { setItemsPayment } from '../../../redux/actions/paymentAction';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
dayjs.extend(utc);
dayjs.extend(timezone);

const ConfirmUserFlight = (props) => {
    const {
        dataFlightDeparture,
        dataFlightComeback,
        show,
        setShow,
        dataPeopleQuantity,
    } = props;
    const dispatch = useDispatch();
    const { formatCurrency } = useFormatter();
    const { t } = useTranslation();
    const { totalMoney, setTotalMoney } = useState(0);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const userId = useSelector((state) => state.user.account.id);
    const history = useHistory();

    const formatUtcToLocal = (utcStr, timezone, format = 'HH:mm') => {
        return dayjs.utc(utcStr).tz(timezone).format(format);
    };
    const [selectViewDetail, setSelectViewDetail] = useState(1);

    const [showDetailInformation, setShowDetailInformation] = useState(false);
    const handleClose = () => setShowDetailInformation(false);
    const handleShow = () => setShowDetailInformation(true);

    const handleChooseViewDetail = (value) => {
        setShowDetailInformation(true);
        setSelectViewDetail(value);
    };

    const handleAddToCart = async () => {
        if (isAuthenticated === true) {
            const dataAdd = {
                flight_departure_id: dataFlightDeparture._id,
                flight_comeback_id: dataFlightComeback._id,
                people_quantity: dataPeopleQuantity,
                seat_class:
                    dataFlightDeparture.seats_quantity[0].seat_class_id._id,
            };
            const reponse = await addCartItem(dataAdd, userId);
            if (reponse && reponse.EC === 0) {
                const itemAdd = {
                    id: reponse.DT,
                    dataFlightDeparture: dataFlightDeparture,
                    dataFlightComeback: dataFlightComeback,
                    peopleQuantity: props.dataPeopleQuantity,
                };
                dispatch(addItemToCart(itemAdd));
            }
        } else {
            const dataAdd = {
                dataFlightDeparture: dataFlightDeparture,
                dataFlightComeback: dataFlightComeback,
                peopleQuantity: props.dataPeopleQuantity,
            };
            dispatch(addItemToCart(dataAdd));
            // history.push('/payment?');
        }
        toast.success(t('confirmUserFlight.addToCartSuccess'));
    };

    const handleNavigateToPayment = () => {
        // const dataPayment = {
        //     dataFlightDeparture: dataFlightDeparture,
        //     dataFlightComeback: dataFlightComeback,
        //     seatClassId:
        //         dataFlightDeparture.seats_quantity[0].seat_class_id._id,
        //     peopleQuantity: dataPeopleQuantity,
        // };

        // dispatch(setItemsPayment(dataPayment));
        history.push(
            `/confirm-user-information?flightDepartureId=${
                dataFlightDeparture._id
            }&flightComebackId=${dataFlightComeback._id}&seatClassId=${
                dataFlightDeparture.seats_quantity[0].seat_class_id._id
            }&seatClassName=${
                dataFlightDeparture.seats_quantity[0].seat_class_id.name
            }&peopleQuantity=${JSON.stringify(dataPeopleQuantity)}`
        );
    };

    return (
        <Offcanvas
            show={show}
            onHide={setShow}
            size="lg"
            style={{ width: '800px' }}
            placement="end"
        >
            <Offcanvas.Header className="mb-0 pb-0" closeButton>
                <Offcanvas.Title>
                    {t('confirmUserFlight.reviewYourFlight')}
                </Offcanvas.Title>
            </Offcanvas.Header>
            <hr />

            <Offcanvas.Body>
                <div className="d-flex flex-column" style={{ height: '100%' }}>
                    <div className="">
                        {dataFlightDeparture &&
                            dataFlightDeparture.airline &&
                            dataFlightDeparture.airline.logo_url !== '' && (
                                <>
                                    <div className="d-flex gap-2 align-items-center">
                                        <div
                                            className="bg-info rounded p-1 px-2"
                                            style={{
                                                fontWeight: '500',
                                                color: 'whitesmoke',
                                            }}
                                        >
                                            {t('confirmUserFlight.departure')}
                                        </div>
                                        <span style={{ fontWeight: '500' }}>
                                            {
                                                dataFlightDeparture.segments[0]
                                                    .departure_airport_id
                                                    .province
                                            }{' '}
                                        </span>
                                        {'->'}
                                        <span style={{ fontWeight: '500' }}>
                                            {
                                                dataFlightDeparture.segments[
                                                    dataFlightDeparture.segments
                                                        .length - 1
                                                ].arrival_airport_id.province
                                            }
                                        </span>
                                        <hr
                                            style={{
                                                width: '1px',
                                                height: '15px',
                                            }}
                                        ></hr>
                                        <span style={{ fontWeight: '500' }}>
                                            {getDateOnly(
                                                dataFlightDeparture.segments[0]
                                                    .departure_time
                                            )}
                                        </span>
                                    </div>
                                    <div
                                        key={dataFlightDeparture._id}
                                        className="flight-card px-3 pt-3 pb-1 bg-light mb-2 rounded shadow-sm border border-gray-800"
                                        style={{ border: '1px solid' }}
                                    >
                                        <div className="row align-items-center">
                                            <div className="col-md-12">
                                                <div className="align-items-center d-flex justify-content-between">
                                                    <div className="col-auto">
                                                        <div className="d-flex align-items-center mb-2 gap-2">
                                                            <img
                                                                style={{
                                                                    width: '60px',
                                                                    height: '20px',
                                                                }}
                                                                src={
                                                                    dataFlightDeparture
                                                                        .airline
                                                                        .logo_url
                                                                }
                                                                alt="airline logo"
                                                            />
                                                            <span className="fw-semibold">
                                                                {
                                                                    dataFlightDeparture
                                                                        .airline
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="text-primary"
                                                        style={{
                                                            fontWeight: '600',
                                                        }}
                                                        onClick={() =>
                                                            handleChooseViewDetail(
                                                                1
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'confirmUserFlight.details'
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="row align-items-center mb-3">
                                                    <div className="col-auto">
                                                        <div className="flight-time">
                                                            {formatUtcToLocal(
                                                                dataFlightDeparture
                                                                    .segments[0]
                                                                    .departure_time,
                                                                dataFlightDeparture
                                                                    .segments[0]
                                                                    .departure_airport_id
                                                                    .time_zon
                                                            )}
                                                        </div>
                                                        <div className="flight-route">
                                                            {
                                                                dataFlightDeparture
                                                                    .segments[0]
                                                                    .departure_airport_id
                                                                    .code
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-auto px-2 text-center">
                                                        <div className="flight-duration">
                                                            {getFlightDuration(
                                                                dataFlightDeparture
                                                                    .segments[0]
                                                                    .departure_time,
                                                                dataFlightDeparture.segments.at(
                                                                    -1
                                                                ).arrival_time
                                                            )}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '12px',
                                                                color: '#6c757d',
                                                            }}
                                                        >
                                                            {{
                                                                1: `${t(
                                                                    'confirmUserFlight.directFlight'
                                                                )}`,
                                                                2: `${t(
                                                                    'confirmUserFlight.oneStop'
                                                                )}`,
                                                                3: `${t(
                                                                    'confirmUserFlight.twoStops'
                                                                )}`,
                                                            }[
                                                                dataFlightDeparture
                                                                    .segments
                                                                    .length
                                                            ] ||
                                                                `${t(
                                                                    'confirmUserFlight.moreThanThreeStops'
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

                                                    <div className="col-auto">
                                                        <div className="flight-time">
                                                            {formatUtcToLocal(
                                                                dataFlightDeparture.segments.at(
                                                                    -1
                                                                ).arrival_time,
                                                                dataFlightDeparture.segments.at(
                                                                    -1
                                                                )
                                                                    .arrival_airport_id
                                                                    .time_zon
                                                            )}
                                                        </div>
                                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                                            <div className="flight-route">
                                                                {
                                                                    dataFlightDeparture.segments.at(
                                                                        -1
                                                                    )
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
                                                                {t(
                                                                    'confirmUserFlight.nextDayArrival'
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                        {dataFlightComeback &&
                            dataFlightComeback.airline &&
                            dataFlightComeback.airline.logo_url !== '' && (
                                <>
                                    <div className="d-flex gap-2 align-items-center">
                                        <div
                                            className="bg-info rounded p-1 px-2"
                                            style={{
                                                fontWeight: '500',
                                                color: 'whitesmoke',
                                            }}
                                        >
                                            {t('confirmUserFlight.roundTrip')}
                                        </div>
                                        <span style={{ fontWeight: '500' }}>
                                            {
                                                dataFlightComeback.segments[0]
                                                    .departure_airport_id
                                                    .province
                                            }{' '}
                                        </span>
                                        {'->'}
                                        <span style={{ fontWeight: '500' }}>
                                            {
                                                dataFlightComeback.segments[
                                                    dataFlightComeback.segments
                                                        .length - 1
                                                ].arrival_airport_id.province
                                            }
                                        </span>
                                        <hr
                                            style={{
                                                width: '1px',
                                                height: '15px',
                                            }}
                                        ></hr>
                                        <span style={{ fontWeight: '500' }}>
                                            {getDateOnly(
                                                dataFlightComeback.segments[0]
                                                    .departure_time
                                            )}
                                        </span>
                                    </div>
                                    <div
                                        key={dataFlightComeback._id}
                                        className="flight-card px-3 pt-3 pb-1 bg-light mb-2 rounded shadow-sm border border-gray-800"
                                        style={{ border: '1px solid' }}
                                    >
                                        <div className="row align-items-center">
                                            <div className="col-md-12">
                                                <div className="align-items-center d-flex justify-content-between">
                                                    <div className="col-auto">
                                                        <div className="d-flex align-items-center mb-2 gap-2">
                                                            <img
                                                                style={{
                                                                    width: '60px',
                                                                    height: '20px',
                                                                }}
                                                                src={
                                                                    dataFlightComeback
                                                                        .airline
                                                                        .logo_url
                                                                }
                                                                alt="airline logo"
                                                            />
                                                            <span className="fw-semibold">
                                                                {
                                                                    dataFlightComeback
                                                                        .airline
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="text-primary"
                                                        style={{
                                                            fontWeight: '600',
                                                        }}
                                                        onClick={() =>
                                                            handleChooseViewDetail(
                                                                2
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'confirmUserFlight.details'
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="row align-items-center mb-3">
                                                    <div className="col-auto">
                                                        <div className="flight-time">
                                                            {formatUtcToLocal(
                                                                dataFlightComeback
                                                                    .segments[0]
                                                                    .departure_time,
                                                                dataFlightComeback
                                                                    .segments[0]
                                                                    .departure_airport_id
                                                                    .time_zon
                                                            )}
                                                        </div>
                                                        <div className="flight-route">
                                                            {
                                                                dataFlightComeback
                                                                    .segments[0]
                                                                    .departure_airport_id
                                                                    .code
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-auto px-2 text-center">
                                                        <div className="flight-duration">
                                                            {getFlightDuration(
                                                                dataFlightComeback
                                                                    .segments[0]
                                                                    .departure_time,
                                                                dataFlightComeback.segments.at(
                                                                    -1
                                                                ).arrival_time
                                                            )}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '12px',
                                                                color: '#6c757d',
                                                            }}
                                                        >
                                                            {{
                                                                1: `${t(
                                                                    'confirmUserFlight.directFlight'
                                                                )}`,
                                                                2: `${t(
                                                                    'confirmUserFlight.oneStop'
                                                                )}`,
                                                                3: `${t(
                                                                    'confirmUserFlight.twoStops'
                                                                )}`,
                                                            }[
                                                                dataFlightComeback
                                                                    .segments
                                                                    .length
                                                            ] ||
                                                                `${t(
                                                                    'confirmUserFlight.moreThanThreeStops'
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

                                                    <div className="col-auto">
                                                        <div className="flight-time">
                                                            {formatUtcToLocal(
                                                                dataFlightComeback.segments.at(
                                                                    -1
                                                                ).arrival_time,
                                                                dataFlightComeback.segments.at(
                                                                    -1
                                                                )
                                                                    .arrival_airport_id
                                                                    .time_zon
                                                            )}
                                                        </div>
                                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                                            <div className="flight-route">
                                                                {
                                                                    dataFlightComeback.segments.at(
                                                                        -1
                                                                    )
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
                                                                {/* {t(
                                                                    'confirmUserFlight.nextDayArrival'
                                                                )} */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                    </div>

                    <div
                        className="mt-auto d-flex justify-content-between align-items-center pt-3"
                        style={{ borderTop: '1px solid #ccc' }}
                    >
                        <div>
                            <h5 className="mb-0 mt-0 text-primary">
                                {t('confirmUserFlight.total')}{' '}
                                {Array.isArray(
                                    dataFlightDeparture?.seats_quantity
                                ) &&
                                dataFlightDeparture.seats_quantity.length > 0 &&
                                Array.isArray(
                                    dataFlightComeback?.seats_quantity
                                ) &&
                                dataFlightComeback.seats_quantity.length > 0
                                    ? formatCurrency(
                                          (Number(
                                              dataFlightDeparture
                                                  .seats_quantity[0].price
                                                  ?.$numberDecimal || 0
                                          ) +
                                              Number(
                                                  dataFlightComeback
                                                      .seats_quantity[0].price
                                                      ?.$numberDecimal || 0
                                              )) *
                                              dataPeopleQuantity.adult +
                                              (Number(
                                                  dataFlightDeparture
                                                      .seats_quantity[0]
                                                      .child_price
                                                      ?.$numberDecimal || 0
                                              ) +
                                                  Number(
                                                      dataFlightComeback
                                                          .seats_quantity[0]
                                                          .child_price
                                                          ?.$numberDecimal || 0
                                                  )) *
                                                  dataPeopleQuantity.child
                                      )
                                    : formatCurrency(
                                          Number(
                                              dataFlightDeparture
                                                  ?.seats_quantity?.[0]?.price
                                                  ?.$numberDecimal || 0
                                          ) *
                                              dataPeopleQuantity.adult +
                                              Number(
                                                  dataFlightDeparture
                                                      ?.seats_quantity?.[0]
                                                      ?.child_price
                                                      ?.$numberDecimal || 0
                                              ) *
                                                  dataPeopleQuantity.child
                                      )}
                                /
                                {dataPeopleQuantity.adult +
                                    dataPeopleQuantity.child}{' '}
                                {t('confirmUserFlight.personCount')}
                            </h5>
                            <h6 className="mt-0 mb-0 text-secondary">
                                {Array.isArray(
                                    dataFlightDeparture?.seats_quantity
                                ) &&
                                dataFlightDeparture.seats_quantity.length > 0 &&
                                Array.isArray(
                                    dataFlightComeback?.seats_quantity
                                ) &&
                                dataFlightComeback.seats_quantity.length > 0
                                    ? formatCurrency(
                                          Number(
                                              dataFlightDeparture
                                                  .seats_quantity[0].price
                                                  ?.$numberDecimal || 0
                                          ) +
                                              Number(
                                                  dataFlightComeback
                                                      .seats_quantity[0].price
                                                      ?.$numberDecimal || 0
                                              )
                                      )
                                    : formatCurrency(
                                          dataFlightDeparture
                                              ?.seats_quantity?.[0]?.price
                                              ?.$numberDecimal || 0
                                      )}
                                / {t('confirmUserFlight.perPerson')}
                            </h6>
                        </div>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                            <button
                                className="btn btn-secondary"
                                style={{ fontWeight: '500' }}
                                onClick={() => handleAddToCart()}
                            >
                                {t('confirmUserFlight.addToCart')}
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ fontWeight: '500' }}
                                onClick={() => handleNavigateToPayment()}
                            >
                                {t('confirmUserFlight.continue')}
                            </button>
                        </div>
                    </div>
                </div>
            </Offcanvas.Body>
            <FlightSelectedInformation
                show={showDetailInformation}
                setShow={handleClose}
                dataFlight={
                    selectViewDetail === 1
                        ? dataFlightDeparture
                        : dataFlightComeback
                }
            />
        </Offcanvas>
    );
};

export default ConfirmUserFlight;
