import { Card, Button, Alert } from 'react-bootstrap';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFormatter } from '../../../hooks/useFomatter';
import { useDispatch } from 'react-redux';
import { clearPaymentData } from '../../../../redux/actions/paymentAction';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PaymentSuccess = () => {
    const { t } = useTranslation();
    const [orderId, setOrderId] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [status, setStatus] = useState('');
    const orderDate = new Date();
    const location = useLocation();
    const { formatCurrency } = useFormatter();
    const dispatch = useDispatch();
    const history = useHistory();
    const formattedDate = `${String(orderDate.getDate()).padStart(
        2,
        '0'
    )}/${String(orderDate.getMonth() + 1).padStart(
        2,
        '0'
    )}/${orderDate.getFullYear()}`;

    useEffect(() => {
        dispatch(clearPaymentData());
        const dataUrl = new URLSearchParams(location.search);
        const orderId = dataUrl.get('orderId');
        setOrderId(orderId);
        const totalPrice = dataUrl.get('totalPrice');
        setTotalPrice(totalPrice);
        const paymentMethod = dataUrl.get('paymentMethod');
        setPaymentMethod(paymentMethod);
        const status = dataUrl.get('paymentStatus');
        setStatus(status);
    }, []);

    return (
        <div
            style={{
                background:
                    'linear-gradient(135deg, #b1f6f8ff 0%, #d8fcddff 100%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'center',
                paddingTop: '60px',
            }}
        >
            <Container>
                <Card
                    className="text-center shadow-lg p-4"
                    style={{
                        maxWidth: '550px',
                        margin: '0 auto',
                        borderRadius: '20px',
                        backgroundColor: '#ffffffee',
                    }}
                >
                    <Card.Body>
                        {/* <CheckCircleFill size={70} color="#28a745" className="mb-4" /> */}
                        <Card.Title className="mb-3 text-success fw-bold fs-2">
                            {t('paymentSuccess.paymentSuccessful')}
                        </Card.Title>
                        <Card.Text className="text-muted">
                            {t('paymentSuccess.thankYou')}
                        </Card.Text>

                        <div className="d-flex justify-content-center mt-4 mb-4">
                            <div
                                className="d-flex flex-row w-100 px-4 d-flex justify-content-center"
                                style={{ maxWidth: '450px' }}
                            >
                                {/* Cột tiêu đề bên trái */}
                                <div
                                    className="d-flex flex-column align-items-start me-2"
                                    style={{ minWidth: '130px' }}
                                >
                                    <span className="text-muted fw-semibold mb-2">
                                        {t('paymentSuccess.orderCode')}
                                    </span>
                                    <span className="text-muted fw-semibold mb-2">
                                        {t('paymentSuccess.orderDate')}
                                    </span>
                                    <span className="text-muted fw-semibold mb-2">
                                        {t('paymentSuccess.paymentMethod')}
                                    </span>

                                    <span className="text-muted fw-semibold mb-2">
                                        {t('paymentSuccess.totalAmount')}
                                    </span>

                                    <span className="text-muted fw-semibold mb-2">
                                        {t('paymentSuccess.status')}
                                    </span>
                                </div>

                                {/* Cột nội dung bên phải */}
                                <div className="d-flex flex-column align-items-start">
                                    <span className="fw-semibold mb-2">
                                        {orderId}
                                    </span>
                                    <span className="fw-semibold mb-2">
                                        {formattedDate}
                                    </span>
                                    <span className="fw-semibold mb-2">
                                        {paymentMethod}
                                    </span>
                                    <span className="fw-semibold mb-2">
                                        {formatCurrency(totalPrice)}
                                    </span>
                                    <span className="fw-semibold mb-2">
                                        {status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-column px-5 mt-5">
                            <Button
                                variant="outline-success"
                                className="mt-3 px-4"
                                onClick={() =>
                                    history.push('/account/orderHistory')
                                }
                            >
                                {t('paymentSuccess.viewOrderHistory')}
                            </Button>
                            <Button
                                variant="success"
                                className="mt-3 px-4"
                                onClick={() => history.push('/')}
                            >
                                {t('paymentSuccess.backToHome')}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default PaymentSuccess;
