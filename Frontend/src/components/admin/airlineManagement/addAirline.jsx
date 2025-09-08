import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminAddAirline } from '../../../services/AdminService';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const AddAirline = ({ show, handleClose }) => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [previewLogoUrl, setPreviewLogoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!show) {
            // Reset state khi Modal đóng
            setName('');
            setCountry('');
            setLogoFile(null);
            setPreviewLogoUrl('');
            setIsLoading(false); // Đảm bảo reset loading khi đóng modal
        }
    }, [show]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setPreviewLogoUrl(URL.createObjectURL(file));
        } else {
            setLogoFile(null);
            setPreviewLogoUrl('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!logoFile) {
            toast.error(t('addAirlineModal.validation.selectLogo'));
            return;
        }

        setIsLoading(true); // BẬT LOADING TRƯỚC KHI GỌI API

        const formDataToSend = new FormData();
        formDataToSend.append('name', name);
        formDataToSend.append('country', country);
        formDataToSend.append('logo', logoFile);

        try {
            const response = await adminAddAirline(formDataToSend);

            if (response && response.EC === 0) {
                toast.success(response.EM);
                handleClose();
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('addAirlineModal.errors.apiCallFailed')); // Thông báo lỗi khi gọi API thất bại
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>{t('addAirlineModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formAirlineName"
                    >
                        <Form.Label column sm="3">
                            {t('addAirlineModal.form.airlineName')}:
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t(
                                    'addAirlineModal.form.placeholderName'
                                )}
                                required
                                disabled={isLoading}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formAirlineCountry"
                    >
                        <Form.Label column sm="3">
                            {t('addAirlineModal.form.country')}:
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder={t(
                                    'addAirlineModal.form.placeholderCountry'
                                )}
                                required
                                disabled={isLoading}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formAirlineLogo"
                    >
                        <Form.Label column sm="3">
                            {t('addAirlineModal.form.logo')}:
                        </Form.Label>
                        <Col sm="9">
                            {previewLogoUrl && (
                                <div className="mb-2">
                                    <Image
                                        src={previewLogoUrl}
                                        alt={t(
                                            'addAirlineModal.form.logoPreviewAlt'
                                        )}
                                        fluid
                                        style={{
                                            maxWidth: '100px',
                                            maxHeight: '100px',
                                            border: '1px solid #ddd',
                                            padding: '5px',
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
                                {t('addAirlineModal.form.logoHelpText')}
                            </Form.Text>
                        </Col>
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
                                    {t('addAirlineModal.buttons.processing')}
                                </>
                            ) : (
                                t('addAirlineModal.buttons.addNew')
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            {t('addAirlineModal.buttons.cancel')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddAirline;
