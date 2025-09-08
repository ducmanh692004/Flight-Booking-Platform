// src/components/Admin/Coupon/AddCoupon.jsx
import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { adminAddCoupon } from '../../../services/AdminService';
import { useFormatter } from '../../hooks/useFomatter';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const AddCoupon = ({ show, handleClose, handleRefetch }) => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation

    const [percent, setPercent] = useState('');
    const [code, setCode] = useState('');
    const [maximumDiscount, setMaximumDiscount] = useState('');
    const [minimumPrice, setMinimumPrice] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const { formatCurrency } = useFormatter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await adminAddCoupon({
                percent,
                code,
                maximum_discount: maximumDiscount,
                minimum_price: minimumPrice,
            });
            if (res && res.EC === 0) {
                toast.success(res.EM);
                handleRefetch();
                handleClose();
                setPercent('');
                setCode('');
                setMaximumDiscount('');
                setMinimumPrice('');
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            console.error(t('addCoupon.errors.addCouponFailedConsole'), error); // Dịch thông báo lỗi console
            toast.error(t('addCoupon.errors.addCouponFailedToast')); // Dịch thông báo lỗi toast
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>{t('addCoupon.modalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            {t('addCoupon.form.percentLabel')}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={percent}
                            onChange={(e) => setPercent(e.target.value)}
                            placeholder={t('addCoupon.form.percentPlaceholder')}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>{t('addCoupon.form.codeLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder={t('addCoupon.form.codePlaceholder')}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-1">
                        <Form.Label>
                            {t('addCoupon.form.maxDiscountLabel')}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={maximumDiscount}
                            onChange={(e) => setMaximumDiscount(e.target.value)}
                            placeholder={t(
                                'addCoupon.form.maxDiscountPlaceholder'
                            )}
                            required
                        />
                    </Form.Group>
                    {maximumDiscount && (
                        <div className="d-flex gap-2 align-items-center">
                            <h6 className="text-muted mt-0 mb-0">
                                {t('addCoupon.form.convertedValueLabel')}:
                            </h6>
                            <h6 className="mt-0 mb-0">
                                {formatCurrency(maximumDiscount)}
                            </h6>
                        </div>
                    )}{' '}
                    <Form.Group className="mb-1 mt-3">
                        <Form.Label>
                            {t('addCoupon.form.minOrderPriceLabel')}
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={minimumPrice}
                            onChange={(e) => setMinimumPrice(e.target.value)}
                            placeholder={t(
                                'addCoupon.form.minOrderPricePlaceholder'
                            )}
                            required
                        />
                    </Form.Group>
                    {minimumPrice && (
                        <div className="d-flex gap-2 align-items-center">
                            <h6 className="text-muted mt-0 mb-0">
                                {t('addCoupon.form.convertedValueLabel')}:
                            </h6>
                            <h6 className="mt-0 mb-0">
                                {formatCurrency(minimumPrice)}
                            </h6>
                        </div>
                    )}
                    <Modal.Footer className="mt-2">
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
                                    {t('addCoupon.buttons.saving')}
                                </>
                            ) : (
                                t('addCoupon.buttons.addNew')
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSaving}
                        >
                            {t('addCoupon.buttons.cancel')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCoupon;
