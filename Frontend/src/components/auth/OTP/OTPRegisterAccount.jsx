import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
    handleConfirmOtpForgetPassword,
    handleConfirmOtpRegisterAccount,
    handleRegister,
    handleSendEmailResetPassword,
} from '../../../services/LoginRegisterService';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OtpRegisterAccount = ({ email }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [otpTimer, setOtpTimer] = useState(120); // 2 phút hiệu lực OTP

    const history = useHistory();
    const { t } = useTranslation();
    useEffect(() => {
        if (otpTimer <= 0) return;

        const interval = setInterval(() => {
            setOtpTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [otpTimer]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6 || isNaN(otp)) {
            setError(`${'otpForgetPassword.errorInvalidOtp'}`);
            return;
        }

        try {
            const dataStored = localStorage.getItem('register-information');
            const emailStored = JSON.parse(dataStored).email;
            const response = await handleConfirmOtpRegisterAccount(
                emailStored,
                otp
            );

            if (response && response.EC === 0) {
                localStorage.removeItem('register-information');
                toast.success(response.EM);
                history.push('/login');
            } else {
                toast.error(response.EM);
            }
        } catch (err) {
            toast.error(`${'resetPassword.errorSystem'}`);
        }
    };

    const handleSendOtpAgain = async () => {
        try {
            const emailLocalStored = localStorage.getItem(
                'register-information'
            );
            const emailStored = JSON.parse(emailLocalStored);
            if (emailStored !== '') {
                const response = await handleRegister(
                    emailStored.fullname,
                    emailStored.email,
                    emailStored.password
                );
                if (response && response.EC === 0) {
                    toast.success(response.EM);
                } else {
                    toast.error(response.EM);
                }

                // toast.success('Đã gửi lại mã OTP mới!');
                setOtpTimer(120); // Reset lại bộ đếm hiệu lực
                setOtp(''); // Reset input
                setError('');
            }
        } catch (error) {
            console.error(error);
            toast.error(t('resetPassword.errorSystem'));
        }
    };

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
                                {t('otpForgetPassword.headerTitle')}
                            </h3>
                            <p className="text-muted">
                                {t('otpForgetPassword.description')}{' '}
                                <strong>{email}</strong>{' '}
                                {t('otpForgetPassword.and')}
                            </p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label>
                                    {t('otpForgetPassword.otpLabel')}
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value);
                                        setError('');
                                    }}
                                    maxLength={6}
                                    isInvalid={!!error}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 py-2 fw-medium border-0"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                            >
                                {t('otpForgetPassword.submitButton')}
                            </Button>
                        </Form>

                        <div className="text-center mt-3">
                            <div className="text-muted mb-2">
                                {t('otpForgetPassword.timerText')}{' '}
                                <strong>{formatTime(otpTimer)}</strong>
                            </div>
                            <div>
                                <span
                                    style={{
                                        color: '#667eea',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                    }}
                                    onClick={handleSendOtpAgain}
                                >
                                    {t('otpForgetPassword.resendOtp')}
                                </span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default OtpRegisterAccount;
