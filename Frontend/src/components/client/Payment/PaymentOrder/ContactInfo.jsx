import React from 'react';
import { Button } from 'react-bootstrap';
import dayjs from 'dayjs';
import { getDateOnly } from '../../../../utils/myFunction';
import { useTranslation } from 'react-i18next';
import { TranslateText } from '../../../Translate';

const ContactInfo = (props) => {
    const { t } = useTranslation();
    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h5>{t('contactInfo.orderInformation')}</h5>
                <div className="d-flex flex-column gap-3 mt-4">
                    {Array.isArray(props.flightDataDeparture?.segments) && (
                        <div
                            className="d-flex flex-column border rounded p-2 px-3 justify-content-between w-100"
                            // style={{ width: 'fit-content' }}
                        >
                            <h6>{t('contactInfo.departure')}</h6>
                            <div className="d-flex gap-2">
                                <span
                                    className="text-primary"
                                    style={{ fontWeight: '500' }}
                                >
                                    {
                                        props.flightDataDeparture.segments[0]
                                            .departure_airport_id.province
                                    }{' '}
                                    -{' '}
                                    {
                                        props.flightDataDeparture.segments[
                                            props.flightDataDeparture.segments
                                                .length - 1
                                        ].arrival_airport_id.province
                                    }
                                </span>

                                <hr
                                    className="mt-0 mb-0"
                                    style={{
                                        color: 'black',
                                        height: '23px',
                                        width: '1px',
                                    }}
                                ></hr>
                                <span>
                                    {getDateOnly(
                                        props.flightDataDeparture?.segments[0]
                                            ?.departure_time
                                    )}
                                </span>

                                <hr
                                    className="mt-0 mb-0"
                                    style={{
                                        color: 'black',
                                        height: '23px',
                                        width: '1px',
                                    }}
                                ></hr>
                                <span>
                                    {
                                        <TranslateText
                                            text={props.seatClassDeparture.name}
                                        />
                                    }
                                </span>
                            </div>
                        </div>
                    )}

                    {Array.isArray(props.flightDataComeback?.segments) && (
                        <div
                            className="d-flex flex-column border rounded p-2 px-3 justify-content-between w-100"
                            // style={{ width: 'fit-content' }}
                        >
                            <h6>{t('contactInfo.roundTrip')}</h6>
                            <div className="d-flex gap-2">
                                <span
                                    className="text-primary"
                                    style={{ fontWeight: '500' }}
                                >
                                    {' '}
                                    {
                                        props.flightDataComeback.segments[0]
                                            .departure_airport_id.province
                                    }{' '}
                                    -{' '}
                                    {
                                        props.flightDataComeback.segments[
                                            props.flightDataComeback.segments
                                                .length - 1
                                        ].arrival_airport_id.province
                                    }
                                </span>

                                <hr
                                    className="mt-0 mb-0"
                                    style={{
                                        color: 'black',
                                        height: '23px',
                                        width: '1px',
                                    }}
                                ></hr>
                                <span>
                                    {getDateOnly(
                                        props.flightDataComeback?.segments[0]
                                            ?.departure_time
                                    )}
                                </span>

                                <hr
                                    className="mt-0 mb-0"
                                    style={{
                                        color: 'black',
                                        height: '23px',
                                        width: '1px',
                                    }}
                                ></hr>
                                <span>
                                    {
                                        <TranslateText
                                            text={props.seatClassComeback.name}
                                        />
                                    }
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="d-flex flex-column gap-2 mt-4">
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-muted">👤</span>
                        <div className="d-flex gap-2 justify-content-center align-items-center">
                            <span
                                className="text-muted"
                                style={{ fontSize: '15px' }}
                            >
                                {t('contactInfo.booker')}{' '}
                            </span>
                            <span
                                style={{ fontWeight: '500', fontSize: '15px' }}
                            >
                                {props.formData.formData.firstName}{' '}
                                {props.formData.formData.lastName}
                            </span>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-muted">✉️</span>
                        <div className="d-flex gap-2 align-items-center">
                            <span
                                className="text-muted"
                                style={{ fontSize: '15px' }}
                            >
                                Email:{' '}
                            </span>
                            <span
                                style={{ fontWeight: '500', fontSize: '15px' }}
                            >
                                {props.formData.formData.email}
                            </span>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-muted">📞</span>
                        <div className="d-flex gap-2 align-items-center">
                            <span
                                className="text-muted"
                                style={{ fontSize: '15px' }}
                            >
                                {t('contactInfo.phoneNumber')}{' '}
                            </span>
                            <span
                                style={{ fontWeight: '500', fontSize: '15px' }}
                            >
                                {props.formData.formData.phone}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
