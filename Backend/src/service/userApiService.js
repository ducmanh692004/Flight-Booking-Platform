import user from '../models/user.js';

const readAllUserInformation = async () => {
    try {
        let data = await user.find();
        return {
            EM: 'Get all user information successfully!',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const addNewUser = () => {
    try {
    } catch (error) {
        console.log(error);
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const takeUserInformation = async (userId) => {
    try {
        let data = await user.findById(userId);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export default {
    readAllUserInformation,
    addNewUser,
    takeUserInformation,
};
