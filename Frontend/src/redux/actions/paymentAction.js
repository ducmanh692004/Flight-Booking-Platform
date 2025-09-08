export const SET_ITEMS_PAYMENT = 'SET_ITEMS_PAYMENT';
export const REMOVE_ITEMS_PAYMENT = 'REMOVE_ITEMS_PAYMENT';
export const CLEAR_PAYMENT_DATA = 'CLEAR_PAYMENT_DATA';

export const setItemsPayment = (data) => {
    return {
        type: SET_ITEMS_PAYMENT,
        payload: data,
    };
};

export const removeItemsPayment = () => {
    return {
        type: REMOVE_ITEMS_PAYMENT,
    };
};

export const clearPaymentData = () => {
    return {
        type: CLEAR_PAYMENT_DATA,
    };
};
