import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminUpdateAirport } from '../../../services/AdminService';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const UpdateAirport = ({
    show,
    handleClose,
    airportData,
    handleFetchDataAgain,
}) => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [country, setCountry] = useState('');
    const [province, setProvince] = useState('');
    const [time_zon, setTime_zon] = useState('');

    const [image_province_file, setImage_province_file] = useState(null);
    const [previewImageProvinceUrl, setPreviewImageProvinceUrl] = useState('');
    const [currentImageProvinceUrl, setCurrentImageProvinceUrl] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (show && airportData) {
            setId(airportData._id);
            setName(airportData.name || '');
            setCode(airportData.code || '');
            setCountry(airportData.country || '');
            setProvince(airportData.province || '');
            setTime_zon(airportData.time_zon || '');
            setCurrentImageProvinceUrl(airportData.image_province || '');
            setPreviewImageProvinceUrl('');
            setImage_province_file(null);
            setIsLoading(false);
        } else if (!show) {
            setId('');
            setName('');
            setCode('');
            setCountry('');
            setProvince('');
            setTime_zon('');
            setImage_province_file(null);
            setPreviewImageProvinceUrl('');
            setCurrentImageProvinceUrl('');
            setIsLoading(false);
        }
    }, [show, airportData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage_province_file(file);
            setPreviewImageProvinceUrl(URL.createObjectURL(file));
        } else {
            setImage_province_file(null);
            setPreviewImageProvinceUrl('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !code || !country || !province || !time_zon) {
            toast.error(t('updateAirport.validation.allFieldsRequired')); // Dịch thông báo lỗi
            return;
        }

        setIsLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append('id', id);
        formDataToSend.append('name', name);
        formDataToSend.append('code', code);
        formDataToSend.append('country', country);
        formDataToSend.append('province', province);
        formDataToSend.append('time_zon', time_zon);

        if (image_province_file) {
            formDataToSend.append('image_province', image_province_file);
        }

        try {
            const response = await adminUpdateAirport(formDataToSend);

            if (response && response.EC === 0) {
                toast.success(response.EM);
                handleClose();
                handleFetchDataAgain();
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.error(
                t('updateAirport.errors.updateAirportFailedConsole'),
                error
            ); // Dịch thông báo lỗi console
            toast.error(t('updateAirport.errors.updateAirportFailedToast')); // Dịch thông báo lỗi toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-success text-white">
                <Modal.Title>{t('updateAirport.modalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formAirportName">
                            <Form.Label>
                                {t('updateAirport.form.airportNameLabel')}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t(
                                    'updateAirport.form.airportNamePlaceholder'
                                )}
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formAirportCode">
                            <Form.Label>
                                {t('updateAirport.form.iataCodeLabel')}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder={t(
                                    'updateAirport.form.iataCodePlaceholder'
                                )}
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formAirportCountry">
                            <Form.Label>
                                {t('updateAirport.form.countryLabel')}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder={t(
                                    'updateAirport.form.countryPlaceholder'
                                )}
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formAirportProvince">
                            <Form.Label>
                                {t('updateAirport.form.provinceLabel')}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                placeholder={t(
                                    'updateAirport.form.provincePlaceholder'
                                )}
                                required
                                disabled={isLoading}
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group
                        className="mb-3"
                        controlId="formAirportTimeZone"
                    >
                        <Form.Label>
                            {t('updateAirport.form.timeZoneLabel')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={time_zon}
                            onChange={(e) => setTime_zon(e.target.value)}
                            placeholder={t(
                                'updateAirport.form.timeZonePlaceholder'
                            )}
                            required
                            disabled={isLoading}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formImageProvince">
                        <Form.Label>
                            {t('updateAirport.form.imageProvinceLabel')}
                        </Form.Label>
                        {(previewImageProvinceUrl ||
                            currentImageProvinceUrl) && (
                            <div className="mb-2 text-center">
                                <Image
                                    src={
                                        previewImageProvinceUrl ||
                                        currentImageProvinceUrl
                                    }
                                    alt={t(
                                        'updateAirport.form.imageProvinceAlt'
                                    )}
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
                            disabled={isLoading}
                        />
                        <Form.Text className="text-muted">
                            {t('updateAirport.form.imageProvinceHelpText')}
                        </Form.Text>
                    </Form.Group>

                    <Modal.Footer className="px-0 pb-0">
                        <Button
                            variant="success"
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
                                    {t('updateAirport.buttons.processing')}
                                </>
                            ) : (
                                t('updateAirport.buttons.update')
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            {t('updateAirport.buttons.cancel')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateAirport;
