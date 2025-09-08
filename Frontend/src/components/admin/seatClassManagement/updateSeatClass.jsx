import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminUpdateSeatClass } from '../../../services/AdminService';
import { TranslateText } from '../../Translate';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const UpdateSeatClass = ({ show, handleClose, seatClassData }) => {
    // Sử dụng useTranslation hook
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (seatClassData) {
            setName(seatClassData.name);
            setDescription(seatClassData.description);
        }
    }, [seatClassData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await adminUpdateSeatClass({
                _id: seatClassData._id,
                name,
                description,
            });
            if (res && res.EC === 0) {
                toast.success(res.EM);
                // handleRefetch(); // Giữ nguyên comment này
                handleClose();
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật hạng ghế:', error);
            toast.error(t('updateSeatClass.toastMessages.updateError'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-warning text-white">
                <Modal.Title>{t('updateSeatClass.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('updateSeatClass.formLabels.name')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('updateSeatClass.placeholders.name')}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('updateSeatClass.formLabels.description')}
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t(
                                'updateSeatClass.placeholders.description'
                            )}
                            required
                        />
                    </Form.Group>
                    <Modal.Footer>
                        <Button
                            variant="warning"
                            type="submit"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    {t('updateSeatClass.buttons.saving')}
                                </>
                            ) : (
                                t('updateSeatClass.buttons.update')
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSaving}
                        >
                            {t('updateSeatClass.buttons.cancel')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateSeatClass;
