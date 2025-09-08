import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminUpdateRole } from '../../../services/AdminService';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const UpdateRoleModal = ({
    show,
    handleClose,
    itemData,
    handleSetRefreshAgain,
}) => {
    // Sử dụng useTranslation hook
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (itemData) {
            setName(itemData.name || '');
            setUrl(itemData.url || '');
        }
    }, [itemData]);

    const handleUpdate = async () => {
        try {
            const res = await adminUpdateRole({
                _id: itemData._id,
                name,
                url,
            });
            if (res && res.EC === 0) {
                toast.success(t('updateRoleModal.successMessage')); // Dịch thông báo thành công
                handleSetRefreshAgain();
                handleClose();
            } else {
                toast.error(res.EM || t('updateRoleModal.errorMessage')); // Dịch thông báo lỗi
            }
        } catch (err) {
            toast.error(t('updateRoleModal.somethingWentWrong')); // Dịch thông báo lỗi chung
        }
    };

    return (
        <Modal show={show} onHide={() => handleClose(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t('updateRoleModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('updateRoleModal.form.nameLabel')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            {t('updateRoleModal.form.urlLabel')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleUpdate}>
                    {t('updateRoleModal.saveButton')}
                </Button>
                <Button variant="secondary" onClick={() => handleClose(false)}>
                    {t('updateRoleModal.cancelButton')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateRoleModal;
