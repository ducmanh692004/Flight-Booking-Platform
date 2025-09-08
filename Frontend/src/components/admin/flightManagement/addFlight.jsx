import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Button,
    Container,
    Row,
    Col,
    Card,
    ListGroup,
    Alert,
    Badge,
} from 'react-bootstrap';
import {
    adminSearchDestinationSuggestion,
    adminSearcgAirlineSuggestion,
    adminGetAllSeatClass,
    adminGetAllUtils,
    adminAddFlight,
} from '../../../services/AdminService';
import { toast } from 'react-toastify';
import { useFormatter } from '../../hooks/useFomatter';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { TranslateText } from '../../Translate';

const cabinLayouts = [
    '1-1',
    '2-2',
    '3-3',
    '3-2',
    '2-3',
    '2-2-2',
    '3-3-3',
    '3-4-3',
    '2-4-2',
    '1-2-1',
    '1-1-1',
    '1-2-2',
    '2-3-2',
    '2-4-3',
    '3-2-3',
    '2-5-2',
    '3-5-3',
];

const AddFlightForm = ({ show, handleClose }) => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation

    const [flightData, setFlightData] = useState({
        flight_number: '',
        airline: null,
        segments: [
            {
                departure_airport_id: null,
                arrival_airport_id: null,
                departure_time: '',
                arrival_time: '',
            },
        ],
        seats_quantity: [],
    });

    const [suggestions, setSuggestions] = useState({});
    const [showSuggestions, setShowSuggestions] = useState({});
    const [searchTerms, setSearchTerms] = useState({});
    const [seatClasses, setSeatClasses] = useState([]);
    const [utils, setUtils] = useState([]);

    const { formatCurrency } = useFormatter();

    useEffect(() => {
        const fetchStaticData = async () => {
            try {
                const seatRes = await adminGetAllSeatClass();
                setSeatClasses(seatRes.DT || []);

                const utilsRes = await adminGetAllUtils();
                setUtils(utilsRes.DT || []);
            } catch (err) {
                console.error(
                    t('addFlightForm.errors.fetchSeatClassUtils'), // Dịch thông báo lỗi
                    err
                );
            }
        };

        fetchStaticData();
    }, []);

    const handleDestinationSearch = async (value, type, segmentIndex) => {
        const key = `${segmentIndex}_${type}`;
        setSearchTerms((prev) => ({ ...prev, [key]: value }));

        if (value.length > 0) {
            try {
                const res = await adminSearchDestinationSuggestion(value);
                setSuggestions((prev) => ({ ...prev, [key]: res.DT || [] }));
                setShowSuggestions((prev) => ({ ...prev, [key]: true }));
            } catch (err) {
                console.error(t('addFlightForm.errors.searchAirport'), err); // Dịch thông báo lỗi
            }
        } else {
            setShowSuggestions((prev) => ({ ...prev, [key]: false }));
        }
    };

    const handleAirlineSearch = async (value) => {
        setSearchTerms((prev) => ({ ...prev, airline: value }));

        if (value.length > 0) {
            try {
                const res = await adminSearcgAirlineSuggestion(value);
                setSuggestions((prev) => ({ ...prev, airline: res.DT || [] }));
                setShowSuggestions((prev) => ({ ...prev, airline: true }));
            } catch (err) {
                console.error(t('addFlightForm.errors.searchAirline'), err); // Dịch thông báo lỗi
            }
        } else {
            setShowSuggestions((prev) => ({ ...prev, airline: false }));
        }
    };

    const selectDestination = (destination, type, segmentIndex) => {
        const newSegments = [...flightData.segments];
        newSegments[segmentIndex][`${type}_airport_id`] = destination._id;

        setFlightData((prev) => ({ ...prev, segments: newSegments }));
        const key = `${segmentIndex}_${type}`;
        setSearchTerms((prev) => ({
            ...prev,
            [key]: `${destination.name} (${destination.code})`,
        }));
        setShowSuggestions((prev) => ({ ...prev, [key]: false }));
    };

    const selectAirline = (airline) => {
        setFlightData((prev) => ({ ...prev, airline: airline._id }));
        setSearchTerms((prev) => ({ ...prev, airline: airline.name }));
        setShowSuggestions((prev) => ({ ...prev, airline: false }));
    };

    const addSegment = () => {
        const newIndex = flightData.segments.length;
        setFlightData((prev) => ({
            ...prev,
            segments: [
                ...prev.segments,
                {
                    departure_airport_id: null,
                    arrival_airport_id: null,
                    departure_time: '',
                    arrival_time: '',
                },
            ],
        }));

        setSearchTerms((prev) => ({
            ...prev,
            [`${newIndex}_departure`]: '',
            [`${newIndex}_arrival`]: '',
        }));
        setSuggestions((prev) => ({
            ...prev,
            [`${newIndex}_departure`]: [],
            [`${newIndex}_arrival`]: [],
        }));
        setShowSuggestions((prev) => ({
            ...prev,
            [`${newIndex}_departure`]: false,
            [`${newIndex}_arrival`]: false,
        }));
    };

    const removeSegment = (index) => {
        if (flightData.segments.length > 1) {
            const newSegments = flightData.segments.filter(
                (_, i) => i !== index
            );
            setFlightData((prev) => ({ ...prev, segments: newSegments }));

            const newSearchTerms = { ...searchTerms };
            const newSuggestions = { ...suggestions };
            const newShowSuggestions = { ...showSuggestions };

            delete newSearchTerms[`${index}_departure`];
            delete newSearchTerms[`${index}_arrival`];
            delete newSuggestions[`${index}_departure`];
            delete newSuggestions[`${index}_arrival`];
            delete newShowSuggestions[`${index}_departure`];
            delete newShowSuggestions[`${index}_arrival`];

            setSearchTerms(newSearchTerms);
            setSuggestions(newSuggestions);
            setShowSuggestions(newShowSuggestions);
        }
    };

    // const [seatClasses, setSeatClasses] = useState([]); // Removed duplicate
    // const [utils, setUtils] = useState([]); // Removed duplicate

    // const [seatClasses, setSeatClasses] = useState([]); // Removed duplicate
    // const [utils, setUtils] = useState([]); // Removed duplicate

    // const [seatClasses, setSeatClasses] = useState([]); // Removed duplicate
    // const [utils, setUtils] = useState([]); // Removed duplicate

    // const [seatClasses, setSeatClasses] = useState([]); // Removed duplicate
    // const [utils, setUtils] = useState([]); // Removed duplicate

    // const [seatClasses, setSeatClasses] = useState([]); // Removed duplicate
    // const [utils, setUtils] = useState([]); // Removed duplicate

    useEffect(() => {
        const fetchStaticData = async () => {
            try {
                const seatRes = await adminGetAllSeatClass();
                setSeatClasses(seatRes.DT || []);
                const utilsRes = await adminGetAllUtils();
                setUtils(utilsRes.DT || []);
            } catch (err) {
                console.error(t('addFlightForm.errors.fetchDataGeneral'), err); // Dịch thông báo lỗi
            }
        };
        fetchStaticData();
    }, []);

    const addSeatClass = () => {
        setFlightData((prev) => ({
            ...prev,
            seats_quantity: [
                ...prev.seats_quantity,
                {
                    seat_class_id: '',
                    maximum_seat: 0,
                    price: 0,
                    child_price: 0,
                    window_seat_price: 0, // ✅ mới
                    normal_seat_price: 0, // ✅ mới
                    carry_on_baggage: 0,
                    free_baggage: 0,
                    max_kilogram_baggage: 0,
                    price_baggage: 0,
                    changeFlight: 'no',
                    refundMoney: 0,
                    utils: [],
                    layout: [],
                },
            ],
        }));
    };

    const updateSeatField = (index, field, value) => {
        setFlightData((prev) => {
            const updated = [...prev.seats_quantity];
            updated[index][field] = value;
            return { ...prev, seats_quantity: updated };
        });
    };
    const toggleSeatUtil = (index, utilId, isChecked) => {
        setFlightData((prev) => {
            const updated = [...prev.seats_quantity];
            const currentUtils = (updated[index].utils || []).map(String);
            const utilIdStr = utilId.toString();

            if (isChecked) {
                // Chỉ thêm nếu chưa tồn tại
                if (!currentUtils.includes(utilIdStr)) {
                    updated[index].utils = [...currentUtils, utilIdStr];
                }
            } else {
                // Chỉ xóa nếu đang tồn tại
                updated[index].utils = currentUtils.filter(
                    (id) => id !== utilIdStr
                );
            }

            return { ...prev, seats_quantity: updated };
        });
    };

    const removeSeatClass = (index) => {
        const updatedSeats = flightData.seats_quantity.filter(
            (_, i) => i !== index
        );
        setFlightData((prev) => ({
            ...prev,
            seats_quantity: updatedSeats,
        }));
    };

    const renderSeatClassSection = () => (
        <Card className="mb-4">
            <Card.Header>
                {t('addFlightForm.seatClassSection.header')}
                <Button
                    variant="success"
                    size="sm"
                    className="ms-3"
                    onClick={addSeatClass}
                >
                    {t('addFlightForm.seatClassSection.addSeatClassBtn')}
                </Button>
            </Card.Header>
            <Card.Body>
                {flightData.seats_quantity.map((seat, index) => (
                    <Card key={index} className="mb-3">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <span>
                                {t(
                                    'addFlightForm.seatClassSection.seatHeader',
                                    { index: index + 1 }
                                )}
                            </span>{' '}
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeSeatClass(index)}
                            >
                                {t(
                                    'addFlightForm.seatClassSection.deleteButton'
                                )}
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.seatTypeLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Select
                                            value={seat.seat_class_id}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'seat_class_id',
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                {t(
                                                    'addFlightForm.seatClassSection.selectTypeOption'
                                                )}
                                            </option>
                                            {seatClasses.map((sc) => (
                                                <option
                                                    key={sc._id}
                                                    value={sc._id}
                                                >
                                                    {sc.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.totalSeatsLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={seat.maximum_seat}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'maximum_seat',
                                                    parseInt(e.target.value)
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.cabinLayoutLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Select
                                            value={seat.layout.join('-')}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'layout',
                                                    e.target.value
                                                        .split('-')
                                                        .map(Number)
                                                )
                                            }
                                        >
                                            <option value="">
                                                {t(
                                                    'addFlightForm.seatClassSection.selectLayoutOption'
                                                )}
                                            </option>
                                            {cabinLayouts.map(
                                                (layoutStr, i) => (
                                                    <option
                                                        key={i}
                                                        value={layoutStr}
                                                    >
                                                        {layoutStr}
                                                    </option>
                                                )
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.adultTicketPriceLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={seat.price}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'price',
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    </Form.Group>
                                    <span className="text-muted">
                                        {t(
                                            'addFlightForm.seatClassSection.convertedValueLabel'
                                        )}
                                        : {formatCurrency(seat.price)}
                                    </span>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.childTicketPriceLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={seat.child_price}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'child_price',
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    </Form.Group>
                                    <span className="text-muted">
                                        {t(
                                            'addFlightForm.seatClassSection.convertedValueLabel'
                                        )}
                                        : {formatCurrency(seat.child_price)}
                                    </span>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.carryOnBaggageLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={seat.carry_on_baggage}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'carry_on_baggage',
                                                    parseInt(e.target.value)
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.freeCheckedBaggageLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={seat.free_baggage}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'free_baggage',
                                                    parseInt(e.target.value)
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.maxCheckedBaggageWeightLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={seat.max_kilogram_baggage}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'max_kilogram_baggage',
                                                    parseInt(e.target.value)
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.extraBaggagePriceLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={seat.price_baggage}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'price_baggage',
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.changeFlightLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Select
                                            value={seat.changeFlight}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'changeFlight',
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="no">
                                                {t(
                                                    'addFlightForm.seatClassSection.changeFlightNo'
                                                )}
                                            </option>
                                            <option value="yes">
                                                {t(
                                                    'addFlightForm.seatClassSection.changeFlightYes'
                                                )}
                                            </option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.refundPercentLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={seat.refundMoney}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'refundMoney',
                                                    parseInt(e.target.value)
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.windowSeatPriceLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={seat.window_seat_price}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'window_seat_price',
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>
                                            {t(
                                                'addFlightForm.seatClassSection.normalSeatPriceLabel'
                                            )}
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={seat.normal_seat_price}
                                            onChange={(e) =>
                                                updateSeatField(
                                                    index,
                                                    'normal_seat_price',
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Form.Label className="mb-2">
                                    {t(
                                        'addFlightForm.seatClassSection.utilitiesLabel'
                                    )}
                                </Form.Label>
                                {utils.map((util) => (
                                    <Col key={util._id} md={3} className="mb-2">
                                        <Form.Check
                                            type="checkbox"
                                            label={
                                                <TranslateText
                                                    text={util.name}
                                                />
                                            }
                                            checked={
                                                Array.isArray(seat.utils) &&
                                                seat.utils
                                                    .map(String)
                                                    .includes(
                                                        util._id.toString()
                                                    )
                                            }
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
    );

    const validateFlightData = () => {
        const { flight_number, airline, segments, seats_quantity } = flightData;

        if (!flight_number.trim() || !airline) return false;

        for (const seg of segments) {
            if (
                !seg.departure_airport_id ||
                !seg.arrival_airport_id ||
                !seg.departure_time ||
                !seg.arrival_time
            ) {
                return false;
            }
        }

        if (!seats_quantity.length) return false;

        for (const seat of seats_quantity) {
            if (
                !seat.seat_class_id ||
                seat.price === 0 ||
                seat.maximum_seat === 0
            ) {
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateFlightData()) {
            // console.log('Vui lòng nhập đầy đủ dữ liệu cho chuyến bay!');
            return;
        }

        const response = await adminAddFlight(flightData);
        if (response && response.EC === 0) {
            toast.success(response.EM);
            // handleClose();
        } else {
            toast.error(response.EM);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="xl" scrollable>
            <Modal.Header closeButton>
                <Modal.Title>{t('addFlightForm.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="py-4">
                    <Form onSubmit={handleSubmit}>
                        <Card className="mb-4 shadow-sm">
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0">
                                    {t('addFlightForm.basicInfo.title')}
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                {t(
                                                    'addFlightForm.basicInfo.flightNumber'
                                                )}{' '}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="VN123"
                                                value={flightData.flight_number}
                                                onChange={(e) =>
                                                    setFlightData((prev) => ({
                                                        ...prev,
                                                        flight_number:
                                                            e.target.value,
                                                    }))
                                                }
                                                className="border-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3 position-relative">
                                            <Form.Label className="fw-semibold">
                                                {t(
                                                    'addFlightForm.basicInfo.airline'
                                                )}{' '}
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder={t(
                                                    'addFlightForm.basicInfo.searchAirlinePlaceholder'
                                                )}
                                                value={
                                                    searchTerms.airline || ''
                                                }
                                                onChange={(e) =>
                                                    handleAirlineSearch(
                                                        e.target.value
                                                    )
                                                }
                                                className="border-2"
                                            />
                                            {showSuggestions.airline &&
                                                suggestions.airline?.length >
                                                    0 && (
                                                    <ListGroup
                                                        className="position-absolute w-100 mt-1"
                                                        style={{
                                                            zIndex: 1000,
                                                            maxHeight: '200px',
                                                            overflowY: 'auto',
                                                        }}
                                                    >
                                                        {suggestions.airline.map(
                                                            (airline) => (
                                                                <ListGroup.Item
                                                                    key={
                                                                        airline._id
                                                                    }
                                                                    action
                                                                    onClick={() =>
                                                                        selectAirline(
                                                                            airline
                                                                        )
                                                                    }
                                                                    className="d-flex align-items-center py-2 border-1 bg-white"
                                                                >
                                                                    <img
                                                                        src={
                                                                            airline.logo_url
                                                                        }
                                                                        alt={
                                                                            airline.name
                                                                        }
                                                                        className="me-2"
                                                                        style={{
                                                                            width: '30px',
                                                                            height: '30px',
                                                                            objectFit:
                                                                                'contain',
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <div className="fw-semibold">
                                                                            {
                                                                                airline.name
                                                                            }
                                                                        </div>
                                                                        <small className="text-muted">
                                                                            {
                                                                                airline.country
                                                                            }
                                                                        </small>
                                                                    </div>
                                                                </ListGroup.Item>
                                                            )
                                                        )}
                                                    </ListGroup>
                                                )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="mb-4 shadow-sm">
                            <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    {t('addFlightForm.segments.title')}
                                </h5>
                                <Button
                                    variant="light"
                                    size="sm"
                                    onClick={addSegment}
                                    className="text-success fw-semibold"
                                >
                                    {t(
                                        'addFlightForm.segments.addSegmentButton'
                                    )}
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {flightData.segments.map((segment, index) => {
                                    const keyDeparture = `${index}_departure`;
                                    const keyArrival = `${index}_arrival`;
                                    return (
                                        <Card
                                            key={index}
                                            className="mb-3 border-2"
                                        >
                                            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                                                <span className="fw-semibold">
                                                    {t(
                                                        'addFlightForm.segments.segmentNumber',
                                                        { number: index + 1 }
                                                    )}{' '}
                                                </span>
                                                {flightData.segments.length >
                                                    1 && (
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeSegment(index)
                                                        }
                                                    >
                                                        {t(
                                                            'addFlightForm.segments.deleteButton'
                                                        )}{' '}
                                                    </Button>
                                                )}
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3 position-relative">
                                                            <Form.Label className="fw-semibold">
                                                                {t(
                                                                    'addFlightForm.segments.departureAirport'
                                                                )}
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder={t(
                                                                    'addFlightForm.segments.searchDepartureAirportPlaceholder'
                                                                )}
                                                                value={
                                                                    searchTerms[
                                                                        keyDeparture
                                                                    ] || ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleDestinationSearch(
                                                                        e.target
                                                                            .value,
                                                                        'departure',
                                                                        index
                                                                    )
                                                                }
                                                                className="border-2"
                                                            />
                                                            {showSuggestions[
                                                                keyDeparture
                                                            ] &&
                                                                suggestions[
                                                                    keyDeparture
                                                                ]?.length >
                                                                    0 && (
                                                                    <ListGroup
                                                                        className="position-absolute w-100 mt-1"
                                                                        style={{
                                                                            zIndex: 1000,
                                                                            maxHeight:
                                                                                '200px',
                                                                            overflowY:
                                                                                'auto',
                                                                        }}
                                                                    >
                                                                        {suggestions[
                                                                            keyDeparture
                                                                        ].map(
                                                                            (
                                                                                dest
                                                                            ) => (
                                                                                <ListGroup.Item
                                                                                    key={
                                                                                        dest._id
                                                                                    }
                                                                                    action
                                                                                    onClick={() =>
                                                                                        selectDestination(
                                                                                            dest,
                                                                                            'departure',
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                    className="border-1 bg-white"
                                                                                >
                                                                                    <div className="fw-semibold">
                                                                                        {
                                                                                            <TranslateText
                                                                                                text={
                                                                                                    dest.name
                                                                                                }
                                                                                            />
                                                                                        }{' '}
                                                                                        (
                                                                                        {
                                                                                            dest.code
                                                                                        }

                                                                                        )
                                                                                    </div>
                                                                                    <small className="text-muted">
                                                                                        {
                                                                                            <TranslateText
                                                                                                text={
                                                                                                    dest.city
                                                                                                }
                                                                                            />
                                                                                        }{' '}
                                                                                        {
                                                                                            dest.country
                                                                                        }
                                                                                    </small>
                                                                                </ListGroup.Item>
                                                                            )
                                                                        )}
                                                                    </ListGroup>
                                                                )}
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3 position-relative">
                                                            <Form.Label className="fw-semibold">
                                                                {t(
                                                                    'addFlightForm.arrivalAirportLabel'
                                                                )}{' '}
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder={t(
                                                                    'addFlightForm.arrivalAirportPlaceholder'
                                                                )}
                                                                value={
                                                                    searchTerms[
                                                                        keyArrival
                                                                    ] || ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleDestinationSearch(
                                                                        e.target
                                                                            .value,
                                                                        'arrival',
                                                                        index
                                                                    )
                                                                }
                                                                className="border-2"
                                                            />
                                                            {showSuggestions[
                                                                keyArrival
                                                            ] &&
                                                                suggestions[
                                                                    keyArrival
                                                                ]?.length >
                                                                    0 && (
                                                                    <ListGroup
                                                                        className="position-absolute w-100 mt-1"
                                                                        style={{
                                                                            zIndex: 1000,
                                                                            maxHeight:
                                                                                '200px',
                                                                            overflowY:
                                                                                'auto',
                                                                        }}
                                                                    >
                                                                        {suggestions[
                                                                            keyArrival
                                                                        ].map(
                                                                            (
                                                                                dest
                                                                            ) => (
                                                                                <ListGroup.Item
                                                                                    key={
                                                                                        dest._id
                                                                                    }
                                                                                    action
                                                                                    onClick={() =>
                                                                                        selectDestination(
                                                                                            dest,
                                                                                            'arrival',
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                    className="border-1 bg-white"
                                                                                >
                                                                                    <div className="fw-semibold">
                                                                                        {
                                                                                            <TranslateText
                                                                                                text={
                                                                                                    dest.name
                                                                                                }
                                                                                            />
                                                                                        }{' '}
                                                                                        (
                                                                                        {
                                                                                            dest.code
                                                                                        }

                                                                                        )
                                                                                    </div>
                                                                                    <small className="text-muted">
                                                                                        {
                                                                                            <TranslateText
                                                                                                text={
                                                                                                    dest.city
                                                                                                }
                                                                                            />
                                                                                        }{' '}
                                                                                        {
                                                                                            dest.country
                                                                                        }
                                                                                    </small>
                                                                                </ListGroup.Item>
                                                                            )
                                                                        )}
                                                                    </ListGroup>
                                                                )}
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className="fw-semibold">
                                                                {t(
                                                                    'addFlightForm.departureTimeLabel'
                                                                )}
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="datetime-local"
                                                                value={
                                                                    segment.departure_time
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const newSegments =
                                                                        [
                                                                            ...flightData.segments,
                                                                        ];
                                                                    newSegments[
                                                                        index
                                                                    ].departure_time =
                                                                        e.target.value;
                                                                    setFlightData(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            segments:
                                                                                newSegments,
                                                                        })
                                                                    );
                                                                }}
                                                                className="border-2"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className="fw-semibold">
                                                                {t(
                                                                    'addFlightForm.arrivalTimeLabel'
                                                                )}
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="datetime-local"
                                                                value={
                                                                    segment.arrival_time
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const newSegments =
                                                                        [
                                                                            ...flightData.segments,
                                                                        ];
                                                                    newSegments[
                                                                        index
                                                                    ].arrival_time =
                                                                        e.target.value;
                                                                    setFlightData(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            segments:
                                                                                newSegments,
                                                                        })
                                                                    );
                                                                }}
                                                                className="border-2"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </Card.Body>
                        </Card>

                        {renderSeatClassSection()}
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>
                    {t('addFlightForm.addFlightButton')}{' '}
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    {t('addFlightForm.cancelButton')}{' '}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddFlightForm;
