import axios from '../config/axios';

const takeDetailCabinInformatin = (flightId, seat_class_id) => {
    return axios.get(
        `/api/v1/user/cabin/takeCabinInformation?flightId=${flightId}&seat_class_id=${seat_class_id}`
    );
};

export { takeDetailCabinInformatin };
