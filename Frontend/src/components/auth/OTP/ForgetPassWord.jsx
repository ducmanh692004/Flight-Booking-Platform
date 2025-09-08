import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { handleSendEmailResetPassword } from '../../../services/LoginRegisterService';
import { useTranslation } from 'react-i18next';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError(`${t('forgotPassword.errorInvalidEmail')}`);
            return;
        }

        const response = await handleSendEmailResetPassword(email);
        if (response && response.EC === 0) {
            localStorage.setItem('emailForgetReset', email);
            history.push('/otp-forget-password');
        } else {
            toast.error(response.EM);
        }
    };

    const history = useHistory();

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
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
                                {t('forgotPassword.headerTitle')}
                            </h3>
                            <p className="text-muted">
                                {t('forgotPassword.description')}
                            </p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label>Email</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border-end-0">
                                        <FaEnvelope className="text-muted" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        placeholder={t(
                                            'forgotPassword.emailPlaceholder'
                                        )}
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
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
                                {t('forgotPassword.sendOtpButton')}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
