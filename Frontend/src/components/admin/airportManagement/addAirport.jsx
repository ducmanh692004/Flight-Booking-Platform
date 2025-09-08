import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminAddAirport } from '../../../services/AdminService';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const AddAirport = ({ show, handleClose }) => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [country, setCountry] = useState('');
    const [province, setProvince] = useState('');
    const [time_zon, setTime_zon] = useState('');
    const [image_province, setImage_province] = useState(null);
    const [previewImageProvinceUrl, setPreviewImageProvinceUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!show) {
            setName('');
            setCode('');
            setCountry('');
            setProvince('');
            setTime_zon('');
            setImage_province(null);
            setPreviewImageProvinceUrl('');
            setIsLoading(false);
        }
    }, [show]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage_province(file);
            setPreviewImageProvinceUrl(URL.createObjectURL(file));
        } else {
            setImage_province(null);
            setPreviewImageProvinceUrl('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !name ||
            !code ||
            !country ||
            !province ||
            !time_zon ||
            !image_province
        ) {
            toast.error(t('addAirport.validation.allFieldsRequired')); // Dịch thông báo lỗi
            return;
        }

        setIsLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append('name', name);
        formDataToSend.append('code', code);
        formDataToSend.append('country', country);
        formDataToSend.append('province', province);
        formDataToSend.append('time_zon', time_zon);
        formDataToSend.append('image_province', image_province);

        try {
            const response = await adminAddAirport(formDataToSend);

            if (response && response.EC === 0) {
                toast.success(response.EM);
                handleClose();
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.error(
                t('addAirport.errors.addAirportFailedConsole'),
                error
            ); // Dịch thông báo lỗi console
            toast.error(t('addAirport.errors.addAirportFailedToast')); // Dịch thông báo lỗi toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>{t('addAirport.modalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Hàng 1: Tên sân bay và Mã IATA (chia đôi để nằm ngang) */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formAirportName">
                            <Form.Label>
                                {t('addAirport.form.airportNameLabel')}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t(
                                    'addAirport.form.airportNamePlaceholder'
                                )}
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formAirportCode">
                            <Form.Label>
                                {t('addAirport.form.iataCodeLabel')}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder={t(
                                    'addAirport.form.iataCodePlaceholder'
                                )}
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>
                    </Row>

                    {/* Hàng 2: Quốc gia và Tỉnh/Thành phố (chia đôi để nằm ngang) */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formAirportCountry">
                            <Form.Label>
                                {t('addAirport.form.countryLabel')}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder={t(
                                    'addAirport.form.countryPlaceholder'
                                )}
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formAirportProvince">
                            <Form.Label>
                                {t('addAirport.form.provinceLabel')}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                placeholder={t(
                                    'addAirport.form.provincePlaceholder'
                                )}
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>
                    </Row>

                    {/* Hàng 3: Múi giờ (toàn bộ hàng) */}
                    <Form.Group
                        className="mb-3"
                        controlId="formAirportTimeZone"
                    >
                        <Form.Label>
                            {t('addAirport.form.timeZoneLabel')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={time_zon}
                            onChange={(e) => setTime_zon(e.target.value)}
                            placeholder={t(
                                'addAirport.form.timeZonePlaceholder'
                            )}
                            required
                            disabled={isLoading}
                        />
                    </Form.Group>

                    {/* Hàng 4: Ảnh tỉnh/thành phố (toàn bộ hàng) */}
                    <Form.Group className="mb-3" controlId="formImageProvince">
                        <Form.Label>
                            {t('addAirport.form.imageProvinceLabel')}
                        </Form.Label>
                        {previewImageProvinceUrl && (
                            <div className="mb-2 text-center">
                                <Image
                                    src={previewImageProvinceUrl}
                                    alt={t('addAirport.form.imageProvinceAlt')}
                                    fluid
                                    style={{
                                        maxWidth: '200px',
                                        maxHeight: '200px',
                                        border: '1px solid #ddd',
                                        padding: '5px',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                        )}
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                            disabled={isLoading}
                        />
                        <Form.Text className="text-muted">
                            {t('addAirport.form.imageProvinceHelpText')}
                        </Form.Text>
                    </Form.Group>

                    <Modal.Footer className="px-0 pb-0">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />{' '}
                                    {t('addAirport.buttons.processing')}
                                </>
                            ) : (
                                t('addAirport.buttons.addNew')
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            {t('addAirport.buttons.cancel')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddAirport;
