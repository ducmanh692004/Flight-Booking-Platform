import { RiCoupon2Line } from 'react-icons/ri';
import { useState } from 'react';
import './ListCoupon.scss';
import { useTranslation } from 'react-i18next';
import { useFormatter } from '../../hooks/useFomatter';

const ListCoupon = () => {
    const { t } = useTranslation();
    const { formatCurrency } = useFormatter();
    const defaultDataCoupon = [
        {
            maximumDiscount: 500000,
            mimimunPrice: 2000000,
            percent: '10%',
            code: 'ABCXYZ123',
        },
        {
            maximumDiscount: 400000,
            mimimunPrice: 1900000,
            percent: '7%',
            code: 'GCH2342F',
        },
        {
            maximumDiscount: 200000,
            mimimunPrice: 1300000,
            percent: '6%',
            code: 'LKSDF203',
        },
    ];
    const [dateCoupon, setDataCoupon] = useState(defaultDataCoupon);

    return (
        <div className="container col-12 list-coupon mt-5">
            <h4 className="ms-0">{t('listCoupon.earlyDiscount')}</h4>

            <div
                className="d-flex text-wrap gap-1 gap-md-1 gap-lg-5 mt-3"
                // style={{ width: '100vw' }}
            >
                <div className="row">
                    {dateCoupon &&
                        dateCoupon.length > 0 &&
                        dateCoupon.map((item, index) => {
                            return (
                                <div
                                    className="coupon mt-2 mt-md-0 col-6 col-md-4"
                                    key={index}
                                >
                                    <div className="detail-coupon-information p-2 gap-3">
                                        <div className="coupon-icon bg-info p-2">
                                            <RiCoupon2Line color="white" />
                                        </div>
                                        <div className="content-text">
                                            <h6>
                                                {t('listCoupon.discountUpTo')}{' '}
                                                {formatCurrency(
                                                    item.maximumDiscount
                                                )}
                                            </h6>
                                            <label>
                                                {t('listCoupon.minOrder')}{' '}
                                                {formatCurrency(
                                                    item.mimimunPrice
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="solid">
                                        <div className="dot-1"></div>
                                        <hr></hr>
                                        <div className="dot-2"></div>
                                    </div>
                                    <div className="coupon-code p-2">
                                        <h6>{item.code}</h6>
                                        <button className="btn">
                                            {t('listCoupon.save')}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default ListCoupon;
