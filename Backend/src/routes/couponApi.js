import express from 'express';
import couponController from '../controller/couponController.js';

const router = express.Router();
// param: express app
/**
 * @param {*} app: express app
 */

router.get('/user/coupon/fetchData', couponController.fetchCouponFunc);

router.get('/user/coupon/get-all', couponController.getAllCouponFunc);
router.get('/user/coupon/use-coupon', couponController.useCouponFunc);
export default router;
