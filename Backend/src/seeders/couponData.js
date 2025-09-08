import couponModel from '../models/coupon.js';

const couponData = [
    {
        percent: 0,
        code: 'NGUOIMOI',
        maximum_discount: 100000,
        minimum_price: 0,
    },
];

const seedCoupons = async () => {
    try {
        // await couponModel.deleteMany({});
        const result = await couponModel.insertMany(couponData);
        console.log('Coupons seeded successfully:', result);
    } catch (error) {
        console.error('Error seeding coupons:', error);
    }
};

export default seedCoupons;
