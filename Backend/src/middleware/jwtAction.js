import jwt from 'jsonwebtoken';
// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();

const nonSecurePaths = [
    '/user/authentication-google',
    '/user/authentication-facebook',
    '/user/seatClass/fetchData',
    '/user/login',
    '/user/register',
    '/getNewAccessToken',
    '/user/flight/fetchData',
    '/user/flight/searchSuggestion',
    '/user/coupon/fetchData',
    '/logout',
    '/user/send-email-reset-password',
    '/user/confirm-otp-forget-password',
    '/user/insert-new-password-otp',
    '/user/send-support',
    '/user/view-destination-for-homepage',
    '/user/order/check-payment-vnpay',
    // '/user/flight/getFlightDataForConfirmOrder',
    // '/user/cabin/takeCabinInformation',
    // '/user/test/testQueryUpdateCabin',
    // '/user/payment/Paypal-Payment',
    // '/user/order/createOrder',
    // '/user/flight/checkSeatHaveEnough',
    // '/user/payment/paypal-webhook',
    // '/user/payment/get-client-token',
    // '/user/order/create-vnpay-order',
    // '/user/order/check-payment-vnpay',
    // '/user/order/create-order-data-vnpay',
    // '/user/coupon/use-coupon',
    // '/user/coupon/get-all',
    // '/user/order/view-all-order',
    // '/user/get-order-information',
    // '/user/order/cancel-order',
    // '/user/order/refund-money',
    // '/user/order/get-refund-orders',
    // '/user/check-have-password',
    // '/user/add-password',
    // '/user/update-password',
    // '/user/update-account-information',
    // '/user/send-email-reset-password',
    // '/user/confirm-otp-forget-password',
    // 'user/confirm-otp-forget-password',
    // '/user/insert-new-password-otp',
    // '/user/confirm-otp-register-account',

    // '/admin/get-users-information',
    // '/admin/update-user-information',
    // '/admin/delete-user',
    // '/admin/get-all-group',
    // '/admin/create-new-user',

    // '/admin/get-all-airline',
    // '/admin/create-new-airline',
    // '/admin/update-airline',
    // '/admin/delete-airline',

    // '/admin/get-all-airport',
    // '/admin/create-new-airport',
    // '/admin/update-airport',
    // '/admin/delete-airport',

    // '/admin/get-all-coupon',
    // '/admin/create-new-coupon',
    // '/admin/update-coupon',
    // '/admin/delete-coupon',

    // '/admin/get-all-seat-class',
    // '/admin/create-new-seat-class',
    // '/admin/update-seat-class',
    // '/admin/delete-seat-class',

    // '/admin/get-all-order',
    // '/admin/delete-order',

    // '/admin/get-all-flight',
    // '/admin/get-detail-flight',
    // '/admin/create-new-flight',
    // '/admin/get-flight-data-to-update',
    // '/admin/update-flight',
    // '/admin/delete-flight',

    // '/admin/search-destination-suggestion',
    // '/admin/search-airline-suggestion',
    // '/admin/get-all-seatClass',
    // '/admin/get-all-utils',

    // '/admin/get-refund-requests',
    // '/admin/process-refund',

    // '/admin/get-all-group',
    // '/admin/create-new-group',
    // '/admin/update-group',
    // '/admin/delete-group',
    // '/admin/get-all-role',
    // '/admin/get-all-role-of-group',
    // '/admin/create-new-role',
    // '/admin/update-role',
    // '/admin/delete-role',
    // '/admin/update-role-of-group',
];

const createJWT = (payload) => {
    const key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return token;
    } catch (error) {
        console.log(error);
    }
    return token;
};

const createRefreshJWT = (payload) => {
    const key = process.env.JWT_REFRESH_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_REFRESH_IN,
        });
        return token;
    } catch (error) {
        console.log(error);
    }
    return token;
};

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET;
    let decoded = null;
    try {
        decoded = jwt.verify(token, key);
    } catch (error) {
        console.log(error);
    }
    return decoded;
};

const verifyRefreshToken = (token) => {
    let key = process.env.JWT_REFRESH_SECRET;
    let decoded = null;
    try {
        decoded = jwt.verify(token, key);
    } catch (error) {
        console.log(error);
    }
    return decoded;
};

const extractToken = (request) => {
    let token = null;
    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        token = request.headers.authorization.split(' ')[1];
    }
    return token;
};

const checkUserJWT = (request, response, next) => {
    try {
        if (nonSecurePaths.includes(request.path)) {
            return next();
        }

        const tokenFromHeader = extractToken(request);
        if (tokenFromHeader) {
            let decoded = verifyToken(tokenFromHeader);
            let token = tokenFromHeader;
            // console.log('check data decoded: ', decoded);
            if (decoded) {
                request.user = decoded;
                request.token = token;
                next();
            } else {
                return response.status(401).json({
                    EC: -1,
                    DT: '',
                    EM: 'Not authenticated the user!',
                });
            }
        } else {
            return response.status(401).json({
                EC: -1,
                DT: '',
                EM: 'Not authenticated the user!',
            });
        }
    } catch (error) {
        console.log(error);
        return response.status(401).json({
            EC: -1,
            DT: '',
            EM: 'Error from check authenticated the user!',
        });
    }
};

const checkUserPermission = (request, response, next) => {
    try {
        if (
            nonSecurePaths.includes(request.path) ||
            request.path === '/checkAuth'
        ) {
            return next();
        }

        if (request.user) {
            // console.log('bbbb', request.path);
            const roles = request.user.groupWithRoles;
            // console.log('ppppp', roles);
            const currentUrl = request.path;
            if (roles && roles.length === 0) {
                return response.status(403).json({
                    EC: -1,
                    DT: '',
                    EM: 'You do not have any permission to access this resource!',
                });
            }

            let allowAccess = roles.some((role) => role.url === currentUrl);
            if (allowAccess) {
                next();
            } else {
                return response.status(403).json({
                    EC: -1,
                    DT: '',
                    EM: 'You do not have permission to access this resource!',
                });
            }

            // console.log('passs autho');
        }
    } catch (error) {
        console.log(error);
        return response.status(403).json({
            EC: -1,
            DT: '',
            EM: 'Error from check permission!',
        });
    }
};

export {
    createJWT,
    verifyToken,
    checkUserJWT,
    createRefreshJWT,
    verifyRefreshToken,
    checkUserPermission,
};
