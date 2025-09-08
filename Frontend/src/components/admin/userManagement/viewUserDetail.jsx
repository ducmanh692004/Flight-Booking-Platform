import React from 'react';
import {
    Modal,
    Alert,
    Button,
    ListGroup,
    Row,
    Col,
    Card,
} from 'react-bootstrap';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaBuilding,
    FaBirthdayCake,
    FaTransgender,
    FaMapMarkerAlt,
    FaIdBadge,
} from 'react-icons/fa'; // Import các icon cần thiết

// Import useTranslation hook
import { useTranslation } from 'react-i18next';

const UserDetailModal = ({ show, handleClose, user }) => {
    // Sử dụng useTranslation hook để truy cập các hàm dịch
    const { t } = useTranslation();

    // Hàm trợ giúp để định dạng ngày tháng (nếu bạn không dùng moment)
    // Cần đảm bảo user.birthDay là một chuỗi ngày hợp lệ mà Date() có thể parse
    const formatBirthDay = (dateString) => {
        if (!dateString) return t('userDetailModal.notAvailable');
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; // Trả về nguyên gốc nếu không phải ngày hợp lệ
            }
            return date.toLocaleDateString('vi-VN'); // Định dạng theo kiểu Việt Nam (DD/MM/YYYY)
        } catch (error) {
            console.error('Lỗi định dạng ngày sinh:', error);
            return dateString;
        }
    };

    // Hàm giúp dịch giới tính từ tiếng Anh sang tiếng Việt (hoặc ngược lại)
    const getTranslatedGender = (gender) => {
        if (!gender) return t('userDetailModal.notAvailable');
        switch (gender.toLowerCase()) {
            case 'male':
            case 'nam':
                return t('userDetailModal.genderOptions.male');
            case 'female':
            case 'nữ':
                return t('userDetailModal.genderOptions.female');
            case 'other':
            case 'khác':
                return t('userDetailModal.genderOptions.other');
            default:
                return gender;
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <FaUser className="me-2" /> {t('userDetailModal.title')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {user ? (
                    <Card className="shadow-sm">
                        <Card.Body>
                            <ListGroup variant="flush">
                                {/* Họ và tên */}
                                <ListGroup.Item>
                                    <Row className="align-items-center">
                                        <Col xs={2} className="text-muted">
                                            <FaUser />
                                        </Col>
                                        <Col xs={4} className="fw-bold">
                                            {t(
                                                'userDetailModal.labels.fullName'
                                            )}
                                            :
                                        </Col>
                                        <Col xs={6}>
                                            {user.fullname ||
                                                t(
                                                    'userDetailModal.notAvailable'
                                                )}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {/* Email */}
                                <ListGroup.Item>
                                    <Row className="align-items-center">
                                        <Col xs={2} className="text-muted">
                                            <FaEnvelope />
                                        </Col>
                                        <Col xs={4} className="fw-bold">
                                            {t('userDetailModal.labels.email')}:
                                        </Col>
                                        <Col xs={6}>
                                            {user.email ||
                                                t(
                                                    'userDetailModal.notAvailable'
                                                )}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {/* Số điện thoại */}
                                <ListGroup.Item>
                                    <Row className="align-items-center">
                                        <Col xs={2} className="text-muted">
                                            <FaPhone />
                                        </Col>
                                        <Col xs={4} className="fw-bold">
                                            {t(
                                                'userDetailModal.labels.phoneNumber'
                                            )}
                                            :
                                        </Col>
                                        <Col xs={6}>
                                            {user.phone ||
                                                t(
                                                    'userDetailModal.notAvailable'
                                                )}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {/* Ngày sinh */}
                                <ListGroup.Item>
                                    <Row className="align-items-center">
                                        <Col xs={2} className="text-muted">
                                            <FaBirthdayCake />
                                        </Col>
                                        <Col xs={4} className="fw-bold">
                                            {t(
                                                'userDetailModal.labels.dateOfBirth'
                                            )}
                                            :
                                        </Col>
                                        <Col xs={6}>
                                            {formatBirthDay(user.birthDay)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {/* Giới tính */}
                                <ListGroup.Item>
                                    <Row className="align-items-center">
                                        <Col xs={2} className="text-muted">
                                            <FaTransgender />
                                        </Col>
                                        <Col xs={4} className="fw-bold">
                                            {t('userDetailModal.labels.gender')}
                                            :
                                        </Col>
                                        <Col xs={6}>
                                            {getTranslatedGender(user.sex)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {/* Địa chỉ */}
                                <ListGroup.Item>
                                    <Row>
                                        <Col xs={2} className="text-muted">
                                            <FaMapMarkerAlt />
                                        </Col>
                                        <Col xs={4} className="fw-bold">
                                            {t(
                                                'userDetailModal.labels.address'
                                            )}
                                            :
                                        </Col>
                                        <Col xs={6}>
                                            {user.address ||
                                                t(
                                                    'userDetailModal.notAvailable'
                                                )}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {/* Nhóm người dùng (nếu có) */}
                                {user.groupId && (
                                    <ListGroup.Item>
                                        <Row className="align-items-center">
                                            <Col xs={2} className="text-muted">
                                                <FaBuilding />
                                            </Col>
                                            <Col xs={4} className="fw-bold">
                                                {t(
                                                    'userDetailModal.labels.group'
                                                )}
                                                :
                                            </Col>
                                            <Col xs={6}>
                                                {user.groupId.name ||
                                                    user.groupId ||
                                                    t(
                                                        'userDetailModal.notAvailable'
                                                    )}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                ) : (
                    <Alert variant="info" className="text-center">
                        <FaUser className="me-2" /> {t('userDetailModal.alert')}
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('userDetailModal.buttonClose')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserDetailModal;
