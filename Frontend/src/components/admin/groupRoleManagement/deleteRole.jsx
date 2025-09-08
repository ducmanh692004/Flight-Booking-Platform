import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminDeleteRole } from '../../../services/AdminService';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const DeleteRoleModal = ({
    show,
    handleClose,
    itemData,
    handleSetRefreshAgain,
}) => {
    // Sử dụng useTranslation hook
    const { t } = useTranslation();

    const handleDelete = async () => {
        try {
            const res = await adminDeleteRole(itemData._id);
            if (res && res.EC === 0) {
                toast.success(t('deleteRoleModal.successMessage')); // Dịch thông báo thành công
                handleSetRefreshAgain();
                handleClose();
            } else {
                toast.error(res.EM || t('deleteRoleModal.errorMessage')); // Dịch thông báo lỗi
            }
        } catch (error) {
            toast.error(t('deleteRoleModal.somethingWentWrong')); // Dịch thông báo lỗi chung
        }
    };

    return (
        <Modal show={show} onHide={() => handleClose(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t('deleteRoleModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {t('deleteRoleModal.message')}
                <strong> {itemData?.url}</strong>?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleDelete}>
                    {t('deleteRoleModal.deleteButton')}
                </Button>
                <Button variant="secondary" onClick={() => handleClose(false)}>
                    {t('deleteRoleModal.cancelButton')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteRoleModal;
