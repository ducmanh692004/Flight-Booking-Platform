// src/components/Admin/Coupon/UpdateCoupon.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminUpdateCoupon } from '../../../services/AdminService';
import { useFormatter } from '../../hooks/useFomatter';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const UpdateCoupon = ({ show, handleClose, couponData, handleRefetch }) => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation

    const [percent, setPercent] = useState('');
    const [code, setCode] = useState('');
    const [maximumDiscount, setMaximumDiscount] = useState('');
    const [minimumPrice, setMinimumPrice] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const { formatCurrency } = useFormatter();

    useEffect(() => {
        if (couponData) {
            setPercent(couponData.percent);
            setCode(couponData.code);
            setMaximumDiscount(couponData.maximum_discount);
            setMinimumPrice(couponData.minimum_price);
        }
    }, [couponData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = {
                id: couponData._id,
                percent: percent,
                code: code,
                maximum_discount: maximumDiscount,
                minimum_price: minimumPrice,
            };
            const res = await adminUpdateCoupon(formData);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                handleRefetch();
                handleClose();
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            console.error(
                t('updateCoupon.errors.updateCouponFailedConsole'),
                error
            ); // Dịch thông báo lỗi console
            toast.error(t('updateCoupon.errors.updateCouponFailedToast')); // Dịch thông báo lỗi toast
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-warning text-white">
                <Modal.Title>{t('updateCoupon.modalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('updateCoupon.form.percentLabel')}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={percent}
                            onChange={(e) => setPercent(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('updateCoupon.form.codeLabel')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>
                            {t('updateCoupon.form.maxDiscountLabel')}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={maximumDiscount}
                            onChange={(e) => setMaximumDiscount(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {maximumDiscount && (
                        <div className="d-flex gap-2 align-items-center">
                            <h6 className="text-muted mt-0 mb-0">
                                {t('updateCoupon.form.convertedValueLabel')}:
                            </h6>
                            <h6 className="mt-0 mb-0">
                                {formatCurrency(maximumDiscount)}
                            </h6>
                        </div>
                    )}{' '}
                    <Form.Group className="mb-1 mt-3">
                        <Form.Label>
                            {t('updateCoupon.form.minOrderPriceLabel')}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={minimumPrice}
                            onChange={(e) => setMinimumPrice(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {minimumPrice && (
                        <div className="d-flex gap-2 align-items-center">
                            <h6 className="text-muted mt-0 mb-0">
                                {t('updateCoupon.form.convertedValueLabel')}:
                            </h6>
                            <h6 className="mt-0 mb-0">
                                {formatCurrency(minimumPrice)}
                            </h6>
                        </div>
                    )}
                    <Modal.Footer className="mt-2">
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
                                    {t('updateCoupon.buttons.saving')}
                                </>
                            ) : (
                                t('updateCoupon.buttons.update')
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSaving}
                        >
                            {t('updateCoupon.buttons.cancel')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateCoupon;
