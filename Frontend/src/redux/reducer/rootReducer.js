import { combineReducers } from 'redux';
import userReducer from './userReducer';
import languageReducer from './languageReducer';
import paymentReducer from './paymentReducer';
import cartReducer from './cartReducer';

const rootReducer = combineReducers({
    user: userReducer,
    language: languageReducer,
    cart: cartReducer,
    payment: paymentReducer,
});

export default rootReducer;
