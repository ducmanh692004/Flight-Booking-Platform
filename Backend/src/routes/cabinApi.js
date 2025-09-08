import expres from 'express';
import cabinController from '../controller/cabinController.js';

const router = expres.Router();
router.get(
    '/user/cabin/takeCabinInformation',
    cabinController.takeCabinInformationFunc
);

router.post('/user/test/testQueryUpdateCabin', cabinController.testttt);

export default router;
