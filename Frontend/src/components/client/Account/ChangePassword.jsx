import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import {
    checkUserHavePassword,
    handleUserAddPassword,
    handleUserUpdatePassword,
} from '../../../services/LoginRegisterService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [havePassword, setHavePassword] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const userId = useSelector((state) => state.user.account.id);
    const email = useSelector((state) => state.user.account.email);
    const { t } = useTranslation();

    const handleChange = (field, value) => {
        setPasswords({ ...passwords, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
        setSuccessMessage('');
    };

    const validatePasswords = () => {
        const newErrors = {};

        if (havePassword === true) {
            if (!passwords.current) {
                newErrors.current = t('formPayment.currentPasswordRequired');
            }
        }

        if (!passwords.new) {
            newErrors.new = t('formPayment.newPasswordRequired');
        } else if (passwords.new.length < 8) {
            newErrors.new = t('formPayment.newPasswordMinLength');
        } else if (passwords.new === passwords.current) {
            newErrors.new = t('formPayment.newPasswordDifferent');
        }

        if (!passwords.confirm) {
            newErrors.confirm = t('formPayment.confirmPasswordRequired');
        } else if (passwords.new !== passwords.confirm) {
            newErrors.confirm = t('formPayment.confirmPasswordMismatch');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validatePasswords()) {
            if (havePassword === false) {
                handleAddPassWord();
            } else {
                handleUpdatePassword();
            }
        }
    };

    const handleConfirmHavePassword = async () => {
        try {
            setIsChecking(true);
            if (userId && email) {
                const response = await checkUserHavePassword(userId, email);
                console.log('Check password response:', response);

                if (response && (response.EC === 0 || response.EC === 'yes')) {
                    setHavePassword(true);
                } else if (
                    response &&
                    (response.EC === 1 || response.EC === 'no')
                ) {
                    setHavePassword(false);
                } else {
                    console.warn('Phản hồi không hợp lệ:', response);
                    setHavePassword(false); // fallback
                }
            }
        } catch (error) {
            console.error(t('formPayment.checkingPassword'), error);
            setHavePassword(false); // fallback
        } finally {
            setIsChecking(false);
        }
    };

    const handleAddPassWord = async () => {
        try {
            const response = await handleUserAddPassword(
                userId,
                email,
                passwords.new
            );
            if (response && response.EC === 0) {
                toast.success(response.EM);
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            const response = await handleUserUpdatePassword(
                userId,
                email,
                passwords.current,
                passwords.new
            );
            if (response && response.EC === 0) {
                toast.success(response.EM);
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (userId && email) {
            handleConfirmHavePassword();
        }
    }, [userId, email]);

    return (
        <Row className="justify-content-start">
            {isChecking ? (
                <p>{t('account.checkingAccount')}</p>
            ) : (
                <>
                    <h2 className="h4 text-dark mb-0">
                        {havePassword
                            ? t('account.changePassword')
                            : t('account.noPassword')}
                    </h2>
                    <hr className="mb-2" style={{ marginTop: '43px' }} />
                    <Col md={8} lg={7}>
                        <Card className="mb-4 border-0 mt-2">
                            <Card.Body
                                className="p-4 rounded"
                                style={{ backgroundColor: '#f0f0f0ff' }}
                            >
                                {successMessage && (
                                    <Alert
                                        variant="success"
                                        onClose={() => setSuccessMessage('')}
                                        dismissible
                                        className="mb-3"
                                    >
                                        {successMessage}
                                    </Alert>
                                )}
                                <Form onSubmit={handleSubmit}>
                                    {havePassword === true && (
                                        <Form.Group
                                            className="mb-3"
                                            controlId="current-password"
                                            type="password"
                                        >
                                            <Form.Label className="fw-semibold">
                                                {t(
                                                    'formPayment.currentPassword'
                                                )}
                                            </Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={passwords.current}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'current',
                                                        e.target.value
                                                    )
                                                }
                                                isInvalid={!!errors.current}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.current}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    )}

                                    <Form.Group
                                        className="mb-3"
                                        controlId="new-password"
                                        type="password"
                                    >
                                        <Form.Label className="fw-semibold">
                                            {t('formPayment.newPassword')}
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={passwords.new}
                                            onChange={(e) =>
                                                handleChange(
                                                    'new',
                                                    e.target.value
                                                )
                                            }
                                            isInvalid={!!errors.new}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.new}
                                        </Form.Control.Feedback>
                                        <Form.Text className="text-muted">
                                            {t(
                                                'formPayment.passwordMinLength8'
                                            )}
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group
                                        className="mb-4"
                                        controlId="confirm-password"
                                        type="password"
                                    >
                                        <Form.Label className="fw-semibold">
                                            {t('formPayment.confirmPassword')}
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={passwords.confirm}
                                            onChange={(e) =>
                                                handleChange(
                                                    'confirm',
                                                    e.target.value
                                                )
                                            }
                                            isInvalid={!!errors.confirm}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.confirm}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <div className="d-flex justify-content-end gap-2 mt-5">
                                        <Button type="submit" variant="primary">
                                            {havePassword
                                                ? t(
                                                      'formPayment.updatePassword'
                                                  )
                                                : 'Thêm mới'}
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => {
                                                setPasswords({
                                                    current: '',
                                                    new: '',
                                                    confirm: '',
                                                });
                                                setErrors({});
                                                setSuccessMessage('');
                                            }}
                                        >
                                            {t('account.cancel')}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </>
            )}
        </Row>
    );
};

export default ChangePassword;
