import express from 'express';
import cartController from '../controller/cartController.js';

const router = express.Router();
router.post('/user/cart/asyncCartData', cartController.asyncCartDataFunc);
router.post('/user/cart/addCartItem', cartController.addCartItemFunc);
router.post('/user/cart/deleteCartItem', cartController.deleteCartItemFunc);

export default router;
