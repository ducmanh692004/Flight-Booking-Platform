import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { handleUpdateAccountInformation } from '../../../services/LoginRegisterService';
import { useDispatch } from 'react-redux';
import { updateInformation } from '../../../redux/actions/userAction';

const ChangeAccountInformationModal = ({ show, handleClose, accountData }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        sex: '',
        dobDay: '',
        dobMonth: '',
        dobYear: '',
    });

    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        if (accountData) {
            let dobDay = '',
                dobMonth = '',
                dobYear = '';
            if (accountData.birthDay) {
                const [year, month, day] = accountData.birthDay.split('-');
                dobDay = day || '';
                dobMonth = month || '';
                dobYear = year || '';
            }

            setFormData({
                fullName: accountData.username || '',
                email: accountData.email || '',
                phone: accountData.phone || '',
                address: accountData.address || '',
                sex: accountData.sex || '',
                dobDay,
                dobMonth,
                dobYear,
            });
            setErrors({});
        }
    }, [accountData, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const { fullName, dobDay, dobMonth, dobYear } = formData;

        if (!fullName.trim())
            newErrors.fullName = 'Họ và tên không được để trống.';
        if (!dobDay || !dobMonth || !dobYear) {
            newErrors.dob = 'Vui lòng nhập đầy đủ ngày/tháng/năm sinh.';
        } else {
            const day = parseInt(dobDay);
            const month = parseInt(dobMonth);
            const year = parseInt(dobYear);
            const isValidDate = !isNaN(Date.parse(`${year}-${month}-${day}`));
            if (!isValidDate) newErrors.dob = 'Ngày sinh không hợp lệ.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const { dobDay, dobMonth, dobYear } = formData;
        const dob = `${dobYear.padStart(4, '0')}-${dobMonth.padStart(
            2,
            '0'
        )}-${dobDay.padStart(2, '0')}`;

        const response = await handleUpdateAccountInformation(
            accountData.id,
            formData.email,
            formData.fullName,
            formData.phone,
            formData.address,
            formData.sex,
            dob
        );

        if (response && response.EC === 0) {
            toast.success(response.EM);
            dispatch(
                updateInformation({
                    username: formData.fullName,
                    address: formData.address,
                    phone: formData.phone,
                    sex: formData.sex,
                    birthDay: dob,
                })
            );
        } else {
            toast.error(response.EM);
        }

        handleClose();
    };

    const handleModalCloseAndReset = () => {
        if (accountData) {
            let dobDay = '',
                dobMonth = '',
                dobYear = '';
            if (accountData.dob) {
                const [year, month, day] = accountData.dob.split('-');
                dobDay = day || '';
                dobMonth = month || '';
                dobYear = year || '';
            }

            setFormData({
                fullName: accountData.username || '',
                email: accountData.email || '',
                phone: accountData.phone || '',
                address: accountData.address || '',
                sex: accountData.sex || '',
                dobDay,
                dobMonth,
                dobYear,
            });
        }
        setErrors({});
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleModalCloseAndReset} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Thông Tin Tài Khoản Của Bạn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGridFullName">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            isInvalid={!!errors.fullName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.fullName}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            disabled
                        />
                        <Form.Text className="text-muted">
                            Email không thể thay đổi.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridPhone">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phone}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* ✅ Ngày sinh 3 ô nhập liệu */}
                    <Form.Group className="mb-3" controlId="formGridDOB">
                        <Form.Label>Ngày sinh</Form.Label>
                        <Row>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Ngày"
                                    name="dobDay"
                                    value={formData.dobDay}
                                    onChange={handleChange}
                                    isInvalid={!!errors.dob}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Tháng"
                                    name="dobMonth"
                                    value={formData.dobMonth}
                                    onChange={handleChange}
                                    isInvalid={!!errors.dob}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder="Năm"
                                    name="dobYear"
                                    value={formData.dobYear}
                                    onChange={handleChange}
                                    isInvalid={!!errors.dob}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.dob}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridSex">
                        <Form.Label>Giới tính</Form.Label>
                        <Form.Select
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formGridAddress">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            isInvalid={!!errors.address}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.address}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSubmit}>
                    Cập nhật
                </Button>
                <Button variant="secondary" onClick={handleModalCloseAndReset}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangeAccountInformationModal;
