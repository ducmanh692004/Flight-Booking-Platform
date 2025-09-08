import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import {
    FaPlaneDeparture,
    FaSearch,
    FaCreditCard,
    FaHeadset,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const JetNowIntro = () => {
    const { t } = useTranslation();
    return (
        <div className="py-5 bg-light mb-5 mt-5">
            <Container>
                <div className="text-center mb-5">
                    <h1
                        className="display-4 text-primary"
                        style={{ fontWeight: '500' }}
                    >
                        {t('intro_brand.welcome')}{' '}
                        <span className="text-secondary">
                            {t('intro_brand.brandName')}
                        </span>
                    </h1>
                    <p className="lead mt-3">
                        {t('intro_brand.platformDescription')}
                    </p>
                </div>

                <Row className="g-4 mb-5">
                    <Col md={3}>
                        <Card className="shadow-sm h-100 text-center border-0">
                            <Card.Body>
                                <FaSearch
                                    size={40}
                                    className="text-primary mb-3"
                                />
                                <Card.Title className="fw-bold">
                                    {t('intro_brand.features.search.title')}
                                </Card.Title>
                                <Card.Text>
                                    {t(
                                        'intro_brand.features.search.description'
                                    )}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="shadow-sm h-100 text-center border-0">
                            <Card.Body>
                                <FaPlaneDeparture
                                    size={40}
                                    className="text-primary mb-3"
                                />
                                <Card.Title className="fw-bold">
                                    {t('intro_brand.features.booking.title')}
                                </Card.Title>
                                <Card.Text>
                                    {t(
                                        'intro_brand.features.booking.description'
                                    )}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="shadow-sm h-100 text-center border-0">
                            <Card.Body>
                                <FaCreditCard
                                    size={40}
                                    className="text-primary mb-3"
                                />
                                <Card.Title className="fw-bold">
                                    {t('intro_brand.features.payment.title')}
                                </Card.Title>
                                <Card.Text>
                                    {t(
                                        'intro_brand.features.payment.description'
                                    )}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="shadow-sm h-100 text-center border-0 mb-5">
                            <Card.Body>
                                <FaHeadset
                                    size={40}
                                    className="text-primary mb-3"
                                />
                                <Card.Title className="fw-bold">
                                    {t('intro_brand.features.support.title')}
                                </Card.Title>
                                <Card.Text>
                                    {t(
                                        'intro_brand.features.support.description'
                                    )}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default JetNowIntro;
