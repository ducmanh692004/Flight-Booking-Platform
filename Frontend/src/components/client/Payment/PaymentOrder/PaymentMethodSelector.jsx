import { useTranslation } from 'react-i18next';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange }) => {
    const { t } = useTranslation();
    const paymentMethods = [
        {
            id: 'paypal',
            name: 'PayPal',
            description: `${t('payment.creditCardDesc')}`,
            icons: 'https://upload.wikimedia.org/wikipedia/commons/9/93/PayPal_Logo2014.png',
        },
        {
            id: 'vnpay',
            name: 'VNPay',
            description: `${t('payment.vnpayDesc')}`,
            icons: 'https://th.bing.com/th/id/OIP.CoKOWITYxQI47VWXZ6m7SAHaHa?w=209&h=208&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
        },
    ];

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h5 className="card-title mb-4">
                    {t('payment.paymentMethod')}
                </h5>

                <div className="d-flex flex-column gap-2">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            className={`p-2 px-3 border rounded cursor-pointer ${
                                selectedMethod === method.id
                                    ? 'border-primary bg-light'
                                    : 'border-secondary'
                            }`}
                            onClick={() => onMethodChange(method.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        className="rounded"
                                        src={method.icons}
                                        style={{
                                            height: '35px',
                                            width: '35px',
                                        }}
                                    ></img>
                                    <div>
                                        <div className="fw-medium text-dark">
                                            {method.name}
                                        </div>
                                        <div className="small text-muted">
                                            {method.description}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`border rounded-circle d-flex align-items-center justify-content-center ${
                                        selectedMethod === method.id
                                            ? 'border-primary bg-primary'
                                            : 'border-secondary'
                                    }`}
                                    style={{ width: '20px', height: '20px' }}
                                >
                                    {selectedMethod === method.id && (
                                        <div
                                            className="bg-white rounded-circle"
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                            }}
                                        ></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodSelector;
