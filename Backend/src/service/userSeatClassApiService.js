import seatClass from '../models/seatClass.js';

const handleFetchSeatClassData = async () => {
    try {
        let data = await seatClass.find({});
        if (data) {
            return {
                EM: 'Get seat class data successfully!',
                EC: 0,
                DT: data,
            };
        } else {
            return {
                EM: 'Can not get data of seat class!',
                EC: -1,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

export default {
    handleFetchSeatClassData,
};
