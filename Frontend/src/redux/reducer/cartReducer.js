import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    REMOVE_ALL_CART,
    ASYNC_CART_DATA,
    REMOVE_BY_ID,
} from '../actions/cartAction';

const INITIAL_STATE = [];

const cartReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            return [...state, action.payload];
        case 'REMOVE_FROM_CART':
            return state.filter((item, index) => index !== action.payload);
        case 'ASYNC_CART_DATA':
            return action.payload;
        case 'REMOVE_ALL_CART':
            return INITIAL_STATE;
        case 'REMOVE_BY_ID': // USE FOR CONFIRM ORDER CASE
            return state.filter((item) => item.id !== action.payload);
        default:
            return state;
    }
};

export default cartReducer;
