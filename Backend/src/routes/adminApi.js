import express from 'express';
import userController from '../controller/Admin/userManagementController.js';
import airlineController from '../controller/Admin/airlineManagementController.js';
import airportController from '../controller/Admin/airportManagementController.js';
import couponController from '../controller/Admin/couponManagementController.js';
import seatClassController from '../controller/Admin/seatClassManagementController.js';
import orderController from '../controller/Admin/orderManagementController.js';
import flightController from '../controller/Admin/flightManagementController.js';
import refundController from '../controller/Admin/refundManagementController.js';
import groupRoleController from '../controller/Admin/groupRoleManagementController.js';

import multer from 'multer';
// import { auth } from 'firebase-admin';
// import { use } from 'passport';

const router = express.Router();
// param: express app
/**
 * @param {*} app: express app
 */

const upload = multer({
    storage: multer.memoryStorage(), // LƯU VÀO RAM DƯỚNG DẠNG BUFFER
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file, ví dụ: 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh (PNG, JPG, JPEG)!'), false);
        }
    },
});

// user management
router.get('/admin/get-users-information', userController.getAllUserFunc);
router.put('/admin/update-user-information', userController.updateUserFunc);
router.delete('/admin/delete-user', userController.deleteUserFunc);
router.post('/admin/create-user', userController.createUserFunc);
router.get('/admin/get-all-group', userController.getAllGroupFunc);
router.post('/admin/create-new-user', userController.createNewUserFunc);

// airline managment
router.get('/admin/get-all-airline', airlineController.getAllAirlineFunc);
router.post(
    '/admin/create-new-airline',
    upload.single('logo'),
    airlineController.createNewAirlineFunc
);
router.put(
    '/admin/update-airline',
    upload.single('logo'),
    airlineController.updateAirlineFunc
);
router.delete('/admin/delete-airline', airlineController.deleteAirlineFunc);

// airport management
router.get('/admin/get-all-airport', airportController.getAllAirportFunc);
router.post(
    '/admin/create-new-airport',
    upload.single('image_province'),
    airportController.createNewAirportFunc
);
router.put(
    '/admin/update-airport',
    upload.single('image_province'),
    airportController.updateAirportFunc
);
router.delete('/admin/delete-airport', airportController.deleteAirportFunc);

// coupon management
router.get('/admin/get-all-coupon', couponController.getAllCouponFunc);
router.post('/admin/create-new-coupon', couponController.createNewCouponFunc);
router.put('/admin/update-coupon', couponController.updateCouponFunc);
router.delete('/admin/delete-coupon', couponController.deleteCouponFunc);

// seat class management
router.get(
    '/admin/get-all-seat-class',
    seatClassController.getAllSeatClassFunc
);
router.post(
    '/admin/create-new-seat-class',
    seatClassController.createNewSeatClassFunc
);
router.put('/admin/update-seat-class', seatClassController.updateSeatClassFunc);
router.delete(
    '/admin/delete-seat-class',
    seatClassController.deleteSeatClassFunc
);

// order management
router.get('/admin/get-all-order', orderController.getAllOrderFunc);
router.delete('/admin/delete-order', orderController.deleteOrderFunc);

// flight management
router.get('/admin/get-all-flight', flightController.getAllFlightFunc);
router.post('/admin/create-new-flight', flightController.createNewFlightFunc);
router.put('/admin/update-flight', flightController.updateFlightFunc);
router.get('/admin/get-detail-flight', flightController.getDetailFlightFunc);
router.delete('/admin/delete-flight', flightController.deleteFlightFunc);

router.get(
    '/admin/get-flight-data-to-update',
    flightController.getFlightToUpdateFunc
);
router.get(
    '/admin/search-destination-suggestion',
    flightController.searchDestinationSuggestionFunc
);
router.get(
    '/admin/search-airline-suggestion',
    flightController.searchAirlineSuggestionFunc
);
router.get('/admin/get-all-seatClass', flightController.getAllSeatClassFunc);
router.get('/admin/get-all-utils', flightController.getAllUtilsFunc);

// refund management
router.get('/admin/get-refund-requests', refundController.getAllRefundFunc);
router.put('/admin/process-refund', refundController.processRefundFunc);
router.put('/admin/ignore-refund', refundController.ignoreRefundFunc);

// groupRole management
// router.get('/admin/get-all-group', groupRoleController.getAllGroupFunc);
router.post('/admin/create-new-group', groupRoleController.createNewGroupFunc);
router.put('/admin/update-group', groupRoleController.updateGroupFunc);
router.delete('/admin/delete-group', groupRoleController.deleteGroupFunc);

router.get('/admin/get-all-role', groupRoleController.getAllRoleFunc);
router.get(
    '/admin/get-all-role-of-group',
    groupRoleController.getAllRoleOfGroupFunc
);
router.post('/admin/create-new-role', groupRoleController.createNewRoleFunc);
router.put('/admin/update-role', groupRoleController.updateRoleFunc);
router.delete('/admin/delete-role', groupRoleController.deleteRoleFunc);
router.put(
    '/admin/update-role-of-group',
    groupRoleController.updateRoleOfGroupFunc
);

// support management
router.get('/admin/get-all-support', userController.getAllSupportFunc);
router.delete('/admin/delete-support', userController.deleteSupportFunc);

// revenue management
router.get('/admin/get-information-of-revenue', userController.getRevenueFunc);
export default router;
