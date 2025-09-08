import couponModel from '../models/coupon.js';
import oder from '../models/order.js';

const handleFetchCouponForUser = async () => {
    try {
        const data = await couponModel.find().limit(3);
        if (data.length <= 0) {
            return {
                EM: 'No coupon found!',
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: 'Fetch coupon successfully!',
                EC: 0,
                DT: data,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        };
    }
};

const handleUseCoupon = async (userId, totalOrder, couponId) => {
    try {
        const couponSelect = await couponModel.findById(couponId);
        if (couponSelect.percent === 0) {
            const data = await orderBy.countDocuments({ userId: userId });
            if (data > 0) {
                return {
                    EM: 'You have already used this coupon!',
                    EC: -1,
                    DT: [],
                };
            }
            return {
                EM: 'Apply counpon successfully!',
                EC: 0,
                DT: couponSelect.maximum_discount,
            };
        }

        let returnValue = 0;
        if (totalOrder <= couponSelect.maximum_discount) {
            return {
                EM: 'Your order value is not enough to use this coupon!',
                EC: -1,
                DT: [],
            };
        }

        const caculateDiscount = (totalOrder * couponSelect.percent) / 100;
        if (caculateDiscount > couponSelect.maximum_discount) {
            returnValue = couponSelect.maximum_discount;
        } else {
            returnValue = caculateDiscount;
        }
        return {
            EM: 'Apply counpon successfully!',
            EC: 0,
            DT: returnValue,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        };
    }
};

const handleGetAllCoupon = async () => {
    try {
        const data = await couponModel.find();
        return {
            EM: 'Get all coupon successfully!',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        return {
            EM: 'Something wrong in sever!',
            EC: -1,
            DT: [],
        };
    }
};

export default {
    handleFetchCouponForUser,
    handleUseCoupon,
    handleGetAllCoupon,
};
