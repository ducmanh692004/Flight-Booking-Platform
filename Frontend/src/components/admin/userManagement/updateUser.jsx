import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { adminUpdateUserInformation } from '../../../services/AdminService';
import { toast } from 'react-toastify';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const UserUpdateFormModal = ({
    show,
    handleClose,
    user,
    handleFetchDataAgain,
}) => {
    // Sử dụng useTranslation hook để truy cập các hàm dịch
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        groupId: '',
        birthDay: '',
        sex: '',
        address: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || '',
                email: user.email || '',
                phone: user.phone || '',
                groupId: user.groupId ? user.groupId._id || user.groupId : '',
                birthDay: user.birthDay || '',
                sex: user.sex || '',
                address: user.address || '',
            });
        } else {
            setFormData({
                fullname: '',
                email: '',
                phone: '',
                groupId: '',
                birthDay: '',
                sex: '',
                address: '',
            });
        }
        setErrors({});
    }, [user, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.fullname.trim()) {
            newErrors.fullname = t(
                'userUpdateFormModal.validationErrors.fullNameRequired'
            );
        }
        if (!formData.groupId.trim()) {
            newErrors.groupId = t(
                'userUpdateFormModal.validationErrors.groupIdRequired'
            );
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // **QUAN TRỌNG: Tạo một object mới bao gồm _id của user và tất cả các trường từ formData**
        // Chúng ta lấy _id từ 'user' prop và kết hợp nó với 'formData'
        const dataToSend = {
            _id: user ? user._id : null, // Đảm bảo _id tồn tại
            ...formData,
        };

        // Nếu API của bạn không chấp nhận trường email (vì nó disabled), bạn có thể xóa nó khỏi dataToSend
        // delete dataToSend.email; // Uncomment dòng này nếu cần

        if (!dataToSend._id) {
            setErrors({
                api: t('userUpdateFormModal.validationErrors.noUserToUpdate'),
            });
            toast.error(t('userUpdateFormModal.toastMessages.noUserFound'));
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Gửi dataToSend (bao gồm _id và tất cả formData) đến API
            const response = await adminUpdateUserInformation(dataToSend);

            if (response && response.EC === 0) {
                toast.success(
                    response.EM ||
                        t('userUpdateFormModal.toastMessages.updateSuccess')
                );
                handleFetchDataAgain();
                handleClose();
            } else {
                toast.error(
                    response.EM ||
                        t('userUpdateFormModal.toastMessages.updateFailure')
                );
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
            setErrors({
                api: t('userUpdateFormModal.toastMessages.connectionError'),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton className="bg-warning text-white">
                <Modal.Title>{t('userUpdateFormModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {user ? (
                    <Form onSubmit={handleSubmit}>
                        {errors.api && (
                            <Alert variant="danger">{errors.api}</Alert>
                        )}

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formFullName">
                                    <Form.Label>
                                        {t(
                                            'userUpdateFormModal.formLabels.fullName'
                                        )}{' '}
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={t(
                                            'userUpdateFormModal.placeholders.phone'
                                        )}
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        isInvalid={!!errors.fullname}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.fullname}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>
                                        {t(
                                            'userUpdateFormModal.formLabels.email'
                                        )}
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder={t(
                                            'userUpdateFormModal.placeholders.emailDisabled'
                                        )}
                                        name="email"
                                        value={formData.email}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formPhone">
                                    <Form.Label>
                                        {t(
                                            'userUpdateFormModal.formLabels.phone'
                                        )}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={t(
                                            'userUpdateFormModal.placeholders.phone'
                                        )}
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formGroupId">
                                    <Form.Label>
                                        {t(
                                            'userUpdateFormModal.formLabels.groupId'
                                        )}{' '}
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={t(
                                            'userUpdateFormModal.placeholders.groupId'
                                        )}
                                        name="groupId"
                                        value={formData.groupId}
                                        onChange={handleChange}
                                        isInvalid={!!errors.groupId}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.groupId}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formBirthDay">
                                    <Form.Label>
                                        {t(
                                            'userUpdateFormModal.formLabels.birthDay'
                                        )}
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={t(
                                            'userUpdateFormModal.placeholders.birthDay'
                                        )}
                                        name="birthDay"
                                        value={formData.birthDay}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formSex">
                                    <Form.Label>
                                        {t(
                                            'userUpdateFormModal.formLabels.gender'
                                        )}
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            {t(
                                                'userUpdateFormModal.genderOptions.select'
                                            )}
                                        </option>
                                        <option value="Nam">
                                            {t(
                                                'userUpdateFormModal.genderOptions.male'
                                            )}
                                        </option>
                                        <option value="Nữ">
                                            {t(
                                                'userUpdateFormModal.genderOptions.female'
                                            )}
                                        </option>
                                        <option value="Khác">
                                            {t(
                                                'userUpdateFormModal.genderOptions.other'
                                            )}
                                        </option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="formAddress" className="mb-3">
                            <Form.Label>
                                {t('userUpdateFormModal.formLabels.address')}
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder={t(
                                    'userUpdateFormModal.placeholders.address'
                                )}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Modal.Footer>
                            <Button
                                variant="warning"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? t('userUpdateFormModal.buttons.updating')
                                    : t('userUpdateFormModal.buttons.update')}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                {t('userUpdateFormModal.buttons.cancel')}
                            </Button>
                        </Modal.Footer>
                    </Form>
                ) : (
                    <Alert variant="danger">
                        {t('userUpdateFormModal.alerts.noUserToUpdate')}
                    </Alert>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default UserUpdateFormModal;
