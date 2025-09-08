import seatClassService from '../service/userSeatClassApiService.js';

const fetchSeatClassFunc = async (req, res) => {
    try {
        const data = await seatClassService.handleFetchSeatClassData();
        if (data) {
            res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch {
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in serverr!',
            EC: '-1',
            DT: [],
        });
    }
};

export default {
    fetchSeatClassFunc,
};
