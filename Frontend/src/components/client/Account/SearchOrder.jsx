import { BsSearch } from 'react-icons/bs';
import { Button, Col, Card, Form, InputGroup, Row } from 'react-bootstrap';
import { set } from 'lodash';
import { useState } from 'react';
import OrderDetail from '../Payment/PaymentOrder/DetailOrderInformation';
import { useTranslation } from 'react-i18next';

const SearchOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [error, setError] = useState(false);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const { t } = useTranslation();

    const handleChange = (value) => {
        setOrderId(value);
    };

    const handleSearch = () => {
        if (orderId === '') {
            setError(true);
        } else if (orderId !== '') {
            setShowOrderDetail(true);
            setError(false);
        }
    };

    const handleHideOrderDetail = () => {
        setShowOrderDetail(false);
    };

    return (
        <div style={{ height: '70vh' }}>
            <OrderDetail
                orderId={orderId}
                onHide={handleHideOrderDetail}
                show={showOrderDetail}
            />
            <h5>{t('searchOrder.title')}</h5>
            <hr style={{ marginTop: '48px' }}></hr>
            <div>
                <Row className="justify-content-start mt-4">
                    {' '}
                    <Col md={6} lg={10}>
                        {' '}
                        <Card className="shadow-sm p-3 bg-light">
                            <Form>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder={t('searchOrder.placeholder')}
                                        value={orderId}
                                        onChange={(event) => handleChange(event.target.value)}
                                    />
                                    <Button
                                        variant="primary"
                                        onClick={() => handleSearch()}
                                        className="d-flex align-items-center justify-content-center gap-2"
                                    >
                                        <BsSearch size={20} />
                                        <span>{t('searchOrder.search')}</span>
                                    </Button>
                                </InputGroup>
                            </Form>
                        </Card>
                    </Col>
                    {error === true && (
                        <h6 className="text-danger mt-3">
                            {t('searchOrder.orderIdRequired')}
                        </h6>
                    )}
                    <div className="d-flex align-items-center justify-content-start gap-1 mt-4">
                        <h6 className="mt-0 mb-0 text-muted">
                            {t('searchOrder.support')}
                        </h6>
                        <a className="underline">tại đây</a>
                    </div>
                </Row>
            </div>
        </div>
    );
};

export default SearchOrder;
