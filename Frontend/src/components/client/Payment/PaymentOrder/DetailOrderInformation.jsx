import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Modal,
    Button,
    Badge,
    ListGroup,
} from 'react-bootstrap';
import {
    BiSolidShoppingBags,
    BiUser,
    BiPhone,
    BiEnvelope,
} from 'react-icons/bi';
import { IoCheckmarkDoneSharp, IoAirplane } from 'react-icons/io5';
import { ImCancelCircle } from 'react-icons/im';
import { FaCalendarAlt, FaCreditCard, FaUsers } from 'react-icons/fa';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getOrderDetailInformation } from '../../../../services/OrderService';
import { useFormatter } from '../../../hooks/useFomatter';
import { useTranslation } from 'react-i18next';
import { TranslateText } from '../../../Translate';
dayjs.extend(utc);
dayjs.extend(timezone);

const OrderDetail = ({ orderId, show, onHide }) => {
    const { t } = useTranslation();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const response = await getOrderDetailInformation(orderId);
            if (response?.EC === 0) {
                setOrderData(response.DT);
            }
        } catch (error) {
            console.error('Error fetching order detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const { formatCurrency } = useFormatter();

    useEffect(() => {
        if (orderId && show) {
            fetchOrderDetail();
        }
    }, [orderId, show]);

    const formatUtcToLocal = (utcStr, timezone, format = 'HH:mm') => {
        return dayjs.utc(utcStr).tz(timezone).format(format);
    };

    const getDateOnly = (dateStr) => {
        return dayjs(dateStr).format('DD/MM/YYYY');
    };

    const getFlightDuration = (departureTime, arrivalTime) => {
        const departure = dayjs(departureTime);
        const arrival = dayjs(arrivalTime);
        const duration = arrival.diff(departure, 'minute');
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours}h ${minutes}m`;
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case t('detailOrderInformation.waitingForPayment'):
                return 'warning';
            case t('payment.paymentSuccess'):
            case t('detailOrderInformation.paymentSuccessful'):
                return 'success';
            case t('detailOrderInformation.cancelled'):
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const renderFlightSegments = (flight) => {
        return flight.segments.map((segment, index) => (
            <div className="d-flex gap-3 mt-4" key={index}>
                <div className="d-flex justify-content-between flex-column">
                    <div>
                        <h6 className="mb-0">
                            {formatUtcToLocal(
                                segment.departure_time,
                                segment.departure_airport_id.time_zone || 'UTC'
                            )}
                        </h6>
                    </div>

                    <span className="mt-3 mb-3" style={{ fontSize: '14px' }}>
                        {getFlightDuration(
                            segment.departure_time,
                            segment.arrival_time
                        )}
                    </span>

                    <div>
                        <h6 className="mb-0">
                            {formatUtcToLocal(
                                segment.arrival_time,
                                segment.arrival_airport_id.time_zone || 'UTC'
                            )}
                        </h6>
                    </div>
                </div>

                <div className="d-flex flex-column align-items-center justify-content-center">
                    <div
                        className="bg-info mt-1 rounded-circle"
                        style={{ width: '10px', height: '10px' }}
                    ></div>
                    <hr
                        className="mt-0 mb-0"
                        style={{ height: '110px', width: '1px' }}
                    ></hr>
                    <div
                        className="bg-info rounded-circle"
                        style={{ width: '10px', height: '10px' }}
                    ></div>
                </div>

                <div className="d-flex flex-column justify-content-between">
                    <div>
                        <div className="d-flex justify-content-start gap-1">
                            <div>{segment.departure_airport_id.province}</div>
                            <div>({segment.departure_airport_id.code})</div>
                        </div>
                        <div style={{ fontSize: '13px' }}>
                            {/* {segment.departure_airport_id.name} */}
                            <TranslateText
                                text={segment.departure_airport_id.name}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="d-flex justify-content-start gap-1">
                            <div>{segment.arrival_airport_id.province}</div>
                            <div>({segment.arrival_airport_id.code})</div>
                        </div>
                        <div style={{ fontSize: '13px' }}>
                            {/* {segment.arrival_airport_id.name} */}
                            <TranslateText
                                text={segment.arrival_airport_id.name}
                            />
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    const renderFlightInfo = (flight, seatClass, title) => (
        <Card className="mb-4">
            <Card.Header>
                <h6
                    className="mb-0 d-flex align-items-center"
                    style={{ fontSize: '17px' }}
                >
                    <IoAirplane className="me-2" />
                    {title}
                </h6>
            </Card.Header>
            <Card.Body>
                <div className="d-flex align-items-center gap-2 mb-3">
                    <img
                        style={{
                            width: '80px',
                            height: '40px',
                            objectFit: 'contain',
                        }}
                        src={flight.airline.logo_url}
                        alt={flight.airline.name}
                    />
                    <div>
                        <h6 className="mb-0">{flight.airline.name}</h6>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                            {flight.flight_number} -{' '}
                            <TranslateText text={seatClass.name} />
                        </span>
                    </div>
                </div>

                <Row>
                    <Col md={7}>{renderFlightSegments(flight)}</Col>
                    <Col md={5}>
                        <div>
                            <div className="d-flex align-items-center justify-content-start gap-2">
                                <h6 className="mt-0 mb-0">
                                    {t('detailOrderInformation.departureTime')}{' '}
                                </h6>
                                <span>
                                    {formatUtcToLocal(
                                        flight.segments[0].departure_time
                                    )}
                                    {' - '}
                                    {getDateOnly(
                                        flight.segments[0].departure_time
                                    )}
                                </span>
                            </div>
                            <h6 className="mt-3" style={{ fontWeight: 600 }}>
                                {t('detailOrderInformation.amenities')}
                            </h6>
                            <div className="d-flex align-items-start gap-2 mb-2">
                                <BiSolidShoppingBags color="gray" />
                                <div className="d-flex flex-column">
                                    <div
                                        style={{
                                            fontSize: '14px',
                                            color: 'gray',
                                        }}
                                    >
                                        {flight.seats_quantity[0].free_baggage}{' '}
                                        {t(
                                            'detailOrderInformation.freeBaggage'
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '14px',
                                            color: 'gray',
                                        }}
                                    >
                                        {
                                            flight.seats_quantity[0]
                                                .carry_on_baggage
                                        }{' '}
                                        {t(
                                            'detailOrderInformation.carryOnBaggage'
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                {flight.seats_quantity[0].utils.map(
                                    (util, index) => (
                                        <div
                                            key={index}
                                            className="d-flex gap-2 align-items-center mb-1"
                                        >
                                            <div
                                                style={{
                                                    fontSize: '14px',
                                                    color: 'gray',
                                                }}
                                            >
                                                {/* • {util.name}  */}•{' '}
                                                <TranslateText
                                                    text={util.name}
                                                />
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            <h6 style={{ fontWeight: 600 }}>
                                {t('detailOrderInformation.policy')}
                            </h6>
                            <div className="mb-2">
                                {flight.seats_quantity[0].changeFlight ===
                                'yes' ? (
                                    <div
                                        className="d-flex align-items-center gap-2 p-2 rounded mb-2"
                                        style={{
                                            backgroundColor:
                                                'rgb(230, 249, 237)',
                                            width: 'fit-content',
                                        }}
                                    >
                                        <IoCheckmarkDoneSharp color="green" />
                                        <div
                                            style={{
                                                fontSize: '14px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {t(
                                                'detailOrderInformation.changeSupport'
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="d-flex align-items-center gap-2 bg-warning p-2 rounded mb-2"
                                        style={{ width: 'fit-content' }}
                                    >
                                        <ImCancelCircle color="red" />
                                        <div
                                            style={{
                                                fontSize: '14px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {t(
                                                'detailOrderInformation.noChangeSupport'
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                {flight.seats_quantity[0].refundMoney > 0 ? (
                                    <div
                                        className="d-flex align-items-center gap-2 p-2 rounded"
                                        style={{
                                            backgroundColor:
                                                'rgb(230, 249, 237)',
                                            width: 'fit-content',
                                        }}
                                    >
                                        <IoCheckmarkDoneSharp color="green" />
                                        <div
                                            style={{
                                                fontSize: '14px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {t(
                                                'detailOrderInformation.refundSupport'
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center gap-2 bg-warning p-2 rounded">
                                        <ImCancelCircle color="red" />
                                        <div
                                            style={{
                                                fontSize: '14px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {t(
                                                'detailOrderInformation.noRefundSupport'
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );

    // *** HÀM MỚI: Dùng để hiển thị thông tin chi tiết của từng hành khách ***
    const renderPassengerDetails = (
        passengers,
        seatDataDeparture,
        baggageDataDeparture,
        seatDataComeback,
        baggageDataComeback,
        passengerType
    ) => {
        if (!passengers || passengers.length === 0) {
            return null;
        }

        // Xác định key để truy cập mảng ('adults' hoặc 'child')
        const typeKey =
            passengerType === t('detailOrderInformation.adult')
                ? 'adults'
                : 'child';

        return (
            <>
                <h6
                    style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        marginTop: '1rem',
                    }}
                >
                    {passengerType}:
                </h6>
                {passengers.map((passenger, index) => {
                    // Lấy dữ liệu tương ứng bằng index
                    const departureSeat = seatDataDeparture?.[typeKey]?.[index];
                    const departureBaggage =
                        baggageDataDeparture?.[typeKey]?.[index];
                    const comebackSeat = seatDataComeback?.[typeKey]?.[index];
                    const comebackBaggage =
                        baggageDataComeback?.[typeKey]?.[index];

                    return (
                        <div
                            key={`${typeKey}-${index}`}
                            className="mb-3"
                            style={{
                                fontSize: '14px',
                                borderLeft: '2px solid #eee',
                                paddingLeft: '12px',
                            }}
                        >
                            {/* Tên và ngày sinh */}
                            <div>
                                <span>
                                    {passenger.title === 'Ông'
                                        ? `${t('people.mr')}`
                                        : passenger.title === 'Bà'
                                        ? `${t('people.mrs')}`
                                        : `${t('people.mr')}`}{' '}
                                    {passenger.firstName} {passenger.lastName}
                                </span>
                                <span
                                    className="text-muted ms-2"
                                    style={{ fontSize: '13px' }}
                                >
                                    ({passenger.birthDay}/{passenger.birthMonth}
                                    /{passenger.birthYear})
                                </span>
                            </div>

                            {/* Thông tin chuyến đi */}
                            {departureSeat && departureBaggage && (
                                <div
                                    className="mt-1"
                                    style={{ fontSize: '13px', color: 'gray' }}
                                >
                                    <strong>
                                        {t('detailOrderInformation.departure')}
                                    </strong>
                                    <span className="ms-2">
                                        {t('detailOrderInformation.seat')}{' '}
                                        <strong>
                                            {departureSeat.row}
                                            {departureSeat.seatNumber}
                                        </strong>
                                    </span>
                                    <span className="ms-2">
                                        | {t('detailOrderInformation.baggage')}{' '}
                                        <strong>
                                            {departureBaggage.baggage}{' '}
                                            {t('detailOrderInformation.pieces')}
                                        </strong>
                                    </span>
                                </div>
                            )}

                            {/* Thông tin chuyến về (chỉ hiển thị nếu có) */}
                            {comebackSeat && comebackBaggage && (
                                <div
                                    className="mt-1"
                                    style={{ fontSize: '13px', color: 'gray' }}
                                >
                                    <strong>
                                        {t('detailOrderInformation.return')}
                                    </strong>
                                    <span className="ms-2">
                                        {t('detailOrderInformation.seat')}{' '}
                                        <strong>
                                            {comebackSeat.row}
                                            {comebackSeat.seatNumber}
                                        </strong>
                                    </span>
                                    <span className="ms-2">
                                        | {t('detailOrderInformation.baggage')}{' '}
                                        <strong>
                                            {comebackBaggage.baggage}{' '}
                                            {t('detailOrderInformation.pieces')}
                                        </strong>
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </>
        );
    };

    if (!orderData) {
        return (
            <Modal show={show} onHide={onHide} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{t('orderDetail.modalTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center p-5">
                        {loading
                            ? `${t('orderDetail.loading')}.`
                            : `${t('orderDetail.noData')}.`}
                    </div>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal show={show} onHide={onHide} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>{t('orderDetail.modalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        {/* Left Column - Flight Information */}
                        <Col lg={8}>
                            {orderData.flightDepartureId &&
                                renderFlightInfo(
                                    orderData.flightDepartureId,
                                    orderData.seatClassDepartureId,
                                    `${t('orderDetail.departureFlight')}`
                                )}

                            {orderData.flightComebackId &&
                                renderFlightInfo(
                                    orderData.flightComebackId,
                                    orderData.seatClassComebackId,
                                    `${t('orderDetail.returnFlight')}`
                                )}
                        </Col>

                        {/* Right Column - Order & Customer Information */}
                        <Col lg={4}>
                            {/* Order Status */}
                            <Card className="mb-4">
                                <Card.Header>
                                    <h6 className="mb-0">
                                        {t('orderDetail.statusOrder')}
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span
                                            className="text-muted"
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {t('orderDetail.status')}
                                        </span>
                                        <div
                                            className={`bg-${getStatusVariant(
                                                orderData.status
                                            )} text-white px-2 rounded d-flex justify-content-center align-items-center`}
                                            style={{
                                                fontSize: '13px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {/* {orderData.status} */}
                                            <TranslateText
                                                text={orderData.status}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 align-items-center">
                                        <span
                                            className="text-muted"
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {t('orderDetail.paymentMethod')}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {orderData.paymentMethod}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 align-items-center">
                                        <span
                                            className="text-muted"
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {t('orderDetail.orderCode')}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '15px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {orderData._id}
                                        </span>
                                    </div>
                                    {orderData.captureId && (
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span
                                                className="text-muted"
                                                style={{
                                                    fontSize: '15px',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                {t(
                                                    'orderDetail.transactionCode'
                                                )}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '15px',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                {orderData.captureId}
                                            </span>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* Passenger Information - ĐÃ SỬA */}
                            <Card className="mb-4">
                                <Card.Header>
                                    <h6 className="mb-0 d-flex align-items-center">
                                        <FaUsers className="me-2" />
                                        {t('orderDetail.passengerInfo')}
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    {/* Thông tin người đặt vé */}
                                    <h6
                                        style={{
                                            fontSize: '15px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {t('orderDetail.bookingCustomer')}
                                    </h6>
                                    <div
                                        className="mb-3"
                                        style={{
                                            fontSize: '14px',
                                            borderLeft: '2px solid #eee',
                                            paddingLeft: '12px',
                                        }}
                                    >
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <BiUser size={16} color="gray" />
                                            <span>
                                                {orderData.formData.firstName}{' '}
                                                {orderData.formData.lastName}
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <BiPhone size={16} color="gray" />
                                            <span>
                                                {orderData.formData.countryCode}{' '}
                                                {orderData.formData.phone}
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <BiEnvelope
                                                size={16}
                                                color="gray"
                                            />
                                            <span>
                                                {orderData.formData.email}
                                            </span>
                                        </div>
                                    </div>

                                    <hr />

                                    {/* Thông tin chi tiết từng hành khách */}
                                    {renderPassengerDetails(
                                        orderData.formDataAdult,
                                        orderData.seatDetailDataDeparture,
                                        orderData.baggageDataDeparture,
                                        orderData.seatDetailDataComeback,
                                        orderData.baggageDataComeback,
                                        `${t('orderDetail.adult')}`
                                    )}
                                    {renderPassengerDetails(
                                        orderData.formDataChild,
                                        orderData.seatDetailDataDeparture,
                                        orderData.baggageDataDeparture,
                                        orderData.seatDetailDataComeback,
                                        orderData.baggageDataComeback,
                                        `${t('orderDetail.child')}`
                                    )}
                                </Card.Body>
                            </Card>

                            {/* Price Breakdown */}
                            <Card>
                                <Card.Header>
                                    <h6 className="mb-0 d-flex align-items-center">
                                        <FaCreditCard className="me-2" />
                                        {t('orderDetail.priceDetail')}
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>
                                            {t(
                                                'orderDetail.totalTicketDeparture'
                                            )}
                                        </span>
                                        <span>
                                            {formatCurrency(
                                                Number(
                                                    orderData
                                                        .totalFlightDeparturePrice
                                                        .$numberDecimal
                                                )
                                            )}
                                        </span>
                                    </div>

                                    {parseInt(
                                        orderData.totalFlightComebackPrice
                                            ?.$numberDecimal || 0
                                    ) > 0 && (
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>
                                                {t(
                                                    'orderDetail.totalTicketReturn'
                                                )}
                                            </span>
                                            <span>
                                                {formatCurrency(
                                                    Number(
                                                        orderData
                                                            .totalFlightComebackPrice
                                                            .$numberDecimal
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {parseInt(
                                        orderData.totalBaggagePrice
                                            ?.$numberDecimal || 0
                                    ) > 0 && (
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>
                                                {t(
                                                    'orderDetail.totalBaggagePrice'
                                                )}
                                            </span>
                                            <span>
                                                {formatCurrency(
                                                    Number(
                                                        orderData
                                                            .totalBaggagePrice
                                                            .$numberDecimal
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {parseInt(
                                        orderData.totalSeatDetailPrice
                                            ?.$numberDecimal || 0
                                    ) > 0 && (
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>
                                                {t(
                                                    'orderDetail.totalSeatDetailPrice'
                                                )}
                                            </span>
                                            <span>
                                                {formatCurrency(
                                                    Number(
                                                        orderData
                                                            .totalSeatDetailPrice
                                                            .$numberDecimal
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {parseInt(
                                        orderData.discountValue
                                            ?.$numberDecimal || 0
                                    ) > 0 && (
                                        <div className="d-flex justify-content-between mb-2 text-success">
                                            <span>
                                                {t('orderDetail.discount')}
                                            </span>
                                            <span>
                                                -
                                                {formatCurrency(
                                                    Number(
                                                        orderData.discountValue
                                                            .$numberDecimal
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <strong>
                                            {t('orderDetail.total')}
                                        </strong>
                                        <strong>
                                            {formatCurrency(
                                                Number(
                                                    orderData
                                                        .totalFlightComebackPrice
                                                        .$numberDecimal
                                                ) +
                                                    Number(
                                                        orderData
                                                            .totalFlightDeparturePrice
                                                            .$numberDecimal
                                                    ) +
                                                    Number(
                                                        orderData
                                                            .totalBaggagePrice
                                                            .$numberDecimal
                                                    ) +
                                                    Number(
                                                        orderData
                                                            .totalSeatDetailPrice
                                                            .$numberDecimal
                                                    ) -
                                                    Number(
                                                        orderData.discountValue
                                                            .$numberDecimal
                                                    )
                                            )}
                                        </strong>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default OrderDetail;
