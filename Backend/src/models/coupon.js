import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    percent: {
        type: Number,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    maximum_discount: {
        type: Number,
        required: true,
    },
    minimum_price: {
        type: Number,
        required: true,
    },
});

const couponModel = mongoose.model('Coupon', couponSchema, 'Coupons');
export default couponModel;
