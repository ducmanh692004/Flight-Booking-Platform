import express from 'express';
import flightController from '../controller/flightController.js';

const router = express.Router();
// param: express app
/**
 * @param {*} app: express app
 */

router.post('/user/flight/fetchData', flightController.fetchFlightFunc);
router.post('/user/flight/filter', flightController.filterFlightFunc);
router.post(
    '/user/flight/searchSuggestion',
    flightController.searchSuggestionFunc
);
router.get(
    '/user/flight/getFlightDataForConfirmOrder',
    flightController.getFlightDataForConfirmOrder
);

router.get(
    '/user/flight/checkSeatHaveEnough',
    flightController.checkSeatHaveEnoughFunc
);

router.get(
    '/user/view-destination-for-homepage',
    flightController.viewDestinationForHomepage
);

export default router;
