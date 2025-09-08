import React, { useState, useEffect, useCallback } from 'react';
import {
    Modal,
    Button,
    Row,
    Col,
    Badge,
    Spinner,
    Alert,
} from 'react-bootstrap';
import { FaPlaneDeparture, FaClock } from 'react-icons/fa';
import { adminGetDetailFlight } from '../../../services/AdminService';
import { getDateOnly } from '../../../utils/myFunction';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useFormatter } from '../../hooks/useFomatter';
import dayjs from 'dayjs';

const FlightDetailModal = ({ show, handleClose, flightId }) => {
    const { t } = useTranslation(); // Initialize useTranslation hook
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatUtcToLocal = (utcStr, timezone, format = 'HH:mm') => {
        console.log('check timezon: ', timezone);
        console.log('check utc:', utcStr);
        return dayjs.utc(utcStr).tz(timezone).format(format);
    };

    const { formatCurrency } = useFormatter();
    // Sử dụng useCallback để memoize hàm fetchFlightDetail, tránh việc tạo lại hàm không cần thiết
    const fetchFlightDetail = useCallback(async () => {
        if (!flightId) {
            // Chỉ gọi API khi có flightId
            setFlight(null);
            setLoading(false);
            setError(t('flightDetailModal.noFlightIdProvided'));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await adminGetDetailFlight(flightId);
            if (response && response.EC === 0) {
                setFlight(response.DT);
            } else {
                // Xử lý trường hợp API trả về lỗi hoặc không có dữ liệu
                setFlight(null);
                setError(
                    response?.EM ||
                        t('flightDetailModal.failedToLoadFlightDetails')
                );
            }
        } catch (err) {
            console.error('Lỗi khi tải chi tiết chuyến bay:', err); // Log lỗi để debug
            setError(t('flightDetailModal.errorLoadingData'));
            setFlight(null);
        } finally {
            setLoading(false);
        }
    }, [flightId, t]); // Add t as a dependency for useCallback

    useEffect(() => {
        if (show) {
            // Chỉ fetch dữ liệu khi modal được hiển thị
            fetchFlightDetail();
        } else {
            // Reset state khi modal đóng để chuẩn bị cho lần mở tiếp theo
            setFlight(null);
            setLoading(true); // Đặt lại loading về true để hiển thị spinner khi mở lại
            setError(null);
        }
    }, [show, fetchFlightDetail]); // Chạy lại khi show hoặc fetchFlightDetail thay đổi

    // const formatUtcToLocal = (isoString) => {
    //     if (!isoString) return t('common.notApplicable');
    //     try {
    //         const date = new Date(isoString);
    //         // Kiểm tra tính hợp lệ của ngày trước khi định dạng
    //         if (isNaN(date.getTime())) {
    //             return t('flightDetailModal.invalidDate');
    //         }
    //         return date.toLocaleString('vi-VN', {
    //             year: 'numeric',
    //             month: '2-digit',
    //             day: '2-digit',
    //             hour: '2-digit',
    //             minute: '2-digit',
    //             hour12: false,
    //         });
    //     } catch (e) {
    //         console.error('Lỗi định dạng ngày giờ:', e);
    //         return t('flightDetailModal.invalidDate');
    //     }
    // };

    // const formatCurrency = (amount) => {
    //     let numericAmount = amount;
    //     if (typeof amount === 'object' && amount && amount.$numberDecimal) {
    //         numericAmount = parseFloat(amount.$numberDecimal);
    //     }
    //     if (typeof numericAmount !== 'number' || isNaN(numericAmount)) {
    //         return t('common.notApplicable');
    //     }
    //     return new Intl.NumberFormat('vi-VN', {
    //         style: 'currency',
    //         currency: 'VND',
    //     }).format(numericAmount);
    // };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header
                closeButton
                style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderBottom: '1px solid #0056b3',
                }}
            >
                <Modal.Title style={{ color: 'white' }}>
                    {t('flightDetailModal.flightDetails')}:{' '}
                    {loading
                        ? t('common.loading')
                        : flight?.flight_number || t('common.notApplicable')}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {loading && (
                    <div className="text-center my-4">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">
                                {t('common.loading')}
                            </span>
                        </Spinner>
                        <p className="mt-2">
                            {t('flightDetailModal.loadingFlightDetails')}
                        </p>
                    </div>
                )}

                {error && (
                    <Alert variant="danger" className="my-4">
                        {t('common.error')}: {error}
                    </Alert>
                )}

                {!loading && !error && !flight && (
                    <Alert variant="info" className="my-4">
                        {t('flightDetailModal.noFlightInfoFound')}
                    </Alert>
                )}

                {flight && (
                    <>
                        <Row style={{ marginBottom: '16px' }}>
                            <Col md={6}>
                                <h5
                                    style={{
                                        color: '#007bff',
                                        marginBottom: '15px',
                                        borderBottom: '2px solid #e9ecef',
                                        paddingBottom: '5px',
                                    }}
                                >
                                    {t('flightDetailModal.generalInformation')}
                                </h5>

                                <p
                                    style={{
                                        marginBottom: '8px',
                                        fontSize: '0.95em',
                                    }}
                                >
                                    <strong>
                                        {t('flightDetailModal.flight')}:
                                    </strong>{' '}
                                    {
                                        flight.segments[0].departure_airport_id
                                            .province
                                    }
                                    {' - '}
                                    {
                                        flight.segments[
                                            flight.segments.length - 1
                                        ].arrival_airport_id.province
                                    }
                                </p>
                                <p
                                    style={{
                                        marginBottom: '8px',
                                        fontSize: '0.95em',
                                    }}
                                >
                                    <strong>
                                        {t('flightDetailModal.airline')}:
                                    </strong>{' '}
                                    {flight.airline?.name ||
                                        t('common.notApplicable')}
                                </p>
                                <p
                                    style={{
                                        marginBottom: '8px',
                                        fontSize: '0.95em',
                                    }}
                                >
                                    <strong>
                                        {t('flightDetailModal.flightNumber')}:
                                    </strong>{' '}
                                    {flight.flight_number ||
                                        t('common.notApplicable')}
                                </p>
                                <p
                                    style={{
                                        marginBottom: '8px',
                                        fontSize: '0.95em',
                                    }}
                                >
                                    <strong>
                                        {t('flightDetailModal.departureDate')}:
                                    </strong>{' '}
                                    {getDateOnly(
                                        flight.segments[0].departure_time
                                    )}
                                </p>

                                <p
                                    style={{
                                        marginBottom: '8px',
                                        fontSize: '0.95em',
                                    }}
                                >
                                    <strong>{t('common.status')}:</strong>{' '}
                                    <Badge
                                        bg={
                                            flight.status === 'active'
                                                ? 'success'
                                                : 'secondary'
                                        }
                                        style={{
                                            fontSize: '0.85em',
                                            padding: '0.5em 0.8em',
                                            borderRadius: '0.35rem',
                                        }}
                                    >
                                        {flight.status === 'active'
                                            ? t('common.active')
                                            : t('common.inactive')}
                                    </Badge>
                                </p>
                            </Col>
                            <Col md={6}>
                                {flight.airline?.logo_url && (
                                    <div style={{ textAlign: 'center' }}>
                                        <img
                                            src={flight.airline.logo_url}
                                            alt={
                                                flight.airline?.name ||
                                                t(
                                                    'flightDetailModal.airlineLogo'
                                                )
                                            }
                                            style={{
                                                maxWidth: '100px',
                                                height: 'auto',
                                                borderRadius: '8px',
                                                boxShadow:
                                                    '0 4px 10px rgba(0, 0, 0, 0.1)',
                                            }}
                                        />
                                    </div>
                                )}
                            </Col>
                        </Row>

                        <hr style={{ margin: '24px 0' }} />

                        <h5
                            style={{
                                color: '#007bff',
                                marginBottom: '15px',
                                borderBottom: '2px solid #e9ecef',
                                paddingBottom: '5px',
                            }}
                        >
                            {t('flightDetailModal.flightSegments', {
                                count: flight.segments?.length || 0,
                            })}
                        </h5>
                        {flight.segments && flight.segments.length > 0 ? (
                            flight.segments.map((segment, index) => (
                                <div
                                    key={index}
                                    style={{
                                        marginBottom: '16px',
                                        padding: '16px',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '4px',
                                        backgroundColor: '#f8f9fa',
                                        boxShadow:
                                            '0 2px 8px rgba(0, 0, 0, 0.05)',
                                    }}
                                >
                                    <h6
                                        style={{
                                            color: '#343a40',
                                            fontWeight: '600',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {t('flightDetailModal.segment', {
                                            index: index + 1,
                                        })}
                                    </h6>
                                    <p
                                        style={{
                                            marginBottom: '8px',
                                            fontSize: '0.95em',
                                        }}
                                    >
                                        <strong>
                                            {t('flightDetailModal.departure')}:
                                        </strong>{' '}
                                        {segment.departure_airport_id?.name ||
                                            t('common.notApplicable')}{' '}
                                        (
                                        {segment.departure_airport_id?.code ||
                                            t('common.notApplicable')}
                                        ) -{' '}
                                        {segment.departure_airport_id
                                            ?.province ||
                                            t('common.notApplicable')}
                                    </p>
                                    <p
                                        style={{
                                            marginBottom: '8px',
                                            fontSize: '0.95em',
                                        }}
                                    >
                                        <strong>
                                            {t('flightDetailModal.arrival')}:
                                        </strong>{' '}
                                        {segment.arrival_airport_id?.name ||
                                            t('common.notApplicable')}{' '}
                                        (
                                        {segment.arrival_airport_id?.code ||
                                            t('common.notApplicable')}
                                        ) -{' '}
                                        {segment.arrival_airport_id?.province ||
                                            t('common.notApplicable')}
                                    </p>
                                    <p
                                        style={{
                                            marginBottom: '8px',
                                            fontSize: '0.95em',
                                        }}
                                    >
                                        <FaClock
                                            style={{
                                                marginRight: '4px',
                                                color: '#007bff',
                                            }}
                                        />
                                        <strong>
                                            {t('flightDetailModal.takeoffTime')}
                                            :
                                        </strong>{' '}
                                        {formatUtcToLocal(
                                            segment.departure_time,
                                            segment.departure_airport_id
                                                .time_zon
                                        )}
                                    </p>
                                    <p
                                        style={{
                                            marginBottom: '8px',
                                            fontSize: '0.95em',
                                        }}
                                    >
                                        <FaClock
                                            style={{
                                                marginRight: '4px',
                                                color: '#007bff',
                                            }}
                                        />
                                        <strong>
                                            {t('flightDetailModal.landingTime')}
                                            :
                                        </strong>{' '}
                                        {formatUtcToLocal(
                                            segment.arrival_time,
                                            segment.arrival_airport_id.time_zon
                                        )}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <Alert variant="info">
                                {t('flightDetailModal.noSegmentInfo')}
                            </Alert>
                        )}

                        <hr style={{ margin: '24px 0' }} />

                        <h5
                            style={{
                                color: '#007bff',
                                marginBottom: '15px',
                                borderBottom: '2px solid #e9ecef',
                                paddingBottom: '5px',
                            }}
                        >
                            {t('flightDetailModal.seatClassPriceInfo', {
                                count: flight.seats_quantity?.length || 0,
                            })}
                        </h5>
                        {flight.seats_quantity &&
                        flight.seats_quantity.length > 0 ? (
                            flight.seats_quantity.map((seat, index) => (
                                <div
                                    key={index}
                                    style={{
                                        marginBottom: '16px',
                                        padding: '16px',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '4px',
                                        backgroundColor: '#f8f9fa',
                                        boxShadow:
                                            '0 2px 8px rgba(0, 0, 0, 0.05)',
                                    }}
                                >
                                    <h6
                                        style={{
                                            color: '#343a40',
                                            fontWeight: '600',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {t('flightDetailModal.seatClass')}:{' '}
                                        {seat.seat_class_id?.name ||
                                            t('common.notApplicable')}
                                    </h6>
                                    <Row>
                                        <Col md={6}>
                                            <p
                                                style={{
                                                    marginBottom: '8px',
                                                    fontSize: '0.95em',
                                                }}
                                            >
                                                <strong>
                                                    {t(
                                                        'flightDetailModal.adultPrice'
                                                    )}
                                                    :
                                                </strong>{' '}
                                                {formatCurrency(
                                                    Number(
                                                        seat.price
                                                            .$numberDecimal
                                                    )
                                                )}
                                            </p>
                                            <p
                                                style={{
                                                    marginBottom: '8px',
                                                    fontSize: '0.95em',
                                                }}
                                            >
                                                <strong>
                                                    {t(
                                                        'flightDetailModal.childPrice'
                                                    )}
                                                    :
                                                </strong>{' '}
                                                {formatCurrency(
                                                    Number(
                                                        seat.child_price
                                                            .$numberDecimal
                                                    )
                                                )}
                                            </p>
                                            <p
                                                style={{
                                                    marginBottom: '8px',
                                                    fontSize: '0.95em',
                                                }}
                                            >
                                                <strong>
                                                    {t(
                                                        'flightDetailModal.maxSeats'
                                                    )}
                                                    :
                                                </strong>{' '}
                                                {seat.maximum_seat ??
                                                    t('common.notApplicable')}
                                            </p>
                                            <p
                                                style={{
                                                    marginBottom: '8px',
                                                    fontSize: '0.95em',
                                                }}
                                            >
                                                <strong>
                                                    {t(
                                                        'flightDetailModal.remainingSeats'
                                                    )}
                                                    :
                                                </strong>{' '}
                                                {seat.current_seat ??
                                                    t('common.notApplicable')}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <p
                                                style={{
                                                    marginBottom: '8px',
                                                    fontSize: '0.95em',
                                                }}
                                            >
                                                <strong>
                                                    {t(
                                                        'flightDetailModal.carryOnBaggage'
                                                    )}
                                                    :
                                                </strong>{' '}
                                                {seat.carry_on_baggage ??
                                                    t(
                                                        'common.notApplicable'
                                                    )}{' '}
                                                kg
                                            </p>
                                            <p
                                                style={{
                                                    marginBottom: '8px',
                                                    fontSize: '0.95em',
                                                }}
                                            >
                                                <strong>
                                                    {t(
                                                        'flightDetailModal.freeCheckedBaggage'
                                                    )}
                                                    :
                                                </strong>{' '}
                                                {seat.free_baggage ??
                                                    t(
                                                        'common.notApplicable'
                                                    )}{' '}
                                                kg
                                            </p>
                                            <p
                                                style={{
                                                    marginBottom: '8px',
                                                    fontSize: '0.95em',
                                                }}
                                            >
                                                <strong>
                                                    {t(
                                                        'flightDetailModal.maxCheckedBaggage'
                                                    )}
                                                    :
                                                </strong>{' '}
                                                {seat.max_kilogram_baggage ??
                                                    t(
                                                        'common.notApplicable'
                                                    )}{' '}
                                                kg
                                            </p>
                                            <p
                                                style={{
                                                    marginBottom: '8px',
                                                    fontSize: '0.95em',
                                                }}
                                            >
                                                <strong>
                                                    {t(
                                                        'flightDetailModal.excessBaggagePrice'
                                                    )}
                                                    :
                                                </strong>{' '}
                                                {formatCurrency(
                                                    Number(
                                                        seat.price_baggage
                                                            .$numberDecimal
                                                    )
                                                )}
                                            </p>
                                        </Col>
                                    </Row>
                                    <p
                                        style={{
                                            marginBottom: '8px',
                                            fontSize: '0.95em',
                                        }}
                                    >
                                        <strong>
                                            {t(
                                                'flightDetailModal.changeFlight'
                                            )}
                                            :
                                        </strong>{' '}
                                        {seat.changeFlight === 'yes'
                                            ? t('common.yes')
                                            : t('common.no')}
                                    </p>
                                    <p
                                        style={{
                                            marginBottom: '8px',
                                            fontSize: '0.95em',
                                        }}
                                    >
                                        <strong>
                                            {t(
                                                'flightDetailModal.refundPercentage'
                                            )}
                                            :
                                        </strong>{' '}
                                        {seat.refundMoney ??
                                            t('common.notApplicable')}
                                        %
                                    </p>
                                    {seat.utils && seat.utils.length > 0 && (
                                        <p
                                            style={{
                                                marginBottom: '8px',
                                                fontSize: '0.95em',
                                            }}
                                        >
                                            <strong>
                                                {t(
                                                    'flightDetailModal.utilities'
                                                )}
                                                :
                                            </strong>{' '}
                                            {seat.utils
                                                .map((util) => util.name)
                                                .join(', ')}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <Alert variant="info">
                                {t('flightDetailModal.noSeatClassInfo')}
                            </Alert>
                        )}
                    </>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('common.close')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FlightDetailModal;
