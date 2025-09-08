import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { handleInsertNewPassword } from '../../../services/LoginRegisterService';
import { useTranslation } from 'react-i18next';

const ResetPasswordForm = () => {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || newPassword.length < 6) {
            setError(`${t('resetPassword.errorPasswordMin')}`);
            return;
        }

        try {
            const email = localStorage.getItem('emailForgetReset');
            if (email !== '') {
                const response = await handleInsertNewPassword(
                    email,
                    newPassword
                );
                if (response && response.EC === 0) {
                    localStorage.removeItem('emailForgetReset');
                    toast.success(response.EM);
                    history.push('/login');
                } else {
                    toast.error(response.EM);
                }
            }
        } catch (err) {
            setError(`${t('resetPassword.errorSystem')}`);
        }
    };

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            {/* Ảnh nền */}
            <img
                src="../assets/image_header.jpg"
                alt="background"
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />

            {/* Form nhập mật khẩu mới */}
            <div
                className="container d-flex align-items-center justify-content-center"
                style={{ height: '75vh', position: 'relative' }}
            >
                <Card
                    className="shadow-lg border-0 col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4"
                    style={{
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                >
                    <Card.Body className="p-4">
                        <div className="text-center mb-4">
                            <div className="d-flex justify-content-center mb-3">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        background:
                                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }}
                                >
                                    <FaLock className="text-white" size={24} />
                                </div>
                            </div>
                            <h3 className="fw-bold text-dark">
                                {t('resetPassword.headerTitle')}
                            </h3>
                            <p className="text-muted">
                                {t('resetPassword.description')}
                            </p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label>
                                    {t('resetPassword.newPasswordLabel')}
                                </Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border-end-0">
                                        <FaLock className="text-muted" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        placeholder={t(
                                            'resetPassword.newPasswordPlaceholder'
                                        )}
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setError('');
                                        }}
                                        isInvalid={!!error}
                                        className="border-start-0"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {error}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Button
                                type="submit"
                                className="w-100 py-2 fw-medium border-0"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                            >
                                {t('resetPassword.updateButton')}
                            </Button>

                            <div className="d-flex justify-content-center align-items-center mt-2">
                                <span
                                    style={{
                                        color: '#667eea',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                    }}
                                    onClick={() =>
                                        history.push('/otp-forget-password')
                                    }
                                >
                                    {t('resetPassword.backLink')}
                                </span>{' '}
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
