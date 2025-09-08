import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { MdOutlineAccountCircle } from 'react-icons/md';
import YourCurrentFlight from './YourCurrentFlight';
import FillUserInformation from './FillUserInformation';
import SelectOtherSeatClass from './SelectOtherSeatClass';
import SelectMoreBaggage from './SelectMoreBaggage';
import SelectDetailSeat from './SelectDetailSeat';
import {
    fetchAllSeatClassFlight,
    handleCheckSeatHaveEnough,
} from '../../../../services/UserFlightList';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { set } from 'lodash';
import { validate } from 'uuid';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setItemsPayment } from '../../../../redux/actions/paymentAction';
import { handleCreateOrder } from '../../../../services/OrderService';
import { removeItemById } from '../../../../redux/actions/cartAction';
import { deleteCartItem } from '../../../../services/CartService';
import Coupon from './Coupon';
import { useTranslation } from 'react-i18next';

const ConfirmUserInformation = () => {
    const [dataFlightDeparture, setDataFlightDeparture] = useState({});
    const [dataFlightComeback, setDataFlightComeback] = useState({});
    // const [activeTrip, setActiveTrip] = useState('departure');
    const [currentSeatClassDeparture, setCurrentSeatClassDeparture] = useState(
        {}
    );
    const [currentSeatClassComeback, setCurrentSeatClassComeback] = useState(
        {}
    );
    const [cartItemId, setCartItemId] = useState('');

    const [currentDepartureBaggage, setCurrentDepartureBaggage] = useState({});
    const [currentComebackBaggage, setCurrentComebackBaggage] = useState({});
    const [currentSeatDetailDeparture, setCurrentSeatDetailDeparture] =
        useState({});
    const [currentSeatDetailComeback, setCurrentSeatDetailComeback] = useState(
        {}
    );
    const userId = useSelector((state) => state.user.account.id);
    const { t } = useTranslation();

    const location = useLocation();
    const [peopleQuantity, setPeopleQuantity] = useState({});
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        phone: '',
        email: '',
        countryCode: '+84',
    });
    const history = useHistory();
    const dispatch = useDispatch();

    const [priceBaggageDeparture, setPriceBaggageDeparture] = useState(0);
    const [priceBaggageComeback, setPriceBaggageComeback] = useState(0);
    const [priceTotalFlightDeparture, setPriceTotalFlightDeparture] =
        useState(0);
    const [priceTotalFlightComeback, setPriceTotalFlightComeback] = useState(0);
    const [priceDetailSeatDeparture, setPriceDetailSeatDeparture] = useState(0);
    const [priceDetailSeatComeback, setPriceDetailSeatComeback] = useState(0);
    const [discountValue, setDiscountValue] = useState(0);
    const [formErrors, setFormErrors] = useState({});

    // State fill Passenger information
    const [formAllDataAdult, setFormAllDataAdult] = useState([]);
    const [formAllDataChild, setFormAllDataChild] = useState([]);
    const [formErrorAdult, setFormErrorAdult] = useState([]);
    const [formErrorChild, setFormErrorChild] = useState([]);

    const handleSetDiscountValue = (value) => {
        setDiscountValue(value);
    };

    const handleChangePassengerInformation = (people, index, field, value) => {
        if (people === 'adult') {
            setFormAllDataAdult((prev) => {
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    [field]: value,
                };
                return updated;
            });
        } else if (people === 'child') {
            setFormAllDataChild((prev) => {
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    [field]: value,
                };
                return updated;
            });
        }
    };

    const handleTakeData = () => {
        if (peopleQuantity.adult > 0) {
            let adultData = [];
            for (let i = 0; i < peopleQuantity.adult; i++) {
                adultData.push({
                    index: i,
                    title: 'Ông',
                    firstName: '',
                    lastName: '',
                    birthDay: '',
                    birthMonth: '10',
                    birthYear: '',
                    nationality: 'Việt Nam',
                });
            }
            setFormAllDataAdult(adultData);
            setFormErrorAdult(adultData);
        }

        if (peopleQuantity.child > 0) {
            let childData = [];
            for (let i = 0; i < peopleQuantity.child; i++) {
                childData.push({
                    index: i,
                    title: 'Ông',
                    firstName: '',
                    lastName: '',
                    birthDay: '',
                    birthMonth: '10',
                    birthYear: '',
                    nationality: 'Việt Nam',
                });
            }
            setFormAllDataChild(childData);
            setFormErrorChild(childData);
        }
    };

    const validateDetailPassenger = (data, people) => {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            const errors = {};
            const passenger = data[i];

            if (!passenger.lastName || !passenger.lastName.trim()) {
                errors.lastName = 'Vui lòng nhập họ.';
            }

            if (!passenger.firstName || !passenger.firstName.trim()) {
                errors.firstName = 'Vui lòng nhập tên.';
            }

            const day = parseInt(passenger.birthDay, 10);
            const month = parseInt(passenger.birthMonth, 10);
            const year = parseInt(passenger.birthYear, 10);

            if (!day || day < 1 || day > 31) {
                errors.birthDay = 'Ngày sinh không hợp lệ.';
            }

            const currentYear = new Date().getFullYear();
            if (!year || year < 1900 || year > currentYear) {
                errors.birthYear = 'Năm sinh không hợp lệ.';
            }

            if (!errors.birthDay && !errors.birthYear) {
                const birthDate = new Date(year, month - 1, day);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const dayDiff = today.getDate() - birthDate.getDate();

                if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                    age--;
                }

                if (people === 'adult') {
                    if (age < 12) {
                        errors.birthDay = 'Người lớn phải từ 12 tuổi trở lên.';
                    }
                } else if (people === 'child') {
                    if (age >= 12) {
                        errors.birthDay = 'Trẻ em phải dưới 12 tuổi.';
                    }
                }
            }

            if (Object.keys(errors).length > 0) {
                arr.push(errors);
            }
        }
        return arr;
    };

    // const validateFormPassengerInformation = () => {
    //     let validatedAdult = true;
    //     if (peopleQuantity.adult > 0) {
    //         const error = validateDetailPassenger(formAllDataAdult, 'adult');
    //         setFormAllDataAdult(error);
    //         if (Object.keys(error).length > 0) {
    //             validatedAdult = false;
    //         }
    //     }

    //     let validatedChild = true;
    //     if (peopleQuantity.child > 0) {
    //         const error = validateDetailPassenger(formAllDataChild, 'child');
    //         setFormAllDataChild(error);
    //         if (Object.keys(error).length > 0) {
    //             validatedChild = false;
    //         }
    //     }

    //     if (validatedAdult && validatedChild) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // };

    const handleSetContactForm = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSetDetailSeat = (type, value) => {
        if (type === 'departure') {
            setPriceDetailSeatDeparture(value);
        } else {
            setPriceDetailSeatComeback(value);
        }
    };

    const validateFormData = (data) => {
        const errors = {};

        if (!data.firstName.trim()) {
            errors.firstName = 'Vui lòng nhập tên.';
        }

        if (!data.lastName.trim()) {
            errors.lastName = 'Vui lòng nhập họ.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email.trim()) {
            errors.email = 'Vui lòng nhập email.';
        } else if (!emailRegex.test(data.email)) {
            errors.email = 'Email không hợp lệ.';
        }

        const phoneRegex = /^[0-9]{6,15}$/;
        if (!data.phone.trim()) {
            errors.phone = 'Vui lòng nhập số điện thoại.';
        } else if (!phoneRegex.test(data.phone)) {
            errors.phone = 'Số điện thoại không hợp lệ.';
        } else {
            if (
                data.countryCode === '+84' &&
                data.phone.length !== 10 &&
                data.phone.length !== 11
            ) {
                errors.phone =
                    'Số điện thoại Việt Nam phải có 9 hoặc 10 chữ số.';
            }

            if (
                data.countryCode === '+44' &&
                data.phone.length !== 10 &&
                data.phone.length !== 11
            ) {
                errors.phone = 'Số điện thoại UK phải có 10 hoặc 11 chữ số.';
            }
        }

        const allowedCountryCodes = ['+84', '+44'];
        if (!allowedCountryCodes.includes(data.countryCode)) {
            errors.countryCode = 'Mã quốc gia không hợp lệ.';
        }

        return errors;
    };

    const calculateTotalDepartureComeback = () => {
        if (Object.keys(dataFlightDeparture).length > 0) {
            let total = 0;
            for (
                let i = 0;
                i < dataFlightDeparture.seats_quantity.length;
                i++
            ) {
                if (
                    dataFlightDeparture.seats_quantity[i].seat_class_id._id ===
                    currentSeatClassDeparture._id
                ) {
                    total +=
                        Number(
                            dataFlightDeparture.seats_quantity[i].price
                                .$numberDecimal
                        ) *
                            peopleQuantity.adult +
                        (Number(
                            dataFlightDeparture.seats_quantity[i].child_price
                                .$numberDecimal
                        ) * peopleQuantity?.child || 0);
                }
            }
            setPriceTotalFlightDeparture(total);
        }

        if (Object.keys(dataFlightComeback).length > 0) {
            let total = 0;
            for (let i = 0; i < dataFlightComeback.seats_quantity.length; i++) {
                if (
                    dataFlightComeback.seats_quantity[i].seat_class_id._id ===
                    currentSeatClassComeback._id
                ) {
                    total +=
                        Number(
                            dataFlightComeback.seats_quantity[i].price
                                .$numberDecimal
                        ) *
                            peopleQuantity.adult +
                        (Number(
                            dataFlightComeback.seats_quantity[i].child_price
                                .$numberDecimal
                        ) * peopleQuantity?.child || 0);
                }
            }
            setPriceTotalFlightComeback(total);
        }
    };

    const handleSetPriceBaggage = (field, value) => {
        if (field === 'departure') {
            setPriceBaggageDeparture(value);
        } else {
            setPriceBaggageComeback(value);
        }
    };

    const handleChangeCurrentSeatClass = (field, value) => {
        if (field === 'departure') {
            setCurrentSeatClassDeparture(value);
        } else {
            setCurrentSeatClassComeback(value);
        }
    };

    const fetchAllSeatClassOfFlight = async () => {
        try {
            const dataUrl = new URLSearchParams(location.search);
            const flightDepartureId = dataUrl.get('flightDepartureId');
            const flightComebackId = dataUrl.get('flightComebackId');
            const seatClassId = dataUrl.get('seatClassId');
            const seatClassName = dataUrl.get('seatClassName');
            const peopleQuantityString = dataUrl.get('peopleQuantity');
            const peopleQuantity = JSON.parse(peopleQuantityString);
            const cartItemId = dataUrl.get('cartItemId');
            if (flightDepartureId && seatClassId && peopleQuantity) {
                setCurrentSeatClassDeparture({
                    _id: seatClassId,
                    name: seatClassName,
                });

                setCurrentSeatClassComeback({
                    _id: seatClassId,
                    name: seatClassName,
                });
                setPeopleQuantity(peopleQuantity);
                handleCreateDefaultBaggage(
                    peopleQuantity.adult,
                    peopleQuantity.child
                );
                handleCreateDefaultSeatDetail(
                    peopleQuantity.adult,
                    peopleQuantity.child
                );

                setCartItemId(cartItemId);

                const response = await fetchAllSeatClassFlight(
                    flightDepartureId,
                    flightComebackId ? flightComebackId : ''
                );

                if (response && response.EC === 0) {
                    setDataFlightDeparture(response.DT.dataFlightDeparture);
                    if (response.DT.dataFlightComeback) {
                        setDataFlightComeback(response.DT.dataFlightComeback);
                    }
                } else {
                    toast.error(response.EM);
                    history.push('/');
                }
            } else {
                toast.error('Thông tin chuyến bay không hợp lệ!');
                history.push('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmitForm = async () => {
        const error = validateFormData(formData);
        const errorAdult = validateDetailPassenger(formAllDataAdult, 'adult');
        const errorChild = validateDetailPassenger(formAllDataChild, 'child');

        setFormErrors(error);
        setFormErrorAdult(errorAdult);
        setFormErrorChild(errorChild);
        if (
            Object.keys(error).length === 0 &&
            errorAdult.length === 0 &&
            errorChild.length === 0
        ) {
            // await submitOrderData({
            const objectUrl = {
                currentDepartureBaggage: currentDepartureBaggage,
                currentComebackBaggage: currentComebackBaggage,
                flightDepartureId: dataFlightDeparture._id,
                flightComebackId: dataFlightComeback._id,
                currentSeatDetailDeparture: currentSeatDetailDeparture,
                currentSeatDetailComeback: currentSeatDetailComeback,
                currentSeatClassDeparture: currentSeatClassDeparture,
                currentSeatClassComeback: currentSeatClassComeback,
                peopleQuantity: peopleQuantity,
                formData: formData,
                formAllDataAdult: formAllDataAdult,
                formAllDataChild: formAllDataChild,
                totalBaggagePrice: priceBaggageDeparture + priceBaggageComeback,
                totalSeatDetailPrice:
                    priceDetailSeatDeparture + priceDetailSeatComeback,
                priceTotalFlightDeparture: priceTotalFlightDeparture,
                priceTotalFlightComeback: priceTotalFlightComeback,
                discountValue: discountValue,
                cartItemId: cartItemId,
            };

            const response = await handleCreateOrder(objectUrl, userId);
            if (response && response.EC === 0) {
                objectUrl.orderId = response.DT;
                objectUrl.discountValue = discountValue;
                dispatch(setItemsPayment(objectUrl));
                if (cartItemId !== null) {
                    dispatch(removeItemById(cartItemId));
                    await deleteCartItem(cartItemId);
                }
                history.push('/payment');
            } else {
                toast.error(response.EM);
            }

            // console.log(
            //     'check data flight DEPARTURE ID:',
            //     dataFlightDeparture._id
            // );
            // console.log(
            //     'check data flight COMEBACK ID:',
            //     dataFlightComeback._id
            // );
            // const response = await handleCheckSeatHaveEnough(
            //     dataFlightDeparture._id,
            //     dataFlightComeback._id,
            //     currentSeatClassDeparture._id,
            //     currentSeatClassComeback._id,
            //     peopleQuantity.adult + peopleQuantity.child
            // );
            // if (response && response.EC === 0) {

            //     dispatch(setItemsPayment(objectUrl));

            //     history.push('/payment');
            // } else {
            //     toast.error(response.EM);
            // }

            // history.push(`/payment?dataPayment=${JSON.stringify(objectUrl)}`);
        } else {
            toast.error('Vui lòng kiểm tra lại thông tin của bạn!');
        }
    };

    const handleCreateDefaultBaggage = (numberAdults, numberChild) => {
        let defaultState = {
            adults: [],
            child: [],
        };
        if (numberAdults > 0) {
            for (let i = 0; i < numberAdults; i++) {
                defaultState.adults.push({
                    index: i,
                    baggage: 1,
                });
            }
        }

        if (numberChild > 0) {
            for (let i = 0; i < numberChild; i++) {
                defaultState.child.push({
                    index: i,
                    baggage: 1,
                });
            }
        }

        setCurrentDepartureBaggage(defaultState);
        setCurrentComebackBaggage(defaultState);
    };

    const handleCreateDefaultSeatDetail = (numberAdults, numberChild) => {
        let defaultState = {
            adults: [],
            child: [],
        };
        if (numberAdults > 0) {
            for (let i = 0; i < numberAdults; i++) {
                defaultState.adults.push({
                    rowId: '',
                    seat_id: '',
                    seatNumber: '',
                    row: 0,
                    price: 0,
                });
            }
        }

        if (numberChild > 0) {
            for (let i = 0; i < numberChild; i++) {
                defaultState.child.push({
                    rowId: '',
                    seat_id: '',
                    seatNumber: '',
                    row: 0,
                    price: 0,
                });
            }
        }
        setCurrentSeatDetailDeparture(defaultState);
        setCurrentSeatDetailComeback(defaultState);
    };

    const handleChangeBaggage = (people, index, field, value) => {
        if (field === 'departure') {
            setCurrentDepartureBaggage((prev) => {
                const updated = { ...prev };
                const arr = [...updated[people]];
                arr[index] = { ...arr[index], baggage: value };
                updated[people] = arr;
                return updated;
            });
        } else if (field === 'comeback') {
            setCurrentComebackBaggage((prev) => {
                const update = { ...prev };
                const arr = [...update[people]];
                arr[index] = { ...arr[index], baggage: value };
                update[people] = arr;
                return update;
            });
        }
    };

    const handleChooseDetailSeat = (
        type,
        people,
        index,
        price,
        number,
        row,
        rowId,
        seatId
    ) => {
        // console.log('kkkkkkk', people);
        // alert('hellloo');

        // if (type === 'child' && peopleQuantity.child === 0) {
        //     return;
        // }

        if (type === 'departure') {
            setCurrentSeatDetailDeparture((prev) => {
                const updated = { ...prev };
                const arr = [...updated[people]];
                arr[index] = {
                    ...arr[index],
                    rowId: rowId,
                    seat_id: seatId,
                    price: price,
                    seatNumber: number,
                    row: row,
                };
                updated[people] = arr;
                return updated;
            });
        } else if (type === 'comeback') {
            setCurrentSeatDetailComeback((prev) => {
                const updated = { ...prev };
                const arr = [...updated[people]];
                arr[index] = {
                    ...arr[index],
                    rowId: rowId,
                    seat_id: seatId,
                    price: price,
                    seatNumber: number,
                    row: row,
                };
                updated[people] = arr;
                return updated;
            });
        }
    };

    useEffect(() => {
        fetchAllSeatClassOfFlight();
        // assignCurrentSeatClass();
    }, []);

    useEffect(() => {
        handleTakeData();
    }, [peopleQuantity]);

    useEffect(() => {
        calculateTotalDepartureComeback();
    }, [
        dataFlightDeparture,
        dataFlightComeback,
        currentSeatClassDeparture,
        currentSeatClassComeback,
    ]);

    return (
        <div className="container mt-4 mb-5">
            <div className="container-fluid">
                <div className="row g-4">
                    {/* Contact Information Section */}
                    <div className="col-lg-9">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white pt-3 pb-3 d-flex justify-content-start align-items-center gap-2">
                                <div className="bg-primary pt-1 p-2 rounded-circle">
                                    <MdOutlineAccountCircle
                                        className="text-white"
                                        size={20}
                                    />
                                </div>
                                <h5 className="card-title mb-0 text-dark fw-semibold">
                                    {t('passenger.info')}
                                </h5>
                            </div>
                            <div className="card-body">
                                {/* Name Fields */}
                                <div className="row mb-4">
                                    <div className="col-md-6 mb-3">
                                        <label
                                            htmlFor="lastName"
                                            className="form-label fw-medium"
                                        >
                                            {t('passenger.lastNameExample')}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                formErrors.lastName
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) =>
                                                handleSetContactForm(
                                                    'lastName',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="ta"
                                        />
                                        <div className="form-text">
                                            {t('passenger.cccdExample')}
                                        </div>
                                        {formErrors.firstName && (
                                            <span className="text-danger">
                                                {formErrors.lastName}
                                            </span>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label
                                            htmlFor="firstName"
                                            className="form-label fw-medium"
                                        >
                                            {t('passenger.firstNameExample')}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${
                                                formErrors.firstName
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) =>
                                                handleSetContactForm(
                                                    'firstName',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="duc manh"
                                        />
                                        <div className="form-text">
                                            {t('passenger.cccdExample')}
                                        </div>
                                        {formErrors.firstName && (
                                            <span className="text-danger">
                                                {formErrors.firstName}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Phone and Email Fields */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label
                                            htmlFor="phone"
                                            className="form-label fw-medium"
                                        >
                                            {t('formPayment.phone')}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <div className="input-group">
                                            <select
                                                className="form-select"
                                                style={{ maxWidth: '120px' }}
                                                value={formData.countryCode}
                                                onChange={(e) =>
                                                    handleSetContactForm(
                                                        'countryCode',
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="+84">
                                                    vn +84
                                                </option>
                                                <option value="+1">
                                                    gb +44
                                                </option>
                                            </select>
                                            <input
                                                type="tel"
                                                className={`form-control ${
                                                    formErrors.phone
                                                        ? 'is-invalid'
                                                        : ''
                                                }`}
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    handleSetContactForm(
                                                        'phone',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="985359043"
                                            />
                                        </div>
                                        <div className="form-text">
                                            {t('passenger.countryPhone')}
                                        </div>
                                        {formErrors.phone && (
                                            <span className="text-danger">
                                                {formErrors.phone}
                                            </span>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label
                                            htmlFor="email"
                                            className="form-label fw-medium"
                                        >
                                            Email
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${
                                                formErrors.email
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                handleSetContactForm(
                                                    'email',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="manhanh0609@gmail.com"
                                        />
                                        <div className="form-text">
                                            {t('formPayment.emailExample')}
                                        </div>
                                        {formErrors.email && (
                                            <span className="text-danger">
                                                {formErrors.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FillUserInformation
                            peopleQuantity={peopleQuantity}
                            formAllDataAdult={formAllDataAdult}
                            formAllDataChild={formAllDataChild}
                            formErrorAdult={formErrorAdult}
                            formErrorChild={formErrorChild}
                            handleChangePassengerInformation={
                                handleChangePassengerInformation
                            }
                        />
                        <SelectOtherSeatClass
                            dataFlightDeparture={dataFlightDeparture}
                            dataFlightComeback={dataFlightComeback}
                            currentSeatClassDeparture={
                                currentSeatClassDeparture
                            }
                            currentSeatClassComeback={currentSeatClassComeback}
                            handleChangeCurrentSeatClass={
                                handleChangeCurrentSeatClass
                            }
                        />
                        <SelectMoreBaggage
                            currentSeatClassComeback={currentSeatClassComeback}
                            currentSeatClassDeparture={
                                currentSeatClassDeparture
                            }
                            dataFlightComeback={dataFlightComeback}
                            dataFlightDeparture={dataFlightDeparture}
                            peopleQuantity={peopleQuantity}
                            currentDepartureBaggage={currentDepartureBaggage}
                            currentComebackBaggage={currentComebackBaggage}
                            handleChangeBaggage={handleChangeBaggage}
                            handleSetPriceBaggage={handleSetPriceBaggage}
                        />
                        <SelectDetailSeat
                            peopleQuantity={peopleQuantity}
                            dataFlightDepartureId={dataFlightDeparture._id}
                            dataFlightComebackId={dataFlightComeback._id}
                            currentSeatClassComeback={currentSeatClassComeback}
                            currentSeatClassDeparture={
                                currentSeatClassDeparture
                            }
                            currentDetailSeatDeparture={
                                currentSeatDetailDeparture
                            }
                            currentDetailSeatComeback={
                                currentSeatDetailComeback
                            }
                            handleChooseDetailSeat={handleChooseDetailSeat}
                            handleSetDetailSeat={handleSetDetailSeat}
                            priceDetailSeatDeparture={priceDetailSeatDeparture}
                            priceDetailSeatComeback={priceDetailSeatComeback}
                            // dataFlightComeback={dataFlightComeback}
                            // dataFlightDeparture={dataFlightDeparture}
                        />
                        <Coupon
                            handleSetDiscountValue={handleSetDiscountValue}
                            totalOrder={Number(
                                priceBaggageDeparture +
                                    priceBaggageComeback +
                                    priceTotalFlightDeparture +
                                    priceTotalFlightComeback +
                                    priceDetailSeatDeparture +
                                    priceDetailSeatComeback
                            )}
                        />
                        <div className="d-flex justify-content-end mt-4">
                            <button
                                className="btn btn-primary"
                                style={{ fontWeight: '500' }}
                                onClick={() => handleSubmitForm()}
                            >
                                {t('payment.continueToPayment')}
                            </button>
                        </div>
                    </div>

                    {/* Flight Summary Section - Placeholder */}
                    <div className="col-lg-3 px-0">
                        <div className="h-100 px-0">
                            <YourCurrentFlight
                                flightDataDeparture={dataFlightDeparture}
                                flightDataComeback={dataFlightComeback}
                                currentSeatClassDeparture={
                                    currentSeatClassDeparture
                                }
                                currentSeatClassComeback={
                                    currentSeatClassComeback
                                }
                                totalBaggageDeparture={priceBaggageDeparture}
                                totalBaggageComeback={priceBaggageComeback}
                                totalPriceFlightDeparture={
                                    priceTotalFlightDeparture
                                }
                                totalPriceFlightComeback={
                                    priceTotalFlightComeback
                                }
                                priceDetailSeatDeparture={
                                    priceDetailSeatDeparture
                                }
                                priceDetailSeatComeback={
                                    priceDetailSeatComeback
                                }
                                discountValue={discountValue}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmUserInformation;
