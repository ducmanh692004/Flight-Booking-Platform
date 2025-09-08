import React, { useEffect } from 'react';
import './Search.scss';
import { useState, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { BsPeopleFill } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import { MdOutlineEmojiPeople } from 'react-icons/md';
import { FaChildReaching } from 'react-icons/fa6';
import { PiSeatBold } from 'react-icons/pi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useHistory } from 'react-router-dom';
import { fetchSeatClassData } from '../../../services/SeatClassService';
import { TranslateText } from '../../Translate';
import { useLocation } from 'react-router-dom';
import SearchSuggestion from './SearchSuggestion';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import useSearchSuggestion from '../../hooks/useSearchSuggestion';
import useClickOutside from '../../hooks/useClickOutside';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
// import { TranslateText } from '../../Translate';

const Search = (props) => {
    const { t } = useTranslation();
    const [departureDate, setDepartureDate] = useState(new Date());
    const [arrivalDate, setArrivalDate] = useState(new Date());
    const [departureDestination, setDepartureDestination] = useState('Hà Nội');
    const [arrivalDestination, setArrivalDestination] = useState('Hồ Chí Minh');
    const [flightType, setFlightType] = useState('round-trip');
    const [dataSeatClass, setDataSeatClass] = useState([]);
    const [seatClassSelect, setSeatClassSelect] = useState({});
    const defaultPeopleQuantity = {
        adult: 1,
        child: 0,
    };

    // Replace with custom hooks
    const departureSuggestion = useSearchSuggestion(departureDestination);
    const arrivalSuggestion = useSearchSuggestion(arrivalDestination);

    // Refs for click outside detection
    const departureSuggestionRef = useRef(null);
    const arrivalSuggestionRef = useRef(null);

    // Use click outside hooks
    useClickOutside(
        departureSuggestionRef,
        departureSuggestion.hideSuggestions
    );
    useClickOutside(arrivalSuggestionRef, arrivalSuggestion.hideSuggestions);

    const [peopleQuantity, setPeopleQuantity] = useState(defaultPeopleQuantity);

    const location = useLocation();
    const history = useHistory();

    const updateDepartureDestination = (value) => {
        setDepartureDestination(value);
        departureSuggestion.hideSuggestions(); // Hide suggestions when selecting
    };

    const updateArrivalDestination = (value) => {
        setArrivalDestination(value);
        arrivalSuggestion.hideSuggestions(); // Hide suggestions when selecting
    };

    const setDefautlValue = (type, value) => {
        if (type === 'departure_destination') {
            if (value.trim() === '') {
                setDepartureDestination('Hà Nội');
            }
        } else {
            if (value.trim() === '') {
                setArrivalDestination('Hồ Chí Minh');
            }
        }
    };

    const handleChangeFlightType = (flightType) => {
        if (flightType === 'one-way') {
            setFlightType('one-way');
        } else {
            setFlightType('round-trip');
        }
    };

    const handleSearch = () => {
        history.push(
            `/flightList?departure_destination=${departureDestination}&arrival_destination=${arrivalDestination}&departure_date=${departureDate}
            &comeback_date=${arrivalDate}&flight_type=${flightType}&people_quantity=${JSON.stringify(
                peopleQuantity
            )}&seat_class=${JSON.stringify(seatClassSelect)}`
        );
        if (location.pathname === '/flightList') {
            window.location.reload();
            props.handleClose();
        }
    };

    const handleIncreaseQuantity = (type) => {
        if (type === 'child') {
            setPeopleQuantity((prev) => ({
                ...prev,
                child: prev.child < 5 ? +prev.child + 1 : 5,
            }));
        } else {
            setPeopleQuantity((prev) => ({
                ...prev,
                adult: prev.adult < 7 ? prev.adult + 1 : 7,
            }));
        }
    };

    const handleDecreaseQuantity = (type) => {
        if (type === 'child') {
            setPeopleQuantity((prev) => ({
                ...prev,
                child: prev.child > 0 ? prev.child - 1 : 0,
            }));
        } else {
            setPeopleQuantity((prev) => ({
                ...prev,
                adult: prev.adult > 1 ? prev.adult - 1 : 1,
            }));
        }
    };

    const handleChangeSeatClass = (id, name) => {
        setSeatClassSelect({
            id: id,
            name: name,
        });
    };

    const handleFetchDataSeatClass = async () => {
        const response = await fetchSeatClassData();
        if (response && response.EC === 0) {
            setDataSeatClass(response.DT);
            setSeatClassSelect({
                id: response.DT[0]._id,
                name: response.DT[0].name,
            });
        }
    };

    const handleSwapCities = () => {
        const temp = departureDestination;
        setDepartureDestination(arrivalDestination);
        setArrivalDestination(temp);
    };

    const updateDepartureDate = (date) => {
        if (date < new Date()) {
            toast.error('Ngày quá khứ là không hợp lệ!');
        } else {
            setDepartureDate(date);
        }
    };

    const updateComebackDate = (date) => {
        if (date < new Date()) {
            toast.error('Ngày quá khứ là không hợp lệ!');
        } else {
            setArrivalDate(date);
        }
    };

    useEffect(() => {
        handleFetchDataSeatClass();
    }, []);

    useEffect(() => {
        const dataSearch = props.dataSearch;

        if (dataSearch && Object.keys(dataSearch).length > 0) {
            console.log(dataSearch);
            setDepartureDestination(dataSearch.departure_destination);
            setArrivalDestination(dataSearch.arrival_destination);
            setDepartureDate(new Date(dataSearch.departure_date));
            setArrivalDate(new Date(dataSearch.comeback_date));
            setFlightType(dataSearch.flight_type);
            setPeopleQuantity(dataSearch.people_quantity);
            handleChangeSeatClass(
                dataSearch.seat_class.id,
                dataSearch.seat_class.name
            );
        }
    }, [props.dataSearch, dataSeatClass]);

    return (
        <div
            className="rounded"
            style={{
                background:
                    'linear-gradient(135deg, #0f79aaff 0%, #35bee7ff 100%)',
            }}
        >
            <div className="container search-block pb-4 pt-3">
                <div className="title-block d-flex flex-column mb-3">
                    <h2 className="d-none d-md-block ps-0 ps-md-3 pt-3">
                        {t('search.title')}
                    </h2>
                    <h4 className="d-none d-md-block ps-0 ps-md-3">
                        {t('search.subtitle')}
                    </h4>
                </div>

                <div className="first-block d-flex justify-content-between align-items-start px-0 px-sm-3 pb-3 pt-2 pt-md-3">
                    <div className="d-flex flex-column flex-md-row gap-2">
                        <button
                            className={
                                flightType === 'one-way'
                                    ? 'btn btn-sm btn-primary'
                                    : 'btn btn-sm custom-btn'
                            }
                            onClick={() => handleChangeFlightType('one-way')}
                        >
                            {t('search.oneWay')}
                        </button>
                        <button
                            className={
                                flightType === 'round-trip'
                                    ? 'btn btn-sm btn-primary'
                                    : 'btn btn-sm custom-btn'
                            }
                            onClick={() => handleChangeFlightType('round-trip')}
                        >
                            {t('search.roundTrip')}
                        </button>
                    </div>

                    <div>
                        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-end gap-2">
                            <Dropdown>
                                <Dropdown.Toggle
                                    style={{
                                        border: '1px solid white',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.2)',
                                    }}
                                    id="dropdown-basic"
                                    className="d-flex gap-1 gap-md-3 p-2 p-md-3 rounded"
                                >
                                    <BsPeopleFill className="fs-6 fs-md-5" />
                                    <label style={{ cursor: 'pointer' }}>
                                        {peopleQuantity.adult}{' '}
                                        {t('search.adults')}
                                    </label>
                                    <label style={{ cursor: 'pointer' }}>
                                        {peopleQuantity.child}{' '}
                                        {t('search.children')}
                                    </label>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <div className="dropdown-item d-flex justify-content-between align-items-center gap-4">
                                        <div className="d-flex justify-content-center align-items-center gap-1">
                                            <MdOutlineEmojiPeople className="fs-3 icon-people" />
                                            <label className="lbl-people">
                                                {t('search.adult')}
                                            </label>
                                        </div>
                                        <div
                                            className="d-flex justify-content-center align-items-center gap-2"
                                            style={{ width: '80px' }}
                                        >
                                            <FaPlus
                                                className="icon-quantity"
                                                style={{ fontSize: '10px' }}
                                                onClick={() =>
                                                    handleIncreaseQuantity(
                                                        'adult'
                                                    )
                                                }
                                            />
                                            <div
                                                className="bg-warning d-flex justify-content-center rounded quantity"
                                                style={{ width: '30px' }}
                                            >
                                                {peopleQuantity.adult}
                                            </div>
                                            <FaMinus
                                                className="icon-quantity"
                                                style={{ fontSize: '10px' }}
                                                onClick={() =>
                                                    handleDecreaseQuantity(
                                                        'adult'
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="dropdown-item d-flex justify-content-center align-items-center gap-5"
                                        style={{ marginLeft: '2px' }}
                                    >
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <FaChildReaching className="fs-5 icon-people" />
                                            <label className="lbl-people">
                                                {t('search.child')}
                                            </label>
                                        </div>
                                        <div
                                            className="d-flex justify-content-center align-items-center gap-2"
                                            style={{ width: '80px' }}
                                        >
                                            <FaPlus
                                                className="icon-quantity"
                                                style={{ fontSize: '10px' }}
                                                onClick={() =>
                                                    handleIncreaseQuantity(
                                                        'child'
                                                    )
                                                }
                                            />
                                            <div
                                                className="bg-warning d-flex justify-content-center rounded quantity"
                                                style={{ width: '30px' }}
                                            >
                                                {peopleQuantity.child}
                                            </div>
                                            <FaMinus
                                                className="icon-quantity"
                                                style={{ fontSize: '10px' }}
                                                onClick={() =>
                                                    handleDecreaseQuantity(
                                                        'child'
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>

                            <Dropdown style={{ width: '200px' }}>
                                <Dropdown.Toggle
                                    style={{
                                        border: '1px solid white',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.2)',
                                        width: '200px',
                                    }}
                                    className="rounded d-flex gap-1 gap-md-2 p-1 p-md-3 justify-content-between align-items-center"
                                    id="dropdown-basic"
                                >
                                    <div className="d-flex gap-2 align-items-center justify-content-center">
                                        <PiSeatBold />
                                        <label style={{ cursor: 'pointer' }}>
                                            <TranslateText
                                                text={seatClassSelect.name}
                                            />
                                        </label>
                                    </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ width: '200px' }}>
                                    {dataSeatClass &&
                                        dataSeatClass.length > 0 &&
                                        dataSeatClass.map(
                                            (seatClass, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    style={{
                                                        marginRight: '23px',
                                                    }}
                                                    className={
                                                        seatClassSelect.name ===
                                                        seatClass.name
                                                            ? 'bg-primary text-white'
                                                            : ''
                                                    }
                                                    onClick={() =>
                                                        handleChangeSeatClass(
                                                            seatClass._id,
                                                            seatClass.name
                                                        )
                                                    }
                                                >
                                                    <TranslateText
                                                        text={seatClass.name}
                                                    />
                                                </Dropdown.Item>
                                            )
                                        )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <Container className="mt-4 mb-3">
                    <Card className="shadow-sm">
                        <Card.Body className="p-1 px-4 pt-3">
                            <Row className="align-items-end justify-content-center">
                                <Col lg={6} className="mb-2">
                                    <Row>
                                        <Col>
                                            <Form.Group
                                                className="mb-3"
                                                style={{ position: 'relative' }}
                                                ref={departureSuggestionRef}
                                            >
                                                <Form.Label
                                                    className="text-muted"
                                                    style={{ fontWeight: 500 }}
                                                >
                                                    <span className="me-2">
                                                        🛫
                                                    </span>
                                                    {t('search.from')}
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={departureDestination}
                                                    onChange={(event) =>
                                                        setDepartureDestination(
                                                            event.target.value
                                                        )
                                                    }
                                                    onBlur={(event) =>
                                                        setDefautlValue(
                                                            'departure_destination',
                                                            event.target.value
                                                        )
                                                    }
                                                    onFocus={
                                                        departureSuggestion.showSuggestionsHandler
                                                    }
                                                    placeholder={t(
                                                        'search.enterDeparture'
                                                    )}
                                                    className="border-0 rounded-0 pb-2"
                                                />
                                                <hr
                                                    className="mt-0"
                                                    style={{
                                                        height: '2px',
                                                    }}
                                                />

                                                {departureSuggestion.showSuggestions && (
                                                    <SearchSuggestion
                                                        suggestions={
                                                            departureSuggestion.suggestions
                                                        }
                                                        loading={
                                                            departureSuggestion.loading
                                                        }
                                                        onSelect={
                                                            updateDepartureDestination
                                                        }
                                                    />
                                                )}
                                            </Form.Group>
                                        </Col>

                                        <Col
                                            xs="auto"
                                            className="d-flex align-items-center"
                                        >
                                            <Button
                                                variant="link"
                                                className="p-0 border-0"
                                                onClick={handleSwapCities}
                                            >
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M7 16l-4-4 4-4M21 12H3M17 8l4 4-4 4" />
                                                </svg>
                                            </Button>
                                        </Col>

                                        <Col>
                                            <Form.Group
                                                className="mb-3"
                                                style={{ position: 'relative' }}
                                                ref={arrivalSuggestionRef}
                                            >
                                                <Form.Label
                                                    className="text-muted"
                                                    style={{ fontWeight: 500 }}
                                                >
                                                    <span className="me-2">
                                                        🛬
                                                    </span>
                                                    {t('search.to')}
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={arrivalDestination}
                                                    onChange={(event) =>
                                                        setArrivalDestination(
                                                            event.target.value
                                                        )
                                                    }
                                                    onBlur={(event) =>
                                                        setDefautlValue(
                                                            'arrival_destination',
                                                            event.target.value
                                                        )
                                                    }
                                                    onFocus={
                                                        arrivalSuggestion.showSuggestionsHandler
                                                    }
                                                    placeholder={t(
                                                        'search.enterDestination'
                                                    )}
                                                    className="border-0 rounded-0 pb-2"
                                                />
                                                <hr
                                                    className="mt-0"
                                                    style={{
                                                        height: '2px',
                                                    }}
                                                />
                                                {arrivalSuggestion.showSuggestions && (
                                                    <SearchSuggestion
                                                        suggestions={
                                                            arrivalSuggestion.suggestions
                                                        }
                                                        loading={
                                                            arrivalSuggestion.loading
                                                        }
                                                        onSelect={
                                                            updateArrivalDestination
                                                        }
                                                    />
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={6} className="mb-2">
                                    <Row>
                                        <Col md={1} />
                                        <Col md={5}>
                                            <Form.Group className="mb-3">
                                                <Form.Label
                                                    className="text-muted"
                                                    style={{ fontWeight: 500 }}
                                                >
                                                    <span className="me-2">
                                                        📅
                                                    </span>
                                                    {t('search.departureDate')}
                                                </Form.Label>
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <div className="px-2">
                                                        <DatePicker
                                                            className="date-component border-0 pb-2 pt-2"
                                                            selected={
                                                                departureDate
                                                            }
                                                            onChange={(date) =>
                                                                updateDepartureDate(
                                                                    date
                                                                )
                                                            }
                                                            placeholderText={t(
                                                                'search.selectDepartureDate'
                                                            )}
                                                        />
                                                    </div>

                                                    <hr
                                                        className="mt-0"
                                                        style={{
                                                            height: '2px',
                                                        }}
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>

                                        <Col md={5}>
                                            {flightType !== 'one-way' && (
                                                <Form.Group className="mb-3">
                                                    <Form.Label
                                                        className="text-muted"
                                                        style={{
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        <span className="me-2">
                                                            📅
                                                        </span>
                                                        {t('search.returnDate')}
                                                    </Form.Label>
                                                    <div className="px-2">
                                                        <DatePicker
                                                            className="date-component border-0 pb-2 pt-2"
                                                            selected={
                                                                arrivalDate
                                                            }
                                                            onChange={(date) =>
                                                                updateComebackDate(
                                                                    date
                                                                )
                                                            }
                                                            placeholderText={t(
                                                                'search.selectReturnDate'
                                                            )}
                                                        />
                                                    </div>

                                                    <hr
                                                        className="mt-0 color-primary"
                                                        style={{
                                                            height: '2px',
                                                        }}
                                                    />
                                                </Form.Group>
                                            )}
                                        </Col>
                                        <Col
                                            lg={1}
                                            className="mb-3 px-1 pt-4 pb-0 d-flex justify-content-end"
                                        >
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleSearch()}
                                            >
                                                <FiSearch className="fs-5" />
                                            </button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </div>
    );
};

export default Search;
