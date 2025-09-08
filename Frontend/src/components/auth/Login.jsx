import React, { useEffect, useState } from 'react';
import { Card, Form, Button, InputGroup, Alert } from 'react-bootstrap';
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaGoogle,
} from 'react-icons/fa';
// import './Login.scss';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { auth, provider, facebookProvider } from '../../config/firebaseAuthen';
import { signInWithPopup } from 'firebase/auth';
import {
    googleAuthentication,
    facebookAuthentication,
} from '../../services/AuthenticationService';
import { handleLogin } from '../../services/LoginRegisterService';
import { doLogin } from '../../redux/actions/userAction';
import { useHistory } from 'react-router-dom';
import { FaFacebook } from 'react-icons/fa6';
import { SiTelegram } from 'react-icons/si';
import { useSelector, useDispatch } from 'react-redux';
import { asyncCartData } from '../../services/CartService';
import { asyncCartDataOfUser } from '../../redux/actions/cartAction';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false);
    const [valueGoogleLogin, setValueGoogleLogin] = useState({});
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

    const handleForgotPassword = () => {
        history.push('/forgot-password');
    };

    const handleAsyncCartData = async (userId) => {
        let response = await asyncCartData(dataCart, userId);
        if (response && response.EC === 0) {
            dispath(asyncCartDataOfUser(response.DT));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            let response = await handleLogin(formData.email, formData.password);
            if (response && response.EC === 0) {
                localStorage.setItem('jwt', response.DT.access_token);
                toast.success(response.EM);
                dispath(doLogin(response.DT));
                const role = handleNavigateByGroup(response.DT.group);
                if (role === 'user') {
                    handleAsyncCartData(response.DT.id);
                }
                localStorage.setItem('loggined', true);
            } else {
                toast.error(response.EM);
            }
            console.log(response);
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
                const role = handleNavigateByGroup(response.DT.group);
                if (role === 'user') {
                    handleAsyncCartData(response.DT.id);
                }
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
                const role = handleNavigateByGroup(response.DT.group);
                if (role === 'user') {
                    handleAsyncCartData(response.DT.id);
                }
                localStorage.setItem('loggined', true);
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.log(error);
            if (
                error.code === 'auth/account-exists-with-different-credential'
            ) {
                toast.error(
                    'Your emai of facebook has exist in other acocunt information!'
                );
            }
            // console.log('Error from login with google: ', error);
        }
    };

    const handleNavigateByGroup = (group) => {
        if (group === 'client') {
            history.push('/');
            return 'user';
        } else if (group === 'admin') {
            history.push('/admin');
            return '';
        }
    };

    useEffect(() => {}, []);

    return (
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
                className="container d-flex align-items-center justify-content-center pt-5 pb-5 pt-sm-1 pb-sm-1 pt-md-4 pb-md-4 pt-xl-4 pb-xl-5"
                style={{
                    position: 'relative',
                }}
            >
                <Card
                    className="shadow-lg border-0 col-12 col-md-10 col-lg-7 col-xl-5 mt-5"
                    style={{
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        height: 'fit-content',
                        // position: 'relative',
                    }}
                >
                    <Card.Body className="p-4 p-md-5">
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
                                    <FaLock className="text-white" size={24} />
                                </div>
                            </div>
                            <h2 className="fw-bold text-dark mb-2">Login</h2>
                        </div>
                        {/* Form */}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
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
                                            'login.emailPlaceholder'
                                        )}
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'email',
                                                e.target.value
                                            )
                                        }
                                        isInvalid={errors.email}
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
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-medium">
                                    {t('login.passwordPlaceholder')}
                                </Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="border-end-0 bg-light">
                                        <FaLock className="text-muted" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder={t(
                                            'login.passwordPlaceholder'
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
                            {/* Remember Me & Forgot Password */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Form.Check
                                    type="checkbox"
                                    id="rememberMe"
                                    label={t('login.rememberMe')}
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                    className="text-muted"
                                />
                                <a
                                    href="/forgot-password"
                                    className="text-decoration-none"
                                    style={{
                                        color: '#667eea',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {t('login.forgotPassword')}
                                </a>
                            </div>
                            <Button
                                type="submit"
                                className="w-100 py-2 fw-medium border-0 mb-1"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {t('login.login')}
                            </Button>
                        </Form>
                        {/* Divider */}
                        <div className="d-flex align-items-center my-2">
                            <hr className="flex-grow-1" />
                            <span className="px-3 text-muted small">
                                {t('login.or')}
                            </span>
                            <hr className="flex-grow-1" />
                        </div>
                        {/* Google Login & Facebook Login giữ nguyên */}
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

                        {/* Sign up link */}
                        <p className="text-center text-muted mt-4 mb-0">
                            {t('login.noAccount')}{' '}
                            <a
                                className="text-decoration-none fw-medium"
                                style={{ color: '#667eea', cursor: 'pointer' }}
                                onClick={() => history.push('/register')}
                            >
                                {t('login.registerNow')}
                            </a>
                        </p>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default LoginForm;
