import './IntroBrand.scss';
import { useTranslation } from 'react-i18next';

const IntroBrand = () => {
    const { t } = useTranslation();
    return (
        <>
            <h4 className="ms-2 mt-5">{t('introBrand.whyBook')}</h4>
            <div className="container introduc-brand mt-3">
                <div className="detail-information d-flex flex-column flex-lg-row">
                    <div className="title col-12 col-lg-4 d-flex ">
                        <div className="image-block col-4">
                            <img src="./assets/reason1.jpg"></img>
                        </div>
                        <div className="detail-reason col-8 p-3">
                            <h6>{t('introBrand.easyBooking')}</h6>
                            <label>{t('introBrand.easyBookingDesc')}</label>
                        </div>
                    </div>

                    <div className="title col-12 col-lg-4  d-flex">
                        <div className="image-block col-4">
                            <img src="./assets/reason2.jpg"></img>
                        </div>

                        <div className="detail-reason col-8 p-3">
                            <h6>{t('introBrand.flexibleTime')}</h6>
                            <label>{t('introBrand.flexibleTimeDesc')}</label>
                        </div>
                    </div>

                    <div className="title col-12 col-lg-4  d-flex">
                        <div className="image-block col-4">
                            <img src="./assets/reason3.jpg"></img>
                        </div>

                        <div className="detail-reason col-8 p-3">
                            <h6>{t('introBrand.easyPayment')}</h6>
                            <label>{t('introBrand.easyPaymentDesc')}</label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IntroBrand;
