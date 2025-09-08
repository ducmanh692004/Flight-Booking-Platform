import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
    adminGetAllGroup,
    adminAddNewUser,
} from '../../../services/AdminService';

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const AddUserModal = ({ show, handleClose, handleFetchDataAgain }) => {
    // Sử dụng useTranslation hook để truy cập các hàm dịch
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        sex: '',
        groupId: '',
    });
    const [errors, setErrors] = useState({});
    const [groupList, setGroupList] = useState([]);

    useEffect(() => {
        if (!show) {
            setFormData({
                fullname: '',
                email: '',
                password: '',
                phone: '',
                address: '',
                sex: '',
                groupId: '',
            });
            setErrors({});
        }
    }, [show]);

    useEffect(() => {
        const fetchGroups = async () => {
            if (show && groupList.length === 0) {
                try {
                    const response = await adminGetAllGroup();
                    if (response && response.EC === 0) {
                        setGroupList(response.DT);
                        if (response.DT.length > 0 && !formData.groupId) {
                            setFormData((prev) => ({
                                ...prev,
                                groupId: response.DT[0]._id,
                            }));
                        }
                    } else {
                        toast.error(
                            response.EM ||
                                t('addUserModal.toastMessages.fetchGroupsError')
                        );
                    }
                } catch (error) {
                    console.error('Lỗi khi tải danh sách nhóm:', error);
                    toast.error(
                        t(
                            'addUserModal.toastMessages.fetchGroupsConnectionError'
                        )
                    );
                }
            }
        };

        fetchGroups();
    }, [show, groupList.length, formData.groupId, t]); // Thêm 't' vào dependency array

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullname.trim()) {
            newErrors.fullname = t(
                'addUserModal.validationErrors.fullNameRequired'
            );
        }
        if (!formData.email.trim()) {
            newErrors.email = t('addUserModal.validationErrors.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('addUserModal.validationErrors.emailInvalid');
        }
        if (!formData.password.trim()) {
            newErrors.password = t(
                'addUserModal.validationErrors.passwordRequired'
            );
        } else if (formData.password.length < 6) {
            newErrors.password = t(
                'addUserModal.validationErrors.passwordMinLength'
            );
        }
        if (!formData.groupId) {
            newErrors.groupId = t(
                'addUserModal.validationErrors.groupIdRequired'
            );
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await adminAddNewUser({
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address,
                sex: formData.sex,
                groupId: formData.groupId,
            });

            if (response && response.EC === 0) {
                toast.success(t('addUserModal.toastMessages.addUserSuccess'));
                handleFetchDataAgain();
                handleClose();
            } else {
                toast.error(
                    response.EM ||
                        t('addUserModal.toastMessages.addUserFailure')
                );
            }
        } catch (error) {
            console.error('Lỗi khi thêm người dùng:', error);
            toast.error(t('addUserModal.toastMessages.addUserConnectionError'));
        }
    };

    const handleModalCloseAndReset = () => {
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleModalCloseAndReset} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{t('addUserModal.title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGridFullname">
                        <Form.Label>
                            {t('addUserModal.formLabels.fullName')}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            isInvalid={!!errors.fullname}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.fullname}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridEmail">
                        <Form.Label>
                            {t('addUserModal.formLabels.email')}
                        </Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridPassword">
                        <Form.Label>
                            {t('addUserModal.formLabels.password')}
                        </Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridPhone">
                        <Form.Label>
                            {t('addUserModal.formLabels.phone')}
                        </Form.Label>
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

                    <Form.Group className="mb-3" controlId="formGridAddress">
                        <Form.Label>
                            {t('addUserModal.formLabels.address')}
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            isInvalid={!!errors.address}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.address}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridSex">
                            <Form.Label>
                                {t('addUserModal.formLabels.gender')}
                            </Form.Label>
                            <Form.Select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                            >
                                <option value="">
                                    {t('addUserModal.genderOptions.select')}
                                </option>
                                <option value="male">
                                    {t('addUserModal.genderOptions.male')}
                                </option>
                                <option value="female">
                                    {t('addUserModal.genderOptions.female')}
                                </option>
                                <option value="other">
                                    {t('addUserModal.genderOptions.other')}
                                </option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridGroup">
                            <Form.Label>
                                {t('addUserModal.formLabels.userGroup')}
                            </Form.Label>
                            <Form.Select
                                name="groupId"
                                value={formData.groupId}
                                onChange={handleChange}
                                isInvalid={!!errors.groupId}
                            >
                                <option value="">
                                    {t('addUserModal.groupOptions.select')}
                                </option>
                                {groupList.map((group) => (
                                    <option key={group._id} value={group._id}>
                                        {group.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.groupId}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalCloseAndReset}>
                    {t('addUserModal.buttons.cancel')}
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={groupList.length === 0}
                >
                    {t('addUserModal.buttons.add')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddUserModal;
