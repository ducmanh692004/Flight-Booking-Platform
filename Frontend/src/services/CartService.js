import axios from '../config/axios';

const asyncCartData = (cartItems, userId) => {
    return axios.post('/api/v1/user/cart/asyncCartData', { cartItems, userId });
};

const addCartItem = (cartItem, userId) => {
    return axios.post('/api/v1/user/cart/addCartItem', { cartItem, userId });
};

const deleteCartItem = (cartItemId) => {
    return axios.post('/api/v1/user/cart/deleteCartItem', { cartItemId });
};

export { asyncCartData, addCartItem, deleteCartItem };
