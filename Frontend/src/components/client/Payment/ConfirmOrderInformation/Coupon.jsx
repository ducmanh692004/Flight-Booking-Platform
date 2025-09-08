import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Badge } from 'react-bootstrap';
import { RiCoupon2Line } from 'react-icons/ri';
import {
    fetchCheckUseCoupon,
    handleGetAllCoupon,
} from '../../../../services/CouponService';
import { useFormatter } from '../../../hooks/useFomatter';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Coupon = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCode, setSelectedCode] = useState(null);
    const [listDiscount, setListDiscount] = useState([]);
    const userId = useSelector((state) => state.user.account?.id);

    const { formatCurrency } = useFormatter();
    const { t } = useTranslation();

    const handleCodeSelect = (code) => {
        setSelectedCode(code);
        setShowModal(false);
    };

    const fetchDataCoupon = async () => {
        try {
            const response = await handleGetAllCoupon();
            if (response && response.EC === 0) {
                setListDiscount(response.DT);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCheckApplyCoupon = async () => {
        try {
            const response = await fetchCheckUseCoupon(
                userId,
                props.totalOrder,
                selectedCode._id
            );
            if (response && response.EC === 0) {
                props.handleSetDiscountValue(response.DT);
                // setListDiscount(response.DT);
                toast.success(response.EM);
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDataCoupon();
    }, []);

    useEffect(() => {
        if (selectedCode) {
            handleCheckApplyCoupon();
        }
    }, [selectedCode]);

    return (
        <div
            className="container p-4 mt-4 rounded shadow-sm"
            style={{
                background:
                    'linear-gradient(135deg, #c5f3f5ff 0%, #d8fcddff 100%)',
                border: '1px solid #B3E5E5',
            }}
        >
            {/* Discount code selection display */}
            <div
                className="d-flex align-items-center justify-content-between p-3 mb-0 rounded bg-white border"
                onClick={() => setShowModal(true)} // Thêm onClick để mở modal
                style={{ cursor: 'pointer' }} // Thêm cursor pointer để người dùng biết có thể click
            >
                <div className="d-flex align-items-center gap-3">
                    {/* Icon mã giảm giá cũ */}
                    <RiCoupon2Line className="fs-4" />
                    <div className="d-flex flex-column">
                        <h6 className="mb-1 text-primary fw-bold">
                            {t('payment.selectCoupon')}
                        </h6>
                        {selectedCode ? (
                            <small className="text-primary">
                                {t('payment.selectedCode')} {selectedCode.code}
                            </small>
                        ) : (
                            <small className="text-secondary">
                                {t('payment.selectCouponToSave')}
                            </small>
                        )}
                    </div>
                </div>
                <button
                    className="btn d-flex align-items-center"
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#4A9EFF',
                        fontSize: '16px',
                        fontWeight: '500',
                        padding: '0',
                    }}
                    // onClick={() => handleShow()}
                >
                    {t('payment.select')}
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="ms-1"
                    >
                        <path
                            d="M9 18L15 12L9 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            {/* Modal for discount code selection */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="md"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('payment.selectCouponTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted mb-4">
                        {t('payment.selectCouponDesc')}
                    </p>

                    <div
                        className="d-grid gap-3"
                        style={{ maxHeight: '450px', overflowY: 'auto' }}
                    >
                        {listDiscount.length > 0 &&
                            listDiscount.map((code) => (
                                <Card
                                    key={code._id}
                                    className="border cursor-pointer"
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow:
                                            selectedCode?._id === code._id
                                                ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
                                                : 'none',
                                    }}
                                    onClick={() => handleCodeSelect(code)}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.boxShadow =
                                            '0 2px 8px rgba(0,0,0,0.1)')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.boxShadow =
                                            selectedCode?._id === code._id
                                                ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
                                                : 'none')
                                    }
                                >
                                    <Card.Body className="p-3">
                                        <div className="d-flex align-items-start justify-content-between">
                                            <div className="d-flex align-items-start">
                                                <div
                                                    className="p-2 me-3"
                                                    style={{
                                                        backgroundColor:
                                                            selectedCode?._id !==
                                                            code?._id
                                                                ? '#e3f2fd'
                                                                : '#0891f3ff',
                                                        borderRadius: '8px',
                                                    }}
                                                >
                                                    <i className="bi bi-ticket-fill text-primary"></i>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6
                                                        className="mb-1 fw-semibold"
                                                        style={{
                                                            fontSize: '0.9rem',
                                                        }}
                                                    >
                                                        {code?.code}
                                                    </h6>
                                                    <p
                                                        className="mb-1 text-muted"
                                                        style={{
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        {t(
                                                            'payment.maximumDiscount'
                                                        )}
                                                        :{' '}
                                                        {formatCurrency(
                                                            code.maximum_discount
                                                        )}
                                                    </p>
                                                    <p
                                                        className="mb-0 text-muted"
                                                        style={{
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        {t(
                                                            'payment.minimumOrderValue'
                                                        )}{' '}
                                                        {formatCurrency(
                                                            code.minimum_price
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                {selectedCode?._id ===
                                                    code.id && (
                                                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                                                )}
                                                <Badge
                                                    bg="danger"
                                                    style={{
                                                        fontSize: '0.75rem',
                                                    }}
                                                >
                                                    -{code.percent}%
                                                </Badge>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-primary"
                        onClick={() => setShowModal(false)}
                    >
                        {t('flightSelectedInformation.close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Coupon;
