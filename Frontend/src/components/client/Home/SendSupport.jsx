import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { sendSupport } from '../../../services/AuthenticationService';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const SupportForm = () => {
    const userId = useSelector((state) => state.user.account.id);
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await sendSupport({
                userId: userId || '',
                email: email,
                content: content,
            });
            if (response && response.EC === 0) {
                toast.success(response.EM);
            } else {
                toast.error(response.EM);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            <div
                className="container w-50"
                style={{ height: '90vh', marginTop: '50px' }}
            >
                <Form
                    onSubmit={handleSubmit}
                    className="rounded p-3"
                    style={{ backgroundColor: '#e9ebecff' }}
                >
                    <h3 className="mb-4">{t('sendSupport.title')}</h3>
                    <Form.Group controlId="supportEmail" className="mb-3">
                        <Form.Label>{t('sendSupport.Email')}</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder={t('login.emailPlaceholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="supportContent" className="mb-3">
                        <Form.Label>{t('sendSupport.content')}</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder={t('sendSupport.contentPlaceholder')}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        {t('sendSupport.send')}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default SupportForm;
