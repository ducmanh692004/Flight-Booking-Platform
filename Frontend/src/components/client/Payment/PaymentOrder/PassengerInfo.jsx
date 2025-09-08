import React from 'react';
import { useTranslation } from 'react-i18next';

const PassengerInfo = (props) => {
    const { t } = useTranslation();
    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h5 className="card-title d-flex align-items-center mb-3">
                    {t('passengerInfo.passengerInformation')}
                </h5>

                <div
                    className="d-flex flex-column gap-1"
                    style={{ maxHeight: '105px', overflowY: 'auto' }}
                >
                    {Array.isArray(props.formDataAdult) &&
                        props.formDataAdult.map((item, index) => (
                            <div
                                key={index}
                                className="d-flex align-items-center gap-2"
                            >
                                <div
                                    className="d-flex align-items-center justify-content-center bg-light rounded-circle"
                                    style={{ width: '32px', height: '32px' }}
                                >
                                    <span className="text-muted">👤</span>
                                </div>

                                <div className="d-flex gap-2 align-items-center">
                                    <span
                                        className="text-muted"
                                        style={{ fontSize: '15px' }}
                                    >
                                        {item.title === 'Ông'
                                            ? `${t('people.mr')}`
                                            : `${t('people.mrs')}`}{' '}
                                        {'('}
                                        {t('passengerInfo.adult')} {index + 1}
                                        {')'}:{' '}
                                    </span>
                                    <span
                                        style={{
                                            fontWeight: '500',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {item.firstName} {item.lastName}
                                    </span>
                                </div>
                            </div>
                        ))}

                    {Array.isArray(props.formDataChild) &&
                        props.formDataChild.map((item, index) => (
                            <div
                                className="d-flex align-items-center gap-2"
                                key={index}
                            >
                                <div
                                    className="d-flex align-items-center justify-content-center bg-light rounded-circle"
                                    style={{ width: '32px', height: '32px' }}
                                >
                                    <span className="text-muted">👤</span>
                                </div>

                                <div className="d-flex gap-2 align-items-center">
                                    <span
                                        className="text-muted"
                                        style={{ fontSize: '15px' }}
                                    >
                                        {item.title === 'Cô' && t('people.ms')}{' '}
                                        {'('}
                                        {t('passengerInfo.child')} {index + 1}
                                        {')'}:{' '}
                                    </span>
                                    <span
                                        style={{
                                            fontWeight: '500',
                                            fontSize: '15px',
                                        }}
                                    >
                                        {item.firstName} {item.lastName}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default PassengerInfo;
