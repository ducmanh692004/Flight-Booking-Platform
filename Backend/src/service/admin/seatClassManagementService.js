import seatClass from '../../models/seatClass.js';
import cabin from '../../models/cabin.js';

const handleGetAllSeatClass = async () => {
    try {
        const data = await seatClass.find({});
        return {
            EM: 'Get all seat class successfully!',
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

const handleCreateNewSeatClass = async (name, description) => {
    try {
        const exist = await seatClass.findOne({ name: name });
        if (exist) {
            return {
                EM: 'Seat class name already exist!',
                EC: -1,
                DT: [],
            };
        }
        const data = await seatClass.create({
            name: name,
            description: description,
        });

        return {
            EM: 'Create new seat class successfully!',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleUpdateSeatClass = async (id, name, description) => {
    try {
        const data = await seatClass.findOneAndUpdate(
            { _id: id },
            {
                name: name,
                description: description,
            }
        );
        return {
            EM: 'Update seat class successfully!',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        return {
            EM: 'Something wrong in service!',
            EC: -1,
            DT: [],
        };
    }
};

const handleDeleteSeatClass = async (id) => {
    try {
        const checkExist = await cabin.findOne({ seat_class_id: id }).limit(1);
        // console.log('checkkkk: ', checkExist);
        if (checkExist) {
            return {
                EM: 'Seat class is used in flights, can not delete!',
                EC: -1,
                DT: [],
            };
        }

        await seatClass.deleteOne({ _id: id });
        return {
            EM: 'Delete seat class successfully!',
            EC: 0,
            DT: [],
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

export default {
    handleGetAllSeatClass,
    handleCreateNewSeatClass,
    handleUpdateSeatClass,
    handleDeleteSeatClass,
};
