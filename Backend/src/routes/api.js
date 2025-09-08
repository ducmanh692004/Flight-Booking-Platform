import express from 'express';
import userApi from './loginRegisterApi.js';
import authenApi from './authenticationApi.js';
import flightApi from './flightApi.js';
import seatClassApi from './seatClassApi.js';
import couponApi from './couponApi.js';
import cartApi from './cartApi.js';
import cabinApi from './cabinApi.js';
import { checkUserJWT, checkUserPermission } from '../middleware/jwtAction.js';
import paymentApi from './paymentApi.js';
import orderApi from './orderApi.js';
import adminAPi from './adminApi.js';
const router = express.Router();

// param: express app
/**
*
@param {*} app: express app
*/

const initApiRoutes = (app) => {
    router.use(checkUserJWT, checkUserPermission);

    router.use(userApi);
    router.use(authenApi);
    router.use(flightApi);
    router.use(seatClassApi);
    router.use(couponApi);
    router.use(cartApi);
    router.use(cabinApi);
    router.use(paymentApi);
    router.use(orderApi);
    router.use(adminAPi);

    return app.use('/api/v1', router);
};

export default initApiRoutes;
