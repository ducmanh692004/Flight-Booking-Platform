import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminAddSeatClass } from '../../../services/AdminService';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const AddSeatClass = ({ show, handleClose }) => {
    // Sử dụng useTranslation hook
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await adminAddSeatClass({
                name,
                description,
            });
            if (res && res.EC === 0) {
                toast.success(res.EM);
                // handleRefetch(); // Giữ nguyên comment này
                handleClose();
                setName('');
                setDescription('');
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            console.error('Lỗi khi thêm hạng ghế:', error);
            toast.error(t('addSeatClass.toastMessages.addError'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>{t('addSeatClass.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('addSeatClass.formLabels.name')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('addSeatClass.placeholders.name')}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('addSeatClass.formLabels.description')}
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t(
                                'addSeatClass.placeholders.description'
                            )}
                            required
                        />
                    </Form.Group>
                    <Modal.Footer>
                        <Button
                            variant="primary"
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
                                    {t('addSeatClass.buttons.saving')}
                                </>
                            ) : (
                                t('addSeatClass.buttons.add')
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSaving}
                        >
                            {t('addSeatClass.buttons.cancel')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddSeatClass;
