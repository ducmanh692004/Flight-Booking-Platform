import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminCreateGroup } from '../../../services/AdminService';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const AddGroupModal = ({ show, handleClose, handleSetRefreshAgain }) => {
    // Sử dụng useTranslation hook
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (!name || !description) {
            toast.error(t('addGroupModal.validation.fillAllFields')); // Dịch thông báo lỗi
            return;
        }
        try {
            const response = await adminCreateGroup({ name, description });
            if (response && response.EC === 0) {
                toast.success(response.EM);
                handleSetRefreshAgain();
                handleClose();
            } else {
                toast.error(response.EM);
                handleClose();
            }
        } catch (err) {
            toast.error(t('addGroupModal.validation.serverError')); // Dịch thông báo lỗi
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{t('addGroupModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>
                            {t('addGroupModal.form.nameLabel')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={t(
                                'addGroupModal.form.namePlaceholder'
                            )}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                </Form>
                <Form className="mt-2">
                    <Form.Group>
                        <Form.Label>
                            {t('addGroupModal.form.descriptionLabel')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={t(
                                'addGroupModal.form.descriptionPlaceholder'
                            )}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>
                    {t('addGroupModal.addButton')}
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    {t('addGroupModal.cancelButton')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddGroupModal;
