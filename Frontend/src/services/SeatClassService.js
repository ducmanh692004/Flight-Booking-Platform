import axios from '../config/axios';

const fetchSeatClassData = () => {
    return axios.get('/api/v1/user/seatClass/fetchData');
};

export { fetchSeatClassData };
