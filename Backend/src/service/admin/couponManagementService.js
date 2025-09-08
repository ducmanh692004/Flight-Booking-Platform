import coupon from '../../models/coupon.js';

const handleGetAllCoupon = async (limit, page) => {
    try {
        const data = await coupon
            .find({})
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPage = await coupon.countDocuments({});
        return {
            EM: 'Get all coupon successfully!',
            EC: 0,
            DT: {
                coupons: data,
                totalPage: Math.ceil(totalPage / limit),
            },
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

const handleCreateNewCoupon = async (formData) => {
    try {
        // console.log('chckkkk', formData);

        const data = await coupon.findOne({ code: formData.code });
        if (data) {
            return {
                EM: 'Coupon code already exist!',
                EC: -1,
                DT: [],
            };
        }
        await coupon.create({
            percent: parseInt(formData.percent),
            code: formData.code,
            maximum_discount: parseInt(formData.maximum_discount),
            minimum_price: parseInt(formData.minimum_price),
        });

        return {
            EM: 'Create new coupon successfully!',
            EC: 0,
            DT: data,
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

const handleUpdateCoupon = async (formData) => {
    try {
        await coupon.updateOne(
            {
                _id: formData._id,
            },
            {
                code: formData.code,
                percent: parseInt(formData.percent),
                maximum_discount: parseInt(formData.maximum_discount),
                minimum_price: parseInt(formData.minimum_price),
            }
        );

        return {
            EM: 'Update coupon successfully!',
            EC: 0,
            DT: [],
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

const handleDeleteCoupon = async (couponId) => {
    try {
        const data = await coupon.findByIdAndDelete(couponId);
        if (!data) {
            return {
                EM: 'Coupon not found!',
                EC: -1,
                DT: [],
            };
        }

        return {
            EM: 'Delete coupon successfully!',
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
    handleGetAllCoupon,
    handleCreateNewCoupon,
    handleUpdateCoupon,
    handleDeleteCoupon,
};
