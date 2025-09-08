// import React from "react";
import React, { useState } from 'react';
import { Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaGoogle,
} from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa6';
import { doLogin } from '../../redux/actions/userAction';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, provider, facebookProvider } from '../../config/firebaseAuthen';
import { signInWithPopup } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import {
    googleAuthentication,
    facebookAuthentication,
} from '../../services/AuthenticationService';
import { handleRegister } from '../../services/LoginRegisterService';
import { asyncCartDataOfUser } from '../../redux/actions/cartAction';
import { asyncCartData } from '../../services/CartService';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmpassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false);
    const dispath = useDispatch();
    const history = useHistory();
    const dataCart = useSelector((state) => state.cart);
    const { t } = useTranslation();

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
        if (!formData.fullname) {
            newErrors.fullname = `${t('registerForm.errorUsernameRequired')}`;
        }

        if (!formData.email) {
            newErrors.email = `${t('registerForm.errorEmailRequired')}`;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = `${t('registerForm.errorEmailInvalid')}`;
        }

        if (!formData.password) {
            newErrors.password = `${t('registerForm.errorPasswordRequired')}`;
        } else if (formData.password.length < 6) {
            newErrors.password = `${t('registerForm.errorPasswordMin')}`;
        }

        if (!formData.confirmpassword) {
            newErrors.confirmpassword = `${t(
                'registerForm.errorConfirmPasswordRequired'
            )}`;
        } else if (formData.password !== formData.confirmpassword) {
            newErrors.confirmpassword = `${t(
                'registerForm.errorConfirmPasswordInvalid'
            )}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAsyncCartData = async (userId) => {
        let response = await asyncCartData(dataCart, userId);
        if (response && response.EC === 0) {
            dispath(asyncCartDataOfUser(response.DT));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            let response = await handleRegister(
                formData.fullname,
                formData.email,
                formData.password
            );
            if (response && response.EC === 0) {
                // toast.success(response.EM);
                localStorage.setItem(
                    'register-information',
                    JSON.stringify({
                        fullname: formData.fullname,
                        email: formData.email,
                        password: formData.password,
                    })
                );
                history.push('/otp-register-account');
            } else {
                toast.error(response.EM);
            }
        }
    };

    const handleNavigateByGroup = (group) => {
        if (group === 'client') {
            history.push('/');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const data = await signInWithPopup(auth, provider);
            const idToken = await data.user.getIdToken();
            const response = await googleAuthentication(idToken);
            if (response && response.EC === 0) {
                localStorage.setItem('jwt', response.DT.access_token);
                toast.success(response.EM);
                dispath(doLogin(response.DT));
                handleNavigateByGroup(response.DT.group);
                handleAsyncCartData(response.DT.id);
                localStorage.setItem('loggined', true);
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.log('Error from login with google: ', error);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const data = await signInWithPopup(auth, facebookProvider);
            const idToken = await data.user.getIdToken();
            // console.log('check data from facebook login:', data);
            const response = await facebookAuthentication(idToken);
            if (response && response.EC === 0) {
                localStorage.setItem('jwt', response.DT.access_token);
                toast.success(response.EM);
                dispath(doLogin(response.DT));
                handleNavigateByGroup(response.DT.group);
                handleAsyncCartData(response.DT.id);
                localStorage.setItem('loggined', true);
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.log(error);
            if (
                error.code === 'auth/account-exists-with-different-credential'
            ) {
                toast.error(`${t('registerForm.errorFacebookAccountExists')}`);
            }
            // console.log('Error from login with google: ', error);
        }
    };

    return (
        <>
            <div style={{ position: 'relative' }} className="pb-3">
                <img
                    src="../assets/image_header.jpg"
                    style={{
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        height: '100%',
                        // opacity: '0.9',
                    }}
                ></img>
                <div
                    className="container d-flex align-items-center justify-content-center pt-5 pb-5 pt-sm-1 pb-sm-1 pt-md-4 pb-md-4 pt-xl-5 pb-xl-5"
                    style={{
                        position: 'relative',
                        // paddingBottom: '55px',
                        // paddingTop: '55px',
                    }}
                >
                    <Card
                        className="shadow-lg border-0 col-12 col-md-10 col-lg-7 col-xl-5"
                        style={{
                            backdropFilter: 'blur(10px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            // position: 'relative',
                        }}
                    >
                        <Card.Body className="p-4 p-md-4 px-md-5">
                            {/* Header */}
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
                                        <FaLock
                                            className="text-white"
                                            size={24}
                                        />
                                    </div>
                                </div>
                                <h2 className="fw-bold text-dark mb-2">
                                    {t('registerForm.signUp')}
                                </h2>
                            </div>

                            {/* Form */}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group style={{ marginBottom: '22px' }}>
                                    <Form.Label className="fw-medium">
                                        {t('registerForm.usernameLabel')}
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="border-end-0 bg-light">
                                            <FaUser className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder={t(
                                                'registerForm.usernamePlaceholder'
                                            )}
                                            value={formData.fullname}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'fullname',
                                                    e.target.value
                                                )
                                            }
                                            isInvalid={!!errors.fullname}
                                            className="border-start-0"
                                        />
                                        <Form.Control.Feedback
                                            type="invalid"
                                            style={{
                                                position: 'absolute',
                                                marginTop: '37px',
                                            }}
                                        >
                                            {errors.fullname}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group style={{ marginBottom: '22px' }}>
                                    <Form.Label className="fw-medium">
                                        Email
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="border-end-0 bg-light">
                                            <FaEnvelope className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            placeholder={t(
                                                'registerForm.emailPlaceholder'
                                            )}
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
                                        <Form.Control.Feedback
                                            type="invalid"
                                            style={{
                                                position: 'absolute',
                                                marginTop: '37px',
                                            }}
                                        >
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group style={{ marginBottom: '22px' }}>
                                    <Form.Label className="fw-medium">
                                        {t('registerForm.passwordLabel')}
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="border-end-0 bg-light">
                                            <FaLock className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder={t(
                                                'registerForm.passwordPlaceholder'
                                            )}
                                            value={formData.password}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'password',
                                                    e.target.value
                                                )
                                            }
                                            isInvalid={!!errors.password}
                                            className="border-start-0 border-end-0"
                                        />
                                        <InputGroup.Text
                                            className="border-start-0 bg-light cursor-pointer"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="text-muted" />
                                            ) : (
                                                <FaEye className="text-muted" />
                                            )}
                                        </InputGroup.Text>
                                        <Form.Control.Feedback
                                            type="invalid"
                                            style={{
                                                position: 'absolute',
                                                marginTop: '37px',
                                            }}
                                        >
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium">
                                        {t('registerForm.confirmPasswordLabel')}
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="border-end-0 bg-light">
                                            <FaLock className="text-muted" />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder={t(
                                                'registerForm.confirmPasswordPlaceholder'
                                            )}
                                            value={formData.confirmpassword}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'confirmpassword',
                                                    e.target.value
                                                )
                                            }
                                            isInvalid={!!errors.confirmpassword}
                                            className="border-start-0 border-end-0"
                                        />
                                        <InputGroup.Text
                                            className="border-start-0 bg-light cursor-pointer"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {showConfirmPassword ? (
                                                <FaEyeSlash className="text-muted" />
                                            ) : (
                                                <FaEye className="text-muted" />
                                            )}
                                        </InputGroup.Text>
                                        <Form.Control.Feedback
                                            type="invalid"
                                            style={{
                                                position: 'absolute',
                                                marginTop: '37px',
                                            }}
                                        >
                                            {errors.confirmpassword}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    className="w-100 py-2 fw-medium border-0 mt-3"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {t('registerForm.registerButton')}
                                </Button>
                            </Form>

                            {/* Google Login */}

                            {/* Sign up link */}
                            <span className="text-center text-muted mt-3 mb-0">
                                <div className="d-flex align-items-center my-2">
                                    <hr className="flex-grow-1" />
                                    <span className="px-3 text-muted small">
                                        {t('registerForm.orRegisterWith')}
                                    </span>
                                    <hr className="flex-grow-1" />
                                </div>
                                <div className="d-flex justify-content-center align-items-center gap-4">
                                    <FcGoogle
                                        style={{
                                            fontSize: '25px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleGoogleLogin()}
                                    />
                                    <FaFacebook
                                        style={{
                                            color: 'blue',
                                            fontSize: '22px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleFacebookLogin()}
                                    />
                                </div>
                            </span>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Register;
