import { Card, Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { fetchCouponDataForUser } from '../../../../services/CouponService';
import { useFormatter } from '../../../hooks/useFomatter';
import { useTranslation } from 'react-i18next';

const FlightPromotion = (props) => {
    const { t } = useTranslation();
    const [dataCoupon, setDataCoupon] = useState([]);
    const { formatCurrency } = useFormatter();

    const handleFetchDataCoupon = async () => {
        const response = await fetchCouponDataForUser();
        if (response && response.EC === 0) {
            setDataCoupon(response.DT);
        }
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
    };

    useEffect(() => {
        handleFetchDataCoupon();
    }, []);

    return (
        <div>
            <hr style={{ height: '0.8px' }}></hr>
            <div className="d-flex gap-2">
                {dataCoupon &&
                    dataCoupon.length > 0 &&
                    dataCoupon.map((coupon, index) => (
                        <Card
                            className="promo-card shadow-sm mb-3"
                            style={{ maxWidth: '270px', borderRadius: '12px' }}
                            key={index} // Thêm key cho các phần tử trong map
                        >
                            <Card.Body className="p-3">
                                <div className="d-flex align-items-start">
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center mb-2 bg-info p-1 rounded">
                                            <h6
                                                className="mb-0 me-2"
                                                style={{ color: 'white' }}
                                            >
                                                {t(
                                                    'userFlightPromotion.discountUpTo'
                                                )}{' '}
                                                {formatCurrency(
                                                    coupon.maximum_discount
                                                )}{' '}
                                            </h6>
                                            <i
                                                className="bi bi-info-circle text-primary"
                                                style={{ fontSize: '16px' }}
                                            ></i>
                                        </div>

                                        <p
                                            className="text-muted small mb-3"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {t('userFlightPromotion.bookFrom')}{' '}
                                            {formatCurrency(
                                                coupon.minimum_price
                                            )}
                                        </p>

                                        {/* Promo code input */}
                                        <div
                                            className="d-flex border rounded"
                                            style={{ height: '40px' }}
                                        >
                                            <Form.Control
                                                type="text"
                                                value={coupon.code}
                                                readOnly
                                                className="border-0 bg-transparent text-muted"
                                                style={{
                                                    fontSize: '14px',
                                                    paddingLeft: '12px',
                                                }}
                                            />
                                            <Button
                                                variant="link"
                                                className="border-0 text-primary fw-medium px-3"
                                                style={{ fontSize: '14px' }}
                                                onClick={() =>
                                                    handleCopy(coupon.code)
                                                }
                                            >
                                                {t('userFlightPromotion.copy')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
            </div>
        </div>
    );
};

export default FlightPromotion;
