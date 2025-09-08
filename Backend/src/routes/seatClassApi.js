import express from 'express';
import seatClassController from '../controller/seatClassController.js';

const router = express.Router();
// param: express app
/**
 * @param {*} app: express app
 */

router.get('/user/seatClass/fetchData', seatClassController.fetchSeatClassFunc);
// router.post('/user/flight/filter', flightController.filterFlightFunc);

export default router;
