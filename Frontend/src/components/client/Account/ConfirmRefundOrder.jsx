import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { refundOrder } from '../../../services/OrderService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const ConfirmRefundOrder = (props) => {
    const userId = useSelector((state) => state.user.account.id);
    const { t } = useTranslation();

    const refundReasons = [
        t('refund.reasons.changePlan'),
        t('refund.reasons.health'),
        t('refund.reasons.work'),
        t('refund.reasons.bookingError'),
        t('refund.reasons.airlineChange'),
        t('refund.reasons.other'),
    ];

    const [selectedReason, setSelectedReason] = useState('');
    const [note, setNote] = useState('');
    const [showError, setShowError] = useState(false);

    const handleSubmit = async () => {
        if (!selectedReason) {
            setShowError(true);
            return;
        }

        if (props.itemRefund !== null && userId !== '') {
            const response = await refundOrder(
                userId,
                props.itemRefund.orderId,
                selectedReason,
                note
            );
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

    const handleSetDefaultData = () => {
        setSelectedReason('');
        setNote('');
        setShowError(false);
    };

    useEffect(() => {
        handleSetDefaultData();
    }, [props.show]);

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h5 className="mt-0 mb-0">{t('refund.cancelAndRefund')}</h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="info" style={{ fontSize: '15px' }}>
                        {t('refund.selectReason')}
                    </Alert>
                    <div className="d-flex justify-content-start gap-2 align-items-center">
                        <h6 className="mt-0 mb-0">{t('refund.orderId')}</h6>
                        <h6 className="mt-0 mb-0">{props.itemRefund?.orderId}</h6>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label as="legend" column sm={12} className="fw-bold">
                                {t('refund.reason')}
                            </Form.Label>
                            {refundReasons.map((reason, index) => (
                                <Form.Check
                                    key={index}
                                    type="radio"
                                    id={`reason-${index}`}
                                    name="refundReason"
                                    value={reason}
                                    label={reason}
                                    checked={selectedReason === reason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="mb-2"
                                />
                            ))}
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label htmlFor="refundNote" className="fw-bold">
                                {t('refund.note')}
                            </Form.Label>
                            {props.itemRefund?.paymentMethod === 'VNPay' && (
                                <Alert>
                                    {t('refund.vnpayAlert')}
                                </Alert>
                            )}
                            <Form.Control
                                as="textarea"
                                id="refundNote"
                                rows={3}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder={t('refund.notePlaceholder')}
                            />
                        </Form.Group>
                        {showError && (
                            <Alert variant="danger">
                                {t('refund.reasonRequired')}
                            </Alert>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => handleSubmit()}>
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

export default ConfirmRefundOrder;
