import { ImCancelCircle } from 'react-icons/im';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { MdDone } from 'react-icons/md';
import { FcCancel } from 'react-icons/fc';
import { useTranslation } from 'react-i18next';

const FlightChange = (props) => {
    const { t } = useTranslation();
    const flight = props.dataFlight;

    return (
        <>
            <hr style={{ height: '0.8px' }}></hr>
            {flight.seats_quantity[0].changeFlight === 'no' ? (
                <div>
                    <div
                        className="d-flex align-items-center gap-2 bg-warning p-2 rounded mb-3"
                        style={{ width: 'fit-content' }}
                    >
                        <ImCancelCircle color="red" />
                        <div style={{ fontSize: '15px', fontWeight: '500' }}>
                            {t('flightChange.noChangeSupport')}
                        </div>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: '500' }}>
                        {t('flightChange.noChangeSupportDesc')}
                    </div>
                </div>
            ) : (
                <div>
                    <div
                        className="d-flex align-items-center gap-2 p-2 rounded mb-3"
                        style={{
                            width: 'fit-content',
                            backgroundColor: 'rgb(252, 236, 221)',
                        }}
                    >
                        <IoCheckmarkDoneSharp color="green" />
                        <div style={{ fontSize: '15px', fontWeight: '500' }}>
                            {t('flightChange.hasChangeSupport')}
                        </div>
                    </div>
                    <div className="d-flex gap-5">
                        <div>
                            <div
                                style={{ fontSize: '15px', fontWeight: '500' }}
                            >
                                {t('flightChange.title')}
                            </div>
                            <div>
                                <div className="d-flex align-items-center gap-2">
                                    <MdDone />
                                    <span>{t('flightChange.reason1')}</span>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <FcCancel />
                                    <span>{t('flightChange.reason2')}</span>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <FcCancel />
                                    <span>{t('flightChange.reason3')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FlightChange;
