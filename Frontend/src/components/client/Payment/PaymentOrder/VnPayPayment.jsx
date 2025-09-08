import React from 'react';
import { useTranslation } from 'react-i18next';

const VNPayPayment = () => {
    const { t } = useTranslation();

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <div className="text-center py-1">
                    <img
                        className="mb-4 mt-2"
                        src="https://th.bing.com/th/id/OIP.CoKOWITYxQI47VWXZ6m7SAHaHa?w=209&h=208&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
                        style={{ width: '55px', height: '55px' }}
                    ></img>
                    <h5 className="fw-bold mb-3">
                        {t('paymentMethodContent.vnpaytitle')}
                    </h5>
                    <p className="text-muted">
                        {t('paymentMethodContent.vnpayContent')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VNPayPayment;
