import express from 'express';
import userController from '../controller/loginRegisterController.js';

const router = express.Router();
// param: express app
/**
 *
 * @param {*} app: express app
 */

router.post('/user/login', userController.loginFunc);
router.post('/user/register', userController.registerFunc);

router.get('/user/check-have-password', userController.checkHavePasswordFunc);
router.post('/user/add-password', userController.addPasswordFunc);
router.post('/user/update-password', userController.updatePasswordFunc);

router.post(
    '/user/update-account-information',
    userController.updateAccountInfo
);

router.post(
    '/user/send-email-reset-password',
    userController.sendEmailTakePasswordFunc
);

router.post(
    '/user/confirm-otp-forget-password',
    userController.confirmOtpForgetPasswordFunc
);

router.post(
    '/user/insert-new-password-otp',
    userController.insertNewPasswordFunc
);

router.post(
    '/user/confirm-otp-register-account',
    userController.confirmOtpRegisterFunc
);

export default router;
