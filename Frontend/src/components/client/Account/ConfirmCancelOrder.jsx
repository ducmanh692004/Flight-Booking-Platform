import { use, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { GiCancel } from 'react-icons/gi';
import { cancelOrder } from '../../../services/OrderService';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ConfirmCancelOrder = (props) => {
    const { t } = useTranslation();
    const handleConfirmCancel = async () => {
        if (props.itemCancel !== null) {
            const response = await cancelOrder(props.itemCancel);
            if (response && response.EC === 0) {
                toast.success(response.EM);
                props.handleFetchDataAgain();
                props.handleClose();
            } else {
                toast.error(response.EM);
                props.handleClose();
            }
        }
    };

    return (
        <>
            <Modal
                show={props.show}
                onHide={props.handleClose}
                // centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('order.cancelOrderTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column align-items-center gap-2">
                        <GiCancel
                            className="text-danger"
                            style={{ fontSize: '50px' }}
                        />
                        <h5 className="mt-4">
                            {t('order.cancelOrderConfirm')}
                        </h5>
                        <div className="d-flex justify-content-center align-items-center gap-3">
                            <h6 className="text-muted">{t('refund.orderId')}</h6>
                            <h6>{props.itemCancel}</h6>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => handleConfirmCancel()}
                    >
                        {t('account.confirm')}
                    </Button>
                    <Button variant="secondary" onClick={props.handleClose}>
                        {t('account.cancel')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ConfirmCancelOrder;
