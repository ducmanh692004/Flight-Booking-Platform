import React from 'react';
import { Modal, Button, Image, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ViewAirportDetails = ({ show, handleClose, airportData }) => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation

    // Nếu không có dữ liệu sân bay, không hiển thị gì cả hoặc hiển thị thông báo
    if (!airportData) {
        return null;
    }

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            {' '}
            {/* Tăng kích thước modal */}
            <Modal.Header closeButton className="bg-info text-white">
                <Modal.Title>{t('viewAirportDetails.modalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Col md={6}>
                        {' '}
                        {/* Chia cột để hiển thị thông tin bên trái */}
                        <p>
                            <strong>
                                {t('viewAirportDetails.airportNameLabel')}:
                            </strong>{' '}
                            {airportData.name}
                        </p>
                        <p>
                            <strong>
                                {t('viewAirportDetails.iataCodeLabel')}:
                            </strong>{' '}
                            {airportData.code}
                        </p>
                        <p>
                            <strong>
                                {t('viewAirportDetails.countryLabel')}:
                            </strong>{' '}
                            {airportData.country}
                        </p>
                        <p>
                            <strong>
                                {t('viewAirportDetails.provinceLabel')}:
                            </strong>{' '}
                            {airportData.province}
                        </p>
                        <p>
                            <strong>
                                {t('viewAirportDetails.timeZoneLabel')}:
                            </strong>{' '}
                            {airportData.time_zon}
                        </p>
                    </Col>
                    <Col md={6}>
                        {' '}
                        {/* Phần ảnh bên phải */}
                        {airportData.image_province ? (
                            <div className="text-center">
                                <Image
                                    src={airportData.image_province}
                                    alt={t('viewAirportDetails.imageAlt', {
                                        province: airportData.province,
                                    })} // Dịch alt text và truyền biến
                                    fluid
                                    style={{
                                        maxWidth: '100%', // Ảnh chiếm toàn bộ chiều rộng cột
                                        height: 'auto', // Giữ tỉ lệ ảnh
                                        border: '1px solid #ddd',
                                        padding: '5px',
                                        objectFit: 'contain', // Đảm bảo toàn bộ ảnh hiển thị
                                    }}
                                />
                                <small className="text-muted mt-2 d-block">
                                    {t('viewAirportDetails.imageDescription')}
                                </small>
                            </div>
                        ) : (
                            <p className="text-muted text-center">
                                {t('viewAirportDetails.noImageMessage')}
                            </p>
                        )}
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('viewAirportDetails.closeButton')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewAirportDetails;
