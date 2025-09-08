export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const ASYNC_CART_DATA = 'ASYNC_CART_DATA';
export const REMOVE_ALL_CART = 'REMOVE_ALL_CART';
export const REMOVE_BY_ID = 'REMOVE_BY_ID';

export const addItemToCart = (data) => {
    return {
        type: ADD_TO_CART,
        payload: data,
    };
};

export const removeItemFromCart = (data) => {
    return {
        type: REMOVE_FROM_CART,
        payload: data,
    };
};

export const asyncCartDataOfUser = (data) => {
    return {
        type: ASYNC_CART_DATA,
        payload: data,
    };
};

export const clearCart = () => {
    return {
        type: REMOVE_ALL_CART,
    };
};

export const removeItemById = (data) => {
    // use for confirm order case
    return {
        type: REMOVE_BY_ID,
        payload: data,
    };
};
