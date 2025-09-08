// src/components/PersonalInfo.jsx
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ChangeAccountInformationModal from './ChangeAccountInformation'; // Đổi tên import thành Modal
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const PersonalInfo = () => {
    // Lấy dữ liệu tài khoản từ Redux store
    const accountData = useSelector((state) => state.user.account);
    const { t } = useTranslation();

    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Hàm định dạng ngày tháng (nếu có trường ngày sinh trong Redux)
    const formatDisplayDate = (dateString) => {
        if (!dateString) return t('personalInfo.notUpdated'); // Sửa lại để hiển thị "Chưa cập nhật"
        try {
            // Giả định dateString là định dạng hợp lệ (ví dụ: ISO 8601)
            return new Intl.DateTimeFormat('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(new Date(dateString));
        } catch (error) {
            console.error('Lỗi định dạng ngày:', error);
            return t('personalInfo.invalid');
        }
    };

    // Hàm trợ giúp để hiển thị giới tính
    const getGenderDisplay = (gender) => {
        switch (gender) {
            case 'male':
                return t('personalInfo.male');
            case 'female':
                return t('personalInfo.female');
            case 'other':
                return t('personalInfo.other');
            default:
                return t('personalInfo.notUpdated'); // Sửa lại để hiển thị "Chưa cập nhật"
        }
    };

    // Component con dùng để hiển thị từng trường thông tin
    const InfoField = ({ label, value, labelWidthMd = 4 }) => (
        <Row className="mb-2">
            <Col md={labelWidthMd} className="text-muted fw-semibold">
                {label}:
            </Col>
            <Col md={12 - labelWidthMd} className="text-dark">
                {value || t('personalInfo.notUpdated')}{' '}
                {/* Hiển thị "Chưa cập nhật" nếu giá trị null/undefined/empty string */}
            </Col>
        </Row>
    );

    // Xử lý fullName từ username: "Ta Duc Manh (FGW HN)"
    // hoặc giữ nguyên username nếu không có firstName/lastName riêng biệt
    const displayFullName = accountData.username || t('personalInfo.notUpdated');

    return (
        <Card className="border-0 mb-4">
            {/* Modal hiển thị thông tin và cho phép chỉnh sửa */}
            <ChangeAccountInformationModal
                show={showModal}
                handleClose={handleCloseModal}
                accountData={accountData} // Truyền toàn bộ object accountData từ Redux
            />

            <h5 className="mt-0 text-dark mb-0">{t('personalInfo.title')}</h5>
            <hr className="mb-2" style={{ marginTop: '48px' }} />

            <Card.Body
                className="rounded mt-2"
                style={{ backgroundColor: '#f0f0f0ff' }}
            >
                <div className="d-flex flex-column gap-4">
                    <InfoField label={t('personalInfo.fullName')} value={displayFullName} />
                    <InfoField label={t('personalInfo.email')} value={accountData.email} />
                    <InfoField
                        label={t('personalInfo.phone')}
                        value={accountData.phone}
                    />
                    {/* Giả định Redux có trường birthDate và sex */}
                    <InfoField
                        label={t('personalInfo.birthDate')}
                        value={formatDisplayDate(accountData.birthDay)} // Sử dụng accountData.birthDate
                    />
                    <InfoField
                        label={t('personalInfo.gender')}
                        value={getGenderDisplay(accountData.sex)} // Sử dụng accountData.sex
                    />
                    <InfoField
                        label={t('personalInfo.address')}
                        value={accountData.address}
                        labelWidthMd={4}
                    />
                </div>
            </Card.Body>
            <div className="d-flex justify-content-end mt-5">
                {/* Nút này sẽ mở modal */}
                <button
                    className="btn btn-primary mt-3"
                    onClick={handleOpenModal}
                >
                    {t('personalInfo.edit')}
                </button>
            </div>
        </Card>
    );
};

export default PersonalInfo;
