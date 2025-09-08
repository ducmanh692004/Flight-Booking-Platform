import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { adminGetInformationOfRevenue } from '../../services/AdminService';
import { toast } from 'react-toastify';
import { useFormatter } from '../hooks/useFomatter';
import { useTranslation } from 'react-i18next'; // Import useTranslation

// Component Dashboard quản lý tổng quan hệ thống (sử dụng mockData)
const RevenueDashboard = () => {
    const { t } = useTranslation(); // Initialize useTranslation
    const [stats, setStats] = useState({});
    const { formatCurrency } = useFormatter();

    const fetchData = async () => {
        try {
            const response = await adminGetInformationOfRevenue();
            if (response && response.EC === 0) {
                setStats({
                    totalFlight: response.DT.totalFlight,
                    bookedFlights: response.DT.totalOrder,
                    paidFlights: response.DT.orderBooked,
                    canceledFlights: response.DT.orderCancel,
                    totalRevenue: response.DT.totalRevenue,
                    totalAirlines: response.DT.totalAirline,
                    totalAirports: response.DT.totalAirport,
                });
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="p-4">
            <h4 className="mb-4">{t('dashboard.title')}</h4>

            <Row xs={1} md={4} className="g-3 mb-4">
                <Col>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>
                                {t('dashboard.totalFlights')}
                            </Card.Title>
                            <Card.Text>{stats.totalFlight}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>
                                {t('dashboard.bookedFlights')}
                            </Card.Title>
                            <Card.Text>{stats.bookedFlights}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>
                                {t('dashboard.paidFlights')}
                            </Card.Title>
                            <Card.Text>{stats.paidFlights}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>
                                {t('dashboard.canceledFlights')}
                            </Card.Title>
                            <Card.Text>{stats.canceledFlights}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row xs={1} md={3} className="g-3">
                <Col>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>
                                {t('dashboard.totalRevenue')}
                            </Card.Title>
                            <Card.Text>
                                {formatCurrency(stats.totalRevenue)}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>
                                {t('dashboard.totalAirlines')}
                            </Card.Title>
                            <Card.Text>{stats.totalAirlines}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>
                                {t('dashboard.totalAirports')}
                            </Card.Title>
                            <Card.Text>{stats.totalAirports}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RevenueDashboard;
