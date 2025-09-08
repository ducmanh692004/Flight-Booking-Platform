import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Table } from 'react-bootstrap';
import { viewAllOrderData } from '../../../services/OrderService';
import {
    Container,
    Card,
    Row,
    Col,
    Badge,
    Button,
    Modal,
} from 'react-bootstrap';
import {
    FaPlane,
    FaClock,
    FaCreditCard,
    FaEye,
    FaTimes,
    FaUndo,
} from 'react-icons/fa';
import { IoAirplane } from 'react-icons/io5';
import { getDateOnly } from '../../../utils/myFunction';
import OrderDetail from '../Payment/PaymentOrder/DetailOrderInformation';
import { setItemsPayment } from '../../../redux/actions/paymentAction';
import ConfirmRefundOrder from './ConfirmRefundOrder';
import ConfirmCancelOrder from './ConfirmCancelOrder';
import { set } from 'lodash';
import { useTranslation } from 'react-i18next';
import { TranslateText } from '../../Translate';

const OrderHistory = () => {
    const userId = useSelector((state) => state.user.account.id);
    const [listOrder, setListOrder] = useState([]);
    const [orderIdSelected, setOrderIdSelected] = useState(null);
    const [showOrderDetail, setShowOrderDetail] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [showModalRefund, setShowModalRefund] = useState(false);
    const [showModalCancel, setShowModalCancel] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [itemCancel, setItemCancel] = useState(null);
    const [itemRefund, setItemRefund] = useState(null);
    const [fetchDataAgain, setFetchDataAgain] = useState(false);

    const { t } = useTranslation();
    const handleFetchDataAgain = () => {
        setFetchDataAgain(true);
    };

    const dispatch = useDispatch();
    const history = useHistory();

    const handleHideModalRefund = () => {
        setShowModalRefund(false);
    };

    const handleHideModalCancel = () => {
        setShowModalCancel(false);
    };

    const handleHideOrderDetail = () => {
        setShowOrderDetail(false);
    };

    const handleShowOrderDeatail = (orderId) => {
        setOrderIdSelected(orderId._id);
        setShowOrderDetail(true);
    };

    const handleFetchData = async () => {
        try {
            if (userId !== '') {
                const response = await viewAllOrderData(userId);
                if (response && response.EC === 0) {
                    setListOrder(response.DT);
                } else {
                    toast.error(response.EM);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        handleFetchData();
    }, [fetchDataAgain]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Đã thanh toán': { variant: 'success', text: 'Đã thanh toán' },
            'Chờ thanh toán': { variant: 'warning', text: 'Chờ thanh toán' },
            'Đang chờ hoàn tiền': {
                variant: 'primary',
                text: 'Đang chờ hoàn tiền',
            },
        };
        return statusConfig[status] || { variant: 'success', text: status };
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handlePayment = (order) => {
        const orderPayment = {
            currentDepartureBaggage: order.baggageDataDeparture,
            currentComebackBaggage: order.baggageDataComeback,
            flightDepartureId: order.flightDepartureId._id,
            flightComebackId: order.flightComebackId?._id || null,
            currentSeatClassDeparture: order.seatClassDepartureId,
            currentSeatClassComeback: order.seatClassComebackId,
            peopleQuantity: order.peopleQuantity,
            formData: order.formData,
            formAllDataAdult: order.formDataAdult,
            formAllDataChild: order.formDataChild,
            totalBaggagePrice: Number(order.totalBaggagePrice.$numberDecimal),
            totalSeatDetailPrice: Number(
                order.totalSeatDetailPrice.$numberDecimal
            ),
            priceTotalFlightDeparture: Number(
                order.totalFlightDeparturePrice.$numberDecimal
            ),
            priceTotalFlightComeback: Number(
                order.totalFlightComebackPrice.$numberDecimal
            ),
            discountValue: Number(order.discountValue.$numberDecimal),
            orderId: order._id,
        };

        dispatch(setItemsPayment(orderPayment));
        history.push('/payment');
    };

    const handleCancelOrder = (orderId) => {
        setItemCancel(orderId);
        setShowModalCancel(true);
    };

    const handleRefund = (orderData) => {
        setItemRefund(orderData);
        setShowModalRefund(true);
    };

    return (
        <div>
            <ConfirmRefundOrder
                show={showModalRefund}
                handleClose={handleHideModalRefund}
                itemRefund={itemRefund}
                handleFetchDataAgain={handleFetchDataAgain}
            />

            <ConfirmCancelOrder
                show={showModalCancel}
                handleClose={handleHideModalCancel}
                itemCancel={itemCancel}
                handleFetchDataAgain={handleFetchDataAgain}
            />

            <h5>{t('orderHistory.title')}</h5>
            <hr style={{ marginTop: '48px' }}></hr>

            <div
                className="mt-4"
                style={{ maxHeight: '550px', overflowY: 'auto' }}
            >
                {listOrder && listOrder.length > 0 ? (
                    listOrder.map((order, index) => (
                        <Card key={index} className="mb-4 shadow-sm">
                            <Card.Header className="bg-light">
                                <Row className="align-items-center">
                                    <Col md={6}>
                                        <h6 className="mb-0">
                                            {t('orderHistory.orderCode')}{' '}
                                            {order._id}
                                        </h6>
                                    </Col>
                                    <Col md={6} className="text-md-end">
                                        <Badge
                                            bg={
                                                getStatusBadge(order.status)
                                                    .variant
                                            }
                                            // className="me-2"
                                        >
                                            {
                                                getStatusBadge(
                                                    <TranslateText
                                                        text={order.status}
                                                    />
                                                ).text
                                            }
                                        </Badge>
                                    </Col>
                                </Row>
                            </Card.Header>

                            <Card.Body>
                                <Row>
                                    <div className="d-flex align-items-center gap-4">
                                        {/* Thông tin chuyến bay đi */}
                                        <div className="mb-3">
                                            <h6 className="text-primary">
                                                {order.flightComebackId === null
                                                    ? `${t(
                                                          'orderHistory.oneWayFlight'
                                                      )}`
                                                    : `${t(
                                                          'orderHistory.roundTripFlight'
                                                      )}`}
                                            </h6>
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <strong>
                                                    {
                                                        order.flightDepartureId
                                                            .segments[0]
                                                            .departure_airport_id
                                                            .province
                                                    }{' '}
                                                    (
                                                    {
                                                        order.flightDepartureId
                                                            .segments[0]
                                                            .departure_airport_id
                                                            .code
                                                    }
                                                    )
                                                </strong>
                                                <IoAirplane className="text-muted" />

                                                <strong>
                                                    {
                                                        order.flightDepartureId
                                                            .segments[
                                                            order
                                                                .flightDepartureId
                                                                .segments
                                                                .length - 1
                                                        ].arrival_airport_id
                                                            .province
                                                    }{' '}
                                                    (
                                                    {
                                                        order.flightDepartureId
                                                            .segments[
                                                            order
                                                                .flightDepartureId
                                                                .segments
                                                                .length - 1
                                                        ].arrival_airport_id
                                                            .code
                                                    }
                                                    )
                                                </strong>
                                            </div>
                                        </div>

                                        {order.flightComebackId !== null && (
                                            <hr
                                                className="mt-0 mb-3"
                                                style={{
                                                    height: '50px',
                                                    width: '2px',
                                                }}
                                            ></hr>
                                        )}

                                        {/* Thông tin chuyến bay về (nếu có) */}
                                        {order.flightComebackId !== null && (
                                            <div className="mb-3">
                                                <h6 className="text-primary">
                                                    {t(
                                                        'orderHistory.returnFlight'
                                                    )}
                                                </h6>
                                                <div className="d-flex align-items-center gap-3 mb-2">
                                                    <strong>
                                                        {
                                                            order
                                                                .flightComebackId
                                                                .segments[0]
                                                                .departure_airport_id
                                                                .province
                                                        }{' '}
                                                        (
                                                        {
                                                            order
                                                                .flightComebackId
                                                                .segments[0]
                                                                .departure_airport_id
                                                                .code
                                                        }
                                                        )
                                                    </strong>
                                                    <IoAirplane className="text-muted" />
                                                    <strong>
                                                        {
                                                            order
                                                                .flightComebackId
                                                                .segments[
                                                                order
                                                                    .flightComebackId
                                                                    .segments
                                                                    .length - 1
                                                            ].arrival_airport_id
                                                                .province
                                                        }{' '}
                                                        (
                                                        {
                                                            order
                                                                .flightComebackId
                                                                .segments[
                                                                order
                                                                    .flightComebackId
                                                                    .segments
                                                                    .length - 1
                                                            ].arrival_airport_id
                                                                .code
                                                        }
                                                        )
                                                    </strong>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Col md={12} className="">
                                        <div className="d-flex gap-5">
                                            <div className="d-flex gap-2 align-items-center">
                                                <small className="text-muted">
                                                    {t(
                                                        'orderHistory.passengerCount'
                                                    )}
                                                </small>
                                                <div>
                                                    {order.peopleQuantity
                                                        .adult +
                                                        order.peopleQuantity
                                                            .child}
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2 align-items-center">
                                                <small className="text-muted">
                                                    {t('orderHistory.time')}
                                                </small>
                                                <div>
                                                    {getDateOnly(
                                                        order.flightDepartureId
                                                            .segments[0]
                                                            .departure_time
                                                    )}
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2 align-items-center">
                                                <small className="text-muted">
                                                    {t(
                                                        'orderHistory.paymentMethod'
                                                    )}
                                                </small>
                                                <div className="d-flex justify-content-center">
                                                    {order.paymentMethod}
                                                </div>
                                            </div>
                                        </div>

                                        <hr
                                            className="mt-3 mb-3"
                                            style={{ height: '0.5px' }}
                                        ></hr>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="text-center d-flex align-items-center gap-2">
                                                <small
                                                    className="text-muted"
                                                    style={{ fontSize: '16px' }}
                                                >
                                                    {t(
                                                        'orderHistory.totalPrice'
                                                    )}
                                                </small>
                                                <h5
                                                    className="text-primary mb-0 mt-0"
                                                    style={{ fontSize: '18px' }}
                                                >
                                                    {formatCurrency(
                                                        Number(
                                                            order
                                                                ?.totalFlightDeparturePrice
                                                                ?.$numberDecimal
                                                        ) +
                                                            Number(
                                                                order
                                                                    ?.totalFlightComebackPrice
                                                                    ?.$numberDecimal
                                                            ) +
                                                            Number(
                                                                order
                                                                    ?.totalBaggagePrice
                                                                    ?.$numberDecimal
                                                            ) +
                                                            Number(
                                                                order
                                                                    ?.totalSeatDetailPrice
                                                                    ?.$numberDecimal
                                                            ) -
                                                            Number(
                                                                order
                                                                    ?.discountValue
                                                                    ?.$numberDecimal
                                                            )
                                                    )}
                                                </h5>
                                            </div>
                                            <div className="d-flex gap-2">
                                                {order.status ===
                                                    'Chờ thanh toán' && (
                                                    <Button
                                                        variant="warning text-white"
                                                        size="sm"
                                                        onClick={() =>
                                                            handlePayment(order)
                                                        }
                                                        style={{
                                                            fontWeight: '500',
                                                        }}
                                                    >
                                                        {t(
                                                            'orderHistory.payNow'
                                                        )}
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleShowOrderDeatail(
                                                            order
                                                        )
                                                    }
                                                    style={{ height: '30px' }}
                                                >
                                                    <span
                                                        style={{
                                                            fontWeight: '500',
                                                        }}
                                                    >
                                                        {t(
                                                            'orderHistory.details'
                                                        )}
                                                    </span>
                                                </Button>

                                                {order.status ===
                                                    'Chờ thanh toán' && (
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        style={{
                                                            height: '30px',
                                                            fontWeight: '500',
                                                        }}
                                                        onClick={() =>
                                                            handleCancelOrder(
                                                                order._id
                                                            )
                                                        }
                                                    >
                                                        {t(
                                                            'orderHistory.cancelOrder'
                                                        )}
                                                    </Button>
                                                )}

                                                {order.status ===
                                                    'Đã thanh toán' && (
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        style={{
                                                            height: '30px',
                                                            fontWeight: '500',
                                                        }}
                                                        onClick={() =>
                                                            handleRefund({
                                                                orderId:
                                                                    order._id,
                                                                paymentMethod:
                                                                    order.paymentMethod,
                                                            })
                                                        }
                                                    >
                                                        {t(
                                                            'orderHistory.cancelAndRefund'
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <span>{t('orderHistory.noOrder')}</span>
                )}
            </div>
            <OrderDetail
                orderId={orderIdSelected}
                onHide={handleHideOrderDetail}
                show={showOrderDetail}
            />
        </div>
    );
};

export default OrderHistory;
