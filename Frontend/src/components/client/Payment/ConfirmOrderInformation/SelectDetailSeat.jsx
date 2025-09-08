import { MdAirlineSeatReclineNormal } from 'react-icons/md';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { takeDetailCabinInformatin } from '../../../../services/CabinService';
import { useFormatter } from '../../../hooks/useFomatter';
import { set } from 'lodash';
import { PiSeatBold } from 'react-icons/pi';
import { useTranslation } from 'react-i18next';
import { TranslateText } from '../../../Translate';

const SelectDetailSeat = (props) => {
    const [show, setShow] = useState(false);
    const [currentSelect, setCurrentSelect] = useState('departure');
    const [currentCabin, setCurrentCabin] = useState({});
    const [currentCabinLayout, setCurrentCabinLayout] = useState([]);

    const { t } = useTranslation();
    const defaultPeopleSelect = {
        people: 'adults',
        index: 0,
    };
    const [currentPeopleSelect, setCurrentPeopleSelect] =
        useState(defaultPeopleSelect);
    const defaultAplha = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
    ];

    const isSeatSelected = (row, seatNumber) => {
        const selectedSeatsData =
            currentSelect === 'departure'
                ? props.currentDetailSeatDeparture
                : props.currentDetailSeatComeback;

        // if (
        //     prop.peopleQuantity.child === 0 &&
        //     currentPeopleSelect.people === 'child'
        // ) {
        //     return false;
        // }
        const allSelected = [
            ...selectedSeatsData.adults.map((s, idx) => ({
                ...s,
                index: idx + 1,
            })),
            ...selectedSeatsData.child.map((s, idx) => ({
                ...s,
                index: selectedSeatsData.adults.length + idx + 1,
            })),
        ];

        const match = allSelected.find(
            (s) => s.row === row && s.seatNumber === seatNumber
        );

        return match ? match.index : null;
    };

    const handleCaculaterPrice = () => {
        if (
            currentSelect === 'departure' &&
            Array.isArray(props.currentDetailSeatDeparture.adults)
        ) {
            let totalPrice = 0;
            for (
                let i = 0;
                i < props.currentDetailSeatDeparture.adults.length;
                i++
            ) {
                totalPrice += props.currentDetailSeatDeparture.adults[i].price;
            }
            for (
                let j = 0;
                j < props.currentDetailSeatDeparture.child.length;
                j++
            ) {
                totalPrice += props.currentDetailSeatDeparture.child[j].price;
            }
            props.handleSetDetailSeat('departure', totalPrice);
        } else if (
            currentSelect === 'comeback' &&
            Array.isArray(props.currentDetailSeatComeback.adults)
        ) {
            let totalPrice = 0;
            for (
                let i = 0;
                i < props.currentDetailSeatComeback.adults.length;
                i++
            ) {
                totalPrice += props.currentDetailSeatComeback.adults[i].price;
            }
            for (
                let j = 0;
                j < props.currentDetailSeatComeback.child.length;
                j++
            ) {
                totalPrice += props.currentDetailSeatComeback.child[j].price;
            }
            props.handleSetDetailSeat('comeback', totalPrice);
        }
    };

    const handleChooseDetailSeat = (
        type,
        people,
        index,
        price,
        seat_number,
        row,
        rowId,
        seatId
    ) => {
        alert(people);
        // if (props.peopleQuantity.child === 0 && people === 'child') {
        //     return;
        // }
        // console.log('heloooooooooooooo', people);
        const currentDetail =
            type === 'departure'
                ? props.currentDetailSeatDeparture
                : props.currentDetailSeatComeback;

        const foundAdultIndex = currentDetail.adults.findIndex(
            (s) => s.row === row && s.seatNumber === seat_number
        );
        if (foundAdultIndex !== -1) {
            props.handleChooseDetailSeat(
                type,
                'adults',
                foundAdultIndex,
                0,
                '',
                0,
                '',
                ''
            );
            return;
        }

        const foundChildIndex = currentDetail.child.findIndex(
            (s) => s.row === row && s.seatNumber === seat_number
        );
        if (foundChildIndex !== -1) {
            props.handleChooseDetailSeat(
                type,
                'child',
                foundChildIndex,
                0,
                '',
                0,
                '',
                ''
            );
            return;
        }

        props.handleChooseDetailSeat(
            type,
            people,
            index,
            price,
            seat_number,
            row,
            rowId,
            seatId
        );

        console.log('pppp', people);

        if (people === 'adults' && index === 0) {
        }

        if (
            currentPeopleSelect.people === 'adults' &&
            currentPeopleSelect.index <=
                props.currentDetailSeatDeparture.adults.length - 1
        ) {
            if (
                currentPeopleSelect.people === 'adults' &&
                props.peopleQuantity.adults > currentPeopleSelect.index + 1
            ) {
                setCurrentPeopleSelect({
                    people: 'adults',
                    index: currentPeopleSelect.index + 1,
                });
            }

            if (
                currentPeopleSelect.index ===
                props.currentDetailSeatDeparture.adults.length - 1
            ) {
                if (props.peopleQuantity.child > 0) {
                    setCurrentPeopleSelect({
                        people: 'child',
                        index: 0,
                    });
                }
            }
        }

        if (
            currentPeopleSelect.people === 'child' &&
            currentPeopleSelect.index <
                props.currentDetailSeatDeparture.child.length - 1
        ) {
            setCurrentPeopleSelect({
                people: 'child',
                index: currentPeopleSelect.index + 1,
            });
            handleCaculaterPrice();
        }
    };

    useEffect(() => {
        handleCaculaterPrice();
    }, [props.currentDetailSeatDeparture, props.currentDetailSeatComeback]);

    const [alpha, setAlpha] = useState(defaultAplha);
    const [priceSeat, setPriceSeat] = useState({});
    const { formatCurrency } = useFormatter();
    const handleFetchData = async () => {
        setCurrentPeopleSelect(defaultPeopleSelect);
        const response = await takeDetailCabinInformatin(
            currentSelect === 'departure'
                ? props.dataFlightDepartureId
                : props.dataFlightComebackId,
            currentSelect === 'departure'
                ? props.currentSeatClassDeparture._id
                : props.currentSeatClassComeback._id
        );
        if (response && response.EC === 0) {
            setCurrentCabin(response.DT[0].cabin_map);
            setCurrentCabinLayout(response.DT[0].layout);
            setPriceSeat({
                price_normal_seat:
                    response.DT[0].price_normal_seat.$numberDecimal,
                price_window_seat:
                    response.DT[0].price_window_seat.$numberDecimal,
            });
        }
    };

    const borderSelectDeparture =
        currentSelect === 'departure' ? '2px solid #0d6efd' : '1px solid gray';

    const borderSelectComeback =
        currentSelect !== 'departure' ? '2px solid #0d6efd' : '1px solid gray';

    const textColorDeparture =
        currentSelect === 'departure' ? '#0d6efd' : 'gray';
    const textColorComeback =
        currentSelect !== 'departure' ? '#0d6efd' : 'gray';

    // const handleChooseSeatDetail = (price, seatNumber) => {};

    useEffect(() => {
        if (
            show === true
            // props.dataFlightDepartureId !== '' &&
            // props.currentSeatClassDeparture._id !== ''
        ) {
            handleFetchData();
        }
    }, [
        props.dataFlightDepartureId,
        props.currentSeatClassDeparture._id,
        show,
        currentSelect,
    ]);

    return (
        <div className="mt-4 shadow-sm">
            <div
                className="card p-4"
                style={{
                    background:
                        'linear-gradient(135deg, #c5f3f5ff 0%, #d8fcddff 100%)',
                    border: '1px solid #B3E5E5',
                    // border: '1px solid #B3E5E5',
                }}
            >
                <div
                    className="card-body bg-light p-3 px-3"
                    style={{
                        backgroundColor: 'white',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                    }}
                >
                    <div className="d-flex align-items-start">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    <PiSeatBold className="fs-4" />
                                </div>
                                <div className="flex-grow-1">
                                    <h6
                                        className="card-title fw-bold text-primary"
                                        style={{
                                            // fontSize: '20px',
                                            fontWeight: '600',
                                            color: '#2D3748',
                                        }}
                                    >
                                        {t('payment.seatPosition')}
                                    </h6>
                                    <p
                                        className="card-text"
                                        style={{
                                            fontSize: '14px',
                                            color: '#718096',
                                            lineHeight: '1.4',
                                        }}
                                    >
                                        {t('payment.chooseSeatReason')}
                                    </p>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-center bg-light rounded">
                                <div>
                                    <span
                                        style={{
                                            fontSize: '14px',
                                            color: '#718096',
                                        }}
                                    ></span>
                                    <span
                                        style={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#E53E3E',
                                        }}
                                    ></span>
                                </div>
                                <button
                                    className="btn d-flex align-items-center"
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        color: '#4A9EFF',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                        padding: '0',
                                        // marginRight: '5px',
                                    }}
                                    onClick={() => setShow(true)}
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
                    {/* <hr className="mt-0" style={{ height: '1px' ></hr> */}
                </div>
            </div>
            <Modal size="xl" show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        {t('payment.seatSelection')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex">
                        <div className="d-flex flex-column gap-3 col-4 px-2">
                            <div
                                className="p-3 d-flex flex-column gap-2 rounded"
                                style={{
                                    border: '1px solid rgb(179, 180, 182)',
                                }}
                            >
                                <h5
                                    className="mt-0 mb-0"
                                    style={{ fontWeight: '500' }}
                                >
                                    {t('payment.selectFlight')}
                                </h5>
                                <Button
                                    className="p-2 d-flex mt-2 flex-column border-3 rounded"
                                    variant={
                                        currentSelect === 'departure'
                                            ? 'primary'
                                            : 'outline-primary'
                                    }
                                    onClick={() =>
                                        setCurrentSelect('departure')
                                    }
                                >
                                    <span>{t('flightType.departure')}</span>
                                    {/* {props?.dataFlightDeparture?.segments !==
                                        undefined &&
                                        props?.dataFlightDeparture?.segments.isArray() &&
                                        props?.dataFlightDeparture?.segments
                                            ?.length > 0 && (
                                            <span>
                                                {
                                                    props?.dataFlightDeparture
                                                        ?.segments[0]
                                                        ?.departure_airport_id
                                                        ?.province
                                                }{' '}
                                                -{' '}
                                                {
                                                    props?.dataFlightDeparture
                                                        ?.segments[
                                                        props
                                                            ?.dataFlightDeparture
                                                            ?.segments.length -
                                                            1
                                                    ]?.arrival_airport_id
                                                        ?.province
                                                }
                                            </span>
                                        )} */}
                                </Button>
                                {props.dataFlightComebackId !== undefined && (
                                    <div>
                                        <hr className="mt-0 mb-2"></hr>
                                        <Button
                                            className="p-2 d-flex flex-column border-3 rounded w-100"
                                            variant={
                                                currentSelect === 'comeback'
                                                    ? 'primary'
                                                    : 'outline-primary'
                                            }
                                            onClick={() =>
                                                setCurrentSelect('comeback')
                                            }
                                        >
                                            <span>
                                                {t('flightType.return')}
                                            </span>
                                            {/* <span>
                                                {
                                                    props?.dataFlightComeback
                                                        ?.segments[0]
                                                        .departure_airport_id
                                                        .province
                                                }{' '}
                                                -{' '}
                                                {
                                                    props?.dataFlightComeback
                                                        ?.segments[
                                                        props
                                                            ?.dataFlightComeback
                                                            ?.segments.length -
                                                            1
                                                    ].arrival_airport_id
                                                        .province
                                                }
                                            </span> */}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div
                                className="d-flex flex-column gap-2 rounded p-3"
                                style={{
                                    border: '1px solid rgb(179, 180, 182)',
                                }}
                            >
                                <h5 className="mt-0 mb-0">
                                    {t('payment.chooseSeatProcess')}
                                </h5>
                                <div
                                    className="d-flex flex-column gap-2 p-2 rounded"
                                    style={{
                                        height: '172px',
                                        overflowY: 'scroll',
                                    }}
                                >
                                    {Array.isArray(
                                        props.currentDetailSeatDeparture.adults
                                    ) &&
                                        currentSelect === 'departure' &&
                                        props.currentDetailSeatDeparture.adults.map(
                                            (item, index) => (
                                                <div
                                                    className="d-flex justify-content-between gap-3 rounded p-1 px-2"
                                                    key={index}
                                                    style={{
                                                        border: `${
                                                            currentPeopleSelect.people ===
                                                                'adults' &&
                                                            currentPeopleSelect.index ===
                                                                index
                                                                ? '2px solid #4A9EFF'
                                                                : '1px solid rgb(205, 206, 207)'
                                                        }`,
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() =>
                                                        setCurrentPeopleSelect({
                                                            people: 'adults',
                                                            index: index,
                                                        })
                                                    }
                                                >
                                                    <div>
                                                        <span
                                                            className="text-primary"
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {index + 1}.{' '}
                                                            {item.row
                                                                ? '(' +
                                                                  item.row +
                                                                  item.seatNumber +
                                                                  ') - '
                                                                : ''}
                                                        </span>
                                                        <span
                                                            className="text-muted"
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {t(
                                                                'passengerInfo.adult'
                                                            )}{' '}
                                                            {index + 1}:
                                                        </span>
                                                    </div>

                                                    <span
                                                        className="text-muted"
                                                        style={{
                                                            fontWeight: '500',
                                                        }}
                                                    >
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        )}

                                    {Array.isArray(
                                        props.currentDetailSeatDeparture.child
                                    ) &&
                                        props.currentDetailSeatDeparture.child
                                            .length > 0 &&
                                        currentSelect === 'departure' &&
                                        props.currentDetailSeatDeparture.child.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="d-flex justify-content-between gap-3 rounded p-1 px-2"
                                                    style={{
                                                        border: `${
                                                            currentPeopleSelect.people ===
                                                                'child' &&
                                                            currentPeopleSelect.index ===
                                                                index
                                                                ? '2px solid rgb(28, 153, 255)'
                                                                : '1px solid rgb(210, 212, 216)'
                                                        }`,
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() =>
                                                        setCurrentPeopleSelect({
                                                            people: 'child',
                                                            index: index,
                                                        })
                                                    }
                                                >
                                                    <div>
                                                        <span
                                                            className="text-primary"
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {props
                                                                .currentDetailSeatDeparture
                                                                .adults.length +
                                                                index +
                                                                1}
                                                            .{' '}
                                                            {item.row
                                                                ? '(' +
                                                                  item.row +
                                                                  item.seatNumber +
                                                                  ') - '
                                                                : ''}
                                                        </span>
                                                        <span
                                                            className="text-muted"
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {t(
                                                                'passengerInfo.child'
                                                            )}{' '}
                                                            {index + 1}:
                                                        </span>
                                                    </div>

                                                    <span
                                                        className="text-muted"
                                                        style={{
                                                            fontWeight: '500',
                                                        }}
                                                    >
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        )}

                                    {Array.isArray(
                                        props.currentDetailSeatComeback.adults
                                    ) &&
                                        currentSelect === 'comeback' &&
                                        props.currentDetailSeatComeback.adults.map(
                                            (item, index) => (
                                                <div
                                                    className="d-flex justify-content-between gap-3 rounded p-1 px-2"
                                                    key={index}
                                                    style={{
                                                        border: `${
                                                            currentPeopleSelect.people ===
                                                                'adults' &&
                                                            currentPeopleSelect.index ===
                                                                index
                                                                ? '2px solid rgb(28, 153, 255)'
                                                                : '1px solid rgb(210, 212, 216)'
                                                        }`,
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() =>
                                                        setCurrentPeopleSelect({
                                                            people: 'adults',
                                                            index: index,
                                                        })
                                                    }
                                                >
                                                    <div>
                                                        <span
                                                            className="text-primary"
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {index + 1}.{' '}
                                                            {item.row
                                                                ? '(' +
                                                                  item.row +
                                                                  item.seatNumber +
                                                                  ') - '
                                                                : ''}
                                                        </span>
                                                        <span
                                                            className="text-muted"
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {t(
                                                                'passengerInfo.adult'
                                                            )}{' '}
                                                            {index + 1}:
                                                        </span>
                                                    </div>
                                                    <span
                                                        className="text-muted"
                                                        style={{
                                                            fontWeight: '500',
                                                        }}
                                                    >
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        )}

                                    {Array.isArray(
                                        props.currentDetailSeatComeback.child
                                    ) &&
                                        props.currentDetailSeatComeback.child
                                            .length > 0 &&
                                        currentSelect === 'comeback' &&
                                        props.currentDetailSeatComeback.child.map(
                                            (item, index) => (
                                                <div
                                                    className="d-flex justify-content-between gap-3 rounded p-1 px-2"
                                                    key={index}
                                                    style={{
                                                        border: `${
                                                            currentPeopleSelect.people ===
                                                                'child' &&
                                                            currentPeopleSelect.index ===
                                                                index
                                                                ? '2px solid rgb(28, 153, 255)'
                                                                : '1px solid rgb(210, 212, 216)'
                                                        }`,
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() =>
                                                        setCurrentPeopleSelect({
                                                            people: 'child',
                                                            index: index,
                                                        })
                                                    }
                                                >
                                                    <div>
                                                        <span
                                                            className="text-primary"
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {props
                                                                .currentDetailSeatDeparture
                                                                .adults.length +
                                                                index +
                                                                1}
                                                            .{' '}
                                                            {item.row
                                                                ? '(' +
                                                                  item.row +
                                                                  item.seatNumber +
                                                                  ') - '
                                                                : ''}
                                                        </span>
                                                        <span
                                                            className="text-muted"
                                                            style={{
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {t(
                                                                'passengerInfo.child'
                                                            )}{' '}
                                                            {index + 1}:
                                                        </span>
                                                    </div>

                                                    <span
                                                        className="text-muted"
                                                        style={{
                                                            fontWeight: '500',
                                                        }}
                                                    >
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>

                            <div
                                className="p-3 rounded"
                                style={{
                                    border: '1px solid rgb(179, 180, 182)',
                                }}
                            >
                                <div className="d-flex align-items-center justify-content-between">
                                    {' '}
                                    <span
                                        style={{
                                            fontWeight: '500',
                                        }}
                                    >
                                        {t('payment.selectSeatDeparture')}
                                    </span>
                                    <span
                                        className="text-primary"
                                        style={{ fontWeight: '500' }}
                                    >
                                        {formatCurrency(
                                            props.priceDetailSeatDeparture
                                        )}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    {' '}
                                    <span
                                        style={{
                                            fontWeight: '500',
                                        }}
                                    >
                                        {t('payment.selectSeatReturn')}
                                    </span>
                                    <span
                                        className="text-primary"
                                        style={{ fontWeight: '500' }}
                                    >
                                        {formatCurrency(
                                            props.priceDetailSeatComeback
                                        )}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span
                                        className="d-flex"
                                        style={{ fontWeight: '500' }}
                                    >
                                        {t('order.totalSeatPrice')}
                                    </span>
                                    <span
                                        className="text-primary"
                                        style={{ fontWeight: '500' }}
                                    >
                                        {formatCurrency(
                                            props.priceDetailSeatComeback +
                                                props.priceDetailSeatDeparture
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-8 px-2">
                            <div
                                className="rounded p-3 px-4"
                                style={{
                                    border: '1px solid rgb(179, 180, 182)',
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <h5>
                                        {currentSelect === 'departure' ? (
                                            <TranslateText
                                                text={
                                                    props
                                                        .currentSeatClassDeparture
                                                        .name
                                                }
                                            />
                                        ) : (
                                            <TranslateText
                                                text={
                                                    props
                                                        .currentSeatClassComeback
                                                        .name
                                                }
                                            />
                                        )}
                                    </h5>

                                    <div className="d-flex gap-2 flex-column">
                                        <div className="d-flex gap-3">
                                            <div className="d-flex gap-1 align-items-center">
                                                <div
                                                    className="rounded"
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        backgroundColor:
                                                            'orange',
                                                    }}
                                                ></div>
                                                <span
                                                    style={{
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {t('payment.booked')}
                                                </span>
                                            </div>
                                            <div className="d-flex gap-1 align-items-center">
                                                <div
                                                    className="rounded"
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        backgroundColor:
                                                            'green',
                                                    }}
                                                ></div>
                                                <span
                                                    style={{
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {t('payment.available')}
                                                </span>
                                            </div>
                                            <div className="d-flex gap-1 align-items-center">
                                                <div
                                                    className="rounded"
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        backgroundColor:
                                                            '#0d6efd',
                                                    }}
                                                ></div>
                                                <span
                                                    style={{
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {t('payment.yourSeat')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-3">
                                            <div className="d-flex gap-1">
                                                <h6 className="text-muted">
                                                    {t('payment.normalSeat')}
                                                </h6>
                                                <h6>
                                                    {' '}
                                                    {formatCurrency(
                                                        priceSeat.price_normal_seat
                                                    )}
                                                </h6>
                                            </div>

                                            <div className="d-flex gap-1">
                                                <h6 className="text-muted">
                                                    {t('payment.windowSeat')}
                                                </h6>
                                                <h6>
                                                    {formatCurrency(
                                                        priceSeat.price_window_seat
                                                    )}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="mt-1 mb-0"></hr>

                                <div
                                    className="d-flex flex-column align-items-center rounded gap-3 p-3 px-4 mt-0"
                                    style={{
                                        height: '505px',
                                        overflowY: 'auto',
                                    }}
                                >
                                    <div className="d-flex justify-content-center flex-column gap-2 p-3">
                                        {Array.isArray(currentCabin) &&
                                            currentCabin.map((item, rowIdx) => {
                                                const seatGroups = [];
                                                let cursor = 0;
                                                currentCabinLayout.forEach(
                                                    (groupSize) => {
                                                        const group =
                                                            item.seats.slice(
                                                                cursor,
                                                                cursor +
                                                                    groupSize
                                                            );
                                                        seatGroups.push(group);
                                                        cursor += groupSize;
                                                    }
                                                );

                                                return (
                                                    <div
                                                        className="d-flex justify-content-start align-items-center gap-3"
                                                        key={rowIdx}
                                                    >
                                                        <span
                                                            style={{
                                                                width: 30,
                                                                fontWeight:
                                                                    '500',
                                                            }}
                                                        >
                                                            {item.row}
                                                        </span>

                                                        <div className="d-flex gap-5">
                                                            {seatGroups.map(
                                                                (
                                                                    group,
                                                                    groupIdx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            groupIdx
                                                                        }
                                                                        className="d-flex gap-2"
                                                                    >
                                                                        {group.map(
                                                                            (
                                                                                seat,
                                                                                seatIdx
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        seatIdx
                                                                                    }
                                                                                    onClick={() => {
                                                                                        if (
                                                                                            seat.status !==
                                                                                            'booked'
                                                                                        ) {
                                                                                            handleChooseDetailSeat(
                                                                                                currentSelect,
                                                                                                currentPeopleSelect.people,
                                                                                                currentPeopleSelect.index,
                                                                                                (groupIdx ===
                                                                                                    0 &&
                                                                                                    seatIdx ===
                                                                                                        0) ||
                                                                                                    (groupIdx ===
                                                                                                        seatGroups.length -
                                                                                                            1 &&
                                                                                                        seatIdx ===
                                                                                                            group.length -
                                                                                                                1)
                                                                                                    ? Number(
                                                                                                          priceSeat.price_window_seat
                                                                                                      )
                                                                                                    : Number(
                                                                                                          priceSeat.price_normal_seat
                                                                                                      ),
                                                                                                seat.seat_number,
                                                                                                rowIdx +
                                                                                                    1,
                                                                                                item._id,
                                                                                                seat._id
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                    className="justify-content-center align-items-center d-flex rounded"
                                                                                    style={{
                                                                                        width: '27px',
                                                                                        height: '27px',
                                                                                        color: 'white',
                                                                                        backgroundColor:
                                                                                            isSeatSelected(
                                                                                                rowIdx +
                                                                                                    1,
                                                                                                seat.seat_number
                                                                                            )
                                                                                                ? '#007BFF' // màu xanh nước biển nếu đã chọn
                                                                                                : seat.status ===
                                                                                                  'available'
                                                                                                ? 'green'
                                                                                                : seat.status ===
                                                                                                  'pending'
                                                                                                ? 'red'
                                                                                                : 'orange',
                                                                                        cursor: 'pointer',
                                                                                        cursor: 'pointer',
                                                                                    }}
                                                                                >
                                                                                    {isSeatSelected(
                                                                                        rowIdx +
                                                                                            1,
                                                                                        seat.seat_number
                                                                                    ) ||
                                                                                        seat.seat_number}
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default SelectDetailSeat;
