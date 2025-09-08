import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminCreateRole } from '../../../services/AdminService';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const AddRoleModal = ({ show, handleClose, handleSetRefreshAgain }) => {
    // Sử dụng useTranslation hook
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async () => {
        if (!name || !url) {
            toast.error(t('addRoleModal.validation.fillAllFields')); // Dịch thông báo lỗi
            return;
        }
        try {
            const response = await adminCreateRole({ name, url });
            if (response && response.EC === 0) {
                toast.success(response.EM);
                handleSetRefreshAgain();
                handleClose();
            } else {
                toast.error(response.EM);
                handleClose();
            }
        } catch (err) {
            toast.error(t('addRoleModal.validation.serverError')); // Dịch thông báo lỗi
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{t('addRoleModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>
                            {t('addRoleModal.form.urlLabel')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={t('addRoleModal.form.urlPlaceholder')}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            {t('addRoleModal.form.descriptionLabel')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={t(
                                'addRoleModal.form.descriptionPlaceholder'
                            )}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>
                    {t('addRoleModal.addButton')}
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    {t('addRoleModal.cancelButton')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddRoleModal;
