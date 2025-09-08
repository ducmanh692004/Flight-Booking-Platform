import cabinService from '../service/cabinApiService.js';

const takeCabinInformationFunc = async (req, res) => {
    try {
        const flightId = req.query.flightId;
        const seat_class_id = req.query.seat_class_id;
        // console.log('checkkkk:', flightId);
        // console.log('checkkkkkkkk:', seat_class_id);
        const data = await cabinService.handleTakeCabinInformation(
            flightId,
            seat_class_id
        );
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

const testttt = async (req, res) => {
    try {
        const data = await cabinService.handleTest();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

export default {
    takeCabinInformationFunc,
    testttt,
};
