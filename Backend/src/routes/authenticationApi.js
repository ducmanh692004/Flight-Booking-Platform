import express from 'express';
import authenController from '../controller/authController.js';
// import { auth } from 'firebase-admin';

const router = express.Router();

router.post('/user/authentication-google', authenController.googleLogin);
router.post('/user/authentication-facebook', authenController.facebookLogin);
router.post('/getNewAccessToken', authenController.getAccessToken);
router.get('/logout', authenController.logout);
router.get('/checkAuth', authenController.handleCheckAuth);
router.post('/user/send-support', authenController.sendSupport);

export default router;
