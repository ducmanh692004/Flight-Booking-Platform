import React, { useState } from 'react';

const CreditCardForm = () => {
    const [formData, setFormData] = useState({
        cardType: 'Visa / Mastercard / Amex / JCB',
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h5 className="card-title d-flex align-items-center mb-3">
                    💳 THẺ TÍN DỤNG/GHI NỢ
                </h5>
                <p className="text-muted small mb-4">
                    (Có thể áp dụng phí xử lý)
                </p>

                <div className="row g-3">
                    {/* Card Type Selector */}
                    <div className="col-12">
                        <label className="form-label fw-medium">
                            Hình thức thanh toán{' '}
                            <span className="text-danger">*</span>
                        </label>
                        <div className="position-relative">
                            <select
                                className="form-select"
                                value={formData.cardType}
                                onChange={(e) =>
                                    handleInputChange(
                                        'cardType',
                                        e.target.value
                                    )
                                }
                            >
                                <option>Visa / Mastercard / Amex / JCB</option>
                            </select>
                            <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                                <div className="d-flex gap-1">
                                    <span>💳</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Name */}
                    <div className="col-12">
                        <label className="form-label fw-medium">
                            Tên trên thẻ <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tên trên Thẻ"
                            value={formData.cardName}
                            onChange={(e) =>
                                handleInputChange('cardName', e.target.value)
                            }
                        />
                    </div>

                    {/* Card Number */}
                    <div className="col-12">
                        <label className="form-label fw-medium">
                            Số thẻ tín dụng/thẻ ghi nợ{' '}
                            <span className="text-danger">*</span>
                        </label>
                        <div className="position-relative">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Số thẻ"
                                value={formData.cardNumber}
                                onChange={(e) =>
                                    handleInputChange(
                                        'cardNumber',
                                        e.target.value
                                    )
                                }
                            />
                            <span className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted">
                                🔒
                            </span>
                        </div>
                    </div>

                    {/* Expiry Date and CVC */}
                    <div className="col-6">
                        <label className="form-label fw-medium">
                            Ngày hết hạn <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="TT/NN"
                            value={formData.expiryDate}
                            onChange={(e) =>
                                handleInputChange('expiryDate', e.target.value)
                            }
                        />
                    </div>
                    <div className="col-6">
                        <label className="form-label fw-medium">
                            Mã bảo mật CVC{' '}
                            <span className="text-danger">*</span>
                        </label>
                        <div className="position-relative">
                            <input
                                type="text"
                                className="form-control"
                                value={formData.cvc}
                                onChange={(e) =>
                                    handleInputChange('cvc', e.target.value)
                                }
                            />
                            <div className="position-absolute top-50 end-0 translate-middle-y me-3 bg-light rounded px-2 py-1">
                                <small>123</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditCardForm;
