// src/components/LanguageModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { updateLanguage } from '../../redux/actions/userAction';

const LanguageModal = ({ show, handleClose }) => {
    const currentLanguage = useSelector(
        (state) => state.language.current_language
    );

    const dispatch = useDispatch();
    const { i18n, t } = useTranslation(); // Thêm 't' để sử dụng hàm dịch

    const handleChange = (value) => {
        dispatch(updateLanguage(value));
        i18n.changeLanguage(value);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                {/* Sử dụng t() cho tiêu đề modal */}
                <Modal.Title>{t('languageModal.selectLanguage')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="d-flex justify-content-around">
                        <Form.Check
                            type="radio"
                            id="lang-en"
                            label={t('languageModal.english')}
                            name="language"
                            value="en"
                            checked={currentLanguage === 'en'}
                            onChange={() => handleChange('en')}
                        />
                        <Form.Check
                            type="radio"
                            id="lang-vi"
                            label={t('languageModal.vietnamese')}
                            name="language"
                            value="vi"
                            checked={currentLanguage === 'vi'}
                            onChange={() => handleChange('vi')}
                        />
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {/* Sử dụng t() cho nút Đóng */}
                    {t('languageModal.closeButton')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LanguageModal;
