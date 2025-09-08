import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import {
    adminGetAllSeatClass,
    adminGetAllUtils,
    adminGetFlightDataToUpdate,
    adminUpdateFlight,
} from '../../../services/AdminService';
import { TranslateText } from '../../Translate';

const EditFlightForm = ({ show, handleClose, flightId }) => {
    const { t } = useTranslation(); // Sử dụng hook useTranslation
    const [flightData, setFlightData] = useState(null);
    const [seatClasses, setSeatClasses] = useState([]);
    const [utils, setUtils] = useState([]);
    const [seatPrices, setSeatPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [seatRes, utilsRes, flightRes] = await Promise.all([
                    adminGetAllSeatClass(),
                    adminGetAllUtils(),
                    adminGetFlightDataToUpdate(flightId),
                ]);
                setSeatClasses(seatRes.DT || []);
                setUtils(utilsRes.DT || []);
                setFlightData(flightRes.DT.flightData);
                setSeatPrices(flightRes.DT.seatPositionPriceData || []);
                setLoading(false);
            } catch (err) {
                toast.error(t('editFlightForm.errorLoadingFlightData')); // Dịch chuỗi này
                setLoading(false);
            }
        };
        if (show && flightId) fetchData();
    }, [show, flightId, t]); // Thêm 't' vào dependencies array

    const updateField = (section, index, field, value) => {
        const updated = [...flightData[section]];
        updated[index][field] = value;
        setFlightData((prev) => ({ ...prev, [section]: updated }));
    };

    const toggleSeatUtil = (index, utilId, isChecked) => {
        const updated = [...flightData.seats_quantity];
        const currentUtils =
            updated[index].utils?.map((util) => util._id || util) || [];
        const idStr = utilId.toString();

        if (isChecked) {
            if (!currentUtils.includes(idStr)) {
                updated[index].utils = [...currentUtils, idStr];
            }
        } else {
            updated[index].utils = currentUtils.filter((id) => id !== idStr);
        }

        setFlightData((prev) => ({ ...prev, seats_quantity: updated }));
    };

    const handleSubmit = async () => {
        try {
            // Format seats_quantity
            const formattedSeats = flightData.seats_quantity.map((s) => ({
                _id: s._id,
                seat_class_id:
                    typeof s.seat_class_id === 'object'
                        ? s.seat_class_id._id
                        : s.seat_class_id,
                price: (s.price?.$numberDecimal || s.price)?.toString(),
                child_price: (
                    s.child_price?.$numberDecimal || s.child_price
                )?.toString(),
                price_baggage: (
                    s.price_baggage?.$numberDecimal || s.price_baggage
                )?.toString(),
                utils: s.utils.map((u) => (typeof u === 'object' ? u._id : u)),
                maximum_seat: Number(s.maximum_seat),
                current_seat: Number(s.current_seat),
                carry_on_baggage: Number(s.carry_on_baggage),
                free_baggage: Number(s.free_baggage),
                max_kilogram_baggage: Number(s.max_kilogram_baggage),
                changeFlight: s.changeFlight,
                refundMoney: Number(s.refundMoney),
            }));

            // Format segments
            const formattedSegments = flightData.segments.map((seg) => ({
                _id: seg._id,
                departure_airport_id:
                    typeof seg.departure_airport_id === 'object'
                        ? seg.departure_airport_id._id
                        : seg.departure_airport_id,
                arrival_airport_id:
                    typeof seg.arrival_airport_id === 'object'
                        ? seg.arrival_airport_id._id
                        : seg.arrival_airport_id,
                departure_time: new Date(seg.departure_time).toISOString(),
                arrival_time: new Date(seg.arrival_time).toISOString(),
            }));

            // Format main flight data only (NO seatPositionPriceData)
            const fullPayload = {
                flightData: {
                    _id: flightData._id,
                    airline:
                        typeof flightData.airline === 'object'
                            ? flightData.airline._id
                            : flightData.airline,
                    flight_number: flightData.flight_number,
                    segments: formattedSegments,
                    seats_quantity: formattedSeats,
                    status: flightData.status,
                },
            };

            console.log('Payload gửi:', fullPayload); // 👉 kiểm tra nếu cần

            const res = await adminUpdateFlight(fullPayload);

            if (res.EC === 0) {
                toast.success(t('editFlightForm.updateSuccess')); // Dịch chuỗi này
                handleClose();
            } else {
                toast.error(t('editFlightForm.updateError')); // Dịch chuỗi này
            }
        } catch (err) {
            console.error(err);
            toast.error(t('editFlightForm.submitError')); // Dịch chuỗi này
        }
    };

    if (!flightData || loading)
        return <Spinner animation="border" className="m-5" />;

    return (
        <Modal show={show} onHide={handleClose} size="xl" scrollable>
            <Modal.Header closeButton>
                <Modal.Title>{t('editFlightForm.modalTitle')}</Modal.Title>{' '}
                {/* Dịch chuỗi này */}
            </Modal.Header>
            <Modal.Body>
                <Card className="mb-4">
                    <Card.Header>
                        {t('editFlightForm.flightInfoTitle')}
                    </Card.Header>{' '}
                    {/* Dịch chuỗi này */}
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        {t('editFlightForm.flightCodeLabel')}
                                    </Form.Label>{' '}
                                    {/* Dịch chuỗi này */}
                                    <Form.Control
                                        value={flightData.flight_number}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        {t('editFlightForm.airlineLabel')}
                                    </Form.Label>{' '}
                                    {/* Dịch chuỗi này */}
                                    <Form.Control
                                        value={flightData.airline.name}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header>
                        {t('editFlightForm.segmentsTitle')}
                    </Card.Header>{' '}
                    {/* Dịch chuỗi này */}
                    <Card.Body>
                        {flightData.segments.map((seg, i) => (
                            <Row key={i} className="mb-4">
                                <Col md={12}>
                                    <h5>
                                        {t('editFlightForm.segment', {
                                            number: i + 1,
                                        })}
                                    </h5>{' '}
                                    {/* Dịch chuỗi này */}
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'editFlightForm.departurePointLabel'
                                            )}
                                        </Form.Label>{' '}
                                        {/* Dịch chuỗi này */}
                                        {/* <Form.Control
                                            plaintext
                                            readOnly
                                            value={`${seg.departure_airport_id.name} (${seg.departure_airport_id.code})`}
                                        /> */}
                                        <h6 className="mb-3 mt-0">
                                            <TranslateText
                                                text={
                                                    seg.departure_airport_id
                                                        .name
                                                }
                                            />{' '}
                                            ({seg.departure_airport_id.code})
                                        </h6>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'editFlightForm.arrivalPointLabel'
                                            )}
                                        </Form.Label>{' '}
                                        {/* Dịch chuỗi này */}
                                        {/* <Form.Control
                                            plaintext
                                            readOnly
                                            // value={`${<TranslateText text={seg.arrival_airport_id.name}/>`} (${seg.arrival_airport_id.code})`}
                                            value={`${seg.arrival_airport_id.name} (${seg.arrival_airport_id.code})`}
                                        />
                                         */}
                                        <h6 className="mb-3 mt-0">
                                            <TranslateText
                                                text={
                                                    seg.arrival_airport_id.name
                                                }
                                            />{' '}
                                            ({seg.arrival_airport_id.code})
                                        </h6>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'editFlightForm.departureTimeLabel'
                                            )}{' '}
                                            {/* Dịch chuỗi này */}
                                        </Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            value={new Date(seg.departure_time)
                                                .toISOString()
                                                .slice(0, 16)}
                                            onChange={(e) =>
                                                updateField(
                                                    'segments',
                                                    i,
                                                    'departure_time',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'editFlightForm.arrivalTimeLabel'
                                            )}
                                        </Form.Label>{' '}
                                        {/* Dịch chuỗi này */}
                                        <Form.Control
                                            type="datetime-local"
                                            value={new Date(seg.arrival_time)
                                                .toISOString()
                                                .slice(0, 16)}
                                            onChange={(e) =>
                                                updateField(
                                                    'segments',
                                                    i,
                                                    'arrival_time',
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        ))}
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Header>
                        {t('editFlightForm.seatClassInfoTitle')}
                    </Card.Header>{' '}
                    {/* Dịch chuỗi này */}
                    <Card.Body>
                        {flightData.seats_quantity.map((seat, index) => (
                            <Card key={index} className="mb-3">
                                <Card.Body>
                                    <h5>
                                        {/* {seat.seat_class_id.name} */}
                                        <TranslateText
                                            text={seat.seat_class_id.name}
                                        />
                                    </h5>
                                    <p className="text-muted">
                                        {/* {seat.seat_class_id.description} */}
                                        <TranslateText
                                            text={
                                                seat.seat_class_id.description
                                            }
                                        />
                                    </p>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>
                                                    {t(
                                                        'editFlightForm.adultPriceLabel'
                                                    )}{' '}
                                                    {/* Dịch chuỗi này */}
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={
                                                        seat.price
                                                            ?.$numberDecimal ||
                                                        seat.price
                                                    }
                                                    onChange={(e) =>
                                                        updateField(
                                                            'seats_quantity',
                                                            index,
                                                            'price',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>
                                                    {t(
                                                        'editFlightForm.childPriceLabel'
                                                    )}{' '}
                                                    {/* Dịch chuỗi này */}
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={
                                                        seat.child_price
                                                            ?.$numberDecimal ||
                                                        seat.child_price
                                                    }
                                                    onChange={(e) =>
                                                        updateField(
                                                            'seats_quantity',
                                                            index,
                                                            'child_price',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>
                                                    {t(
                                                        'editFlightForm.carryOnBaggageLabel'
                                                    )}{' '}
                                                    {/* Dịch chuỗi này */}
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={
                                                        seat.carry_on_baggage
                                                    }
                                                    onChange={(e) =>
                                                        updateField(
                                                            'seats_quantity',
                                                            index,
                                                            'carry_on_baggage',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>
                                                    {t(
                                                        'editFlightForm.extraBaggagePriceLabel'
                                                    )}{' '}
                                                    {/* Dịch chuỗi này */}
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={
                                                        seat.price_baggage
                                                            ?.$numberDecimal ||
                                                        seat.price_baggage
                                                    }
                                                    onChange={(e) =>
                                                        updateField(
                                                            'seats_quantity',
                                                            index,
                                                            'price_baggage',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>
                                                    {t(
                                                        'editFlightForm.refundPercentageLabel'
                                                    )}{' '}
                                                    {/* Dịch chuỗi này */}
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={seat.refundMoney}
                                                    onChange={(e) =>
                                                        updateField(
                                                            'seats_quantity',
                                                            index,
                                                            'refundMoney',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>
                                                    {t(
                                                        'editFlightForm.freeBaggageLabel'
                                                    )}{' '}
                                                    {/* Dịch chuỗi này */}
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={seat.free_baggage}
                                                    onChange={(e) =>
                                                        updateField(
                                                            'seats_quantity',
                                                            index,
                                                            'free_baggage',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>
                                                    {t(
                                                        'editFlightForm.maxBaggageWeightLabel'
                                                    )}{' '}
                                                    {/* Dịch chuỗi này */}
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={
                                                        seat.max_kilogram_baggage
                                                    }
                                                    onChange={(e) =>
                                                        updateField(
                                                            'seats_quantity',
                                                            index,
                                                            'max_kilogram_baggage',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>
                                                    {t(
                                                        'editFlightForm.allowRefundLabel'
                                                    )}{' '}
                                                    {/* Dịch chuỗi này */}
                                                </Form.Label>
                                                <Form.Control
                                                    plaintext
                                                    disabled
                                                    value={
                                                        seat.refundMoney > 0
                                                            ? t('common.yes') // Dịch chuỗi này
                                                            : t('common.no') // Dịch chuỗi này
                                                    }
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Form.Label>
                                            {t('editFlightForm.utilitiesLabel')}
                                        </Form.Label>{' '}
                                        {/* Dịch chuỗi này */}
                                        {utils.map((util) => (
                                            <Col md={3} key={util._id}>
                                                <Form.Check
                                                    type="checkbox"
                                                    label={
                                                        <TranslateText
                                                            text={util.name}
                                                        />
                                                    }
                                                    checked={seat.utils?.some(
                                                        (u) =>
                                                            (u._id || u) ===
                                                            util._id
                                                    )}
                                                    onChange={(e) =>
                                                        toggleSeatUtil(
                                                            index,
                                                            util._id,
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </Card.Body>
                </Card>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>
                    {t('editFlightForm.saveChangesButton')}{' '}
                    {/* Dịch chuỗi này */}
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    {t('editFlightForm.cancelButton')} {/* Dịch chuỗi này */}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditFlightForm;
