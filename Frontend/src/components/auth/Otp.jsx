import { Card, InputGroup } from 'react-bootstrap';
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaGoogle,
} from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Otp = ({
    onSubmit,
    onResend,
    length = 6,
    loading = false,
    error = null,
    success = false,
}) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.value !== '' && index < length - 1) {
            inputRefs.current[index + 1].focus();
            setActiveIndex(index + 1);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                // Focus previous input if current is empty
                inputRefs.current[index - 1].focus();
                setActiveIndex(index - 1);
            } else {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
            setActiveIndex(index - 1);
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1].focus();
            setActiveIndex(index + 1);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text');
        const pasteArray = pasteData.slice(0, length).split('');

        if (pasteArray.every((char) => !isNaN(char))) {
            const newOtp = [...otp];
            pasteArray.forEach((char, index) => {
                if (index < length) {
                    newOtp[index] = char;
                }
            });
            setOtp(newOtp);

            // Focus the next empty input or last input
            const nextIndex = Math.min(pasteArray.length, length - 1);
            inputRefs.current[nextIndex].focus();
            setActiveIndex(nextIndex);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length === length) {
            onSubmit(otpValue);
        }
    };

    const handleResend = () => {
        setOtp(new Array(length).fill(''));
        setActiveIndex(0);
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
        if (onResend) {
            onResend();
        }
    };

    const isComplete = otp.every((digit) => digit !== '');

    return (
        <div style={{ position: 'relative' }}>
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
            <Container
                className="d-flex justify-content-center align-items-start min-vh-100 pt-5"
                style={{
                    position: 'relative',
                }}
            >
                <Row className="w-100">
                    <Col xs={12} md={7} lg={6} className="mx-auto pt-5">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-primary mb-2">
                                        Xác thực OTP
                                    </h2>
                                    <p className="text-muted">
                                        Vui lòng nhập mã {length} chữ số được
                                        gửi đến điện thoại của bạn
                                    </p>
                                </div>

                                {error && (
                                    <Alert variant="danger" className="mb-4">
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert variant="success" className="mb-4">
                                        Xác thực thành công!
                                    </Alert>
                                )}

                                <Form
                                    onSubmit={handleSubmit}
                                    style={{
                                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <div className="d-flex justify-content-center gap-1 mb-4">
                                        {otp.map((data, index) => (
                                            <input
                                                key={index}
                                                ref={(ref) =>
                                                    (inputRefs.current[index] =
                                                        ref)
                                                }
                                                type="text"
                                                name="otp"
                                                maxLength="1"
                                                value={data}
                                                className={`form-control text-center fw-bold fs-4 otp-input ${
                                                    activeIndex === index
                                                        ? 'border-primary'
                                                        : ''
                                                } ${
                                                    data ? 'border-success' : ''
                                                }`}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '12px',
                                                    border: '2px solid #dee2e6',
                                                    transition: 'all 0.2s ease',
                                                    backgroundColor: data
                                                        ? '#f8f9fa'
                                                        : 'white',
                                                }}
                                                onChange={(e) =>
                                                    handleChange(
                                                        e.target,
                                                        index
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    handleKeyDown(e, index)
                                                }
                                                onFocus={() =>
                                                    setActiveIndex(index)
                                                }
                                                onPaste={
                                                    index === 0
                                                        ? handlePaste
                                                        : undefined
                                                }
                                                disabled={loading}
                                            />
                                        ))}
                                    </div>

                                    <div className="d-grid gap-2">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            type="submit"
                                            disabled={!isComplete || loading}
                                            className="rounded-3 fw-semibold"
                                            style={{
                                                background: isComplete
                                                    ? 'linear-gradient(45deg, #007bff, #0056b3)'
                                                    : '',
                                                border: 'none',
                                                padding: '12px',
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                    Đang xác thực...
                                                </>
                                            ) : (
                                                'Xác thực OTP'
                                            )}
                                        </Button>

                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={handleResend}
                                            disabled={loading}
                                            className="rounded-3"
                                            style={{ padding: '12px' }}
                                        >
                                            Gửi lại mã OTP
                                        </Button>
                                    </div>
                                </Form>

                                <div className="text-center mt-4">
                                    <small className="text-muted">
                                        Không nhận được mã? Kiểm tra tin nhắn
                                        rác hoặc thử gửi lại
                                    </small>
                                </div>

                                <p className="text-center text-muted mt-4 mb-0">
                                    Bạn đã có tài khoản?{' '}
                                    <a
                                        href="#"
                                        className="text-decoration-none fw-medium"
                                        style={{ color: '#667eea' }}
                                    >
                                        Đăng nhập ngay
                                    </a>
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>

                <style jsx>{`
                    .otp-input:focus {
                        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
                        outline: none !important;
                    }

                    .otp-input:hover:not(:disabled) {
                        border-color: #007bff !important;
                    }

                    .card {
                        transition: transform 0.2s ease;
                    }

                    .card:hover {
                        transform: translateY(-2px);
                    }

                    .min-vh-100 {
                        min-height: 100vh;
                    }
                `}</style>
            </Container>
        </div>
    );
};

export default Otp;
