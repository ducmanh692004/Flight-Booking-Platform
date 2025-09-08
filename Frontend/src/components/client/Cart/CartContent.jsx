import { useSelector } from 'react-redux';
import {
    getDateOnly,
    getFlightDuration,
    calculaterPriceFlightRoundTrip,
    calculaterPriceFlightOneWay,
} from '../../../utils/myFunction';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useFormatter } from '../../hooks/useFomatter';
import { RiDeleteBin5Line } from 'react-icons/ri';
import FlightSelectedInformation from '../FlightList/FlightSelectedInformation';
import { useDispatch } from 'react-redux';
import { removeItemFromCart } from '../../../redux/actions/cartAction';
import { deleteCartItem } from '../../../services/CartService';
import { useTranslation } from 'react-i18next';

const CartContent = (props) => {
    const { t } = useTranslation();
    const [showDetailInformation, setShowDetailInformation] = useState(false);
    const [selectViewDetail, setSelectViewDetail] = useState({});
    const [currentItem, setCurrentItem] = useState({});
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const dispatch = useDispatch();

    const { formatCurrency } = useFormatter();
    const cartInformation = useSelector((state) => state.cart);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    const formatUtcToLocal = (utcStr, timezone, format = 'HH:mm') => {
        return dayjs.utc(utcStr).tz(timezone).format(format);
    };

    const handleChooseViewDetail = (value) => {
        setShowDetailInformation(true);
        setSelectViewDetail(value);
    };

    const handleCloseDetailInformation = () => {
        setShowDetailInformation(false);
    };

    const handleSelectItem = (value, index) => {
        if (currentItemIndex !== 0) {
            setCurrentItemIndex(0);
            setCurrentItem({});
            props.handleSetTotal(0);
        } else {
            setCurrentItem(value);
            setCurrentItemIndex(index + 1);
            let priceTotal = 0;
            props.handleSetItemSelect(value);
            if (Object.keys(value.dataFlightComeback).length > 0) {
                priceTotal = calculaterPriceFlightRoundTrip(value);
            } else {
                priceTotal = calculaterPriceFlightOneWay(value);
            }
            console.log('check selected price item:', priceTotal);
            props.handleSetTotal(priceTotal);
        }
    };

    const handleDeleteItem = async (index, id) => {
        if (isAuthenticated === true) {
            await deleteCartItem(id);
            dispatch(removeItemFromCart(index));
        } else {
            dispatch(removeItemFromCart(index));
        }
    };

    return (
        <div className="px-3" style={{ height: '90%' }}>
            {cartInformation &&
                cartInformation.length > 0 &&
                cartInformation.map((cartItem, index) => (
                    <div
                        className="cart-item p-3 px-4 rounded mb-4"
                        style={{
                            border: '2px solid #eeeeee',
                            backgroundColor: '#eeeeee',
                        }}
                        key={index}
                    >
                        <div
                            key={cartItem.dataFlightDeparture._id}
                            className="flight-card px-3 pt-1 pb-1 bg-light mb-2 rounded shadow-sm border border-gray-800"
                            style={{ border: '1px solid' }}
                        >
                            <div className="d-flex gap-2 align-items-center">
                                <div
                                    className="bg-info rounded p-1 px-2"
                                    style={{
                                        fontWeight: '500',
                                        color: 'whitesmoke',
                                    }}
                                >
                                    {t('cart.departure')}
                                </div>
                                <span style={{ fontWeight: '500' }}>
                                    {
                                        cartItem.dataFlightDeparture.segments[0]
                                            .departure_airport_id.province
                                    }{' '}
                                </span>
                                {'->'}
                                <span style={{ fontWeight: '500' }}>
                                    {
                                        cartItem.dataFlightDeparture.segments[
                                            cartItem.dataFlightDeparture
                                                .segments.length - 1
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
                                        cartItem.dataFlightDeparture.segments[0]
                                            .departure_time
                                    )}
                                </span>
                            </div>
                            <hr className="mt-0"></hr>

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
                                                        cartItem
                                                            .dataFlightDeparture
                                                            .airline.logo_url
                                                    }
                                                    alt="airline logo"
                                                />
                                                <span className="fw-semibold">
                                                    {
                                                        cartItem
                                                            .dataFlightDeparture
                                                            .airline.name
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
                                                    cartItem.dataFlightDeparture
                                                )
                                            }
                                        >
                                            {t('cart.details')}
                                        </div>
                                    </div>

                                    <div className="row align-items-center mb-3">
                                        <div className="col-auto">
                                            <div className="flight-time">
                                                {formatUtcToLocal(
                                                    cartItem.dataFlightDeparture
                                                        .segments[0]
                                                        .departure_time,
                                                    cartItem.dataFlightDeparture
                                                        .segments[0]
                                                        .departure_airport_id
                                                        .time_zon
                                                )}
                                            </div>
                                            <div className="flight-route">
                                                {
                                                    cartItem.dataFlightDeparture
                                                        .segments[0]
                                                        .departure_airport_id
                                                        .code
                                                }
                                            </div>
                                        </div>

                                        <div className="col-auto px-2 text-center">
                                            <div className="flight-duration">
                                                {getFlightDuration(
                                                    cartItem.dataFlightDeparture
                                                        .segments[0]
                                                        .departure_time,
                                                    cartItem.dataFlightDeparture.segments.at(
                                                        -1
                                                    ).arrival_time
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    color: '#6c757d',
                                                }}
                                            >
                                                {{
                                                    1: t('cart.directFlight'),
                                                    2: t('cart.oneStop'),
                                                    3: t('cart.twoStops'),
                                                }[
                                                    cartItem.dataFlightDeparture
                                                        .segments.length
                                                ] || t('cart.moreThanThreeStops')}
                                            </div>
                                            <div className="d-flex justify-content-center align-items-center mt-1">
                                                <div
                                                    style={{
                                                        width: '60px',
                                                        height: '1px',
                                                        background: '#dee2e6',
                                                    }}
                                                ></div>
                                                <i
                                                    className="bi bi-airplane"
                                                    style={{
                                                        fontSize: '12px',
                                                        color: '#6c757d',
                                                        margin: '0 4px',
                                                    }}
                                                ></i>
                                                <div
                                                    style={{
                                                        width: '60px',
                                                        height: '1px',
                                                        background: '#dee2e6',
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="col-auto">
                                            <div className="flight-time">
                                                {formatUtcToLocal(
                                                    cartItem.dataFlightDeparture.segments.at(
                                                        -1
                                                    ).arrival_time,
                                                    cartItem.dataFlightDeparture.segments.at(
                                                        -1
                                                    ).arrival_airport_id
                                                        .time_zon
                                                )}
                                            </div>
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                <div className="flight-route">
                                                    {
                                                        cartItem.dataFlightDeparture.segments.at(
                                                            -1
                                                        ).arrival_airport_id
                                                            .code
                                                    }
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '10px',
                                                        color: '#6c757d',
                                                    }}
                                                >
                                                    {t('cart.nextDay')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {Object.keys(cartItem.dataFlightComeback).length >
                            0 && (
                            <div
                                key={cartItem.dataFlightComeback._id}
                                className="flight-card px-3 pt-1 pb-1 bg-light mb-2 rounded shadow-sm border border-gray-800"
                                style={{ border: '1px solid' }}
                            >
                                <div className="d-flex gap-2 align-items-center">
                                    <div
                                        className="bg-info rounded p-1 px-2"
                                        style={{
                                            fontWeight: '500',
                                            color: 'whitesmoke',
                                        }}
                                    >
                                        {t('cart.roundTrip')}
                                    </div>
                                    <span style={{ fontWeight: '500' }}>
                                        {
                                            cartItem.dataFlightComeback
                                                .segments[0]
                                                .departure_airport_id.province
                                        }{' '}
                                    </span>
                                    {'->'}
                                    <span style={{ fontWeight: '500' }}>
                                        {
                                            cartItem.dataFlightComeback
                                                .segments[
                                                cartItem.dataFlightComeback
                                                    .segments.length - 1
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
                                            cartItem.dataFlightComeback
                                                .segments[0].departure_time
                                        )}
                                    </span>
                                </div>
                                <hr className="mt-0"></hr>
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
                                                            cartItem
                                                                .dataFlightComeback
                                                                .airline
                                                                .logo_url
                                                        }
                                                        alt="airline logo"
                                                    />
                                                    <span className="fw-semibold">
                                                        {
                                                            cartItem
                                                                .dataFlightComeback
                                                                .airline.name
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
                                                        cartItem.dataFlightComeback
                                                    )
                                                }
                                            >
                                                {t('cart.details')}
                                            </div>
                                        </div>

                                        <div className="row align-items-center mb-3">
                                            <div className="col-auto">
                                                <div className="flight-time">
                                                    {formatUtcToLocal(
                                                        cartItem
                                                            .dataFlightComeback
                                                            .segments[0]
                                                            .departure_time,
                                                        cartItem
                                                            .dataFlightComeback
                                                            .segments[0]
                                                            .departure_airport_id
                                                            .time_zon
                                                    )}
                                                </div>
                                                <div className="flight-route">
                                                    {
                                                        cartItem
                                                            .dataFlightComeback
                                                            .segments[0]
                                                            .departure_airport_id
                                                            .code
                                                    }
                                                </div>
                                            </div>

                                            <div className="col-auto px-2 text-center">
                                                <div className="flight-duration">
                                                    {getFlightDuration(
                                                        cartItem
                                                            .dataFlightComeback
                                                            .segments[0]
                                                            .departure_time,
                                                        cartItem.dataFlightComeback.segments.at(
                                                            -1
                                                        ).arrival_time
                                                    )}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '12px',
                                                        color: '#6c757d',
                                                    }}
                                                >
                                                    {{
                                                        1: t('cart.directFlight'),
                                                        2: t('cart.oneStop'),
                                                        3: t('cart.twoStops'),
                                                    }[
                                                        cartItem
                                                            .dataFlightComeback
                                                            .segments.length
                                                    ] || t('cart.moreThanThreeStops')}
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
                                                            fontSize: '12px',
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
                                                        cartItem.dataFlightComeback.segments.at(
                                                            -1
                                                        ).arrival_time,
                                                        cartItem.dataFlightComeback.segments.at(
                                                            -1
                                                        ).arrival_airport_id
                                                            .time_zon
                                                    )}
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center gap-2">
                                                    <div className="flight-route">
                                                        {
                                                            cartItem.dataFlightComeback.segments.at(
                                                                -1
                                                            ).arrival_airport_id
                                                                .code
                                                        }
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: '10px',
                                                            color: '#6c757d',
                                                        }}
                                                    >
                                                        {t('cart.nextDay')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="d-flex align-items-center gap-2 justify-content-between">
                            <div className="d-flex justify-content-center align-items-center gap-2">
                                <input
                                    type="checkbox"
                                    style={{
                                        height: '15px',
                                        width: '15px',
                                        cursor: 'pointer',
                                    }}
                                    disabled={
                                        currentItemIndex !== 0 &&
                                        currentItemIndex !== index + 1
                                    }
                                    onClick={() =>
                                        handleSelectItem(cartItem, index)
                                    }
                                ></input>
                                <div className="d-flex gap-3">
                                    <span
                                        className={
                                            currentItemIndex !== 0 &&
                                            currentItemIndex !== index + 1
                                                ? 'text-muted'
                                                : 'text-primary'
                                        }
                                        style={{ fontWeight: '500' }}
                                    >
                                        {cartItem.peopleQuantity.adult} {t('cart.passengers')}
                                    </span>
                                    {cartItem.peopleQuantity.child !== 0 && (
                                        <span
                                            className="text-primary"
                                            style={{ fontWeight: '500' }}
                                        >
                                            {cartItem.peopleQuantity.child} {t('cart.children')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex gap-2 justify-content-center align-items-center">
                                {currentItemIndex !== 0 &&
                                currentItemIndex !== index + 1 ? (
                                    <div className="text-muted">
                                        {t('cart.selectMaxOneFlight')} {t('cart.payment')}
                                    </div>
                                ) : (
                                    <div style={{ fontWeight: '500' }}>
                                        {Array.isArray(
                                            cartItem.dataFlightDeparture
                                                ?.seats_quantity
                                        ) &&
                                        cartItem.dataFlightDeparture
                                            .seats_quantity.length > 0 &&
                                        Array.isArray(
                                            cartItem.dataFlightComeback
                                                ?.seats_quantity
                                        ) &&
                                        cartItem.dataFlightComeback
                                            .seats_quantity.length > 0
                                            ? formatCurrency(
                                                  calculaterPriceFlightRoundTrip(
                                                      cartItem
                                                  )
                                              )
                                            : formatCurrency(
                                                  calculaterPriceFlightOneWay(
                                                      cartItem
                                                  )
                                              )}
                                    </div>
                                )}
                                {/* <button
                                    className="btn btn-danger p-0 d-flex justify-content-center align-items-center"
                                    style={{ width: '25px', height: '25px' }}
                                > */}
                                <RiDeleteBin5Line
                                    color="red"
                                    fontSize={'20px'}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                        handleDeleteItem(index, cartItem?.id)
                                    }
                                />
                                {/* </button> */}
                            </div>
                        </div>
                    </div>
                ))}
            {selectViewDetail && Object.keys(selectViewDetail).length > 0 && (
                <FlightSelectedInformation
                    show={showDetailInformation}
                    setShow={handleCloseDetailInformation}
                    dataFlight={selectViewDetail}
                />
            )}
        </div>
    );
};

export default CartContent;
