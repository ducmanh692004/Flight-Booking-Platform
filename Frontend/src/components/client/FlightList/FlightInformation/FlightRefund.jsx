import { ImCancelCircle } from 'react-icons/im';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

const FlightRefund = ({ dataFlight }) => {
    const { t } = useTranslation();
    const refundPercent = dataFlight.seats_quantity[0].refundMoney;
    const policyItems = t('flightRefundInfomation.refundPolicyItems', {
        returnObjects: true,
    });

    return (
        <>
            <hr style={{ height: '0.8px' }} />

            {refundPercent === 0 ? (
                <div>
                    <div
                        className="d-flex align-items-center gap-2 bg-warning p-2 rounded mb-3"
                        style={{ width: 'fit-content' }}
                    >
                        <ImCancelCircle color="red" />
                        <div style={{ fontSize: '15px', fontWeight: 500 }}>
                            {t('flightRefundInfomation.noRefundSupportTitle')}
                        </div>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 500 }}>
                        {t('flightRefundInfomation.noRefundSupportDescription')}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 400 }}>
                        {t('flightRefundInfomation.noRefundSupportNote')}
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
                        <div style={{ fontSize: '15px', fontWeight: 500 }}>
                            {t('flightRefundInfomation.hasRefundSupportTitle')}
                        </div>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 500 }}>
                        {t(
                            'flightRefundInfomation.hasRefundSupportDescription',
                            { percent: refundPercent }
                        )}
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 500 }}>
                        {t('flightRefundInfomation.refundPolicyTitle')}
                    </div>

                    <ul style={{ paddingLeft: '1em' }}>
                        {policyItems.map((item, idx) => (
                            <li key={idx} style={{ fontSize: '15px' }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default FlightRefund;
