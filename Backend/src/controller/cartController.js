import cartService from '../service/cartService.js';

const asyncCartDataFunc = async (req, res) => {
    try {
        const cartData = req.body.cartItems;
        const userId = req.body.userId;
        const data = await cartService.handleAsyncCartData(cartData, userId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const addCartItemFunc = async (req, res) => {
    try {
        const userId = req.body.userId;
        const cartItem = req.body.cartItem;
        const data = await cartService.handleAddCartItem(userId, cartItem);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const deleteCartItemFunc = async (req, res) => {
    try {
        const cartItemId = req.body.cartItemId;
        const data = await cartService.handleDeleteCartItem(cartItemId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

export default {
    asyncCartDataFunc,
    addCartItemFunc,
    deleteCartItemFunc,
};
