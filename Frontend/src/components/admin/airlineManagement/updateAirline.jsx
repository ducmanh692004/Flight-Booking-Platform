import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminUpdateAirline } from '../../../services/AdminService';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const UpdateAirline = ({
    show,
    handleClose,
    airlineData,
    handleFetchDataAgain,
}) => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');

    const [logoFile, setLogoFile] = useState(null);
    const [previewLogoUrl, setPreviewLogoUrl] = useState('');
    const [currentLogoUrl, setCurrentLogoUrl] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (show && airlineData) {
            setId(airlineData._id);
            setName(airlineData.name);
            setCountry(airlineData.country);
            setCurrentLogoUrl(airlineData.logo_url);
            setPreviewLogoUrl('');
            setLogoFile(null);
            setIsLoading(false);
        } else if (!show) {
            setId('');
            setName('');
            setCountry('');
            setLogoFile(null);
            setPreviewLogoUrl('');
            setCurrentLogoUrl('');
            setIsLoading(false);
        }
    }, [show, airlineData]);

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

        if (!name || !country) {
            toast.error(t('updateAirlineModal.validation.emptyFields'));
            return;
        }

        setIsLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append('id', id);
        formDataToSend.append('name', name);
        formDataToSend.append('country', country);

        if (logoFile) {
            formDataToSend.append('logo', logoFile);
        }

        try {
            const response = await adminUpdateAirline(formDataToSend);

            if (response && response.EC === 0) {
                toast.success(response.EM);
                handleClose();
                handleFetchDataAgain();
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('updateAirlineModal.errors.apiCallFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-success text-white">
                <Modal.Title>{t('updateAirlineModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formAirlineName"
                    >
                        <Form.Label column sm="3">
                            {t('updateAirlineModal.form.airlineName')}:
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t(
                                    'updateAirlineModal.form.placeholderName'
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
                            {t('updateAirlineModal.form.country')}:
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder={t(
                                    'updateAirlineModal.form.placeholderCountry'
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
                            {t('updateAirlineModal.form.logo')}:
                        </Form.Label>
                        <Col sm="9">
                            {(previewLogoUrl || currentLogoUrl) && (
                                <div className="mb-2">
                                    <Image
                                        src={previewLogoUrl || currentLogoUrl}
                                        alt={t(
                                            'updateAirlineModal.form.logoPreviewAlt'
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
                                disabled={isLoading}
                            />
                            <Form.Text className="text-muted">
                                {t('updateAirlineModal.form.logoHelpText')}
                            </Form.Text>
                        </Col>
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
                                    {t('updateAirlineModal.buttons.processing')}
                                </>
                            ) : (
                                t('updateAirlineModal.buttons.update')
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            {t('updateAirlineModal.buttons.cancel')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateAirline;
