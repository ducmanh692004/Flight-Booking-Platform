import PaymentMethodSelector from './PaymentMethodSelector';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchAllSeatClassFlight } from '../../../../services/UserFlightList';
import ContactInfo from './ContactInfo';
import PassengerInfo from './PassengerInfo';
import { FaArrowDown } from 'react-icons/fa';
import { useFormatter } from '../../../hooks/useFomatter';
import VNPayPayment from './VnPayPayment';
// import ZaloPayPayment from './ZaloPayPayment';
import { toast } from 'react-toastify';
import {
    createOrderPayPal,
    createOrderDataVNPayToPayment,
    handleUpdateOrderStatus,
} from '../../../../services/OrderService';
import { useDispatch } from 'react-redux';
import { clearPaymentData } from '../../../../redux/actions/paymentAction';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import PayPalPayment from './PayPalPayment';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Payment = () => {
    const { t } = useTranslation();
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState('paypal');
    const [flightDataDeparture, setFlightDataDeparture] = useState({});
    const [flightDataComeback, setFlightDataComeback] = useState({});
    const itemPayment = useSelector((state) => state.payment);
    const { formatCurrency } = useFormatter();
    const [showDetailPrice, setShowDetailPrice] = useState(false);

    const history = useHistory();
    const handleTakeData = async () => {
        const response = await fetchAllSeatClassFlight(
            itemPayment.flightDepartureId,
            itemPayment.flightComebackId || undefined
        );
        if (response && response.EC === 0) {
            setFlightDataDeparture(response.DT.dataFlightDeparture);
            setFlightDataComeback(response.DT.dataFlightComeback || {});
        }
    };

    const dispath = useDispatch();

    const handlePaymentVnPay = async () => {
        const response = await createOrderDataVNPayToPayment(
            itemPayment.orderId
        );
        if (response && response.EC === 0) {
            window.location.href = response.DT;
        } else {
            toast.error(response.EM);
        }
    };

    useEffect(() => {
        handleTakeData();
    }, []);

    useEffect(() => {
        if (selectedPaymentMethod === 'paypal' && window.paypal) {
            const container = document.getElementById(
                'paypal-button-container'
            );
            if (!container) return;

            container.innerHTML = '';

            window.paypal
                .Buttons({
                    createOrder: async () => {
                        const res = await createOrderPayPal(
                            itemPayment.orderId
                        );
                        return res.DT;
                    },

                    onApprove: async (data, actions) => {
                        const details = await actions.order.capture();
                        const captureId =
                            details.purchase_units[0].payments.captures[0].id;
                        // console.log('checkkk ', details);

                        const response = await handleUpdateOrderStatus(
                            itemPayment.orderId,
                            'Đã thanh toán',
                            'PayPal',
                            captureId
                        );

                        if (response && response.EC === 0) {
                            // setTimeout(() => {
                            history.push(
                                `/payment-success?orderId=${
                                    itemPayment.orderId
                                }&totalPrice=${
                                    itemPayment.totalBaggagePrice +
                                    itemPayment.totalSeatDetailPrice +
                                    itemPayment.priceTotalFlightDeparture +
                                    itemPayment.priceTotalFlightComeback
                                }&paymentMethod=PayPal&paymentStatus=${t(
                                    'paymentForm.paymentSuccess'
                                )}`
                            );
                            // }, 5000);
                        }
                    },

                    onCancel: (data) => {
                        toast.error(t('paymentForm.transactionCancelled'));
                    },

                    onError: (err) => {
                        toast.error(t('paymentForm.paymentError'));
                    },
                })
                .render('#paypal-button-container');
        }
    }, [selectedPaymentMethod]);

    if (Object.keys(itemPayment).length > 0) {
        return (
            <div className="container-fluid p-4 mb-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="row g-4">
                            <div className="col-lg-7">
                                <div className="d-flex flex-column gap-4">
                                    <PaymentMethodSelector
                                        selectedMethod={selectedPaymentMethod}
                                        onMethodChange={
                                            setSelectedPaymentMethod
                                        }
                                    />
                                    {selectedPaymentMethod === 'paypal' && (
                                        <PayPalPayment />
                                    )}
                                    {selectedPaymentMethod === 'vnpay' && (
                                        <VNPayPayment />
                                    )}

                                    {selectedPaymentMethod === 'paypal' && (
                                        // <div className="d-flex justify-content-center bg-primary">
                                        <div id="paypal-button-container"></div>
                                        // </div>
                                    )}
                                    {selectedPaymentMethod === 'vnpay' && (
                                        <Button
                                            className="btn-lg"
                                            style={{ fontWeight: '500' }}
                                            onClick={() => handlePaymentVnPay()}
                                        >
                                            {t('paymentForm.payment')}
                                        </Button>
                                    )}

                                    <div className="text-center small text-muted">
                                        {t('paymentForm.byClickingButton')}{' '}
                                        {t('paymentForm.iAgree')}{' '}
                                        <a
                                            href="#"
                                            className="text-primary text-decoration-none"
                                        >
                                            {t('paymentForm.termsOfUse')}
                                        </a>{' '}
                                        {t('paymentForm.and')}{' '}
                                        <a
                                            href="#"
                                            className="text-primary text-decoration-none"
                                        >
                                            {t('paymentForm.privacyPolicy')}
                                        </a>{' '}
                                        {t('paymentForm.ofJetNow')}
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-5 d-flex flex-column gap-4">
                                <ContactInfo
                                    formData={itemPayment}
                                    flightDataDeparture={flightDataDeparture}
                                    flightDataComeback={flightDataComeback}
                                    seatClassDeparture={
                                        itemPayment.currentSeatClassDeparture
                                    }
                                    seatClassComeback={
                                        itemPayment.currentSeatClassComeback
                                    }
                                />
                                <PassengerInfo
                                    formDataAdult={itemPayment.formAllDataAdult}
                                    formDataChild={itemPayment.formAllDataChild}
                                />

                                <div className="border rounded card shadow-sm p-3 w-100">
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <h5 className="mt-0 mb-0">
                                            {t('paymentForm.totalPayment')}
                                        </h5>
                                        <div
                                            style={{ marginLeft: 'auto' }}
                                            className="d-flex align-items-center gap-2"
                                        >
                                            <h5
                                                className="mt-0 mb-0 text-primary"
                                                style={{ fontSize: '18px' }}
                                            >
                                                {formatCurrency(
                                                    itemPayment.totalBaggagePrice +
                                                        itemPayment.totalSeatDetailPrice +
                                                        itemPayment.priceTotalFlightDeparture +
                                                        itemPayment.priceTotalFlightComeback
                                                )}
                                            </h5>
                                            <div
                                                className="d-flex align-items-center justify-content-center bg-secondary rounded-circle px-1"
                                                style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() =>
                                                    setShowDetailPrice(
                                                        !showDetailPrice
                                                    )
                                                }
                                            >
                                                <FaArrowDown
                                                    style={{ fontSize: '11px' }}
                                                    color="white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {showDetailPrice && (
                                        <div className="mt-2 d-flex flex-column gap-1">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">
                                                    {t(
                                                        'paymentForm.totalBaggage'
                                                    )}
                                                </span>
                                                <span
                                                    className="text-primary"
                                                    style={{
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        itemPayment.totalBaggagePrice
                                                    )}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">
                                                    {t(
                                                        'paymentForm.totalSelectedSeats'
                                                    )}
                                                </span>
                                                <span
                                                    className="text-primary"
                                                    style={{
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        itemPayment.totalSeatDetailPrice
                                                    )}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">
                                                    {t(
                                                        'paymentForm.totalDepartureTickets'
                                                    )}
                                                </span>
                                                <span
                                                    className="text-primary"
                                                    style={{
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        itemPayment.priceTotalFlightDeparture
                                                    )}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">
                                                    {t(
                                                        'paymentForm.totalReturnTickets'
                                                    )}
                                                </span>
                                                <span
                                                    className="text-primary"
                                                    style={{
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        itemPayment.priceTotalFlightComeback
                                                    )}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted">
                                                    {t('paymentForm.discount')}
                                                </span>
                                                <span
                                                    className="text-primary"
                                                    style={{
                                                        fontWeight: '500',
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        itemPayment?.discountValue ||
                                                            0
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div
                className="container d-flex justify-content-center"
                style={{ height: '90vh' }}
            >
                <div
                    className="bg-primary rounded p-4 d-flex justify-content-center align-items-center flex-column gap-2"
                    style={{
                        width: 'fit-content',
                        height: 'fit-content',
                        marginTop: '150px',
                    }}
                >
                    <h5 className="text-white">
                        {t('paymentForm.noOrdersToPay')}
                    </h5>
                    <a className="text-white underline mt-3">
                        {t('paymentForm.backToHome')}
                    </a>
                </div>
            </div>
        );
    }
};

export default Payment;
