import {
    SET_ITEMS_PAYMENT,
    REMOVE_ITEMS_PAYMENT,
    CLEAR_PAYMENT_DATA,
} from '../actions/paymentAction';

const INITIAL_STATE = {};

const paymentReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_ITEMS_PAYMENT:
            return action.payload;
        case REMOVE_ITEMS_PAYMENT:
            return INITIAL_STATE;
        case CLEAR_PAYMENT_DATA:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default paymentReducer;
