// import React from "react";
import React, { useState } from 'react';
import { Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaRegUser,
    FaGoogle,
    FaFacebookF,
} from 'react-icons/fa';
import { RiTelegram2Fill } from 'react-icons/ri';
// import './SocialRegister.scss';

const SocialRegister = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            // Xử lý đăng nhập ở đây
        }
    };

    const handleGoogleRegister = () => {};

    return (
        <>
            <div className="pb-3 social-register">
                <img src="../assets/image_header.jpg"></img>
                <div className="container content pt-5 pb-5 pt-sm-1 pb-sm-1 pt-md-4 pb-md-4 pt-xl-5 pb-xl-5">
                    <Card className="card shadow-lg border-0 col-12 col-md-10 col-lg-7 col-xl-5">
                        <Card.Body className="p-4 p-md-5">
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
                                        <FaRegUser
                                            className="text-white"
                                            size={24}
                                        />
                                    </div>
                                </div>
                                <h2 className="fw-bold text-dark mb-2">
                                    Sign up
                                </h2>
                                <p className="d-none d-sm-block text-muted">
                                    Chào mừng bạn đến với JetNow!
                                </p>
                            </div>

                            {/* Form */}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium">
                                        Email
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="border-end-0 bg-light">
                                            <FaEnvelope className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            placeholder="Nhập email của bạn"
                                            value={formData.email}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'email',
                                                    e.target.value
                                                )
                                            }
                                            isInvalid={!!errors.email}
                                            className="border-start-0"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="w-100 py-2 fw-medium border-0 mt-3 mb-2"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Đăng ký
                                </Button>

                                <div className="d-none d-sm-flex align-items-center my-3">
                                    <hr className="flex-grow-1" />
                                    <span className="px-3 text-muted small">
                                        hoặc
                                    </span>
                                    <hr className="flex-grow-1" />
                                </div>

                                <Button
                                    variant="outline-secondary"
                                    className="btn-google w-100 py-2 d-flex align-items-center justify-content-center border-none mt-3 mt-sm-0"
                                    onClick={handleGoogleRegister}
                                >
                                    <FaGoogle className="icon me-2" />
                                    Đăng ký với Google
                                </Button>

                                <Button
                                    variant="outline-secondary"
                                    className="btn-facebook w-100 py-2 d-flex align-items-center justify-content-center border-2 mt-3 mt-sm-3 gap-2"
                                    onClick={handleGoogleRegister}
                                >
                                    <div className="box-icon rounded-circle bg-primary pt-1">
                                        <FaFacebookF className="icon" />
                                    </div>
                                    Đăng ký với Facebook
                                </Button>

                                <Button
                                    variant="outline-secondary"
                                    className="btn-tele w-100 py-2 border-2 mt-3 mt-sm-3 gap-2"
                                    onClick={handleGoogleRegister}
                                >
                                    <div className="box-icon bg-info rounded-circle">
                                        <RiTelegram2Fill className="icon" />
                                    </div>
                                    Đăng ký với Telegram
                                </Button>
                            </Form>

                            {/* Google Login */}

                            {/* Sign up link */}
                            <p className="text-center text-muted mt-3 mb-0">
                                <a
                                    href="#"
                                    className="text-decoration-none fw-medium"
                                    style={{ color: '#667eea' }}
                                >
                                    Đăng ký bằng cách khác
                                </a>
                            </p>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default SocialRegister;
