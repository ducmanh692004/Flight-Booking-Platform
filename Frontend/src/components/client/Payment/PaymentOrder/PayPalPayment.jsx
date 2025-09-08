import React from 'react';
import { useTranslation } from 'react-i18next';

const PayPalPayment = (props) => {
    const { t } = useTranslation();
    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <div className="text-center py-1">
                    <img
                        className="mb-4 mt-2"
                        src="https://upload.wikimedia.org/wikipedia/commons/9/93/PayPal_Logo2014.png"
                        style={{ width: '60px', height: '60px' }}
                    ></img>
                    <h5 className="fw-bold mb-3">
                        {t('paymentMethodContent.paypalTitle')}
                    </h5>
                    <p className="text-muted">
                        {t('paymentMethodContent.paypalContent')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PayPalPayment;
